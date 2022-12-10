import { ChatGPTAPI } from 'chatgpt';

import dotenv from 'dotenv';

import type { BotSession } from '@/types/session';

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

export function getReplyText(bot: BotSession, text: string) {
  const replyText = bot.chatbot.then(chatbot => chatbot.sendMessage(text));

  return replyText;
}
