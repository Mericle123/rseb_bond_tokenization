'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    IoArrowBack, 
    IoBusinessOutline,
    IoCalendarOutline,
    IoCashOutline,
    IoDocumentTextOutline,
    IoStatsChart,
    IoTimeOutline,
    IoAlertCircleOutline,
    IoCheckmarkCircleOutline,
} from 'react-icons/io5';
import { MdArrowDropDown } from 'react-icons/md';

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

// Validation types
interface ValidationErrors {
    bondName?: string;
    org_name?: string;
    totalUnitOffered?: string;
    interest_rate?: string;
    maturity?: string;
    face_value?: string;
    bond_type?: string;
    subscription_period?: string;
    bondSymbol2?: string;
    purpose?: string;
}

interface ValidationState {
    [key: string]: boolean;
}

const TokenizationBondPage = () => {
    const [bondDetails, setBondDetails] = useState({
        bondName: '',
        org_name: '',
        maturity: '',
        purpose: '',
        totalUnitOffered: '',
        bond_type: '',
        interest_rate: '',
        face_value: '',
        bondSymbol2: '',
        subscription_period: '',
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [validFields, setValidFields] = useState<ValidationState>({});
    const [isLoading, setIsLoading] = useState(false);

    // Define the actual fields we have
    const formFields = [
        'bondName',
        'org_name', 
        'bondSymbol2',
        'bond_type',
        'totalUnitOffered',
        'interest_rate',
        'face_value',
        'subscription_period',
        'maturity',
        'purpose',
    ];

    // Validation rules
    const validateField = (name: string, value: string): string => {
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
            
            default:
                return '';
        }
    };

    // Handle number-only input
    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Only allow numbers and decimal point for interest rate
        if (name === 'interest_rate') {
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setBondDetails(prev => ({ ...prev, [name]: value }));
            }
        } else if (name === 'totalUnitOffered' || name === 'face_value') {
            // Only allow whole numbers for these fields
            if (value === '' || /^\d+$/.test(value)) {
                setBondDetails(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setBondDetails(prev => ({ ...prev, [name]: value }));
        }

        // Real-time validation
        if (touched[name] || value.length > 0) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
            setValidFields(prev => ({ 
                ...prev, 
                [name]: !error && value.length > 0 
            }));
        }
    };

    const handleTextInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBondDetails(prev => ({ ...prev, [name]: value }));

        // Real-time validation
        if (touched[name] || value.length > 0) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
            setValidFields(prev => ({ 
                ...prev, 
                [name]: !error && value.length > 0 
            }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
        setValidFields(prev => ({ 
            ...prev, 
            [name]: !error && value.length > 0 
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        const newTouched: Record<string, boolean> = {};
        const newValidFields: ValidationState = {};

        // Validate only the actual form fields we have
        formFields.forEach(key => {
            newTouched[key] = true;
            const error = validateField(key, bondDetails[key as keyof typeof bondDetails]);
            if (error) {
                newErrors[key as keyof ValidationErrors] = error;
                newValidFields[key] = false;
            } else {
                newValidFields[key] = bondDetails[key as keyof typeof bondDetails].length > 0;
            }
        });

        setTouched(newTouched);
        setErrors(newErrors);
        setValidFields(newValidFields);

        return Object.keys(newErrors).length === 0;
    };

    const handleFinalizeClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            // Scroll to first error
            const firstError = Object.keys(errors)[0];
            const element = document.querySelector(`[name="${firstError}"]`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Start loading
        setIsLoading(true);

        try {
            // Simulate API call or processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Navigate to finalize page with bond details - FIXED PATH
            const params = new URLSearchParams();
            Object.entries(bondDetails).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            
            // Use Next.js router for proper navigation
            window.location.href = `/admin/finalize-bond?${params.toString()}`;
            
        } catch (error) {
            console.error('Error finalizing bond:', error);
            setIsLoading(false);
        }
    };

    const getInputClassName = (fieldName: string) => {
        const baseClasses = "w-full p-3 pr-10 border rounded-xl text-gray-700 outline-none transition-all duration-200";
        const focusClasses = "focus:border-[#5B50D9] focus:ring-2 focus:ring-[#5B50D9]/10";
        
        if (errors[fieldName as keyof ValidationErrors] && touched[fieldName]) {
            return `${baseClasses} border-red-300 bg-red-50/50 ${focusClasses}`;
        }
        
        if (validFields[fieldName]) {
            return `${baseClasses} border-green-300 bg-green-50/50 ${focusClasses}`;
        }
        
        return `${baseClasses} border-gray-300 ${focusClasses}`;
    };

    const hasErrors = Object.keys(errors).length > 0;
    const totalFields = formFields.length;
    const completedFields = formFields.filter(field => validFields[field]).length;
    const progressPercentage = (completedFields / totalFields) * 100;
    const isFormValid = completedFields === totalFields;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50/80 via-blue-50/30 to-indigo-50/20 p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                <motion.div
                    {...fadeIn}
                    className="flex items-center gap-4 mb-8"
                >
                    <Link 
                        href="/admin"
                        className="p-2 rounded-xl hover:bg-gray-100/80 text-gray-600 transition-colors group"
                    >
                        <IoArrowBack className="w-6 h-6 group-hover:text-gray-900" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Tokenization Bond</h1>
                        <p className="text-gray-600 mt-1">Create and configure new bond offerings</p>
                    </div>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    {...fadeIn}
                    className="mb-8"
                >
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">
                                Form Completion: {completedFields}/{totalFields} fields
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                                {Math.round(progressPercentage)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="whileInView"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {/* Left Side - Enhanced Form */}
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
                                <p className="text-sm text-gray-600">Enter bond details and specifications</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Basic Information Section */}
                            <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-xl p-4 border border-blue-200/60">
                                <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                                    <IoDocumentTextOutline className="w-4 h-4" />
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Bond Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Bond Name *</label>
                                        <div className="relative">
                                            <input
                                                name="bondName"
                                                value={bondDetails.bondName}
                                                onChange={handleTextInput}
                                                onBlur={handleBlur}
                                                type="text"
                                                placeholder="Enter bond name"
                                                className={getInputClassName('bondName')}
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                {errors.bondName && touched.bondName && (
                                                    <IoAlertCircleOutline className="text-red-500" />
                                                )}
                                                {validFields.bondName && (
                                                    <IoCheckmarkCircleOutline className="text-green-500" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.bondName && touched.bondName && (
                                            <p className="text-red-600 text-xs flex items-center gap-1">
                                                <IoAlertCircleOutline className="w-3 h-3" />
                                                {errors.bondName}
                                            </p>
                                        )}
                                        {validFields.bondName && (
                                            <p className="text-green-600 text-xs flex items-center gap-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3" />
                                                Valid bond name
                                            </p>
                                        )}
                                    </div>

                                    {/* Organization Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Organization Name *</label>
                                        <div className="relative">
                                            <input
                                                name="org_name"
                                                value={bondDetails.org_name}
                                                onChange={handleTextInput}
                                                onBlur={handleBlur}
                                                type="text"
                                                placeholder="Organization name"
                                                className={getInputClassName('org_name')}
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                {errors.org_name && touched.org_name && (
                                                    <IoAlertCircleOutline className="text-red-500" />
                                                )}
                                                {validFields.org_name && (
                                                    <IoCheckmarkCircleOutline className="text-green-500" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.org_name && touched.org_name && (
                                            <p className="text-red-600 text-xs flex items-center gap-1">
                                                <IoAlertCircleOutline className="w-3 h-3" />
                                                {errors.org_name}
                                            </p>
                                        )}
                                        {validFields.org_name && (
                                            <p className="text-green-600 text-xs flex items-center gap-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3" />
                                                Valid organization name
                                            </p>
                                        )}
                                    </div>

                                    {/* Bond Symbol */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Bond Symbol *</label>
                                        <div className="relative">
                                            <input
                                                name="bondSymbol2"
                                                value={bondDetails.bondSymbol2}
                                                onChange={handleTextInput}
                                                onBlur={handleBlur}
                                                type="text"
                                                placeholder="e.g., RSEB2024"
                                                className={getInputClassName('bondSymbol2')}
                                                style={{ textTransform: 'uppercase' }}
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                {errors.bondSymbol2 && touched.bondSymbol2 && (
                                                    <IoAlertCircleOutline className="text-red-500" />
                                                )}
                                                {validFields.bondSymbol2 && (
                                                    <IoCheckmarkCircleOutline className="text-green-500" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.bondSymbol2 && touched.bondSymbol2 && (
                                            <p className="text-red-600 text-xs flex items-center gap-1">
                                                <IoAlertCircleOutline className="w-3 h-3" />
                                                {errors.bondSymbol2}
                                            </p>
                                        )}
                                        {validFields.bondSymbol2 && (
                                            <p className="text-green-600 text-xs flex items-center gap-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3" />
                                                Valid bond symbol
                                            </p>
                                        )}
                                    </div>

                                    {/* Bond Type */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Bond Type *</label>
                                        <div className="relative">
                                            <select
                                                name="bond_type"
                                                value={bondDetails.bond_type}
                                                onChange={handleTextInput}
                                                onBlur={handleBlur}
                                                className={getInputClassName('bond_type') + " appearance-none pr-10"}
                                            >
                                                <option value="">Select bond type</option>
                                                <option value="government_Bond">Government Bond</option>
                                                <option value="corporate_Bond">Corporate Bond</option>
                                                <option value="green_Bond">Green Bond</option>
                                                <option value="development_Bond">Development Bond</option>
                                                <option value="domestic_BondM2">Domestic Project Bond</option>
                                                <option value="SYM2">Others</option>
                                            </select>
                                            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                                                {errors.bond_type && touched.bond_type && (
                                                    <IoAlertCircleOutline className="text-red-500" />
                                                )}
                                                {validFields.bond_type && (
                                                    <IoCheckmarkCircleOutline className="text-green-500" />
                                                )}
                                            </div>
                                            <MdArrowDropDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                        </div>
                                        {errors.bond_type && touched.bond_type && (
                                            <p className="text-red-600 text-xs flex items-center gap-1">
                                                <IoAlertCircleOutline className="w-3 h-3" />
                                                {errors.bond_type}
                                            </p>
                                        )}
                                        {validFields.bond_type && (
                                            <p className="text-green-600 text-xs flex items-center gap-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3" />
                                                Bond type selected
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Financial Details Section */}
                            <div className="bg-gradient-to-br from-green-50/50 to-green-100/30 rounded-xl p-4 border border-green-200/60">
                                <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                                    <IoCashOutline className="w-4 h-4" />
                                    Financial Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Total Units Offered */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Total Units Offered *</label>
                                        <div className="relative">
                                            <input
                                                name="totalUnitOffered"
                                                value={bondDetails.totalUnitOffered}
                                                onChange={handleNumberInput}
                                                onBlur={handleBlur}
                                                type="text"
                                                placeholder="Enter total units"
                                                className={getInputClassName('totalUnitOffered')}
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                {errors.totalUnitOffered && touched.totalUnitOffered && (
                                                    <IoAlertCircleOutline className="text-red-500" />
                                                )}
                                                {validFields.totalUnitOffered && (
                                                    <IoCheckmarkCircleOutline className="text-green-500" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.totalUnitOffered && touched.totalUnitOffered && (
                                            <p className="text-red-600 text-xs flex items-center gap-1">
                                                <IoAlertCircleOutline className="w-3 h-3" />
                                                {errors.totalUnitOffered}
                                            </p>
                                        )}
                                        {validFields.totalUnitOffered && (
                                            <p className="text-green-600 text-xs flex items-center gap-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3" />
                                                Valid number of units
                                            </p>
                                        )}
                                    </div>

                                    {/* Interest Rate */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Interest Rate *</label>
                                        <div className="relative">
                                            <input
                                                name="interest_rate"
                                                value={bondDetails.interest_rate}
                                                onChange={handleNumberInput}
                                                onBlur={handleBlur}
                                                type="text"
                                                placeholder="Enter interest rate"
                                                className={getInputClassName('interest_rate')}
                                            />
                                            <span className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                {errors.interest_rate && touched.interest_rate && (
                                                    <IoAlertCircleOutline className="text-red-500" />
                                                )}
                                                {validFields.interest_rate && (
                                                    <IoCheckmarkCircleOutline className="text-green-500" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.interest_rate && touched.interest_rate && (
                                            <p className="text-red-600 text-xs flex items-center gap-1">
                                                <IoAlertCircleOutline className="w-3 h-3" />
                                                {errors.interest_rate}
                                            </p>
                                        )}
                                        {validFields.interest_rate && (
                                            <p className="text-green-600 text-xs flex items-center gap-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3" />
                                                Valid interest rate
                                            </p>
                                        )}
                                    </div>

                                    {/* Face Value */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Face Value *</label>
                                        <div className="relative">
                                            <input
                                                name="face_value"
                                                value={bondDetails.face_value}
                                                onChange={handleNumberInput}
                                                onBlur={handleBlur}
                                                type="text"
                                                placeholder="Enter face value"
                                                className={getInputClassName('face_value')}
                                            />
                                            <span className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">BTN</span>
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                {errors.face_value && touched.face_value && (
                                                    <IoAlertCircleOutline className="text-red-500" />
                                                )}
                                                {validFields.face_value && (
                                                    <IoCheckmarkCircleOutline className="text-green-500" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.face_value && touched.face_value && (
                                            <p className="text-red-600 text-xs flex items-center gap-1">
                                                <IoAlertCircleOutline className="w-3 h-3" />
                                                {errors.face_value}
                                            </p>
                                        )}
                                        {validFields.face_value && (
                                            <p className="text-green-600 text-xs flex items-center gap-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3" />
                                                Valid face value
                                            </p>
                                        )}
                                    </div>

                                    {/* Subscription Period */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Subscription Period *</label>
                                        <div className="relative">
                                            <input
                                                name="subscription_period"
                                                value={bondDetails.subscription_period}
                                                onChange={handleTextInput}
                                                onBlur={handleBlur}
                                                type="text"
                                                placeholder="e.g., 30 days"
                                                className={getInputClassName('subscription_period')}
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                {errors.subscription_period && touched.subscription_period && (
                                                    <IoAlertCircleOutline className="text-red-500" />
                                                )}
                                                {validFields.subscription_period && (
                                                    <IoCheckmarkCircleOutline className="text-green-500" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.subscription_period && touched.subscription_period && (
                                            <p className="text-red-600 text-xs flex items-center gap-1">
                                                <IoAlertCircleOutline className="w-3 h-3" />
                                                {errors.subscription_period}
                                            </p>
                                        )}
                                        {validFields.subscription_period && (
                                            <p className="text-green-600 text-xs flex items-center gap-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3" />
                                                Valid subscription period
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Section */}
                            <div className="bg-gradient-to-br from-purple-50/50 to-purple-100/30 rounded-xl p-4 border border-purple-200/60">
                                <h3 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                                    <IoCalendarOutline className="w-4 h-4" />
                                    Timeline
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Maturity Date */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Maturity Date *</label>
                                        <div className="relative">
                                            <input
                                                name="maturity"
                                                value={bondDetails.maturity}
                                                onChange={handleTextInput}
                                                onBlur={handleBlur}
                                                type="date"
                                                className={getInputClassName('maturity')}
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                {errors.maturity && touched.maturity && (
                                                    <IoAlertCircleOutline className="text-red-500" />
                                                )}
                                                {validFields.maturity && (
                                                    <IoCheckmarkCircleOutline className="text-green-500" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.maturity && touched.maturity && (
                                            <p className="text-red-600 text-xs flex items-center gap-1">
                                                <IoAlertCircleOutline className="w-3 h-3" />
                                                {errors.maturity}
                                            </p>
                                        )}
                                        {validFields.maturity && (
                                            <p className="text-green-600 text-xs flex items-center gap-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3" />
                                                Valid maturity date
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Purpose Section */}
                            <div className="bg-gradient-to-br from-orange-50/50 to-orange-100/30 rounded-xl p-4 border border-orange-200/60">
                                <h3 className="font-semibold text-orange-900 mb-4 flex items-center gap-2">
                                    <IoDocumentTextOutline className="w-4 h-4" />
                                    Bond Purpose
                                </h3>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Purpose of the Bond *</label>
                                    <div className="relative">
                                        <textarea
                                            name="purpose"
                                            value={bondDetails.purpose}
                                            onChange={handleTextInput}
                                            onBlur={handleBlur}
                                            placeholder="Describe the purpose and objectives of this bond offering in detail..."
                                            className={getInputClassName('purpose') + " resize-none pr-10"}
                                            rows={4}
                                        ></textarea>
                                        <div className="absolute right-3 top-3">
                                            {errors.purpose && touched.purpose && (
                                                <IoAlertCircleOutline className="text-red-500" />
                                            )}
                                            {validFields.purpose && (
                                                <IoCheckmarkCircleOutline className="text-green-500" />
                                            )}
                                        </div>
                                    </div>
                                    {errors.purpose && touched.purpose && (
                                        <p className="text-red-600 text-xs flex items-center gap-1">
                                            <IoAlertCircleOutline className="w-3 h-3" />
                                            {errors.purpose}
                                        </p>
                                    )}
                                    {validFields.purpose && (
                                        <p className="text-green-600 text-xs flex items-center gap-1">
                                            <IoCheckmarkCircleOutline className="w-3 h-3" />
                                            Valid purpose description
                                        </p>
                                    )}
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Minimum 10 characters required</span>
                                        <span>{bondDetails.purpose.length}/500</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Bond Details Preview */}
                    <motion.div
                        {...fadeIn}
                        className="space-y-6"
                    >
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                                    <IoStatsChart className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Bond Preview</h2>
                                    <p className="text-sm text-gray-600">Review your bond configuration</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Progress Summary */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-100/50 rounded-xl p-4 border border-blue-200/60">
                                    <h3 className="font-semibold text-blue-900 mb-2">Validation Progress</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-blue-700">
                                            {completedFields} of {totalFields} fields completed
                                        </span>
                                        <span className="text-sm font-semibold text-blue-900">
                                            {Math.round(progressPercentage)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                                        <div 
                                            className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/60">
                                        <p className="text-sm font-medium text-blue-700 mb-1">Bond Type</p>
                                        <p className="text-lg font-bold text-blue-900">
                                            {bondDetails.bond_type ? bondDetails.bond_type.replace(/_/g, ' ') : 'Not specified'}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/60">
                                        <p className="text-sm font-medium text-purple-700 mb-1">Total Units</p>
                                        <p className="text-lg font-bold text-purple-900">
                                            {bondDetails.totalUnitOffered ? parseInt(bondDetails.totalUnitOffered).toLocaleString() : '0'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200/60">
                                        <p className="text-sm font-medium text-green-700 mb-1">Interest Rate</p>
                                        <p className="text-lg font-bold text-green-900">
                                            {bondDetails.interest_rate ? `${bondDetails.interest_rate}%` : 'Not set'}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200/60">
                                        <p className="text-sm font-medium text-orange-700 mb-1">Face Value</p>
                                        <p className="text-lg font-bold text-orange-900">
                                            {bondDetails.face_value ? `${parseInt(bondDetails.face_value).toLocaleString()} BTN` : 'Not set'}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/60">
                                    <h3 className="font-semibold text-gray-900 mb-3">Detailed Information</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                            <span className="text-gray-600">Bond Name</span>
                                            <span className="font-medium text-gray-900">{bondDetails.bondName || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                            <span className="text-gray-600">Organization</span>
                                            <span className="font-medium text-gray-900">{bondDetails.org_name || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                            <span className="text-gray-600">Bond Symbol</span>
                                            <span className="font-medium text-gray-900">{bondDetails.bondSymbol2 || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                            <span className="text-gray-600">Maturity Date</span>
                                            <span className="font-medium text-gray-900">
                                                {bondDetails.maturity ? new Date(bondDetails.maturity).toLocaleDateString() : 'Not set'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600">Subscription Period</span>
                                            <span className="font-medium text-gray-900">{bondDetails.subscription_period || 'Not set'}</span>
                                        </div>
                                    </div>
                                </div>

                                {bondDetails.purpose && (
                                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-4 border border-indigo-200/60">
                                        <h3 className="font-semibold text-indigo-900 mb-2">Bond Purpose</h3>
                                        <p className="text-sm text-indigo-800">{bondDetails.purpose}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link 
                                href="/admin"
                                className="flex-1 px-6 py-3 rounded-xl text-gray-700 bg-gray-100/80 hover:bg-gray-200/80 font-semibold text-center transition-all border border-gray-300/60"
                            >
                                Cancel
                            </Link>
                            <button
                                onClick={handleFinalizeClick}
                                className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold text-center transition-all shadow-sm flex items-center justify-center gap-2 ${
                                    !isFormValid || isLoading
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-[#5B50D9] to-[#6C63FF] hover:opacity-90'
                                }`}
                                disabled={!isFormValid || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Processing...
                                    </>
                                ) : (
                                    'Finalize Bond'
                                )}
                            </button>
                        </motion.div>

                        {/* Loading Overlay */}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                            >
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-4"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#5B50D9] to-[#6C63FF] flex items-center justify-center mb-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Finalizing Bond</h3>
                                        <p className="text-gray-600 mb-4">
                                            We're processing your bond configuration and preparing it for tokenization...
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <motion.div 
                                                className="h-2 rounded-full bg-gradient-to-r from-[#5B50D9] to-[#6C63FF]"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 2, ease: "easeInOut" }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Validation Summary */}
                        {hasErrors && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50/80 border border-red-200/60 rounded-xl p-4"
                            >
                                <div className="flex items-center gap-2 text-red-800 mb-2">
                                    <IoAlertCircleOutline className="w-5 h-5" />
                                    <h3 className="font-semibold">Please fix the following issues:</h3>
                                </div>
                                <ul className="text-sm text-red-700 space-y-1">
                                    {Object.entries(errors).map(([field, error]) => (
                                        error && (
                                            <li key={field} className="flex items-center gap-2">
                                                <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                                                {error}
                                            </li>
                                        )
                                    ))}
                                </ul>
                            </motion.div>
                        )}

                        {/* Success Summary */}
                        {!hasErrors && completedFields > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50/80 border border-green-200/60 rounded-xl p-4"
                            >
                                <div className="flex items-center gap-2 text-green-800 mb-2">
                                    <IoCheckmarkCircleOutline className="w-5 h-5" />
                                    <h3 className="font-semibold">Great progress!</h3>
                                </div>
                                <p className="text-sm text-green-700">
                                    {completedFields === totalFields 
                                        ? 'All fields are valid! You can now finalize the bond.'
                                        : `${completedFields} out of ${totalFields} fields are completed and valid.`}
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default TokenizationBondPage;
