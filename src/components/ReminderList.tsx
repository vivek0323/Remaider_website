import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/services/api";
import { Reminder } from "@/types/reminder";
import { Button } from "@/components/ui/button";
import { CalendarClock, Mail, MessageSquare, Trash2, Phone, CheckCircle, Send } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ReminderListProps {
  refreshTrigger: number;
}

const ReminderList = ({ refreshTrigger }: ReminderListProps) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    const loadReminders = async () => {
      setLoading(true);
      try {
        const data = await api.getReminders();
        setReminders(data);
      } catch (error) {
        console.error("Failed to load reminders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReminders();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteReminder(id);
      setReminders(prev => prev.filter(reminder => reminder.id !== id));
    } catch (error) {
      console.error("Failed to delete reminder:", error);
    }
  };

  const handleSendNow = async (id: string) => {
    setSending(id);
    try {
      await api.sendReminderNow(id);
    } catch (error) {
      console.error("Failed to send reminder:", error);
    } finally {
      setSending(null);
    }
  };

  const formatDateTime = (dateStr: string, timeStr: string) => {
    try {
      // Parse the date string into a Date object
      const dateObj = parseISO(`${dateStr}T${timeStr}`);
      return format(dateObj, "EEE, MMM d 'at' h:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return `${dateStr} ${timeStr}`;
    }
  };

  // Format the phone number for display with country code
  const formatDisplayPhoneNumber = (phoneNumber?: string, countryCode?: string) => {
    if (!phoneNumber) return '';
    
    // If we have a country code, display it
    if (countryCode) {
      return `+${countryCode} ${phoneNumber}`;
    }
    
    return phoneNumber;
  };

  return (
    <Card className="w-full">
      <CardHeader style={{ 
        backgroundColor: '#f3f4f6', 
        borderTopLeftRadius: '0.5rem', 
        borderTopRightRadius: '0.5rem' 
      }}>
        <CardTitle style={{ 
          color: '#4b5563', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem' 
        }}>
          <CalendarClock style={{ height: '1.25rem', width: '1.25rem' }} />
          Your Reminders
        </CardTitle>
        <CardDescription>
          Manage your upcoming reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        ) : reminders.length === 0 ? (
          <Alert style={{ 
            margin: '1.5rem', 
            backgroundColor: '#f9fafb', 
            border: '1px solid #e5e7eb' 
          }}>
            <CalendarClock style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
            <AlertTitle>No reminders yet</AlertTitle>
            <AlertDescription>
              Create your first reminder using the form above.
            </AlertDescription>
          </Alert>
        ) : (
          <div style={{ borderTop: '1px solid #e5e7eb' }}>
            {reminders.map((reminder) => (
              <div 
                key={reminder.id} 
                className="p-6 border-b border-gray-200 transition-colors hover:bg-gray-50"
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  marginBottom: '0.5rem' 
                }}>
                  <div>
                    <h3 style={{ 
                      fontWeight: '500', 
                      fontSize: '1.125rem', 
                      marginBottom: '0.25rem',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {reminder.message}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      {formatDateTime(reminder.date, reminder.time)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendNow(reminder.id)}
                      disabled={sending === reminder.id}
                      className="text-green-600 hover:bg-green-50 border-green-200"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      {sending === reminder.id ? 'Sending...' : 'Send Now'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(reminder.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 style={{ height: '1rem', width: '1rem' }} />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <Badge variant="outline" style={{ 
                    width: 'fit-content', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem'
                  }}>
                    {reminder.method === "sms" ? (
                      <>
                        <MessageSquare style={{ height: '0.75rem', width: '0.75rem' }} />
                        <span>SMS</span>
                      </>
                    ) : (
                      <>
                        <Mail style={{ height: '0.75rem', width: '0.75rem' }} />
                        <span>Email</span>
                      </>
                    )}
                  </Badge>
                  
                  {reminder.method === "sms" && reminder.phoneNumber && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem', 
                      fontSize: '0.75rem', 
                      color: '#6b7280' 
                    }}>
                      <Phone style={{ height: '0.75rem', width: '0.75rem' }} />
                      <span>To: {formatDisplayPhoneNumber(reminder.phoneNumber, reminder.countryCode)}</span>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#f0fdf4',
                        color: '#16a34a',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        marginLeft: '0.5rem'
                      }}>
                        <CheckCircle style={{ height: '0.625rem', width: '0.625rem' }} />
                        <span>Will send to this number</span>
                      </div>
                    </div>
                  )}
                  
                  {reminder.method === "email" && reminder.email && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem', 
                      fontSize: '0.75rem', 
                      color: '#6b7280' 
                    }}>
                      <Mail style={{ height: '0.75rem', width: '0.75rem' }} />
                      <span>To: {reminder.email}</span>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#f0fdf4',
                        color: '#16a34a',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        marginLeft: '0.5rem'
                      }}>
                        <CheckCircle style={{ height: '0.625rem', width: '0.625rem' }} />
                        <span>Will send to this email</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReminderList;
