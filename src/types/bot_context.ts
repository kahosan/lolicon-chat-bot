import type { NarrowedContext, Context } from 'telegraf/typings/context';
import type { Message, Update } from 'telegraf/typings/core/types/typegram';

export type EventContext = NarrowedContext<Context, {
  message: Update.New & Update.NonChannel & Message.TextMessage
  update_id: number
}>;

type AddOptionalKeys<K extends PropertyKey> = { readonly [P in K]?: never };

export type OnContext = NarrowedContext<Context, Update.MessageUpdate<Record<'text', {}> & Message.TextMessage & AddOptionalKeys<never>>>;
