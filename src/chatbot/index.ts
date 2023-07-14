import type { BotSession } from '@/types/session';
import { Chat, init } from 'bard-ai';
import type { SendMessageOptions } from 'chatgpt';
import { ChatGPTAPI } from 'chatgpt';
import dotenv from 'dotenv';

dotenv.config();

export type BotType = 'GPT' | 'Bard';

export async function createChatbot(type: BotType) {
  switch (type) {
    case 'Bard': {
      await init(process.env.BARD_COOKIE ?? '');
      return new Chat();
    }
    case 'GPT':
      return new ChatGPTAPI({ apiKey: process.env.GPT_API_KEY ?? '' });
    default:
      throw new Error('创建机器人失败: Invalid bot type');
  }
}

export function getReplyText({ chatbot }: BotSession, text: string, options: SendMessageOptions) {
  if (chatbot instanceof ChatGPTAPI)
    return chatbot.sendMessage(text, options);
  if (chatbot instanceof Chat)
    return chatbot.ask(text);

  throw new Error('Chatbot not found');
}
