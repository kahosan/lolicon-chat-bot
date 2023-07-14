import type { ChatGPTAPIOptions } from 'chatgpt';
import { getBotSession, getChatId, getMessageText, getReplyId } from './common';
import type { EventContext } from '@/types/bot_context';

export async function setParamsHandler(ctx: EventContext) {
  const chatId = getChatId(ctx);
  const replyId = getReplyId(ctx);
  const params = getMessageText(ctx).split('/set_params').at(1)?.trim() ?? '';

  try {
    const parseParams = JSON.parse(params) as ChatGPTAPIOptions['completionParams'];
    const botSession = getBotSession(chatId);
    if (!botSession)
      return;

    botSession.completionParams = parseParams;
    ctx.sendMessage('success', { reply_to_message_id: replyId });
  } catch (e) {
    console.error(e);
    ctx.sendMessage('error', { reply_to_message_id: replyId });
  }
}
