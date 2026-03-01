from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
import database
Base = database.Base
import datetime

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    difficulty = Column(Integer)  # 1-10

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    deadline = Column(DateTime)
    estimated_hours = Column(Float)
    priority = Column(Integer, default=1) # 1-Low, 2-Medium, 3-High
    is_completed = Column(Boolean, default=False)
    task_type = Column(String, default="Assignment")  # Assignment, Quiz, Project, Midterm, Final
    description = Column(String, nullable=True)
    link = Column(String, nullable=True)

    subject = relationship("Subject")

class Resource(Base):
    __tablename__ = "resources"
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    title = Column(String)
    link = Column(String)
    resource_type = Column(String) # Google Drive, YouTube, Notes
    is_core = Column(Boolean, default=True)

class UserStats(Base):
    __tablename__ = "user_stats"
    id = Column(Integer, primary_key=True, index=True)
    points = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    last_active = Column(DateTime, default=datetime.datetime.now)
    total_sessions = Column(Integer, default=0)

class MoodReflection(Base):
    __tablename__ = "mood_reflections"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.datetime.now)
    mood = Column(String) # Happy, Stressed, Productive, Tired, Relaxed
    note = Column(String, nullable=True)

class UserSchedule(Base):
    __tablename__ = "user_schedules"
    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(Integer)  # 0-6 (Mon-Sun)
    available_hours = Column(Float)

class ClassSchedule(Base):
    __tablename__ = "class_schedules"
    id = Column(Integer, primary_key=True, index=True)
    day = Column(Integer)  # 0-6 (Sat-Fri)
    slot_index = Column(Integer)  # 0-5
    subject_name = Column(String)
    room = Column(String, nullable=True)
    professor = Column(String, nullable=True)
    color = Column(String, default="#4f46e5")
    slot_type = Column(String, nullable=True)  # Lecture or Section
    section_group_code = Column(String, nullable=True)
    teaching_assistant = Column(String, nullable=True)
