import requests
from datetime import datetime, timedelta

API_BASE = "http://127.0.0.1:8000"

def seed():
    # 1. Add Subjects
    subjects = [
        {"name": "Advanced Mathematics", "difficulty": 8},
        {"name": "Computer Architecture", "difficulty": 9},
        {"name": "Human-Computer Interaction", "difficulty": 4}
    ]
    for s in subjects:
        requests.post(f"{API_BASE}/subjects/", json=s)

    # 2. Add Weekly Schedule (Mon-Fri, 4 hours each)
    for i in range(5):
        requests.post(f"{API_BASE}/schedule/", json={"day_of_week": i, "available_hours": 4.0})

    # 3. Add High Pressure Tasks
    tasks = [
        {
            "title": "Calculus Problem Set",
            "subject_id": 1,
            "deadline": (datetime.now() + timedelta(days=2)).isoformat(),
            "estimated_hours": 6.0,
            "priority": 1
        },
        {
            "title": "CPU Architecture Paper",
            "subject_id": 2,
            "deadline": (datetime.now() + timedelta(days=3)).isoformat(),
            "estimated_hours": 8.0,
            "priority": 1
        },
        {
            "title": "HCI User Study",
            "subject_id": 3,
            "deadline": (datetime.now() + timedelta(days=5)).isoformat(),
            "estimated_hours": 3.0,
            "priority": 2
        }
    ]
    for t in tasks:
        requests.post(f"{API_BASE}/tasks/", json=t)

    print("Demo data seeded successfully!")

if __name__ == "__main__":
    seed()
