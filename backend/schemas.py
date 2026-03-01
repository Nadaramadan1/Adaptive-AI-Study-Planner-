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
        from_attributes = True

class TaskBase(BaseModel):
    title: str
    subject_id: int
    deadline: datetime
    estimated_hours: float
    priority: Optional[int] = 1 # 1-Low, 2-Medium, 3-High
    task_type: Optional[str] = "Assignment" # Assignment, Quiz, Project, Midterm, Final
    description: Optional[str] = None
    link: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    is_completed: bool
    class Config:
        from_attributes = True

class ResourceBase(BaseModel):
    subject_id: int
    title: str
    link: str
    resource_type: str
    is_core: Optional[bool] = True

class ResourceCreate(ResourceBase):
    pass

class Resource(ResourceBase):
    id: int
    class Config:
        from_attributes = True

class UserStatsBase(BaseModel):
    points: int
    streak: int
    total_sessions: int

class UserStats(UserStatsBase):
    id: int
    last_active: datetime
    class Config:
        from_attributes = True

class MoodReflectionBase(BaseModel):
    mood: str
    note: Optional[str] = None

class MoodReflectionCreate(MoodReflectionBase):
    pass

class MoodReflection(MoodReflectionBase):
    id: int
    date: datetime
    class Config:
        from_attributes = True

class ScheduleBase(BaseModel):
    day_of_week: int
    available_hours: float

class ScheduleCreate(ScheduleBase):
    pass

class Schedule(ScheduleBase):
    id: int
    class Config:
        from_attributes = True

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
        from_attributes = True

class StudySession(BaseModel):
    day: int
    task_id: int
    task_title: str
    hours: float
    stress_level: str
    pomodoro_cycles: int
    suggested_break_activity: str
