import type { ChatGPTConversation } from 'chatgpt';

export interface SessionPool {
  [key: string]: BotSession
}

export interface BotSession {
  chatbot: Promise<ChatGPTConversation>
  isEditing: boolean
}
