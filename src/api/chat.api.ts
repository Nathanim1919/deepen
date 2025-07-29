import type { IMessage } from "../context/ChatContext";

export const sendMessageStream = async (
  messages: IMessage[],
  captureId: string,
  onMessageChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
  signal?: AbortSignal
) => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/ai/converse", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        captureId,
      }),
      signal,
    });

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let accumulatedText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunkText = decoder.decode(value, { stream: true });
      accumulatedText += chunkText;

      // Split by double newline as per SSE format
      const parts = accumulatedText.split("\n\n");

      for (let i = 0; i < parts.length - 1; i++) {
        const line = parts[i].trim();
        if (line.startsWith("data:")) {
          const jsonStr = line.replace("data:", "").trim();
          const parsed = JSON.parse(jsonStr);

          if (parsed.text) onMessageChunk(parsed.text);
          else if (parsed.done) onDone();
          else if (parsed.error) onError(parsed.error);
        }
      }

      // keep any leftover incomplete chunk
      accumulatedText = parts[parts.length - 1];
    }
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "name" in err &&
      (err as { name?: string }).name !== "AbortError"
    ) {
      const message =
        "message" in err &&
        typeof (err as { message?: unknown }).message === "string"
          ? (err as { message: string }).message
          : "Something went wrong";
      onError(message);
    }
  }
};
