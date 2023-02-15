import type { SendMessageOptions } from 'chatgpt';
import { ChatGPTAPI } from 'chatgpt';
import dotenv from 'dotenv';
import type { BotSession } from '@/types/session';

dotenv.config();

export async function createChatbot() {
  // get new chat instance
  return new ChatGPTAPI({ apiKey: process.env.API_KEY ?? '' });
}

export function getReplyText({ chatbot }: BotSession, text: string, options: SendMessageOptions) {
  return chatbot.sendMessage(text, options);
}
