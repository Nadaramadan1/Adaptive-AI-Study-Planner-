import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))

import models
import schemas
from engine import StudyEngine
from datetime import datetime

# Mock data
tasks = [
    models.Task(id=1, title="Test Task", priority=1, deadline=datetime.now(), estimated_hours=2.0)
]
schedules = [
    models.UserSchedule(day_of_week=i, available_hours=4.0) for i in range(7)
]
class_schedules = [
    models.ClassSchedule(day=0, slot_index=1, subject_name="Math", slot_type="Lecture")
]

try:
    plan = StudyEngine.generate_plan(tasks, schedules, class_schedules)
    print("Plan generated successfully:")
    for p in plan:
        print(p)
except Exception as e:
    import traceback
    traceback.print_exc()
