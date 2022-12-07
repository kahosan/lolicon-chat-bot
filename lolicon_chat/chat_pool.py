import threading
from typing import Iterable


class ChatPool:

    def __init__(self):
        self.chat = {}

    def new_thread_task(self, task, args: Iterable):
        threading.Thread(target=task, args=args).start()
