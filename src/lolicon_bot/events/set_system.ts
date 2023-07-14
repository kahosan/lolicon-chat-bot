import { getBotSession, getChatId, getMessageText, getReplyId } from './common';
import type { EventContext } from '@/types/bot_context';

export async function setSystemHandler(ctx: EventContext) {
  const chatId = getChatId(ctx);

  const botSession = getBotSession(chatId);

  if (botSession) {
    botSession.systemMessage = getMessageText(ctx).split('/set_system').at(1)?.trim();
    ctx.sendMessage('success', { reply_to_message_id: getReplyId(ctx) });
  }
}
