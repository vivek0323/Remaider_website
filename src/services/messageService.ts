
import { toast } from "@/components/ui/use-toast";

// Email configuration
const EMAIL_ADDRESS = "vvivek0323@gmail.com";
const EMAIL_PASSWORD = "fpue wcyc xttx vomh";

// Twilio configuration
const TWILIO_ACCOUNT_SID = 'your_actual_sid_here';
const TWILIO_AUTH_TOKEN = 'your_actual_token_here';
const TWILIO_PHONE_NUMBER = '+15075127184';

// Helper function to format phone numbers correctly with country code
const formatPhoneNumber = (phoneNumber: string, countryCode: string): string => {
  // Remove any non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Add the country code (if it doesn't already have it)
  if (!phoneNumber.startsWith('+')) {
    // Add the + and country code without leading zeros
    const formattedCountryCode = countryCode.startsWith('+') 
      ? countryCode 
      : `+${countryCode.replace(/^0+/, '')}`;
    
    return `${formattedCountryCode}${cleaned}`;
  }
  
  return phoneNumber; // Already has + format
};

// Function to check if phone number is eligible for trial account
const isEligibleForTrialAccount = (phoneNumber: string): boolean => {
  // Trial accounts can only send to US and Canada numbers (starting with +1)
  return phoneNumber.startsWith('+1');
}

// Function to send SMS using Twilio
export const sendSMS = async (to: string, message: string, countryCode: string = '1'): Promise<boolean> => {
  try {
    // Format the phone number correctly with country code
    const formattedNumber = formatPhoneNumber(to, countryCode);
    
    // Display what number we're attempting to send to (for debugging)
    console.log(`Attempting to send SMS to: ${formattedNumber}`);
    
    // Check if the number is eligible for trial account
    if (!isEligibleForTrialAccount(formattedNumber)) {
      throw new Error(`This is a Twilio trial account which can only send SMS to US and Canada phone numbers (starting with +1). The number ${formattedNumber} is not supported.`);
    }
    
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('To', formattedNumber);
    formData.append('From', TWILIO_PHONE_NUMBER);
    formData.append('Body', message);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Handle Twilio-specific errors
      if (data.code === 21608) {
        // Error for unverified numbers
        throw new Error(`${formattedNumber} is not verified. Trial accounts can only send to verified numbers. Please verify this number at twilio.com/user/account/phone-numbers/verified`);
      } else if (data.code === 21408) {
        // Error for unsupported regions
        throw new Error(`Region not supported: ${formattedNumber}. Twilio trial accounts can only send to verified numbers or to numbers in the US and Canada.`);
      } else {
        throw new Error(data.message || 'Failed to send SMS');
      }
    }
    
    console.log('SMS sent successfully:', data);
    toast({
      title: "SMS Sent Successfully",
      description: `Your message has been sent to ${formattedNumber}`,
    });
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    toast({
      title: "SMS Sending Failed",
      description: `${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive",
    });
    return false;
  }
};

// Function to send email using EmailJS (client-side email sending)
export const sendEmail = async (to: string, subject: string, message: string): Promise<boolean> => {
  try {
    // Using EmailJS for client-side email sending
    // This is a workaround since we can't directly use SMTP from the browser
    const serviceID = "default_service"; // Create this service in EmailJS dashboard
    const templateID = "template_default"; // Create this template in EmailJS dashboard
    const userID = "user_yourUserID"; // Your EmailJS user ID
    
    const templateParams = {
      to_email: to,
      from_name: "Reminder App",
      from_email: EMAIL_ADDRESS,
      subject: subject,
      message: message
    };
    
    // Note: In a real application, you would use the EmailJS SDK
    // This is a simplified version showing the concept
    const url = 'https://api.emailjs.com/api/v1.0/email/send';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: serviceID,
        template_id: templateID,
        user_id: userID,
        template_params: templateParams
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    
    console.log('Email sent successfully');
    toast({
      title: "Email Sent Successfully",
      description: `Your message has been sent to ${to}`,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    toast({
      title: "Email Sending Failed",
      description: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive",
    });
    return false;
  }
};

// Alternative implementation for sending emails using a serverless function or proxy
// This is a placeholder for how you would structure the request to your backend
export const sendEmailViaBackend = async (to: string, subject: string, message: string): Promise<boolean> => {
  try {
    // In a real application, this would call your backend API
    // which would use nodemailer or another server-side email library
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to,
        subject,
        message,
        from: EMAIL_ADDRESS
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email via backend');
    }
    
    console.log('Email sent successfully via backend');
    return true;
  } catch (error) {
    console.error('Error sending email via backend:', error);
    return false;
  }
};
