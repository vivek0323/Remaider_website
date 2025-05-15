
import { useState } from "react";
import { sendSMS, sendEmail } from "@/services/messageService";
import { toast } from "@/components/ui/use-toast";

export const useMessage = () => {
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const sendSMSMessage = async (to: string, message: string) => {
    setIsSendingSMS(true);
    try {
      const result = await sendSMS(to, message);
      if (result) {
        toast({
          title: "SMS Sent",
          description: `Your message has been sent to ${to}`,
        });
        return true;
      } else {
        throw new Error("Failed to send SMS");
      }
    } catch (error) {
      console.error("Error in sendSMSMessage:", error);
      toast({
        title: "SMS Failed",
        description: `Could not send SMS to ${to}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSendingSMS(false);
    }
  };

  const sendEmailMessage = async (to: string, subject: string, message: string) => {
    setIsSendingEmail(true);
    try {
      const result = await sendEmail(to, subject, message);
      if (result) {
        toast({
          title: "Email Sent",
          description: `Your email has been sent to ${to}`,
        });
        return true;
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error in sendEmailMessage:", error);
      toast({
        title: "Email Failed",
        description: `Could not send email to ${to}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSendingEmail(false);
    }
  };

  return {
    sendSMSMessage,
    sendEmailMessage,
    isSendingSMS,
    isSendingEmail
  };
};
