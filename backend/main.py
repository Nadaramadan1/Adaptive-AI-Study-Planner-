from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database, engine as core_engine
from services.vision_service import VisionService
from fastapi import UploadFile, File

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Adaptive Study Planner API")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/subjects/", response_model=schemas.Subject)
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(database.get_db)):
    db_subject = models.Subject(**subject.dict())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@app.get("/subjects/", response_model=List[schemas.Subject])
def read_subjects(db: Session = Depends(database.get_db)):
    return db.query(models.Subject).all()

@app.post("/tasks/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(database.get_db)):
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks/", response_model=List[schemas.Task])
def read_tasks(db: Session = Depends(database.get_db)):
    return db.query(models.Task).all()

@app.post("/schedule/", response_model=schemas.Schedule)
def create_schedule(schedule: schemas.ScheduleCreate, db: Session = Depends(database.get_db)):
    db_schedule = models.UserSchedule(**schedule.dict())
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

@app.get("/plan/", response_model=List[schemas.StudySession])
def get_study_plan(db: Session = Depends(database.get_db)):
    tasks = db.query(models.Task).filter(models.Task.is_completed == False).all()
    schedules = db.query(models.UserSchedule).all()
    class_schedules = db.query(models.ClassSchedule).all()
    
    if not schedules:
        raise HTTPException(status_code=400, detail="No study schedule defined")
    
    plan = core_engine.StudyEngine.generate_plan(tasks, schedules, class_schedules)
    return plan

@app.post("/class-schedule/", response_model=schemas.ClassSchedule)
def create_class_session(cls: schemas.ClassScheduleCreate, db: Session = Depends(database.get_db)):
    db_cls = models.ClassSchedule(**cls.dict())
    db.add(db_cls)
    db.commit()
    db.refresh(db_cls)
    return db_cls

@app.get("/class-schedule/", response_model=List[schemas.ClassSchedule])
def get_class_schedule(db: Session = Depends(database.get_db)):
    return db.query(models.ClassSchedule).all()

@app.delete("/class-schedule/{cls_id}")
def delete_class_session(cls_id: int, db: Session = Depends(database.get_db)):
    db_cls = db.query(models.ClassSchedule).filter(models.ClassSchedule.id == cls_id).first()
    if not db_cls:
        raise HTTPException(status_code=404, detail="Class not found")
    db.delete(db_cls)
    db.commit()
    return {"message": "Deleted"}

@app.post("/upload-schedule/")
async def upload_schedule(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    print(f"DEBUG: Received file upload: {file.filename}")
    # 1. Read file content
    content = await file.read()
    
    # 2. Extract data (AI Mock)
    extracted_slots = await VisionService.extract_schedule_from_image(content)
    print(f"DEBUG: Extracted {len(extracted_slots)} slots from vision service")
    
    # 3. Save to database (Batch)
    created_slots = []
    for slot in extracted_slots:
        db_cls = models.ClassSchedule(**slot)
        db.add(db_cls)
        created_slots.append(db_cls)
    
    db.commit()
    print(f"DEBUG: Committed {len(created_slots)} slots to database")
    return {"message": f"Successfully imported {len(created_slots)} classes", "count": len(created_slots)}

@app.get("/")
def health_check():
    return {"status": "online", "message": "Adaptive Study Planner API is running"}
