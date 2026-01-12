import { api, API_CONFIG } from ".";
import type { Conversation, MessageSource } from "../stores/brain-store";

// export const startConversation = async (conversation: Conversation) => {
//   const response = await api.post('/brain/conversation/start', conversation);
//   return response.data;
// };

// api.tsx
export const startConversationStream = async (
  conversation: Conversation,
  onDelta?: (delta: string) => void,
  onUsage?: (usage: any) => void,
  onSources?: (sources: MessageSource[]) => void
): Promise<Conversation> => {
  // Using better-auth which handles auth via cookies
  // credentials: "include" will send the auth cookies

  const response = await fetch(`${API_CONFIG.baseURL}brain/conversation/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(conversation),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  const isJsonResponse = contentType && contentType.includes('application/json');

  if (isJsonResponse) {
    // Backend returned complete JSON response
    const result = await response.json();
    const serverConversation = result.data;

    // Call onDelta with the assistant content for frontend updates
    if (onDelta && serverConversation.messages) {
      const assistantMessage = serverConversation.messages.find((m: any) => m.role === 'assistant');
      if (assistantMessage) {
        onDelta(assistantMessage.content);
      }
    }

    // Call usage callback if provided
    if (onUsage) onUsage(undefined);

    // Return the conversation from server response
    return {
      id: serverConversation._id || serverConversation.id,
      _id: serverConversation._id,
      title: serverConversation.title,
      createdAt: new Date(serverConversation.createdAt).getTime(),
      context: serverConversation.context,
      modelId: serverConversation.modelId,
      messages: serverConversation.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: new Date(msg.timestamp || msg.createdAt).getTime(),
        status: msg.status || 'sent',
      })),
      lastActivity: serverConversation.lastActivity ? new Date(serverConversation.lastActivity).getTime() : undefined,
      isActive: serverConversation.isActive,
    };
  } else {
    // Handle Server-Sent Events (SSE) streaming response
    if (!response.body) throw new Error("No response body from stream");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let assistantText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process complete lines from buffer
      const lines = buffer.split('\n');
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmedLine.slice(6)); // Remove 'data: ' prefix

            if (data.delta) {
              assistantText += data.delta;
              if (onDelta) onDelta(data.delta);
            }

            if (data.usage && onUsage) {
              onUsage(data.usage);
            }

            // Capture sources event (sent before done)
            if (data.sources && onSources) {
              onSources(data.sources);
            }

            if (data.done && data.conversation) {
              // Return the complete conversation from the done event
              const serverConversation = data.conversation;
              return {
                id: serverConversation._id || serverConversation.id,
                _id: serverConversation._id,
                title: serverConversation.title,
                createdAt: new Date(serverConversation.createdAt).getTime(),
                context: serverConversation.context,
                messages: serverConversation.messages.map((msg: any) => ({
                  id: msg.id,
                  role: msg.role,
                  content: msg.content,
                  createdAt: new Date(msg.timestamp || msg.createdAt).getTime(),
                  status: msg.status || 'sent',
                  sources: msg.sources,  // Include sources in message
                })),
                lastActivity: serverConversation.lastActivity ? new Date(serverConversation.lastActivity).getTime() : undefined,
                isActive: serverConversation.isActive,
              };
            }
          } catch (error) {
            console.warn('Failed to parse SSE data:', trimmedLine, error);
          }
        }
      }
    }

    // Since backend saves conversation and only sends {"done": true},
    // return the original conversation - store will refetch the updated one
    return conversation;
  }
};

export const sendMessage = async (
  conversation: Conversation,
  message: string,
  onDelta?: (delta: string) => void,
  onUsage?: (usage: any) => void,
  onSources?: (sources: MessageSource[]) => void
): Promise<Conversation> => {
  const response = await fetch(`${API_CONFIG.baseURL}brain/conversation/${conversation.id}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ 
      message,
      modelId: conversation.modelId, // Include the model ID for this conversation
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  const isJsonResponse = contentType && contentType.includes('application/json');

  if (isJsonResponse) {
    // Backend returned complete JSON response
    const result = await response.json();
    const serverConversation = result.data;

    // Call onDelta with the assistant content for frontend updates
    if (onDelta && serverConversation.messages) {
      const assistantMessage = serverConversation.messages.find((m: any) => m.role === 'assistant');
      if (assistantMessage) {
        onDelta(assistantMessage.content);
      }
    }

    // Call usage callback if provided
    if (onUsage) onUsage(undefined);

    // Return the conversation from server response
    return {
      id: serverConversation._id || serverConversation.id,
      _id: serverConversation._id,
      title: serverConversation.title,
      createdAt: new Date(serverConversation.createdAt).getTime(),
      context: serverConversation.context,
      modelId: serverConversation.modelId,
      messages: serverConversation.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: new Date(msg.timestamp || msg.createdAt).getTime(),
        status: msg.status || 'sent',
      })),
      lastActivity: serverConversation.lastActivity ? new Date(serverConversation.lastActivity).getTime() : undefined,
      isActive: serverConversation.isActive,
    };
  } else {
    // Handle Server-Sent Events (SSE) streaming response
    if (!response.body) throw new Error("No response body from stream");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let assistantText = "";
    let pendingSources: MessageSource[] = [];  // Store sources until we build the message

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process complete lines from buffer
      const lines = buffer.split('\n');
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmedLine.slice(6)); // Remove 'data: ' prefix

            if (data.delta) {
              assistantText += data.delta;
              if (onDelta) onDelta(data.delta);
            }

            if (data.usage && onUsage) {
              onUsage(data.usage);
            }

            // Capture sources event (sent before done)
            if (data.sources) {
              pendingSources = data.sources;
              if (onSources) onSources(data.sources);
            }

            if (data.done) {
              if (data.conversation) {
                // Start conversation: backend returns full conversation
                const serverConversation = data.conversation;
                return {
                  id: serverConversation._id || serverConversation.id,
                  _id: serverConversation._id,
                  title: serverConversation.title,
                  createdAt: new Date(serverConversation.createdAt).getTime(),
                  context: serverConversation.context,
                  messages: serverConversation.messages.map((msg: any) => ({
                    id: msg.id,
                    role: msg.role,
                    content: msg.content,
                    createdAt: new Date(msg.timestamp || msg.createdAt).getTime(),
                    status: msg.status || 'sent',
                    sources: msg.sources,  // Include sources in message
                  })),
                  lastActivity: serverConversation.lastActivity ? new Date(serverConversation.lastActivity).getTime() : undefined,
                  isActive: serverConversation.isActive,
                };
              } else {
                // Send message: backend just sends done, return conversation with streamed assistant message
                return {
                  ...conversation,
                  messages: [
                    ...conversation.messages,
                    {
                      id: crypto.randomUUID(),
                      role: "assistant",
                      content: assistantText,
                      createdAt: Date.now(),
                      status: "sent",
                      sources: pendingSources.length > 0 ? pendingSources : undefined,  // Include sources
                    },
                  ],
                };
              }
            }
          } catch (error) {
            console.warn('Failed to parse SSE data:', trimmedLine, error);
          }
        }
      }
    }

    // Fallback if stream ended without done event (shouldn't happen with proper backend)
    throw new Error("Stream ended without done event");
  }
};

export const getConversations = async () => {
  const response = await api.get('/brain/conversations');
  return response.data;
};

export const getConversation = async (id: string) => {
  const response = await api.get(`/brain/conversation/${id}`);
  return response.data;
};