import type { NarrowedContext } from 'telegraf/typings/context';
import type Context from 'telegraf/typings/context';
import type { Message, Update } from 'telegraf/typings/core/types/typegram';

export type EventContext = NarrowedContext<Context<Update>, {
  message: Update.New & Update.NonChannel & Message.TextMessage
  update_id: number
}>;

type AddOptionalKeys<K extends PropertyKey> = { readonly [P in K]?: never };

export type OnContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Record<'text', {}> & Message.TextMessage & AddOptionalKeys<never>>>;
