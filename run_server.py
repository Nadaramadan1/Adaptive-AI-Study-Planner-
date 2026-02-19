import subprocess
import os
import time

log_file = open("server_logs.txt", "w")
process = subprocess.Popen(
    ["python", "-m", "uvicorn", "main:app", "--port", "8000", "--app-dir", "backend"],
    stdout=log_file,
    stderr=subprocess.STDOUT
)
print(f"Server started with PID {process.pid}")
time.sleep(5)
log_file.flush()
log_file.close()
