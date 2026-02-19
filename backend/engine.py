from datetime import datetime, timedelta
from typing import List
import models, schemas

class StudyEngine:
    @staticmethod
    def calculate_stress_score(deadlines_count: int, total_hours: float, exam_proximity_days: int) -> float:
        # Simple rule-based score
        # base = (Deadlines this week * 2) + (Total Study Hours / 5)
        # proximity factor: deeper weight if exam is within 3 days
        proximity_factor = 5 if exam_proximity_days <= 3 else (2 if exam_proximity_days <= 7 else 0)
        score = (deadlines_count * 2) + (total_hours / 5) + proximity_factor
        return score

    @staticmethod
    def classify_stress(score: float) -> str:
        if score < 4:
            return "Light"
        elif score < 8:
            return "Moderate"
        else:
            return "High Pressure"

    @staticmethod
    def generate_plan(tasks: List[models.Task], schedules: List[models.UserSchedule], class_schedules: List[models.ClassSchedule] = []) -> List[schemas.StudySession]:
        plan = []
        # Support conversion from Sat-Thu (0-5) to matching indices if needed
        # For simple MVP, we assume schedules.day_of_week matches class_schedules.day
        
        # Base available hours from user settings
        schedule_map = {s.day_of_week: s.available_hours for s in schedules}
        
        # Deduct class hours (1 slot = 1.5 hours)
        for cls in class_schedules:
            if cls.day in schedule_map:
                schedule_map[cls.day] = max(0, schedule_map[cls.day] - 1.5)

        # Sort tasks by priority and deadline
        total_hours = sum(t.estimated_hours for t in tasks)
        deadlines_this_week = len([t for t in tasks if (t.deadline - datetime.now()).days <= 7])
        
        # Mock exam proximity (for MVP)
        exam_proximity = 10 
        stress_score = StudyEngine.calculate_stress_score(deadlines_this_week, total_hours, exam_proximity)
        stress_label = StudyEngine.classify_stress(stress_score)

        # Adaptive logic: If High Pressure, try to distribute more or flag. 
        # (In MVP we mainly label it)
        
        # Sort tasks by priority and deadline
        sorted_tasks = sorted(tasks, key=lambda x: (x.priority, x.deadline))
        
        for task in sorted_tasks:
            remaining_hours = task.estimated_hours
            for day in range(7):  # Sat-Fri (or Mon-Sun depends on index)
                if day in schedule_map and schedule_map[day] > 0 and remaining_hours > 0:
                    allocated = min(schedule_map[day], remaining_hours)
                    if allocated > 0:
                        plan.append(schemas.StudySession(
                            day=day,
                            task_id=task.id,
                            task_title=task.title,
                            hours=round(allocated, 1),
                            stress_level=stress_label
                        ))
                        schedule_map[day] -= allocated
                        remaining_hours -= allocated
        
        return plan
