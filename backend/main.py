from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from database import SessionLocal, engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="User Management API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "User Management API"}

@app.get("/users", response_model=List[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    """Get all users"""
    users = db.query(models.User).all()
    return users

@app.post("/users/create", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    db_user = models.User(
        firstname=user.firstname,
        lastname=user.lastname,
        age=user.age,
        date_of_birth=user.date_of_birth
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/user")
def delete_user(user_delete: schemas.UserDelete, db: Session = Depends(get_db)):
    """Delete a user by ID"""
    user = db.query(models.User).filter(models.User.id == user_delete.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": f"User with ID {user_delete.id} has been deleted"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}