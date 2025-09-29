// lib/otp-service.ts
import twilio from 'twilio';

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send OTP via Twilio Verify API
export const sendOTP = async (phone: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const formattedPhone = `+91${phone}`; // Assuming Indian phone numbers
    
    // In development, just log a mock OTP instead of sending SMS
     if (!process.env.USE_TWILIO) {
      console.log(`[DEV MODE] OTP would be sent to ${formattedPhone}`);
      return { success: true };
    }


    // Send OTP via Twilio Verify API
    await twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications
      .create({ to: formattedPhone, channel: "sms" });

    return { success: true };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { 
      success: false, 
      error: 'Failed to send OTP. Please check your phone number and try again.' 
    };
  }
};

// Verify OTP using Twilio Verify API
export const verifyOTP = async (phone: string, code: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const formattedPhone = `+91${phone}`; // Assuming Indian phone numbers
    
    // In development, accept any 6-digit code
    if (process.env.NODE_ENV === 'development') {
      if (code.length === 6 && /^\d{6}$/.test(code)) {
        return { success: true };
      } else {
        return { success: false, error: 'Invalid OTP format' };
      }
    }

    // Verify OTP via Twilio Verify API
    const verificationCheck = await twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks
      .create({ to: formattedPhone, code });

    if (verificationCheck.status === 'approved') {
      return { success: true };
    } else {
      return { success: false, error: 'Invalid or expired OTP' };
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { 
      success: false, 
      error: 'Failed to verify OTP. Please try again.' 
    };
  }
};
