from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class SubjectBase(BaseModel):
    name: str
    difficulty: int

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int
    class Config:
        orm_mode = True

class TaskBase(BaseModel):
    title: str
    subject_id: int
    deadline: datetime
    estimated_hours: float
    priority: Optional[int] = 1
    task_type: Optional[str] = "Assignment" # Assignment or Quiz

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    is_completed: bool
    class Config:
        orm_mode = True

class ScheduleBase(BaseModel):
    day_of_week: int
    available_hours: float

class ScheduleCreate(ScheduleBase):
    pass

class Schedule(ScheduleBase):
    id: int
    class Config:
        orm_mode = True

class ClassScheduleBase(BaseModel):
    day: int
    slot_index: int
    subject_name: str
    room: Optional[str] = None
    professor: Optional[str] = None
    color: Optional[str] = "#4f46e5"
    slot_type: Optional[str] = None # Lecture or Section
    section_group_code: Optional[str] = None
    teaching_assistant: Optional[str] = None

class ClassScheduleCreate(ClassScheduleBase):
    pass

class ClassSchedule(ClassScheduleBase):
    id: int
    class Config:
        orm_mode = True

class StudySession(BaseModel):
    day: int
    task_id: int
    task_title: str
    hours: float
    stress_level: str
