import { ChatGPTAPI } from 'chatgpt';
import dotenv from 'dotenv';
import type { BotSession } from '@/types/session';
import type { CommandContext } from '@/types/botContext';

dotenv.config();

export async function createChatbot() {
  const chatbot = new ChatGPTAPI({
    sessionToken: process.env.SESSION_TOKEN || ''
  });

  // refresh session
  // await chatbot.ensureAuth();

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

export async function getReplyText(bot: BotSession, text: string, ctx: CommandContext) {
  try {
    const replyText = await bot.chatbot.sendMessage(text);
    bot.isEditing = false;

    return replyText;
  } catch (error) {
    console.error(error);
    ctx.sendMessage('报错了', { reply_to_message_id: ctx.message.message_id });
    bot.isEditing = false;
  }
}
