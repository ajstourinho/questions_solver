import logging
from logging.handlers import RotatingFileHandler
import os
current_dir = os.path.dirname(os.path.abspath(__file__))

# Define necessary folders
logFilePath = os.path.join(current_dir, "iloveprovaantiga.log")
# Shared handler
fileHandler = RotatingFileHandler(
    logFilePath, maxBytes=5 * 1024 * 1024, backupCount=3
)
fileFormatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
fileHandler.setFormatter(fileFormatter)

# Logger 1
loggerGPT = logging.getLogger("loggerGPT")
loggerGPT.setLevel(logging.INFO)
loggerGPT.addHandler(fileHandler)

# Logger 2
loggerFlask = logging.getLogger("loggerFlask")
loggerFlask.setLevel(logging.INFO)
loggerFlask.addHandler(fileHandler)