import asyncio
import logging
import telegram

from revChatGPT.revChatGPT import Chatbot
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters

from lolicon_chat.chat_pool import ChatPool


class LoliconChat:

    def __init__(self, config) -> None:
        self.config = config
        self.chat_bot_config = config.openai_config

        self.groups_white_list = False
        self.users_white_list = False

        self.chat_pool = ChatPool()

    def new_chat_bot(self):
        logging.info("有一个新的 bot 出生了")
        return Chatbot(self.chat_bot_config)

    def new_chat_thread(self, id: str, task_action):

        async def task(id: str, chat: dict):
            if (id not in chat):
                chat[id] = {"chatbot": self.new_chat_bot(), "isEditing": False}

            if (chat[id]["isEditing"]):
                return

            chat[id]["isEditing"] = True

            await task_action(chat[id])

        self.chat_pool.new_thread_task(asyncio.run, args=(task(id, self.chat_pool.chat),))

    def is_allowed(self, update: Update):
        if (not self.users_white_list and not self.groups_white_list):
            return True

        if (update.message.chat.type == "private"):
            id = str(update.message.from_user.id)
            return id in self.config.allow_users

        if (update.message.chat.type == "group" or update.message.chat.type == "supergroup"):
            id = str(update.message.chat.id)
            return id in self.config.allow_groups

        return True

    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        if (not self.is_allowed(update)):
            logging.info(f"User {update.message.from_user.id} is not allowed to use this bot")
            return

        await context.bot.send_message(chat_id=update.effective_chat.id, text="Loli!")

    async def prompt(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        if (not self.is_allowed(update)):
            logging.info(f"User {update.message.from_user.id} is not allowed to use this bot")
            return

        async def action(props: dict):
            await context.bot.send_chat_action(
                chat_id=update.effective_chat.id, action=telegram.constants.ChatAction.TYPING)

            response = self.get_response(update.message.text, chatbot=props["chatbot"])
            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                reply_to_message_id=update.message.id,
                text=response["message"],
                parse_mode=telegram.constants.ParseMode.MARKDOWN)
            props["isEditing"] = False

        # if (update.effective_chat.id not in self.chat_bot):
        #     self.chat_bot[update.effective_chat.id] = {"chatbot": self.new_chat_bot(), "isEditing": False}

        # # 上个请求还没完时，不再处理新的请求
        # if (self.chat_bot[update.effective_chat.id]["isEditing"]):
        #     return

        # self.chat_bot[update.effective_chat.id]["isEditing"] = True
        # await action(self.chat_bot[update.effective_chat.id])
        self.new_chat_thread(update.effective_chat.id, action)

    async def refresh(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        if not self.is_allowed(update):
            logging.info(f'User {update.message.from_user.name} is not allowed to refresh the session')
            return

        if update.effective_chat.id not in self.chat_bot:
            await context.bot.send_message(chat_id=update.effective_chat.id, text="No session to refresh")
            return

        self.chat_bot[update.effective_chat.id]["chatbot"].refresh_session()
        await context.bot.send_message(chat_id=update.effective_chat.id, text="Done!")

    def get_response(self, text: str, chatbot: Chatbot):
        try:
            response = chatbot.get_chat_response(text)
            return response
        except ValueError as e:
            logging.info(f'Error: {e}')
            return {"message": "I'm having some trouble talking to you, please try again later."}

    def error_handler(self, update: object, context: ContextTypes.DEFAULT_TYPE):
        logging.debug(f'Exception while handling an update: {context.error}')

    def run(self):
        application = ApplicationBuilder().token(self.config.bot_token).build()

        application.add_handler(CommandHandler('start', self.start))
        application.add_handler(CommandHandler('refresh', self.refresh))
        application.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), self.prompt))

        application.add_error_handler(self.error_handler)

        application.run_polling()