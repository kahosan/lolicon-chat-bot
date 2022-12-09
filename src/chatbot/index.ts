import { ChatGPTAPI } from 'chatgpt';
import dotenv from 'dotenv';
import type { BotSession } from '@/lolicon_bot/types';

dotenv.config();

export async function createChatbot() {
  const chatbot = new ChatGPTAPI({
    sessionToken: process.env.SESSION_TOKEN || ''
  });

  // refresh session
  await chatbot.ensureAuth();

  // get new chat instance
  const conversation = chatbot.getConversation();
  return conversation;
}

export async function checkChatbotAuthenticated(api: ChatGPTAPI) {
  return await api.getIsAuthenticated();
}

export async function refreshChatbot(api: ChatGPTAPI) {
  return await api.ensureAuth();
}

export async function getReplyText(bot: BotSession, text: string) {
  bot.isEditing = true;
  const replyText = await bot.chatbot.sendMessage(text);
  bot.isEditing = false;

  return replyText;
}
