
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Reminder, ReminderMethod } from "@/types/reminder";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, MessageSquare, Mail, Phone } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ReminderFormProps {
  onReminderAdded: () => void;
}

// Country codes list for the dropdown
const countryCodes = [
  { code: "1", name: "United States & Canada (+1)" },
  { code: "44", name: "United Kingdom (+44)" },
  { code: "91", name: "India (+91)" },
  { code: "61", name: "Australia (+61)" },
  { code: "49", name: "Germany (+49)" },
  { code: "33", name: "France (+33)" },
  { code: "81", name: "Japan (+81)" },
  { code: "86", name: "China (+86)" },
  { code: "7", name: "Russia (+7)" },
  { code: "55", name: "Brazil (+55)" },
  { code: "52", name: "Mexico (+52)" },
  { code: "234", name: "Nigeria (+234)" },
  { code: "27", name: "South Africa (+27)" },
  { code: "82", name: "South Korea (+82)" },
  { code: "39", name: "Italy (+39)" },
  { code: "34", name: "Spain (+34)" },
];

const ReminderForm = ({ onReminderAdded }: ReminderFormProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState<ReminderMethod>("sms");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("1"); // Default to US/Canada
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset contact fields when method changes
  useEffect(() => {
    if (method === "sms") {
      setEmail("");
    } else {
      setPhoneNumber("");
      setCountryCode("1");
    }
  }, [method]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !message) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to create a reminder.",
        variant: "destructive",
      });
      return;
    }

    // Validate contact information based on method
    if (method === "sms" && !phoneNumber) {
      toast({
        title: "Missing phone number",
        description: "Please enter a phone number for SMS reminders.",
        variant: "destructive",
      });
      return;
    }

    if (method === "email" && !email) {
      toast({
        title: "Missing email",
        description: "Please enter an email address for email reminders.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await api.addReminder({
        date: format(date, "yyyy-MM-dd"),
        time,
        message,
        method,
        phoneNumber: method === "sms" ? phoneNumber : undefined,
        countryCode: method === "sms" ? countryCode : undefined,
        email: method === "email" ? email : undefined,
      });
      
      // Reset form
      setDate(undefined);
      setTime("");
      setMessage("");
      setMethod("sms");
      setPhoneNumber("");
      setCountryCode("1");
      setEmail("");
      
      // Notify parent component to refresh reminder list
      onReminderAdded();
    } catch (error) {
      console.error("Failed to create reminder:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card style={{ 
      width: '100%', 
      maxWidth: '28rem', 
      margin: '0 auto',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      <CardHeader style={{ 
        backgroundColor: '#f0f9ff', 
        borderTopLeftRadius: '0.5rem', 
        borderTopRightRadius: '0.5rem' 
      }}>
        <CardTitle style={{ color: '#0369a1' }}>Set a New Reminder</CardTitle>
        <CardDescription>Fill in the details for your reminder</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="time">Time</Label>
            <div style={{ position: 'relative' }}>
              <Clock style={{ position: 'absolute', left: '0.75rem', top: '0.625rem', height: '1rem', width: '1rem', color: '#6b7280' }} />
              <Input 
                id="time" 
                type="time" 
                style={{ paddingLeft: '2.5rem' }} 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message"
              placeholder="Enter your reminder message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ minHeight: '6rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Label>Reminder Method</Label>
            <RadioGroup 
              defaultValue="sms"
              value={method} 
              onValueChange={(value) => setMethod(value as ReminderMethod)}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RadioGroupItem value="sms" id="sms" />
                <Label htmlFor="sms" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <MessageSquare style={{ height: '0.875rem', width: '0.875rem' }} />
                  SMS
                </Label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <Mail style={{ height: '0.875rem', width: '0.875rem' }} />
                  Email
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {method === "sms" && (
            <>
              <Alert className="bg-amber-50 border-amber-200">
                <MessageSquare className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Twilio Trial Account Limitation</AlertTitle>
                <AlertDescription className="text-amber-700 text-xs">
                  This demo uses a Twilio trial account which can only send SMS to US and Canada phone numbers (starting with +1).
                  For other countries, the message will appear to be scheduled but won't be delivered.
                </AlertDescription>
              </Alert>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Label htmlFor="countryCode">Country Code</Label>
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country code" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            +{country.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-2/3">
                    <div style={{ position: 'relative' }}>
                      <Phone style={{ position: 'absolute', left: '0.75rem', top: '0.625rem', height: '1rem', width: '1rem', color: '#6b7280' }} />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Phone number"
                        style={{ paddingLeft: '2.5rem' }}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Note: Currently only US and Canada numbers (+1) will receive messages
                </div>
              </div>
            </>
          )}
          
          {method === "email" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="emailAddress" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Email Address
                <span style={{ 
                  fontSize: '0.75rem', 
                  backgroundColor: '#f0f9ff', 
                  color: '#0369a1',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '9999px',
                  fontWeight: '500'
                }}>
                  Message will be sent to this email
                </span>
              </Label>
              <Input
                id="emailAddress"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
        </CardContent>
        <CardFooter style={{ display: 'flex', justifyContent: 'flex-end', padding: '1.5rem', paddingTop: '0' }}>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-sky-600 text-white hover:bg-sky-700 px-6 py-2"
          >
            {isSubmitting ? "Creating..." : "Create Reminder"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReminderForm;
