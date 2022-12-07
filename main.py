import logging
import config
from lolicon_chat.lolicon_chat import LoliconChat


def main():
    logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

    lolicon_bot = LoliconChat(config=config)
    lolicon_bot.run()


if __name__ == '__main__':
    main()