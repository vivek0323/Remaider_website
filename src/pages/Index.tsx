
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReminderForm from "@/components/ReminderForm";
import ReminderList from "@/components/ReminderList";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleReminderAdded = () => {
    // Increment the refresh trigger to force a refresh of the reminder list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-medium mb-4">Create Reminder</h2>
            <ReminderForm onReminderAdded={handleReminderAdded} />
          </div>
          
          <div>
            <h2 className="text-xl font-medium mb-4">Upcoming Reminders</h2>
            <ReminderList refreshTrigger={refreshTrigger} />
          </div>
        </div>
        
        <div className="mt-16 p-6 bg-reminder-50 rounded-lg">
          <h2 className="text-xl font-medium mb-2">About This API Mock</h2>
          <p className="text-sm text-muted-foreground">
            This is a frontend demonstration using localStorage to simulate an API. 
            In a real application, these requests would be sent to a backend API that could 
            be built with Python frameworks like FastAPI or Django, or any other backend technology.
          </p>
          <pre className="mt-4 p-4 bg-muted rounded-md overflow-x-auto text-xs">
            <code>{`
# Example FastAPI endpoint that would handle these requests:

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import date, time

app = FastAPI()

class ReminderCreate(BaseModel):
    date: str
    time: str
    message: str
    method: str

class Reminder(ReminderCreate):
    id: str
    completed: bool = False

# In-memory store (would be a database in production)
reminders_db = []

@app.post("/reminders/", response_model=Reminder)
async def create_reminder(reminder: ReminderCreate):
    new_reminder = Reminder(
        id=str(uuid.uuid4()),
        date=reminder.date,
        time=reminder.time,
        message=reminder.message,
        method=reminder.method
    )
    reminders_db.append(new_reminder.dict())
    return new_reminder

@app.get("/reminders/", response_model=List[Reminder])
async def get_reminders():
    return reminders_db

@app.delete("/reminders/{reminder_id}")
async def delete_reminder(reminder_id: str):
    global reminders_db
    original_length = len(reminders_db)
    reminders_db = [r for r in reminders_db if r["id"] != reminder_id]
    
    if len(reminders_db) == original_length:
        raise HTTPException(status_code=404, detail="Reminder not found")
    
    return {"message": "Reminder deleted successfully"}
`}</code>
          </pre>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
