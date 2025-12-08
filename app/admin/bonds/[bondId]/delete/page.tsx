"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    IoArrowBack, 
    IoAlertCircle,
    IoTrashOutline,
    IoCloseOutline,
    IoCheckmarkCircle
} from 'react-icons/io5';

// Animation variants
const fadeIn = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    transition: { duration: 0.3, ease: "easeOut" }
};

const backdropVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

const DeleteBondPage = () => {
    const router = useRouter();
    const [confirmationText, setConfirmationText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const requiredText = "Yes I am sure";
    const isButtonDisabled = confirmationText !== requiredText || isDeleting;

    const handleDelete = async () => {
        if (isButtonDisabled) return;
        
        setIsDeleting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setShowSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
            router.push('/admin');
        }, 1500);
    };

    const handleClose = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50/80 via-red-50/20 to-orange-50/10 flex items-center justify-center p-4">
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
                className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xl overflow-hidden"
            >
                {/* Header */}
                <div className="relative p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                    <button 
                        onClick={handleClose}
                        className="absolute right-4 top-4 p-2 rounded-xl hover:bg-white/50 transition-colors"
                    >
                        <IoCloseOutline className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                            <IoTrashOutline className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Delete Bond</h1>
                            <p className="text-sm text-gray-600 mt-1">Permanent bond removal</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!showSuccess ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            {/* Warning Section */}
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <IoAlertCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">Are you sure?</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    This action cannot be undone. The bond will be permanently removed from the marketplace and all associated data will be deleted.
                                </p>
                            </div>

                            {/* Bond Card */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-200/60"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-xl bg-white border-2 border-white shadow-sm grid place-items-center">
                                            <Image 
                                                src="/logo.png" 
                                                alt="Bond Icon" 
                                                width={24} 
                                                height={24} 
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">RSEB Bond</h3>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    BNK002
                                                </span>
                                                <span className="text-xs text-emerald-600 font-semibold">
                                                    +5% / yr
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Royal Security Exchange of Bhutan
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Stats Summary */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-gray-50 rounded-xl p-3 text-center">
                                    <p className="text-gray-600 mb-1">Total Units</p>
                                    <p className="font-semibold text-gray-900">1,250</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3 text-center">
                                    <p className="text-gray-600 mb-1">Subscribed</p>
                                    <p className="font-semibold text-gray-900">896 units</p>
                                </div>
                            </div>

                            {/* Confirmation Input */}
                            <div className="space-y-3">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Type <strong className="text-gray-900">"{requiredText}"</strong> to confirm deletion
                                    </p>
                                </div>
                                <input
                                    type="text"
                                    placeholder={requiredText}
                                    value={confirmationText}
                                    onChange={(e) => setConfirmationText(e.target.value)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl text-center font-medium focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white"
                                    disabled={isDeleting}
                                />
                            </div>

                            {/* Warning Note */}
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <IoAlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-orange-800 mb-1">Important Notice</p>
                                        <p className="text-xs text-orange-700 leading-relaxed">
                                            This action will permanently delete all bond data, subscription records, and transaction history. Investors will be notified of the bond's removal.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* Success State */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-4"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <IoCheckmarkCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Bond Deleted</h3>
                            <p className="text-gray-600 mb-6">
                                The bond has been successfully removed from the marketplace.
                            </p>
                            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </motion.div>
                    )}
                </div>

                {/* Footer Actions */}
                {!showSuccess && (
                    <div className="px-6 pb-6">
                        <div className="flex gap-3">
                            <button
                                onClick={handleClose}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isButtonDisabled}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-200 disabled:shadow-none"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <IoTrashOutline className="w-4 h-4" />
                                        Delete Permanently
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Backdrop */}
            <motion.div
                variants={backdropVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10"
                onClick={handleClose}
            />
        </div>
    );
};

export default DeleteBondPage;