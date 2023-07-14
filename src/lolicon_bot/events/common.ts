import type { BotType as ChatBotType } from '@/chatbot';
import type { EventContext } from '@/types/bot_context';
import type { SessionPool } from '@/types/session';

export const sessionPool: SessionPool = {};

export let chatBotType: ChatBotType = 'GPT';

export function changeChatBotType(type: string) {
  if (type === 'GPT' || type === 'Bard')
    chatBotType = type;
  else
    return 'Invalid bot type';
}

export function getBotSession(chatId: number) {
  return sessionPool[chatId];
}

export function getChatId(ctx: EventContext) {
  return ctx.chat.id;
}

export function getUserId(ctx: EventContext) {
  return ctx.message.from.id;
}

export function getReplyId(ctx: EventContext) {
  return ctx.message.message_id;
}

export function getMessageText(ctx: EventContext) {
  return ctx.message.text;
}
