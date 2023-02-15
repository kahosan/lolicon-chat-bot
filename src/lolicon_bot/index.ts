import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

import dotenv from 'dotenv';

import { chatHandler, refreshHandler } from './event';

dotenv.config();

const loliconBotInstance = new Telegraf(process.env.BOT_TOKEN || '');

export function loliconBot() {
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

  console.info('bot is launch');
  return loliconBotInstance;
}
