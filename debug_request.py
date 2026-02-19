import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

try:
    response = client.get("/plan/")
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    import traceback
    traceback.print_exc()
