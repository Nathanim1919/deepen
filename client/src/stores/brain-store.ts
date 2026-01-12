import { create } from "zustand";
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import { getAiModelList } from "../api/chat.api";
import { getConversations, getConversation, startConversationStream, sendMessage as sendMessageApi } from "../api/brain.api";
import { useSettingsStore } from "./settings-store";


/*
    Types
*/

/**
 * Source reference - tracks which document chunks were used for an AI answer
 */
export type MessageSource = {
  docId: string;       // The capture/document ID
  score: number;       // Relevance score (0-1)
  chunkIndex: number;  // Which chunk from the document
  preview?: string;    // First ~100 chars of the chunk (for display)
};

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
  status: "sending" | "sent" | "error";
  sources?: MessageSource[];  // Sources used for this message (for assistant messages)
};

export type BrainSelector = {
  isBrainActive: boolean; // true if brain is active
  isBookmarkActive: boolean; // true if bookmark is active
  hasExplicitContext: boolean; // true if context is explicitly set (any collection/bookmark/capures)
  canSend: boolean; // message can be sent
}

export type ContextDraft = {
  brainEnabled: boolean;

  collections: Set<string>;
  bookmarksEnabled: boolean;
  captures: Set<string>;
};

export type ContextSnapshot = {
  brain: {
    enabled: boolean;
  };

  collections: {
    ids: string[];
  };

  bookmarks: {
    enabled: boolean;
  };

  captures: {
    ids: string[];
  };
};

export type Conversation = {
  id: string;
  _id?: string; // MongoDB ID (optional for local conversations)
  title: string;
  createdAt: number;
  context: ContextSnapshot;
  messages: Message[];
  modelId?: string; // OpenRouter model ID used for this conversation
  lastActivity?: number;
  isActive?: boolean;
};

// Metadata version for conversation lists (no messages)
export type ConversationMetadata = Omit<Conversation, 'messages' | 'context'> & {
  lastMessage?: {
    content: string;
    timestamp: number;
    role: 'user' | 'assistant';
  };
};


/*
  Constants
*/

const EMPTY_DRAFT: ContextDraft = {
  brainEnabled: true,  // default ON
  collections: new Set(),
  bookmarksEnabled: false,
  captures: new Set()
}


/*
   Core Rule
*/

const buildContextSnapshot = (draft: ContextDraft): ContextSnapshot => {
  if (draft.brainEnabled) {
    return {
        brain: {enabled: true},
        collections: {ids: []},
        bookmarks:{enabled: false},
        captures: {ids: []}
      }
  }

  return {
    brain: {enabled: false},
    collections: {ids: Array.from(draft.collections)},
    bookmarks: {enabled: draft.bookmarksEnabled},
    captures: {ids: Array.from(draft.captures)}
  }
}



/*
   Store
*/

export type OpenRouterModel = {
  id: string;
  canonicalSlug: string;
  huggingFaceId?: string;
  name: string;
  created: number;
  description: string;
  pricing: {
    prompt: number;
    completion: number;
    request?: number;
    image?: number;
    webSearch?: number;
    internalReasoning?: number;
    inputCacheRead?: number;
    inputCacheWrite?: number;
    audio?: number;
  };
  contextLength: number;
  architecture: {
    tokenizer: string;
    instructType?: string | null;
  };
  modality: string;
  inputModalities: string[];
  outputModalities: string[];
  topProvider: {
    contextLength: number;
    maxCompletionTokens?: number | null;
  };
  isModerated: boolean;
  perRequestLimits: any | null;
  supportedParameters: string[];
  defaultParameters: {
    temperature?: number | null;
    topP?: number | null;
    frequencyPenalty?: number | null;
  };
};


