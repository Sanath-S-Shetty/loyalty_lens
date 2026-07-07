from sqlalchemy import create_engine, Column, String, JSON
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./loyalty.db"

# Create database engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define the Jobs table
class DBJob(Base):
    __tablename__ = "analysis_jobs"

    job_id = Column(String, primary_key=True, index=True)
    company_name = Column(String, index=True)
    status = Column(String, default="PENDING")  # PENDING, PROCESSING, COMPLETED, FAILED
    result_data = Column(JSON, nullable=True)

# Function to initialize the database
def init_db():
    Base.metadata.create_all(bind=engine)