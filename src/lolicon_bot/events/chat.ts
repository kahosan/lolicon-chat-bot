import type { SendMessageOptions } from 'chatgpt';
import { whiteList } from '../util';

import { getBotSession, getChatId, getMessageText, getReplyId, sessionPool } from './common';

import type { EventContext } from '@/types/bot_context';

import { createChatbot, getReplyText } from '@/chatbot';

export async function chatHandler(ctx: EventContext) {
  const chatId = getChatId(ctx);
  const replyId = getReplyId(ctx);
  const message = getMessageText(ctx);

  const prompt = message.startsWith('/chat') ? message.split('/chat')[1] : message;

  // 白名单验证
  if (!whiteList.includes(chatId)) {
    ctx.sendMessage('403 Forbidden');
    return;
  }

  // 每一次调用 `/chat` 都会创建一个新的会话
  let botSession = getBotSession(chatId);

  if (!botSession) {
    botSession = {
      chatbot: await createChatbot(),
      isEditing: false
    };

    sessionPool[chatId] = botSession;
  }

  const options: SendMessageOptions = {
    ...botSession,
    parentMessageId: botSession.parentMessageId
  };

  if (botSession.isEditing) {
    ctx.sendMessage('还在打字中...', { reply_to_message_id: replyId });
    return;
  }

  botSession.isEditing = true;

  try {
    const res = await getReplyText(botSession, prompt, options);
    ctx.sendMessage(res.text, { reply_to_message_id: replyId, parse_mode: 'Markdown' });
    console.info(`--prompt: ${prompt}\n--reply: ${res.text}`);
    botSession.isEditing = false;

    botSession.parentMessageId = res.id;
  } catch (error) {
    ctx.sendMessage('报错了', { reply_to_message_id: replyId });
    console.error(error);
    botSession.isEditing = false;

    botSession.parentMessageId = undefined;
  }
}
