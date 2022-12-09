import Context, { NarrowedContext } from "telegraf/typings/context";
import { Message, Update } from "telegraf/typings/core/types/typegram";

export type CommandContext = NarrowedContext<Context<Update>, {
  message: Update.New & Update.NonChannel & Message.TextMessage;
  update_id: number;
}>

type AddOptionalKeys<K extends PropertyKey> = { readonly [P in K]?: never }

export type OnContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Record<"text", {}> & Message.TextMessage & AddOptionalKeys<never>>>

export type ChatType = 'private' | 'group'

import type { ChatGPTConversation } from 'chatgpt';

export interface SessionPool {
  [key: string]: BotSession
}[]

export interface BotSession {
  chatbot: ChatGPTConversation
  isEditing: boolean
}