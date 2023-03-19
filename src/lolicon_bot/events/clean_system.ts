import { getBotSession, getChatId, getReplyId } from './common';
import type { EventContext } from '@/types/bot_context';

export async function cleanSystemHandler(ctx: EventContext) {
  const chatId = getChatId(ctx);
  const botSession = getBotSession(chatId);

  if (botSession) {
    delete botSession.systemMessage;
    ctx.sendMessage('success', { reply_to_message_id: getReplyId(ctx) });
  }
}
