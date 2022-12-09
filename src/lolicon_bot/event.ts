import type { ChatType } from './types';
import type { SessionPool } from '@/types/session';
import type { CommandContext, OnContext } from '@/types/bot_context';

import { createChatbot, getReplyText, refreshChatbot } from '@/chatbot';

const sessionPool: SessionPool = {};

export async function chatHandler(ctx: CommandContext) {
  const chatType: ChatType = ctx.chat.type === 'private' ? 'private' : 'group';
  const chatId = ctx.chat.id;
  const replyId = ctx.message.message_id;

  const chatText = ctx.message.text.split('/chat ')[1];

  // TODO 私聊以后做
  if (chatType === 'private') {
    ctx.reply('私聊以后做');
    return;
  }

  // 每一次调用 `/chat` 都会创建一个新的会话
  sessionPool[chatId] = {
    chatbot: await createChatbot()
  };

  const botSession = sessionPool[chatId];

  const replyText = await getReplyText(botSession, chatText, ctx);
  if (replyText) {
    ctx.sendMessage(replyText, { reply_to_message_id: replyId });
  }

  console.info(`--prompt: ${chatText}, --reply: ${replyText}`);
}

export async function replyHandler(ctx: OnContext) {
  const chatType: ChatType = ctx.chat.type === 'private' ? 'private' : 'group';
  const replyId = ctx.message.message_id;
  const chatId = ctx.chat.id;

  const chatText = ctx.message.text;

  if (chatType === 'private') {
    sessionPool[chatId] = {
      chatbot: await createChatbot()
    };
  } else if (!sessionPool[chatId]) {
    ctx.sendMessage('请先用 `/chat` 创建一个会话', { reply_to_message_id: replyId, parse_mode: 'Markdown' });
    return;
  }

  const botSession = sessionPool[chatId];

  const replyText = await getReplyText(botSession, chatText, ctx);
  if (replyText) {
    ctx.sendMessage(replyText, { reply_to_message_id: replyId });
  }

  console.info(`--prompt: ${chatText}, --reply: ${replyText}`);
}

export async function refreshHandler(ctx: CommandContext) {
  const chatId = ctx.chat.id;
  const replyId = ctx.message.message_id;

  if (!sessionPool[chatId]) {
    ctx.sendMessage('请先用 `/chat` 创建一个会话', { reply_to_message_id: replyId, parse_mode: 'Markdown' });
    return;
  }

  const botSession = sessionPool[chatId];

  await refreshChatbot(botSession.chatbot.api);
  ctx.sendMessage('好了', { reply_to_message_id: replyId });
}
