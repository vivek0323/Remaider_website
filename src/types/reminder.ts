
export type ReminderMethod = 'sms' | 'email';

export interface Reminder {
  id: string;
  date: string;
  time: string;
  message: string;
  method: ReminderMethod;
  phoneNumber?: string;  // Optional for email reminders
  countryCode?: string;  // Country code for phone numbers
  email?: string;        // Optional for SMS reminders
  completed?: boolean;
}
