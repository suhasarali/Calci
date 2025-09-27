'use client';
import { useState, FormEvent } from 'react';
import { auth } from '@/lib/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { MailIcon, LockIcon, Spinner } from '@/components/icons/AuthIcons';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const getFriendlyErrorMessage = (err: any): string => {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case 'auth/email-already-in-use': return 'This email address is already in use.';
        case 'auth/weak-password': return 'Password is too weak. It should be at least 6 characters.';
        case 'auth/invalid-email': return 'Please enter a valid email address.';
        case 'auth/user-not-found': case 'auth/wrong-password': return 'Invalid email or password.';
        case 'auth/too-many-requests': return 'Too many requests. Please try again later.';
        default: return 'An unexpected error occurred. Please try again.';
      }
    }
    return 'An unexpected error occurred. Please try again.';
  };
  
  const handleAuthAction = async (action: Promise<UserCredential>) => {
    setLoading(true);
    setError('');
    try {
      await action;
      onClose(); // Close modal on successful login/signup
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const action = isLogin 
      ? signInWithEmailAndPassword(auth, email, password)
      : createUserWithEmailAndPassword(auth, email, password);
    handleAuthAction(action);
  };
  
  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    handleAuthAction(signInWithPopup(auth, provider));
  };
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card rounded-2xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 space-y-6 relative">
               <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 rounded-full">
                  <X size={24} />
               </Button>
               
               <div className="text-center">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {isLogin ? 'Sign In to Continue' : 'Create an Account'}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-medium text-primary hover:underline ml-1">
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
               </div>
               
               <form onSubmit={handleEmailSubmit} className="space-y-4">
                 <div className="relative">
                   <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                   <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required className="pl-10"/>
                 </div>
                 <div className="relative">
                   <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                   <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="pl-10"/>
                 </div>
                 <Button type="submit" disabled={loading} className="w-full h-11">
                   {loading ? <Spinner /> : (isLogin ? 'Sign In' : 'Create Account')}
                 </Button>
               </form>

               {error && <p className="text-center text-sm text-destructive">{error}</p>}
               
               <div className="relative">
                 <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                 <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
               </div>
               
               <Button variant="outline" onClick={handleGoogleSignIn} disabled={loading} className="w-full h-11">
                 <GoogleIcon className="mr-2" /> Continue with Google
               </Button>
            </div>
          </motion.div>
        </motion.div>
    </AnimatePresence>
  );
}