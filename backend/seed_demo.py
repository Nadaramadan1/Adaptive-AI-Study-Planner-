import requests
import time
from datetime import datetime, timedelta

API_BASE = "http://127.0.0.1:8000"

def seed():
    # Wait for server to be ready
    print("Waiting for server to be ready...")
    for _ in range(5):
        try:
            requests.get(API_BASE)
            break
        except:
            time.sleep(2)

    # 1. Add Subjects (Idempotent)
    try:
        existing_subjects = requests.get(f"{API_BASE}/subjects/").json()
        subject_map = {s['name']: s['id'] for s in existing_subjects}
    except:
        subject_map = {}

    subjects = [
        {"name": "AI & Machine Learning", "difficulty": 9},
        {"name": "Data Structures", "difficulty": 7},
        {"name": "Computer Networks", "difficulty": 8},
        {"name": "Operating Systems", "difficulty": 8}
    ]
    sub_ids = []
    for s in subjects:
        if s['name'] in subject_map:
            sub_ids.append(subject_map[s['name']])
        else:
            try:
                res = requests.post(f"{API_BASE}/subjects/", json=s)
                if res.ok: 
                    sub_ids.append(res.json()['id'])
                else:
                    print(f"Failed to add subject {s['name']}: {res.text}")
            except Exception as e:
                print(f"Error adding subject {s['name']}: {e}")

    if not sub_ids:
        print("No subjects created. Aborting seed.")
        return

    # 2. Add Weekly Availability (Sat-Fri)
    for i in range(7):
        requests.post(f"{API_BASE}/schedule/", json={"day_of_week": i, "available_hours": 6.0})

    # 3. Add Classes
    classes = [
        {"day": 0, "slot_index": 0, "subject_name": "AI & Machine Learning", "slot_type": "Lecture", "professor": "Dr. Smith", "room": "Hall A"},
        {"day": 0, "slot_index": 1, "subject_name": "AI & Machine Learning", "slot_type": "Section", "teaching_assistant": "Eng. Nada", "room": "Lab 1"},
        {"day": 1, "slot_index": 2, "subject_name": "Data Structures", "slot_type": "Lecture", "professor": "Dr. Brown", "room": "Hall B"},
    ]
    for c in classes:
        requests.post(f"{API_BASE}/class-schedule/", json=c)

    # 4. Add Resources
    resources = [
        {"subject_id": sub_ids[0], "title": "Andrew Ng ML Course", "link": "https://youtube.com/playlist?list=PLp8h", "resource_type": "YouTube"},
        {"subject_id": sub_ids[1] if len(sub_ids) > 1 else sub_ids[0], "title": "CLRS Book", "link": "https://drive.google.com/...", "resource_type": "Google Drive"}
    ]
    for r in resources:
        requests.post(f"{API_BASE}/resources/", json=r)

    # 5. Add Tasks
    tasks = [
        {"title": "Neural Network Lab", "subject_id": sub_ids[0], "deadline": (datetime.now() + timedelta(days=1)).isoformat(), "estimated_hours": 4.0, "priority": 3, "task_type": "Project"},
        {"title": "B-Tree Assignment", "subject_id": sub_ids[1] if len(sub_ids) > 1 else sub_ids[0], "deadline": (datetime.now() + timedelta(days=3)).isoformat(), "estimated_hours": 3.0, "priority": 2, "task_type": "Assignment"}
    ]
    for t in tasks:
        requests.post(f"{API_BASE}/tasks/", json=t)

    print("Comprehensive Demo data seeded successfully!")

if __name__ == "__main__":
    seed()
