'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    IoArrowBack, 
    IoCheckmarkCircle,
    IoAlertCircle,
    IoTimeOutline,
    IoBusinessOutline,
    IoCashOutline,
    IoCalendarOutline,
    IoDocumentTextOutline,
    IoStatsChart,
    IoCopyOutline,
    IoWalletOutline,
    // IoImageOutline,
    // IoCloudUploadOutline,
    // IoClose
} from 'react-icons/io5';
import { FiEdit2, FiArrowRight, FiCheck } from 'react-icons/fi';
import { bondCreation } from '@/server/bond/creation';

// Animation variants
const fadeIn = {
    initial: { opacity: 0, y: 8, scale: 0.995 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.45, ease: "easeOut" },
    viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

const staggerChildren = {
    initial: { opacity: 0, y: 20 },
    whileInView: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.1
        }
    }
};

const modalVariants = {
    hidden: { 
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.2 }
    },
    visible: { 
        opacity: 1,
        scale: 1,
        transition: { 
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.4
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.15 }
    }
};

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

type DetailsState = Record<string, string>;

// Loading Component
const FullScreenLoading = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/80 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#5B50D9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading Bond Details...</p>
        </div>
    </div>
);

const FinalizeBondContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [details, setDetails] = useState<DetailsState>({});
    const [editMode, setEditMode] = useState<Record<string, boolean>>({});
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // const [imagePreview, setImagePreview] = useState<string | null>(null);
    // const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        // First try to get data from localStorage (for image data)
        const storedDetails = localStorage.getItem('bondDetails');
        
        if (storedDetails) {
            try {
                const parsedDetails = JSON.parse(storedDetails);
                setDetails(parsedDetails);
                
                // Set image preview if bondImage exists
                // if (parsedDetails.bondImage) {
                //     setImagePreview(parsedDetails.bondImage);
                // }
                
                // Clean up localStorage after use
                localStorage.removeItem('bondDetails');
                return;
            } catch (error) {
                console.error('Error parsing stored bond details:', error);
            }
        }

        // Fallback to URL params (for regular fields)
        const params = Object.fromEntries(searchParams.entries()) as DetailsState;
        setDetails(params);
    }, [searchParams]);

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const toggleEdit = useCallback((field: string) => {
        setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [fieldErrors]);

    // --------- IMAGE HANDLERS COMMENTED OUT ----------
    /*
    const handleImageUpload = (file: File) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setFieldErrors(prev => ({ ...prev, bondImage: 'Please upload a valid image (JPEG, PNG, WebP)' }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setFieldErrors(prev => ({ ...prev, bondImage: 'Image size must be less than 5MB' }));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            setImagePreview(imageUrl);
            setDetails(prev => ({ ...prev, bondImage: imageUrl }));
            setFieldErrors(prev => ({ ...prev, bondImage: '' }));
        };
        reader.readAsDataURL(file);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setDetails(prev => ({ ...prev, bondImage: '' }));
        setFieldErrors(prev => ({ ...prev, bondImage: 'Bond image is required' }));
    };
    */
    // ------------------------------------------------

    const validateField = useCallback((name: string, value: string): string => {
        switch (name) {
            case 'bondName':
                if (!value.trim()) return 'Bond name is required';
                if (value.length < 3) return 'Bond name must be at least 3 characters';
                return '';
            
            case 'org_name':
                if (!value.trim()) return 'Organization name is required';
                return '';
            
            case 'totalUnitOffered':
                if (!value.trim()) return 'Total units offered is required';
                if (!/^\d+$/.test(value)) return 'Must be a valid number';
                if (parseInt(value) <= 0) return 'Must be greater than 0';
                return '';
            
            case 'interest_rate':
                if (!value.trim()) return 'Interest rate is required';
                if (!/^\d*\.?\d*$/.test(value)) return 'Must be a valid number';
                const rate = parseFloat(value);
                if (rate <= 0) return 'Must be greater than 0%';
                if (rate > 100) return 'Cannot exceed 100%';
                return '';
            
            case 'face_value':
                if (!value.trim()) return 'Face value is required';
                if (!/^\d+$/.test(value)) return 'Must be a valid number';
                if (parseInt(value) <= 0) return 'Must be greater than 0';
                return '';
            
            case 'bond_type':
                if (!value) return 'Bond type is required';
                return '';
            
            case 'subscription_period':
                if (!value.trim()) return 'Subscription period is required';
                return '';
            
            case 'bondSymbol2':
                if (!value.trim()) return 'Bond symbol is required';
                if (!/^[A-Z0-9]{2,8}$/.test(value)) return '2-8 uppercase letters/numbers';
                return '';
            
            case 'purpose':
                if (!value.trim()) return 'Purpose is required';
                if (value.length < 10) return 'Purpose must be at least 10 characters';
                return '';
            
            case 'maturity':
                if (!value) return 'Maturity date is required';
                const maturityDate = new Date(value);
                const today = new Date();
                if (maturityDate <= today) return 'Must be a future date';
                return '';
            
            // case 'bondImage':
            //     if (!value.trim()) return 'Bond image is required';
            //     return '';
            
            default:
                return '';
        }
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDetails((prev) => ({ ...prev, [name]: value }));

        const error = validateField(name, value);
        setFieldErrors(prev => ({ ...prev, [name]: error }));
    }, [validateField]);

    const handleBlur = useCallback((field: string) => {
        const error = validateField(field, details[field] || '');
        setFieldErrors(prev => ({ ...prev, [field]: error }));
        
        setTimeout(() => {
            setEditMode(prev => ({ ...prev, [field]: false }));
        }, 100);
    }, [validateField, details]);

    const validateForm = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};
        
        Object.keys(details).forEach(key => {
            const error = validateField(key, details[key] || '');
            if (error) {
                newErrors[key] = error;
            }
        });

        setFieldErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [details, validateField]);

    const getInputClassName = useCallback((fieldName: string) => {
        const baseClasses = "w-full px-4 py-3 border-2 rounded-xl text-gray-800 focus:outline-none transition-all duration-200";
        
        if (fieldErrors[fieldName]) {
            return `${baseClasses} border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/10`;
        }
        
        return `${baseClasses} border-gray-300 focus:border-[#5B50D9] focus:ring-2 focus:ring-[#5B50D9]/10`;
    }, [fieldErrors]);

    const fieldIcons = {
        bondName: <IoDocumentTextOutline className="w-5 h-5 text-[#5B50D9]" />,
        org_name: <IoBusinessOutline className="w-5 h-5 text-[#5B50D9]" />,
        totalUnitOffered: <IoStatsChart className="w-5 h-5 text-[#5B50D9]" />,
        interest_rate: <IoCashOutline className="w-5 h-5 text-[#5B50D9]" />,
        maturity: <IoCalendarOutline className="w-5 h-5 text-[#5B50D9]" />,
        subscription_period: <IoTimeOutline className="w-5 h-5 text-[#5B50D9]" />,
        face_value: <IoCashOutline className="w-5 h-5 text-[#5B50D9]" />,
        bond_type: <IoDocumentTextOutline className="w-5 h-5 text-[#5B50D9]" />,
        bondSymbol2: <IoBusinessOutline className="w-5 h-5 text-[#5B50D9]" />,
    };

    const renderField = useCallback((name: string, placeholder: string, icon?: React.ReactNode) => (
        <div className="w-full">
            {editMode[name] ? (
                <div className="space-y-2">
                    <input
                        name={name}
                        value={details[name] || ''}
                        onChange={handleChange}
                        onBlur={() => handleBlur(name)}
                        placeholder={placeholder}
                        className={getInputClassName(name)}
                        autoFocus
                    />
                    {fieldErrors[name] && (
                        <p className="text-red-600 text-xs flex items-center gap-1">
                            <IoAlertCircle className="w-3 h-3" />
                            {fieldErrors[name]}
                        </p>
                    )}
                </div>
            ) : (
                <div className={`flex justify-between items-center p-4 border-2 rounded-xl w-full min-h-[60px] transition-all group ${
                    fieldErrors[name] ? 'border-red-300 bg-red-50/50' : 'border-gray-300 hover:border-gray-400 bg-white/50'
                }`}>
                    <div className="flex items-center gap-3 flex-1">
                        {icon}
                        <span className={!details[name] ? 'text-gray-500' : 'text-gray-800 font-medium'}>
                            {details[name] || placeholder}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {details[name] && (
                            <button
                                onClick={() => copyToClipboard(details[name], name)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                                title="Copy to clipboard"
                            >
                                {copiedField === name ? (
                                    <FiCheck className="w-4 h-4 text-green-600" />
                                ) : (
                                    <IoCopyOutline className="w-4 h-4 text-gray-500" />
                                )}
                            </button>
                        )}
                        <button
                            onClick={() => toggleEdit(name)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Edit field"
                        >
                            <FiEdit2 className="w-4 h-4 text-[#5B50D9]" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    ), [editMode, details, handleChange, handleBlur, getInputClassName, fieldErrors, toggleEdit, copiedField]);

    const handleSubmit = useCallback(async () => {
        if (!validateForm()) {
            setErrorMsg('Please fix the validation errors before submitting.');
            return;
        }

        try {
            setSubmitting(true);
            setErrorMsg(null);

            const formData = new FormData();
            Object.entries(details).forEach(([key, value]) => {
                if (value != null) formData.append(key, value);
            });

            const result = await bondCreation(formData);

            if (result?.success) {
                setShowSuccess(true);
            } else {
                setErrorMsg('Bond creation failed. Please try again.');
            }
        } catch (error: any) {
            console.error('Bond creation error:', error);
            setErrorMsg(error?.message || 'Failed to connect to blockchain. Please check your MetaMask connection and try again.');
        } finally {
            setSubmitting(false);
        }
    }, [details, validateForm]);

    const goToAdmin = useCallback(() => {
        router.push('/admin');
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50/80 via-blue-50/30 to-indigo-50/20 p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <motion.div
                    {...fadeIn}
                    className="flex items-center gap-4 mb-8"
                >
                    <button 
                        onClick={() => router.back()}
                        className="p-2 rounded-xl hover:bg-gray-100/80 text-gray-600 transition-colors group"
                    >
                        <IoArrowBack className="w-6 h-6 group-hover:text-gray-900" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Finalize Bond</h1>
                        <p className="text-gray-600 mt-1">Review and confirm bond details before tokenization</p>
                    </div>
                </motion.div>

                <motion.div
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="whileInView"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Bond Configuration Card */}
                        <motion.div
                            {...fadeIn}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                    <IoDocumentTextOutline className="w-6 h-6 text-[#5B50D9]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Bond Configuration</h2>
                                    <p className="text-sm text-gray-600">Click on any field to edit before tokenization</p>
                                </div>
                            </div>

                            {/* Bond Image Section (commented out) */}
                            {/*
                            <div className="bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 rounded-xl p-4 border border-indigo-200/60 mb-6">
                                <h3 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                                    <IoImageOutline className="w-4 h-4" />
                                    Bond Image
                                </h3>
                                <div className="space-y-4">
                                    {!imagePreview ? (
                                        <div
                                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                                                isDragging 
                                                    ? 'border-[#5B50D9] bg-indigo-50/50' 
                                                    : fieldErrors.bondImage 
                                                        ? 'border-red-300 bg-red-50/50' 
                                                        : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            onClick={() => document.getElementById('bondImage')?.click()}
                                        >
                                            <IoCloudUploadOutline className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-lg font-medium text-gray-700 mb-2">
                                                Upload Bond Image
                                            </p>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Drag & drop your image here or click to browse
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Supports JPG, PNG, WebP • Max 5MB
                                            </p>
                                            <input
                                                id="bondImage"
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="border-2 border-green-300 rounded-xl p-4 bg-green-50/50">
                                                <div className="flex items-center gap-4">
                                                    <img 
                                                        src={imagePreview} 
                                                        alt="Bond preview" 
                                                        className="w-20 h-20 rounded-lg object-cover"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-green-800">Image uploaded successfully</p>
                                                        <p className="text-sm text-green-600">Your bond image is ready</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <IoClose className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {fieldErrors.bondImage && (
                                        <p className="text-red-600 text-xs flex items-center gap-1">
                                            <IoAlertCircle className="w-3 h-3" />
                                            {fieldErrors.bondImage}
                                        </p>
                                    )}
                                </div>
                            </div>
                            */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {renderField('bondName', 'Bond Name', fieldIcons.bondName)}
                                {renderField('org_name', 'Organization Name', fieldIcons.org_name)}
                                {renderField('totalUnitOffered', 'Total Units Offered', fieldIcons.totalUnitOffered)}
                                {renderField('interest_rate', 'Interest Rate (%)', fieldIcons.interest_rate)}
                                {renderField('maturity', 'Maturity Date', fieldIcons.maturity)}
                                {renderField('subscription_period', 'Subscription Period', fieldIcons.subscription_period)}
                                {renderField('face_value', 'Face Value (BTN)', fieldIcons.face_value)}
                                {renderField('bond_type', 'Bond Type', fieldIcons.bond_type)}
                                {renderField('bondSymbol2', 'Bond Symbol', fieldIcons.bondSymbol2)}
                            </div>

                            {/* Purpose Field */}
                            <div className="w-full">
                                {editMode.purpose ? (
                                    <div className="space-y-2">
                                        <textarea
                                            name="purpose"
                                            value={details.purpose || ''}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('purpose')}
                                            className={getInputClassName('purpose') + " resize-none min-h-[120px]"}
                                            rows={4}
                                            autoFocus
                                            placeholder="Purpose of the Bond"
                                        />
                                        {fieldErrors.purpose && (
                                            <p className="text-red-600 text-xs flex items-center gap-1">
                                                <IoAlertCircle className="w-3 h-3" />
                                                {fieldErrors.purpose}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className={`flex justify-between items-start p-4 border-2 rounded-xl w-full min-h-[120px] transition-all group ${
                                        fieldErrors.purpose ? 'border-red-300 bg-red-50/50' : 'border-gray-300 hover:border-gray-400 bg-white/50'
                                    }`}>
                                        <div className="flex items-start gap-3 flex-1">
                                            <IoDocumentTextOutline className="w-5 h-5 text-[#5B50D9] mt-1" />
                                            <span className={!details.purpose ? 'text-gray-500' : 'text-gray-800'}>
                                                {details.purpose || 'Purpose of the Bond'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {details.purpose && (
                                                <button
                                                    onClick={() => copyToClipboard(details.purpose, 'purpose')}
                                                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Copy to clipboard"
                                                >
                                                    {copiedField === 'purpose' ? (
                                                        <FiCheck className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <IoCopyOutline className="w-4 h-4 text-gray-500" />
                                                    )}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => toggleEdit('purpose')}
                                                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                                title="Edit field"
                                            >
                                                <FiEdit2 className="w-4 h-4 text-[#5B50D9]" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Error Message */}
                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 p-4 bg-red-50/80 border border-red-200/60 rounded-xl"
                                >
                                    <div className="flex items-center gap-2 text-red-800">
                                        <IoAlertCircle className="w-5 h-5" />
                                        <p className="font-medium">{errorMsg}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Validation Summary */}
                            {Object.keys(fieldErrors).filter(key => fieldErrors[key]).length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-6 bg-amber-50/80 border border-amber-200/60 rounded-xl p-4"
                                >
                                    <div className="flex items-center gap-2 text-amber-800 mb-2">
                                        <IoAlertCircle className="w-5 h-5" />
                                        <h3 className="font-semibold">Please fix the following issues:</h3>
                                    </div>
                                    <ul className="text-sm text-amber-700 space-y-1">
                                        {Object.entries(fieldErrors).map(([field, error]) => (
                                            error && (
                                                <li key={field} className="flex items-center gap-2">
                                                    <div className="w-1 h-1 bg-amber-600 rounded-full"></div>
                                                    {error}
                                                </li>
                                            )
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <button
                                onClick={() => router.back()}
                                disabled={submitting}
                                className="flex-1 px-6 py-4 rounded-xl text-gray-700 bg-gray-100/80 hover:bg-gray-200/80 font-semibold transition-all border border-gray-300/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <IoArrowBack className="w-5 h-5" />
                                Back to Edit
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || Object.keys(fieldErrors).filter(key => fieldErrors[key]).length > 0}
                                className={`flex-1 px-6 py-4 rounded-xl text-white font-semibold transition-all shadow-sm flex items-center justify-center gap-2 ${
                                    submitting || Object.keys(fieldErrors).filter(key => fieldErrors[key]).length > 0
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90'
                                }`}
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                                        Tokenizing Bond...
                                    </>
                                ) : (
                                    <>
                                        Finalize Bond
                                        <FiArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column - Preview */}
                    <motion.div
                        {...fadeIn}
                        className="space-y-6"
                    >
                        {/* Bond Preview Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                                    <IoCheckmarkCircle className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Bond Preview</h2>
                                    <p className="text-sm text-gray-600">Review your bond configuration</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Bond Image Preview (commented out) */}
                                {/*
                                {imagePreview && (
                                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-4 border border-indigo-200/60">
                                        <h3 className="font-semibold text-indigo-900 mb-3">Bond Image</h3>
                                        <div className="flex justify-center">
                                            <img 
                                                src={imagePreview} 
                                                alt="Bond preview" 
                                                className="w-32 h-32 rounded-lg object-cover shadow-sm"
                                            />
                                        </div>
                                    </div>
                                )}
                                */}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/60">
                                        <p className="text-sm font-medium text-blue-700 mb-1">Bond Type</p>
                                        <p className="text-lg font-bold text-blue-900">
                                            {details.bond_type ? details.bond_type.replace(/_/g, ' ') : 'Not specified'}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/60">
                                        <p className="text-sm font-medium text-purple-700 mb-1">Total Units</p>
                                        <p className="text-lg font-bold text-purple-900">
                                            {details.totalUnitOffered ? parseInt(details.totalUnitOffered).toLocaleString() : '0'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200/60">
                                        <p className="text-sm font-medium text-green-700 mb-1">Interest Rate</p>
                                        <p className="text-lg font-bold text-green-900">
                                            {details.interest_rate ? `${details.interest_rate}%` : 'Not set'}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200/60">
                                        <p className="text-sm font-medium text-orange-700 mb-1">Face Value</p>
                                        <p className="text-lg font-bold text-orange-900">
                                            {details.face_value ? `${parseInt(details.face_value).toLocaleString()} BTN` : 'Not set'}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/60">
                                    <h3 className="font-semibold text-gray-900 mb-3">Detailed Information</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                            <span className="text-gray-600">Bond Name</span>
                                            <span className="font-medium text-gray-900">{details.bondName || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                            <span className="text-gray-600">Organization</span>
                                            <span className="font-medium text-gray-900">{details.org_name || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                            <span className="text-gray-600">Bond Symbol</span>
                                            <span className="font-medium text-gray-900">{details.bondSymbol2 || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                            <span className="text-gray-600">Maturity Date</span>
                                            <span className="font-medium text-gray-900">
                                                {details.maturity ? new Date(details.maturity).toLocaleDateString() : 'Not set'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600">Subscription Period</span>
                                            <span className="font-medium text-gray-900">{details.subscription_period || 'Not set'}</span>
                                        </div>
                                    </div>
                                </div>

                                {details.purpose && (
                                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-4 border border-indigo-200/60">
                                        <h3 className="font-semibold text-indigo-900 mb-2">Bond Purpose</h3>
                                        <p className="text-sm text-indigo-800 leading-relaxed">{details.purpose}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100/50 rounded-2xl border border-blue-200/60 p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <IoWalletOutline className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-blue-900">Blockchain Ready</h3>
                            </div>
                            <p className="text-sm text-blue-800 leading-relaxed">
                                Your bond will be tokenized on the blockchain. This process is irreversible and will create a permanent record of your bond offering.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Loading Overlay */}
                {submitting && (
                    <div className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-white">
                        <div className="w-12 h-12 border-3 border-indigo-400/25 border-t-indigo-600 rounded-full animate-spin" />
                        <div className="text-center">
                            <p className="text-lg font-semibold">Creating Bond on Blockchain</p>
                            <p className="text-sm text-gray-300 mt-1">This may take a few moments...</p>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                <AnimatePresence>
                    {showSuccess && (
                        <>
                            <motion.div
                                variants={backdropVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                                onClick={() => setShowSuccess(false)}
                            />
                            
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <motion.div
                                    variants={modalVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="w-full max-w-md"
                                >
                                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                                        <div className="relative p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <IoCheckmarkCircle className="w-8 h-8 text-green-600" />
                                                </div>
                                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bond Created Successfully! 🎉</h2>
                                                <p className="text-gray-600">
                                                    Your bond has been successfully tokenized and stored on-chain.
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 p-4 border border-green-200/60 m-4 rounded-xl">
                                            <h3 className="font-semibold text-green-900 mb-2">{details.bondName}</h3>
                                            <div className="space-y-1 text-sm text-green-800">
                                                <p>• {details.totalUnitOffered} units</p>
                                                <p>• {details.interest_rate}% interest rate</p>
                                                <p>• Matures on {new Date(details.maturity).toLocaleDateString()}</p>
                                                <p>• Face value: {details.face_value} BTN</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row gap-3 p-6">
                                            <button
                                                onClick={() => setShowSuccess(false)}
                                                className="flex-1 px-4 py-3 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-all"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={goToAdmin}
                                                className="flex-1 px-4 py-3 rounded-xl text-white bg-gradient-to-r from-[#5B50D9] to-[#6C63FF] hover:opacity-90 font-medium transition-all"
                                            >
                                                Go to Dashboard
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

// Page wrapper with Suspense
const FinalizeBondPage = () => (
    <Suspense fallback={<FullScreenLoading />}>
        <FinalizeBondContent />
    </Suspense>
);

export default FinalizeBondPage;
