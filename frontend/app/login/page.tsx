'use client';
import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MailIcon, LockIcon, Spinner, UserIcon, PhoneIcon } from '@/components/icons/AuthIcons';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function LoginPage() {
  const { user, login, signup, verifyOTP, logout } = useAuth();
  const router = useRouter();

  // Component State
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [tempUserData, setTempUserData] = useState<any>(null);
  
  // UI/UX State
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // --- Authentication Handlers ---

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signup(email, name, phone, password);
    if (result.success) {
      setTempUserData(result.tempData);
      setOtpSent(true);
    } else {
      setError(result.error || 'Signup failed');
    }
    setLoading(false);
  };

  const handleOtpVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await verifyOTP(phone, otp, null);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'OTP verification failed');
    }
    setLoading(false);
  };

  const handleSignOut = () => {
    logout();
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
          <AnimatePresence mode="wait">
            {otpSent ? (
              <motion.form 
                key="otpForm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleOtpVerify} 
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    We sent a verification code to {phone}
                  </p>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    placeholder="Enter 6-digit OTP" 
                    maxLength={6}
                    required 
                    className="w-full h-11 px-3 bg-input border rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-center text-lg tracking-widest"
                  />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: "0px 0px 8px hsl(var(--primary))" }} 
                  whileTap={{ scale: 0.98 }} 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-11 flex items-center justify-center bg-primary text-primary-foreground rounded-md font-medium shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? <Spinner /> : 'Verify OTP'}
                </motion.button>
                <button 
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    setError('');
                  }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                >
                  Back to signup
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="authForm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={isLogin ? handleLogin : handleSignup} 
                className="space-y-4"
              >
                {!isLogin && (
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Full Name" 
                      required 
                      className="w-full h-11 pl-10 pr-3 bg-input border rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                )}
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="name@example.com" 
                    required 
                    className="w-full h-11 pl-10 pr-3 bg-input border rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                {!isLogin && (
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="Phone Number (10 digits)" 
                      maxLength={10}
                      required 
                      className="w-full h-11 pl-10 pr-3 bg-input border rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                )}
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required 
                    className="w-full h-11 pl-10 pr-3 bg-input border rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: "0px 0px 8px hsl(var(--primary))" }} 
                  whileTap={{ scale: 0.98 }} 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-11 flex items-center justify-center bg-primary text-primary-foreground rounded-md font-medium shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? <Spinner /> : (isLogin ? 'Sign In' : 'Create Account')}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
        
        {error && <p className="text-center text-sm text-destructive">{error}</p>}

        <motion.p variants={itemVariants} className="px-8 text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link>.
        </motion.p>
      </motion.div>
    </main>
  );
}