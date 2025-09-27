'use client';
import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  ConfirmationResult,
  UserCredential,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { MailIcon, LockIcon, Spinner } from '@/components/icons/AuthIcons';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// To inform TypeScript about the global recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Component State
  const [isLogin, setIsLogin]       = useState<boolean>(true);
  const [email, setEmail]           = useState<string>('');
  const [password, setPassword]     = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp]               = useState<string>('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpSent, setOtpSent]       = useState<boolean>(false);
  const [showPhoneInput, setShowPhoneInput] = useState<boolean>(false);
  
  // UI/UX State
  const [error, setError]           = useState<string>('');
  const [loading, setLoading]       = useState<boolean>(false);
  const [phoneLoading, setPhoneLoading] = useState<boolean>(false);

  // --- Firebase Logic Handlers with Improved Error Handling ---

  const getFriendlyErrorMessage = (err: any): string => {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          return 'This email address is already in use.';
        case 'auth/weak-password':
          return 'Password is too weak. It should be at least 6 characters.';
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          return 'Invalid email or password.';
        case 'auth/too-many-requests':
          return 'Too many requests. Please try again later.';
        case 'auth/invalid-phone-number':
          return 'The phone number is not valid.';
        case 'auth/invalid-verification-code':
          return 'The OTP code is not valid.';
        default:
          return 'An unexpected error occurred. Please try again.';
      }
    }
    return 'An unexpected error occurred. Please try again.';
  };

  const handleAuthAction = async (action: Promise<UserCredential>) => {
    setLoading(true);
    setError('');
    try {
      await action;
      router.push('/');
    } catch (err) {
        console.error("DETAILED FIREBASE ERROR:", err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };
  
  const handleEmailSignUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAuthAction(createUserWithEmailAndPassword(auth, email, password));
  };
  
  const handleEmailSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAuthAction(signInWithEmailAndPassword(auth, email, password));
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    handleAuthAction(signInWithPopup(auth, provider));
  };

  const handlePhoneSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPhoneLoading(true);
    setError('');
    try {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      const formattedPhoneNumber = `+91${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, verifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleOtpVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setPhoneLoading(true);
    setError('');
    try {
      await confirmationResult.confirm(otp);
      setOtpSent(false);
      router.push('/');
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setPhoneLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  // --- Framer Motion Variants ---

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // --- Render Logic ---

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <p className="text-muted-foreground">You are already logged in.</p>
          <button onClick={handleSignOut} className="w-full h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-background overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)]"></div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full bg-card/60 dark:bg-card/40 backdrop-blur-lg border rounded-2xl shadow-xl p-8 space-y-6"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setShowPhoneInput(false);
              }}
              className="font-medium text-primary hover:underline ml-1"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <form onSubmit={isLogin ? handleEmailSignIn : handleEmailSignUp} className="space-y-4">
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required className="w-full h-11 pl-10 pr-3 bg-input border rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"/>
            </div>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full h-11 pl-10 pr-3 bg-input border rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"/>
            </div>
            <motion.button whileHover={{ scale: 1.02, boxShadow: "0px 0px 8px hsl(var(--primary))" }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full h-11 flex items-center justify-center bg-primary text-primary-foreground rounded-md font-medium shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50">
              {loading ? <Spinner /> : (isLogin ? 'Sign In' : 'Create Account')}
            </motion.button>
          </form>
        </motion.div>
        
        {error && <p className="text-center text-sm text-destructive">{error}</p>}

        <motion.div variants={itemVariants} className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card/0 px-2 text-muted-foreground backdrop-blur-sm">Or</span></div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGoogleSignIn} disabled={loading} className="w-full h-11 inline-flex items-center justify-center gap-2 px-4 bg-background border rounded-md font-medium text-sm transition-colors hover:bg-accent disabled:opacity-50">
            <GoogleIcon /> Continue with Google
          </motion.button>

          {!showPhoneInput ? (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowPhoneInput(true)} disabled={loading} className="w-full h-11 inline-flex items-center justify-center gap-2 px-4 bg-background border rounded-md font-medium text-sm transition-colors hover:bg-accent disabled:opacity-50">
              Continue with Phone
            </motion.button>
          ) : (
             <AnimatePresence>
                {!otpSent ? (
                  <motion.form key="phoneForm" initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} onSubmit={handlePhoneSignIn} className="flex gap-2">
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone number" className="flex-grow h-11 px-3 bg-input border rounded-md text-sm" />
                    <button type="submit" disabled={phoneLoading} className="h-11 px-4 flex items-center justify-center bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80 disabled:opacity-50">
                      {phoneLoading ? <Spinner/> : 'Send OTP'}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form key="otpForm" initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} onSubmit={handleOtpVerify} className="flex gap-2">
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required className="flex-grow h-11 px-3 bg-input border rounded-md text-sm" />
                    <button type="submit" disabled={phoneLoading} className="h-11 px-4 flex items-center justify-center bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80 disabled:opacity-50">
                      {phoneLoading ? <Spinner/> : 'Verify'}
                    </button>
                  </motion.form>
                )}
             </AnimatePresence>
          )}
        </motion.div>

        <motion.p variants={itemVariants} className="px-8 text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link>.
        </motion.p>
      </motion.div>

      <div id="recaptcha-container"></div>
    </main>
  );
}