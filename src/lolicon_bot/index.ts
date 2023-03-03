import type { Context } from 'telegraf';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

import dotenv from 'dotenv';

import type { Update } from 'telegraf/typings/core/types/typegram';
import type { MaybePromise } from 'telegraf/typings/util';
import { chatHandler, refreshHandler } from './event';

dotenv.config();

export function loliconBot() {
  const loliconBotInstance = new Telegraf(process.env.BOT_TOKEN || '');
  /**
   * command `/chat`
   */
  loliconBotInstance.command('chat', ctx => chatHandler(ctx));

  /**
   * commnad `/refresh`
   */
  loliconBotInstance.command('refresh', ctx => refreshHandler(ctx));

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

function TelegrafErrorHandler(err: unknown, ctx: Context<Update>): MaybePromise<void> {
  ctx.sendMessage(`报错了: ${err}`);
}
