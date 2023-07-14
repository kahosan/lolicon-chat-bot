import type { EventContext } from '@/types/bot_context';
import { changeChatBotType, chatBotType, getChatId, getMessageText, getReplyId, sessionPool } from './common';
import { createChatbot } from '@/chatbot';

export async function changeChatBotHandler(ctx: EventContext) {
  const chatId = getChatId(ctx);
  const replyId = getReplyId(ctx);
  const params = getMessageText(ctx).split('/change_chat_bot').at(1)?.trim() ?? '';

  if (!sessionPool[chatId]) {
    ctx.sendMessage('请先用 `/chat` 创建一个会话', { reply_to_message_id: replyId, parse_mode: 'Markdown' });
    return;
  }

  const err = changeChatBotType(params);
  if (err) {
    ctx.sendMessage(err, { reply_to_message_id: replyId });
    return;
  }

  sessionPool[chatId] = {
    chatbot: await createChatbot(chatBotType),
    isEditing: false
  };

  ctx.sendMessage('success', { reply_to_message_id: replyId });
}
