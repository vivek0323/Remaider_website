import { Reminder } from "@/types/reminder";
import { toast } from "@/components/ui/use-toast";
import { sendSMS, sendEmail } from "@/services/messageService";

// Mocking the API since we're focusing on the frontend
const STORAGE_KEY = 'reminders';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to simulate network latency
const simulateRequest = async <T>(data: T): Promise<T> => {
  await delay(500); // Simulate network latency
  return data;
};

// Function to process sending a reminder
const processReminder = async (reminder: Reminder) => {
  if (reminder.method === "sms" && reminder.phoneNumber) {
    return await sendSMS(reminder.phoneNumber, reminder.message, reminder.countryCode);
  } else if (reminder.method === "email" && reminder.email) {
    return await sendEmail(reminder.email, "Reminder", reminder.message);
  }
  return false;
};

// Get all reminders from localStorage
const getReminders = async (): Promise<Reminder[]> => {
  try {
    const storedReminders = localStorage.getItem(STORAGE_KEY);
    const reminders: Reminder[] = storedReminders ? JSON.parse(storedReminders) : [];
    return simulateRequest(reminders);
  } catch (error) {
    console.error('Failed to fetch reminders:', error);
    toast({
      title: "Error",
      description: "Failed to load your reminders. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

// Add a new reminder
const addReminder = async (reminder: Omit<Reminder, 'id'>): Promise<Reminder> => {
  try {
    // Generate random ID (would typically be done by backend)
    const newReminder: Reminder = {
      ...reminder,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    // Get existing reminders
    const reminders = await getReminders();
    
    // Add new reminder
    const updatedReminders = [...reminders, newReminder];
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReminders));
    
    // Check if we should send the message now (if the reminder time is now or in the past)
    const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
    const now = new Date();
    
    if (reminderDateTime <= now) {
      // Send the reminder message immediately
      const success = await processReminder(newReminder);
      
      if (success) {
        toast({
          title: "Reminder sent",
          description: "Your reminder has been sent successfully.",
        });
      }
    } else {
      // The reminder is scheduled for the future
      const successMessage = reminder.method === 'sms' 
        ? `Your reminder will be sent to ${reminder.phoneNumber} at the scheduled time.` 
        : `Your reminder will be sent to ${reminder.email} at the scheduled time.`;
      
      toast({
        title: "Reminder scheduled",
        description: successMessage,
      });
    }
    
    return simulateRequest(newReminder);
  } catch (error) {
    console.error('Failed to add reminder:', error);
    toast({
      title: "Error",
      description: "Failed to create your reminder. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

// Send a specific reminder now
const sendReminderNow = async (id: string): Promise<boolean> => {
  try {
    const reminders = await getReminders();
    const reminder = reminders.find(r => r.id === id);
    
    if (!reminder) {
      toast({
        title: "Error",
        description: "Reminder not found.",
        variant: "destructive",
      });
      return false;
    }
    
    const success = await processReminder(reminder);
    
    if (success) {
      toast({
        title: "Reminder sent",
        description: "Your reminder has been sent successfully.",
      });
      return true;
    } else {
      toast({
        title: "Error",
        description: "Failed to send reminder. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  } catch (error) {
    console.error('Failed to send reminder:', error);
    toast({
      title: "Error",
      description: "Failed to send reminder. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Delete a reminder
const deleteReminder = async (id: string): Promise<boolean> => {
  try {
    // Get existing reminders
    const reminders = await getReminders();
    
    // Filter out the reminder to delete
    const updatedReminders = reminders.filter(r => r.id !== id);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReminders));
    
    toast({
      title: "Reminder deleted",
      description: "The reminder has been successfully deleted and will not be sent.",
    });
    
    return simulateRequest(true);
  } catch (error) {
    console.error('Failed to delete reminder:', error);
    toast({
      title: "Error",
      description: "Failed to delete your reminder. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

export const api = {
  getReminders,
  addReminder,
  deleteReminder,
  sendReminderNow
};
