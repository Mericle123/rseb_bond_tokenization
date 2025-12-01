'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';

/* ───── Shared Modal (inline) ───── */

type StatusType = 'success' | 'error' | 'info';

interface StatusModalProps {
  open: boolean;
  type?: StatusType;
  title: string;
  message: string;
  onClose: () => void;
}

function StatusModal({
  open,
  type = 'info',
  title,
  message,
  onClose,
}: StatusModalProps) {
  if (!open) return null;

  const colorClasses =
    type === 'success'
      ? {
          ring: 'from-emerald-400/40 via-emerald-500/20 to-cyan-400/30',
          chipBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          iconBg: 'bg-emerald-100 text-emerald-600',
          label: 'Success',
        }
      : type === 'error'
      ? {
          ring: 'from-red-400/40 via-rose-500/20 to-orange-400/30',
          chipBg: 'bg-red-50 text-red-700 border-red-100',
          iconBg: 'bg-red-100 text-red-600',
          label: 'Error',
        }
      : {
          ring: 'from-blue-400/40 via-indigo-500/20 to-cyan-400/30',
          chipBg: 'bg-blue-50 text-blue-700 border-blue-100',
          iconBg: 'bg-blue-100 text-blue-600',
          label: 'Notice',
        };

  const iconSymbol = type === 'success' ? '✓' : type === 'error' ? '!' : 'i';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      <div
        className="relative w-full max-w-sm"
        style={{ animation: 'modal-pop 0.22s ease-out' }}
      >
        {/* Glow ring behind */}
        <div
          className={`absolute inset-0 rounded-[24px] bg-gradient-to-br ${colorClasses.ring} blur-xl opacity-70`}
        />
        {/* Card */}
        <div className="relative bg-white/95 rounded-[20px] border border-white/70 shadow-[0_18px_60px_rgba(15,23,42,0.25)] px-5 py-6 sm:px-6 sm:py-7">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold border ${colorClasses.chipBg}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {colorClasses.label}
            </div>
          </div>
          <div
            className={`mx-auto mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full ${colorClasses.iconBg}`}
          >
            <span className="text-base sm:text-lg font-bold">{iconSymbol}</span>
          </div>
          <h2 className="text-[16px] sm:text-[17px] font-semibold text-slate-900 mb-1 text-center">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-5 text-center leading-relaxed">
            {message}
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───── Page ───── */

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState('');

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<StatusType>('info');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [redirectOnClose, setRedirectOnClose] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openModal = (
    type: StatusType,
    title: string,
    message: string,
    redirect = false,
  ) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setRedirectOnClose(redirect);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    if (redirectOnClose && modalType === 'success') {
      router.push('/forgot-password/verify-otp');
    }
  };

  const handleSendCode = () => {
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmed) {
      openModal(
        'error',
        'Email Required',
        'Please enter your registered email address to continue.',
        false,
      );
      return;
    }

    if (!emailRegex.test(trimmed)) {
      openModal(
        'error',
        'Invalid Email Address',
        'Please enter a valid email like "yourname@example.com".',
        false,
      );
      return;
    }

    // Call backend here if needed
    openModal(
      'success',
      'Verification Code Sent',
      'We have emailed you a 6-digit code. Please check your inbox or spam folder.',
      true,
    );
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-gray-50 bg-[url('/background-pattern.png')] bg-cover bg-center bg-no-repeat py-8 sm:py-10 px-4 sm:px-6 overflow-hidden">
      {/* subtle overlay */}
      <div className="absolute inset-0 bg-black/5" />

      {/* Card */}
      <div
        className={`relative z-10 bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 w-full max-w-md border border-white/60 transform transition-all duration-500 ${
          isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        {/* back */}
        <button
          onClick={() => router.back()}
          className="absolute left-3 top-3 sm:left-4 sm:top-4 inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Go back"
        >
          <IoArrowBack size={18} />
        </button>

        {/* step chip */}
        <div className="flex justify-center mb-4 mt-4 sm:mt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] sm:text-xs font-semibold border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Step 1 of 3 · Verify Email
          </div>
        </div>

        {/* logo */}
        <div className="mb-5 sm:mb-6 transform transition-all duration-500 hover:scale-105">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto">
            <Image
              src="/RSEB.png"
              alt="RSEB Logo"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* title */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-gray-800">
          Forgot Password
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 text-center mb-7 sm:mb-8">
          Enter your registered email address and we&apos;ll send you a
          verification code.
        </p>

        {/* input + button */}
        <div className="w-full flex flex-col gap-5 sm:gap-6">
          <div className="space-y-2 text-left">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="yourname@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 sm:p-3 pl-9 sm:pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-300 hover:border-gray-300 shadow-sm text-xs sm:text-sm"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendCode}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Send Verification Code
          </button>
        </div>

        <p className="mt-5 sm:mt-6 text-[11px] sm:text-xs text-gray-500 text-center">
          Remembered your password?{' '}
          <Link
            href="/admin/login"
            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
          >
            Go back to login
          </Link>
        </p>
      </div>

      {/* popup animation keyframes */}
      <style jsx global>{`
        @keyframes modal-pop {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
