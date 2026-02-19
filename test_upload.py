import requests

url = "http://127.0.0.1:8000/upload-schedule/"
# Create a dummy file
with open("dummy_schedule.png", "wb") as f:
    f.write(b"fake image data")

with open("dummy_schedule.png", "rb") as f:
    files = {"file": f}
    response = requests.post(url, files=files)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
