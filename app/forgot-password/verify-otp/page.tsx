'use client';

import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IoArrowBack } from 'react-icons/io5';

/* ───── Inline Modal ───── */

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
        <div
          className={`absolute inset-0 rounded-[24px] bg-gradient-to-br ${colorClasses.ring} blur-xl opacity-70`}
        />
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

export default function OtpVerificationPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<StatusType>('info');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [redirectOnClose, setRedirectOnClose] = useState(false);

  useEffect(() => setIsMounted(true), []);

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
      router.push('/forgot-password/reset-password');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 6 || otp.some((d) => d === '')) {
      openModal(
        'error',
        'Invalid Code',
        'Please enter the 6-digit code we sent to your email.',
        false,
      );
      return;
    }

    // Verify with backend here
    openModal(
      'success',
      'Code Verified',
      'Your verification code is correct. You can now set a new password.',
      true,
    );
  };

  const handleResend = () => {
    // Resend via backend here
    openModal(
      'info',
      'Code Resent',
      'We have resent a new 6-digit code to your email address.',
      false,
    );
    setOtp(new Array(6).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-gray-50 bg-[url('/background-pattern.png')] bg-cover bg-center bg-no-repeat py-8 sm:py-10 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/5" />

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-semibold border border-indigo-100">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            Step 2 of 3 · Verify OTP
          </div>
        </div>

        {/* logo */}
        <div className="mb-4 sm:mb-5 transform transition-all duration-500 hover:scale-105">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
            <Image
              src="/RSEB.png"
              alt="RSEB Logo"
              fill
              className="object-contain drop-shadow-lg"
            />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2">
          Enter Verification Code
        </h1>
        <p className="text-xs sm:text-sm text-center text-gray-600 mb-6 sm:mb-7">
          We&apos;ve sent a 6-digit code to your email. Enter it below to
          continue.
        </p>

        {/* OTP inputs */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-7">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center text-lg sm:text-xl font-semibold border border-gray-200 rounded-xl sm:rounded-2xl bg-gray-50 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleVerify}
          className="block w-full text-center py-2.5 sm:py-3 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-lg hover:bg-indigo-700 active:scale-[0.98] transition-all"
        >
          Verify &amp; Continue
        </button>

        <p className="mt-4 sm:mt-5 text-[11px] sm:text-xs text-center text-gray-500">
          Didn&apos;t get the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline bg-transparent border-none cursor-pointer"
          >
            Resend
          </button>
        </p>

        <p className="mt-3 text-[10px] sm:text-[11px] text-center text-gray-400">
          Wrong email?{' '}
          <Link
            href="/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Go back to step 1
          </Link>
        </p>
      </div>

      <StatusModal
        open={modalOpen}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
        onClose={handleCloseModal}
      />

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
