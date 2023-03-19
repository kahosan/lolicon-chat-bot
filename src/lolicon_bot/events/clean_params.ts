import { getBotSession, getChatId, getReplyId } from './common';
import type { EventContext } from '@/types/bot_context';

export function cleanParamsHandler(ctx: EventContext) {
  const chatId = getChatId(ctx);
  const botSession = getBotSession(chatId);

  if (botSession) {
    delete botSession.completionParams;
    ctx.sendMessage('success', { reply_to_message_id: getReplyId(ctx) });
  }
}