type BrainStore = {
  conversations: Record<string, Conversation>; // Full conversations (with messages)
  conversationList: Record<string, ConversationMetadata>; // Metadata for listing
  activeConversationId: string | null;

  // Model selector
  modelList: OpenRouterModel[];
  setModelList: (models: OpenRouterModel[]) => void;
  selectedModel: OpenRouterModel | null;
  setSelectedModel: (model: OpenRouterModel) => void;
  clearSelectedModel: () => void;
  getModelList: () => void;


  draft: ContextDraft;

  // Actions
  toggleBrain: () => void;
  toggleBookmark: () => void;
  toggleCollection: (id: string) => void;
  toggleCapture: (id: string) => void;
  resetDraft: () => void;

  startConversation: (initialMessage: string, tempId?: string) => Promise<void>;
  fetchConversations: () => Promise<void>;
  fetchConversation: (id: string) => Promise<void | null>; // Fetch full conversation with messages
  sendMessage: (content: string) => Promise<void>;
  selectConversation: (id: string) => void;

  // Derived selectors
  isBrainActive: () => boolean;
  isBookmarkActive: () => boolean;
  hasExplicitContext: () => boolean;
  canSend: () => boolean;
};


export const useBrainStore = create<BrainStore>((set, get) => ({
  /*
    Initial State
  */

  conversations: {}, // Full conversations (with messages)
  conversationList: {}, // Metadata for listing
  activeConversationId: null,
  draft: EMPTY_DRAFT,

  modelList: [],
  selectedModel: null,
  setModelList: (models: OpenRouterModel[]) => set({ modelList: models }),
  setSelectedModel: (model: OpenRouterModel) => set({ selectedModel: model }),
  clearSelectedModel: () => set({ selectedModel: null }),


  /*
    Draft Actions
  */
  toggleBrain: () =>
    set(state => ({
      draft: {
        ...state.draft,
        brainEnabled: !state.draft.brainEnabled,
        bookmarksEnabled: false, // 🔒 brain disables bookmarks
        captures: new Set(), // 🔒 brain disables captures
        collections: new Set() // 🔒 brain disables collections
      }
    })),

  toggleBookmark: () =>
    set(state => ({
      draft: {
        ...state.draft,
        bookmarksEnabled: !state.draft.bookmarksEnabled,
        brainEnabled: false, // 🔒 explicit context disables brain
        captures: new Set(), // 🔒 brain disables captures
        collections: new Set() // 🔒 brain disables collections
      }
    })),

  toggleCollection: (id: string) =>
    set(state => {
      const next = new Set(state.draft.collections);
      next.has(id) ? next.delete(id) : next.add(id);

      return {
        draft: {
          ...state.draft,
          collections: next,
          brainEnabled: false, // 🔒 explicit context disables brain
          bookmarksEnabled: false, // 🔒 explicit context disables bookmarks
        }
      };
    }),

  toggleCapture: (id: string) =>
    set(state => {
      const next = new Set(state.draft.captures);
      next.has(id) ? next.delete(id) : next.add(id);

      return {
        draft: {
          ...state.draft,
          captures: next,
          brainEnabled: false,
          bookmarksEnabled: false,
        }
      };
    }),

  resetDraft: () => set({ draft: EMPTY_DRAFT }),


  /*
     Conversation Lifecycle
  */

  // startConversation: async (firstMessage: string, tempId?: string):Promise<void> =>  {
  //   if (!firstMessage.trim()) return;

  //   const context = buildContextSnapshot(get().draft);
  //   const conversationId = tempId || uuidv4(); // Use provided tempId or generate one

  //   const conversation: Conversation = {
  //     id: conversationId,
  //     title: firstMessage.slice(0, 60),
  //     createdAt: Date.now(),
  //     context,
  //     messages: [
  //       {
  //         id: nanoid(),
  //         role: 'user',
  //         content: firstMessage,
  //         createdAt: Date.now(),
  //         status: 'sent'
  //       }
  //     ]
  //   };

  //   // Optimistic update with ID (temp or generated)
  //   set(state => ({
  //     conversations: {
  //       ...state.conversations,
  //       [conversationId]: conversation
  //     },
  //     activeConversationId: conversationId,
  //     draft: EMPTY_DRAFT
  //   }));

  //   try {
  //     const response = await startConversation(conversation);

  //     // Update with server response (which should have the correct ID)
  //     if (response?.data) {
  //       // Map server response (_id) to our expected format (id)
  //       const serverConversation = {
  //         ...response.data,
  //         id: response.data._id || response.data.id
  //       };

  //       set(state => {
  //         const { [conversationId]: _, ...conversationsWithoutTemp } = state.conversations;
  //         return {
  //           conversations: {
  //             ...conversationsWithoutTemp,
  //             [serverConversation.id]: serverConversation
  //           },
  //           activeConversationId: serverConversation.id
  //         };
  //       });

  //       // Update URL to reflect the real conversation ID
  //       if (typeof window !== 'undefined') {
  //         window.history.replaceState(null, '', `/in/brain/${serverConversation.id}`);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Failed to start conversation:', error);
  //     // Could add error handling here - maybe remove the optimistic update
  //   }
  // },

  startConversation: async (firstMessage: string, tempId?: string): Promise<void> => {
    if (!firstMessage.trim()) return;
  
    const context = buildContextSnapshot(get().draft);
    const conversationId = tempId || uuidv4();
    
    // Get effective model: selectedModel from this store, or default from settings
    const selectedModel = get().selectedModel;
    const defaultModelId = useSettingsStore.getState().defaultModelId;
    const modelId = selectedModel?.id || defaultModelId;
  
    const conversation: Conversation = {
      id: conversationId,
      title: firstMessage.slice(0, 60),
      createdAt: Date.now(),
      context,
      modelId, // Include the model ID
      messages: [
        {
          id: nanoid(),
          role: "user",
          content: firstMessage,
          createdAt: Date.now(),
          status: "sent",
        },
      ],
    };
  
    // Optimistic update
    set((state) => ({
      conversations: {
        ...state.conversations,
        [conversationId]: conversation,
      },
      activeConversationId: conversationId,
      draft: EMPTY_DRAFT,
    }));
  
    try {
      const serverConversation = await startConversationStream(
        conversation,
        (delta) => {
          // Real-time updates for streaming tokens (if backend streams)
          set((state) => {
            const convo = state.conversations[conversationId];
            if (!convo) return state;

            let assistantMessage = convo.messages.find(
              (m) => m.role === "assistant"
            );

            if (!assistantMessage) {
              assistantMessage = {
                id: nanoid(),
                role: "assistant",
                content: "",
                createdAt: Date.now(),
                status: "sent",
              };
              convo.messages.push(assistantMessage);
            }

            assistantMessage.content += delta;

            return {
              conversations: {
                ...state.conversations,
                [conversationId]: convo,
              },
            };
          });
        },
        (usage) => {
          console.log('usage', usage);
        },
        (sources) => {
          // Update the assistant message with sources when they arrive
          set((state) => {
            const convo = state.conversations[conversationId];
            if (!convo) return state;

            const assistantMessage = convo.messages.find(
              (m) => m.role === "assistant"
            );

            if (assistantMessage) {
              assistantMessage.sources = sources;
            }

            return {
              conversations: {
                ...state.conversations,
                [conversationId]: { ...convo },
              },
            };
          });
        }
      );

      // Replace optimistic conversation with server response
      set((state) => {
        // Remove the temporary conversation
        const { [conversationId]: _, ...conversationsWithoutTemp } = state.conversations;

        return {
          conversations: {
            ...conversationsWithoutTemp,
            [serverConversation.id]: serverConversation,
          },
          activeConversationId: serverConversation.id,
        };
      });

      // Update URL to reflect server conversation ID
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `/in/brain/${serverConversation.id}`);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
      // Optionally remove optimistic conversation or mark as failed
    }
  },
  
  getModelList: async () => {
    const models = await getAiModelList();
    set({ modelList: models });
  },

   sendMessage: async (content: string): Promise<void> => {
    const id = get().activeConversationId;
    if (!id || !content.trim()) return;

    const convo = get().conversations[id];
    if (!convo) return;

    // Prevent sending if conversation hasn't been saved to server yet (temp ID)
    // MongoDB ObjectIds are 24 hex characters
    const isValidMongoId = /^[a-f\d]{24}$/i.test(convo.id);
    if (!isValidMongoId) {
      console.warn("Cannot send message: conversation not yet saved. Please wait for the initial response.");
      return;
    }

    // Add user message optimistically BEFORE sending request
    const userMessageId = nanoid();
    set((state) => ({
      conversations: {
        ...state.conversations,
        [id]: {
          ...convo,
          messages: [
            ...convo.messages,
            {
              id: userMessageId,
              role: 'user',
              content,
              createdAt: Date.now(),
              status: 'sent'
            }
          ]
        }
      }
    }));

    try {
      await sendMessageApi(convo, content,
        (delta: string) => {
          // Real-time updates for streaming tokens
          set((state) => {
            const currentConvo = state.conversations[id];
            if (!currentConvo) return state;

            let assistantMessage = currentConvo.messages.find(
              (m) => m.role === "assistant" && m.status === 'sending'
            );

            if (!assistantMessage) {
              // Create new assistant message for streaming
              const newMessages = [
                ...currentConvo.messages,
                {
                  id: nanoid(),
                  role: "assistant" as const,
                  content: delta,
                  createdAt: Date.now(),
                  status: "sending" as const,
                }
              ];
              return {
                conversations: {
                  ...state.conversations,
                  [id]: {
                    ...currentConvo,
                    messages: newMessages,
                  },
                },
              };
            }

            // Append delta to existing assistant message
            const updatedMessages = currentConvo.messages.map((msg) =>
              msg.id === assistantMessage!.id
                ? { ...msg, content: msg.content + delta }
                : msg
            );

            return {
              conversations: {
                ...state.conversations,
                [id]: {
                  ...currentConvo,
                  messages: updatedMessages,
                },
              },
            };
          });
        },
        (usage: any) => {
          console.log('usage', usage);
        },
        (sources) => {
          // Update the current assistant message with sources
          set((state) => {
            const currentConvo = state.conversations[id];
            if (!currentConvo) return state;

            const updatedMessages = currentConvo.messages.map((msg) =>
              msg.role === "assistant" && msg.status === 'sending'
                ? { ...msg, sources }
                : msg
            );

            return {
              conversations: {
                ...state.conversations,
                [id]: {
                  ...currentConvo,
                  messages: updatedMessages,
                },
              },
            };
          });
        }
      );

      // After stream completes, mark assistant message as sent
      set((state) => {
        const currentConvo = state.conversations[id];
        if (!currentConvo) return state;

        const updatedMessages = currentConvo.messages.map((msg) =>
          msg.role === "assistant" && msg.status === 'sending'
            ? { ...msg, status: "sent" as const }
            : msg
        );

        return {
          conversations: {
            ...state.conversations,
            [id]: {
              ...currentConvo,
              messages: updatedMessages,
            },
          },
        };
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  },

  fetchConversations: async (): Promise<void> => {
    const response = await getConversations();
    console.log("conversations response", response);

    // Convert array to metadata objects keyed by _id
    const conversationListById = response.data.reduce((acc: Record<string, ConversationMetadata>, conv: any) => {
      acc[conv._id] = {
        id: conv._id,
        _id: conv._id,
        title: conv.title || '',
        createdAt: conv.createdAt || Date.now(),
        lastActivity: conv.lastActivity,
        isActive: conv.isActive,
        lastMessage: conv.messages?.length > 0 ? {
          content: conv.messages[conv.messages.length - 1].content,
          timestamp: conv.messages[conv.messages.length - 1].timestamp,
          role: conv.messages[conv.messages.length - 1].role
        } : undefined
      };
      return acc;
    }, {});

    set({ conversationList: conversationListById });
  },

  fetchConversation: async (id: string): Promise<void | null> => {
    try {
      const response = await getConversation(id);

      // Map server response to our format
      const serverConversation = {
        ...response.data,
        id: response?.data?._id || response?.data?.id
      };

      if (!serverConversation){
        return null;
      }

      set(state => ({
        conversations: {
          ...state.conversations,
          [serverConversation.id]: serverConversation
        }
      }));
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    }
  },

  selectConversation: (id: string) =>
    set((_state) => ({
      activeConversationId: id
    })),

  // Derived selectors
    isBrainActive: () => get().draft.brainEnabled,
    isBookmarkActive: () => get().draft.bookmarksEnabled,

    hasExplicitContext: () => {
      const draft = get().draft;
      return (
        draft.bookmarksEnabled ||
        draft.collections.size > 0 ||
        draft.captures.size > 0
      );
    },

    canSend: () => {
      // Block only if Brain OFF and no explicit context
      return get().draft.brainEnabled || get().hasExplicitContext();
    }
}));