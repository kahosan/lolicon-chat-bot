// import type { ChatType } from './types';
import type { SessionPool } from '@/types/session';
import type { CommandContext } from '@/types/bot_context';

import { createChatbot, getReplyText } from '@/chatbot';

const sessionPool: SessionPool = {};

export async function chatHandler(ctx: CommandContext) {
  // const chatType: ChatType = ctx.chat.type === 'private' ? 'private' : 'group';
  const chatId = ctx.chat.id;
  const replyId = ctx.message.message_id;

  const prompt = ctx.message.text.split('/chat ')[1] ?? ctx.message.text;

  // TODO 私聊以后做
  // if (chatType === 'private') {
  //   ctx.reply('私聊以后做');
  //   return;
  // }

  // 每一次调用 `/chat` 都会创建一个新的会话
  if (!sessionPool[chatId]) {
    sessionPool[chatId] = {
      chatbot: await createChatbot(),
      isEditing: false
    };
  }

  const botSession = sessionPool[chatId];

  const options = {
    conversationId: sessionPool[chatId].conversationId,
    parentMessageId: sessionPool[chatId].parentMessageId
  };

  if (botSession.isEditing) {
    ctx.sendMessage('还在打字中...', { reply_to_message_id: replyId });
    return;
  }

  botSession.isEditing = true;
  getReplyText(botSession, prompt, options)
    .then((res) => {
      ctx.sendMessage(res.text, { reply_to_message_id: replyId, parse_mode: 'Markdown' });
      console.info(`--prompt: ${prompt}\n--reply: ${res.text}`);
      botSession.isEditing = false;

      sessionPool[chatId].parentMessageId = res.parentMessageId;
      sessionPool[chatId].conversationId = res.conversationId;
    })
    .catch((error) => {
      ctx.sendMessage('报错了', { reply_to_message_id: replyId });
      console.error(error);
      botSession.isEditing = false;

      sessionPool[chatId].parentMessageId = undefined;
      sessionPool[chatId].conversationId = undefined;
    });
}

export async function refreshHandler(ctx: CommandContext) {
  const chatId = ctx.chat.id;
  const replyId = ctx.message.message_id;

  if (!sessionPool[chatId]) {
    ctx.sendMessage('请先用 `/chat` 创建一个会话', { reply_to_message_id: replyId, parse_mode: 'Markdown' });
    return;
  }

  const botSession = sessionPool[chatId];
  botSession.chatbot = await createChatbot();
  ctx.sendMessage('刷新成功', { reply_to_message_id: replyId });
}
