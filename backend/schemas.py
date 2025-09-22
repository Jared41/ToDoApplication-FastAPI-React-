from pydantic import BaseModel
from datetime import date
from typing import Optional

class UserBase(BaseModel):
    firstname: str
    lastname: str
    age: int
    date_of_birth: date

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserDelete(BaseModel):
    id: int