import { getChatId, getReplyId, sessionPool } from './common';
import { createChatbot } from '@/chatbot';

import type { EventContext } from '@/types/bot_context';

export async function refreshHandler(ctx: EventContext) {
  const chatId = getChatId(ctx);
  const replyId = getReplyId(ctx);

  if (!sessionPool[chatId]) {
    ctx.sendMessage('请先用 `/chat` 创建一个会话', { reply_to_message_id: replyId, parse_mode: 'Markdown' });
    return;
  }

  sessionPool[chatId] = {
    chatbot: await createChatbot(),
    isEditing: false
  };

  ctx.sendMessage('success', { reply_to_message_id: replyId });
}
