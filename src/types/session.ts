import type { ChatGPTAPI, SendMessageOptions } from 'chatgpt';

export interface SessionPool {
  [chatId: string]: BotSession & SendMessageOptions
}

export interface BotSession {
  chatbot: ChatGPTAPI
  isEditing: boolean
}
