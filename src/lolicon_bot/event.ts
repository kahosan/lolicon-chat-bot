import type { ChatType } from './types';
import type { SessionPool } from '@/types/session';
import type { CommandContext, OnContext } from '@/types/bot_context';

import { createChatbot, getReplyText, refreshChatbot } from '@/chatbot';

const sessionPool: SessionPool = {};

export function chatHandler(ctx: CommandContext) {
  const chatType: ChatType = ctx.chat.type === 'private' ? 'private' : 'group';
  const chatId = ctx.chat.id;
  const replyId = ctx.message.message_id;

  const prompt = ctx.message.text.split('/chat ')[1];

  // TODO 私聊以后做
  if (chatType === 'private') {
    ctx.reply('私聊以后做');
    return;
  }

  // 每一次调用 `/chat` 都会创建一个新的会话
  sessionPool[chatId] = {
    chatbot: createChatbot(),
    isEditing: false
  };

  const botSession = sessionPool[chatId];

  if (botSession.isEditing) {
    ctx.sendMessage('还在打字中...', { reply_to_message_id: replyId });
    return;
  }

  botSession.isEditing = true;
  getReplyText(botSession, prompt)
    .then((replyText) => {
      ctx.sendMessage(replyText, { reply_to_message_id: replyId, parse_mode: 'Markdown' });
      console.info(`--prompt: ${prompt}\n--reply: ${replyText}`);
      botSession.isEditing = false;
    })
    .catch((error) => {
      ctx.sendMessage('报错了', { reply_to_message_id: replyId });
      console.error(error);
      botSession.isEditing = false;
    });
}

export function replyHandler(ctx: OnContext) {
  const chatType: ChatType = ctx.chat.type === 'private' ? 'private' : 'group';
  const replyId = ctx.message.message_id;
  const chatId = ctx.chat.id;

  const prompt = ctx.message.text;

  if (chatType === 'private') {
    // TODO
    ctx.reply('私聊以后做');
    return;
  } else if (!sessionPool[chatId]) {
    ctx.sendMessage('请先用 `/chat` 创建一个会话', { reply_to_message_id: replyId, parse_mode: 'Markdown' });
    return;
  }

  const botSession = sessionPool[chatId];

  if (botSession.isEditing) {
    ctx.sendMessage('还在打字中...', { reply_to_message_id: replyId });
    return;
  }

  botSession.isEditing = true;
  getReplyText(botSession, prompt)
    .then((replyText) => {
      ctx.sendMessage(replyText, { reply_to_message_id: replyId, parse_mode: 'Markdown' });
      console.info(`--prompt: ${prompt}\n--reply: ${replyText}`);
      botSession.isEditing = false;
    })
    .catch((error) => {
      ctx.sendMessage('报错了', { reply_to_message_id: replyId });
      console.error(error);
      botSession.isEditing = false;
    });
}

export function refreshHandler(ctx: CommandContext) {
  const chatId = ctx.chat.id;
  const replyId = ctx.message.message_id;

  if (!sessionPool[chatId]) {
    ctx.sendMessage('请先用 `/chat` 创建一个会话', { reply_to_message_id: replyId, parse_mode: 'Markdown' });
    return;
  }

  const botSession = sessionPool[chatId];

  botSession.chatbot
    .then(bot => refreshChatbot(bot.api))
    .then(() => ctx.sendMessage('好了', { reply_to_message_id: replyId }))
    .catch((error) => {
      ctx.sendMessage('报错了', { reply_to_message_id: replyId });
      console.error(error);
    });
}
