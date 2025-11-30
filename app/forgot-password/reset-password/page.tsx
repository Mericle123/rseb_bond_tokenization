'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

/* ───── Helpers for password strength ───── */

type StrengthLevel = 0 | 1 | 2 | 3;

function evaluatePasswordStrength(password: string): {
  level: StrengthLevel;
  label: string;
} {
  let score: StrengthLevel = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  if (!password) return { level: 0, label: '' };
  if (score === 1) return { level: 1, label: 'Weak – add more variety.' };
  if (score === 2) return { level: 2, label: 'Medium – can be stronger.' };
  return { level: 3, label: 'Strong password.' };
}

/* ───── Page ───── */

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [strengthLevel, setStrengthLevel] = useState<StrengthLevel>(0);
  const [strengthLabel, setStrengthLabel] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<StatusType>('info');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [redirectOnClose, setRedirectOnClose] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const { level, label } = evaluatePasswordStrength(newPassword);
    setStrengthLevel(level);
    setStrengthLabel(label);
  }, [newPassword]);

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
      router.push('/admin/login');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      openModal(
        'error',
        'Missing Fields',
        'Please fill in both password fields to continue.',
        false,
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      openModal(
        'error',
        'Passwords Do Not Match',
        'Make sure both password fields are exactly the same.',
        false,
      );
      return;
    }

    const complexityRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!complexityRegex.test(newPassword)) {
      openModal(
        'error',
        'Password Too Weak',
        'Your password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.',
        false,
      );
      return;
    }

    // Call reset API here
    openModal(
      'success',
      'Password Updated',
      'Your password has been changed successfully. You can now log in with your new credentials.',
      true,
    );
  };

  const strengthBarWidth =
    strengthLevel === 0 ? '0%' : strengthLevel === 1 ? '33%' : strengthLevel === 2 ? '66%' : '100%';

  const strengthBarColor =
    strengthLevel === 1
      ? 'bg-red-500'
      : strengthLevel === 2
      ? 'bg-amber-500'
      : strengthLevel === 3
      ? 'bg-emerald-500'
      : 'bg-gray-200';

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-gray-50 bg-[url('/background-pattern.png')] bg-cover bg-center bg-no-repeat py-8 sm:py-10 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/5" />

      <div
        className={`relative z-10 flex flex-col items-center text-center w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-3xl border border-white/60 px-6 sm:px-7 md:px-8 py-7 sm:py-8 md:py-9 transform transition-all duration-500 ${
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
        <div className="flex justify-center mb-3 mt-4 sm:mt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-semibold border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Step 3 of 3 · Set New Password
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

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          Create a New Password
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-7 max-w-sm">
          Choose a strong password that you haven&apos;t used before on this
          account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 text-left"
        >
          {/* new password */}
          <div className="space-y-2">
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wide">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-2.5 sm:p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {/* strength meter */}
            {newPassword && (
              <div className="mt-1">
                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full ${strengthBarColor} transition-all duration-300`}
                    style={{ width: strengthBarWidth }}
                  />
                </div>
                <p className="mt-1 text-[10px] sm:text-[11px] text-gray-500">
                  {strengthLabel}
                </p>
              </div>
            )}
          </div>

          {/* confirm */}
          <div className="space-y-2">
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter new password"
              className="w-full p-2.5 sm:p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-3 w-full py-2.5 sm:py-3 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-lg hover:bg-emerald-700 active:scale-[0.98] transition-all"
          >
            Save New Password
          </button>
        </form>

        <p className="mt-5 sm:mt-6 text-[11px] sm:text-xs text-gray-500 max-w-xs">
          After saving, you&apos;ll be redirected to the login page to sign in
          with your new password.
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
