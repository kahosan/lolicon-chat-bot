import type { ChatGPTAPI, SendMessageOptions } from 'chatgpt';

export interface SessionPool {
  [chatId: string]: BotSession & SendMessageOptions | undefined
}

export interface BotSession {
  chatbot: ChatGPTAPI
  isEditing: boolean
}
