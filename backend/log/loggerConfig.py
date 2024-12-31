import logging
from logging.handlers import RotatingFileHandler

# Shared handler
file_handler = RotatingFileHandler(
    "app.log", maxBytes=5 * 1024 * 1024, backupCount=3
)
file_formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
file_handler.setFormatter(file_formatter)

# Logger 1
loggerGPT = logging.getLogger("loggerGPT")
loggerGPT.setLevel(logging.INFO)
loggerGPT.addHandler(file_handler)

# Logger 2
loggerFlask = logging.getLogger("loggerFlask")
loggerFlask.setLevel(logging.INFO)
loggerFlask.addHandler(file_handler)