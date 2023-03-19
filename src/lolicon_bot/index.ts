import type { Context } from 'telegraf';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

import dotenv from 'dotenv';

import type { Update } from 'telegraf/typings/core/types/typegram';
import type { MaybePromise } from 'telegraf/typings/util';

import { chatHandler } from './events/chat';
import { refreshHandler } from './events/refresh';
import { cleanSystemHandler } from './events/clean_system';
import { setSystemHandler } from './events/set_system';
import { setParamsHandler } from './events/set_params';
import { cleanParamsHandler } from './events/clean_params';

dotenv.config();

export function loliconBot() {
  const loliconBotInstance = new Telegraf(process.env.BOT_TOKEN || '');
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
