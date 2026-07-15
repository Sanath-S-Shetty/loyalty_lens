# database.py
import os
import datetime
from sqlalchemy import create_engine, Column, String, DateTime, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# 1. Setup the Connection String (Points to your Docker container)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/loyalty_lens")

# 2. Configure the SQLAlchemy Engine and Session Creators
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 3. Your Database Models
class DBJob(Base):
    __tablename__ = "jobs"

    job_id = Column(String(100), primary_key=True, index=True)
    company_name = Column(String(255), nullable=False)
    status = Column(String(50), default="PENDING")
    
    # Using JSONB ensures your structured Pydantic data from LangGraph maps perfectly
    result_data = Column(JSONB, nullable=True) 
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class DBContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=True)
    message = Column(String(2000), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# 4. Initialization Helper (Called in main.py to auto-create tables on startup)
def init_db():
    Base.metadata.create_all(bind=engine)