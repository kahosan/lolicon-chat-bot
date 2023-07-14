import type { Context } from 'telegraf';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

import dotenv from 'dotenv';

import type { MaybePromise } from 'telegraf/typings/util';

import {
  changeChatBotHandler,
  chatHandler,
  cleanParamsHandler,
  cleanSystemHandler,
  refreshHandler,
  setParamsHandler,
  setSystemHandler
} from './events';

import { whiteList } from './util';

dotenv.config();

export function loliconBot() {
  const loliconBotInstance = new Telegraf(process.env.BOT_TOKEN || '');

  /**
   * middleware whitelist verification
   */
  loliconBotInstance.use((ctx, next) => {
    const chatId = ctx.chat?.id ?? 0;

    if (whiteList.includes(chatId))
      return next();

    ctx.sendMessage('403 Forbidden');
  });

  /**
   * command `/chat`
   */
  loliconBotInstance.command('chat', chatHandler);

  /**
   * commnad `/refresh`
   */
  loliconBotInstance.command('refresh', refreshHandler);

  /**
   * set system message
   */
  loliconBotInstance.command('set_system', setSystemHandler);

  /**
     * clean system message
     */
  loliconBotInstance.command('clean_system', cleanSystemHandler);

  /**
     * set completion params
     */
  loliconBotInstance.command('set_params', setParamsHandler);

  /**
     * clean completion params
     */
  loliconBotInstance.command('clean_params', cleanParamsHandler);

  /**
     * change chat bot type
     */
  loliconBotInstance.command('change_chat_bot', changeChatBotHandler);

  /**
   * reply_to_message
   */
  loliconBotInstance.on(message('text'), ctx => chatHandler(ctx));

  /**
   * Error Handler
   */
  loliconBotInstance.catch(TelegrafErrorHandler);

  console.info('bot is launch');
  return loliconBotInstance;
}

function TelegrafErrorHandler(err: unknown, ctx: Context): MaybePromise<void> {
  ctx.sendMessage(`报错了: ${err as string}`);
}
