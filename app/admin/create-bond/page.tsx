'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
    IoChevronDown,
    IoChevronUp,
} from 'react-icons/io5';
import { 
    FaBuilding, 
    FaTree, 
    FaChartLine, 
    FaHandHoldingUsd, 
    FaCity, 
    FaGlobeAmericas, 
    FaIndustry, 
    FaHome,
    FaLandmark,
    FaShieldAlt,
    FaLeaf,
    FaHardHat,
    FaHouseUser
} from 'react-icons/fa';

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

// ========================= Dynamic Bond Icons =========================
const getBondIcon = (bondType: string) => {
    const icons: Record<string, { icon: any, color: string, bg: string, label: string, description: string }> = {
        'government_Bond': {
            icon: FaLandmark,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
            label: 'Government Bond',
            description: 'Issued by national governments'
        },
        'corporate_Bond': {
            icon: FaIndustry,
            color: 'text-purple-600',
            bg: 'bg-purple-100',
            label: 'Corporate Bond',
            description: 'Issued by companies'
        },
        'green_Bond': {
            icon: FaLeaf,
            color: 'text-green-600',
            bg: 'bg-green-100',
            label: 'Green Bond',
            description: 'For environmental projects'
        },
        'development_Bond': {
            icon: FaHardHat,
            color: 'text-yellow-600',
            bg: 'bg-yellow-100',
            label: 'Development Bond',
            description: 'For infrastructure projects'
        },
        'domestic_BondM2': {
            icon: FaHouseUser,
            color: 'text-red-600',
            bg: 'bg-red-100',
            label: 'Domestic Bond',
            description: 'Local development projects'
        },
        'municipal_Bond': {
            icon: FaCity,
            color: 'text-teal-600',
            bg: 'bg-teal-100',
            label: 'Municipal Bond',
            description: 'Local government bonds'
        },
        'sovereign_Bond': {
            icon: FaGlobeAmericas,
            color: 'text-indigo-600',
            bg: 'bg-indigo-100',
            label: 'Sovereign Bond',
            description: 'Foreign currency bonds'
        },
        'mortgage_Bond': {
            icon: FaHandHoldingUsd,
            color: 'text-orange-600',
            bg: 'bg-orange-100',
            label: 'Mortgage Bond',
            description: 'Backed by mortgage loans'
        }
    };
    
    return icons[bondType] || {
        icon: IoDocumentTextOutline,
        color: 'text-gray-600',
        bg: 'bg-gray-100',
        label: 'Select bond type',
        description: 'Choose a bond type'
    };
};

const bondTypeOptions = [
    'government_Bond',
    'corporate_Bond',
    'green_Bond',
    'development_Bond',
    'domestic_BondM2',
    'municipal_Bond',
    'sovereign_Bond',
    'mortgage_Bond'
];
// ========================= End Dynamic Bond Icons =========================

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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Get bond icon for current selection
    const selectedBondIcon = getBondIcon(bondDetails.bond_type);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const handleTextInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const handleBondTypeSelect = (bondType: string) => {
        setBondDetails(prev => ({ ...prev, bond_type: bondType }));
        setIsDropdownOpen(false);
        
        // Trigger validation
        setTouched(prev => ({ ...prev, bond_type: true }));
        const error = validateField('bond_type', bondType);
        setErrors(prev => ({ ...prev, bond_type: error }));
        setValidFields(prev => ({ 
            ...prev, 
            bond_type: !error && bondType.length > 0 
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
        setValidFields(prev => ({ 
            ...prev, 
            [name]: !error && value.length > 0 
        }));
    };

    const validateForm = () => {
        const newErrors: ValidationErrors = {};
        const newTouched: Record<string, boolean> = {};
        const newValidFields: ValidationState = {};

        // Validate only the actual form fields we have
        formFields.forEach(key => {
            newTouched[key] = true;
            const value = bondDetails[key as keyof typeof bondDetails] as string;
            const error = validateField(key, value);
            if (error) {
                newErrors[key as keyof ValidationErrors] = error;
                newValidFields[key] = false;
            } else {
                newValidFields[key] = value.length > 0;
            }
        });

        setTouched(newTouched);
        setErrors(newErrors);
        setValidFields(newValidFields);

        const isValid = Object.values(newErrors).every(err => !err);
        return { isValid, newErrors };
    };

    const handleFinalizeClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        const { isValid, newErrors } = validateForm();
        if (!isValid) {
            // Scroll to first error
            const firstErrorField = Object.keys(newErrors).find(
                key => newErrors[key as keyof ValidationErrors]
            );
            if (firstErrorField) {
                const element = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
                    `[name="${firstErrorField}"]`
                );
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
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
        const baseClasses = "w-full p-3 sm:p-3 pr-10 sm:pr-12 border rounded-xl text-gray-700 outline-none transition-all duration-200 text-sm sm:text-base";
        const focusClasses = "focus:border-[#5B50D9] focus:ring-2 focus:ring-[#5B50D9]/10";
        
        if (errors[fieldName as keyof ValidationErrors] && touched[fieldName]) {
            return `${baseClasses} border-red-300 bg-red-50/50 ${focusClasses}`;
        }
        
        if (validFields[fieldName]) {
            return `${baseClasses} border-green-300 bg-green-50/50 ${focusClasses}`;
        }
        
        return `${baseClasses} border-gray-300 ${focusClasses}`;
    };

    // NEW: correctly compute whether there are any actual errors
    const hasErrors = Object.values(errors).some(error => !!error);
    const hasAnyTouched = Object.values(touched).some(v => v);

    const totalFields = formFields.length;
    const completedFields = formFields.filter(field => validFields[field]).length;
    const progressPercentage = (completedFields / totalFields) * 100;
    const isFormValid = completedFields === totalFields && !hasErrors;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50/80 via-blue-50/30 to-indigo-50/20 p-3 sm:p-4 md:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                <motion.div
                    {...fadeIn}
                    className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
                >
                    <Link 
                        href="/admin"
                        className="p-2 rounded-xl hover:bg-gray-100/80 text-gray-600 transition-colors group flex-shrink-0 mt-1"
                    >
                        <IoArrowBack className="w-5 h-5 sm:w-6 sm:h-6 group-hover:text-gray-900" />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">Tokenization Bond</h1>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">Create and configure new bond offerings</p>
                    </div>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    {...fadeIn}
                    className="mb-6 sm:mb-8"
                >
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/80 p-4 sm:p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                                Form Completion: {completedFields}/{totalFields} fields
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-gray-700 flex-shrink-0 ml-2">
                                {Math.round(progressPercentage)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div 
                                className="h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="whileInView"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8"
                >
                    {/* Left Side - Enhanced Form */}
                    <motion.div
                        {...fadeIn}
                        className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/80 p-4 sm:p-6 shadow-sm"
                    >
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                                <IoDocumentTextOutline className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#5B50D9]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Bond Configuration</h2>
                                <p className="text-xs sm:text-sm text-gray-600 truncate">Enter bond details and specifications</p>
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            {/* Basic Information Section */}
                            <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-xl p-3 sm:p-4 border border-blue-200/60">
                                <h3 className="font-semibold text-blue-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                                    <IoDocumentTextOutline className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    {/* Bond Name */}
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label className="text-xs sm:text-sm font-medium text-gray-700">Bond Name </label>
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
                                                    <IoAlertCircleOutline className="text-red-500 w-4 h-4" />
                                                )}
                                                {validFields.bondName && (
                                                    <IoCheckmarkCircleOutline className="text-green-500 w-4 h-4" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.bondName && touched.bondName && (
                                            <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                                                <IoAlertCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{errors.bondName}</span>
                                            </p>
                                        )}
                                        {validFields.bondName && (
                                            <p className="text-green-600 text-xs flex items-center gap-1 mt-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">Valid bond name</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Organization Name */}
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label className="text-xs sm:text-sm font-medium text-gray-700">Organization Name </label>
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
                                                    <IoAlertCircleOutline className="text-red-500 w-4 h-4" />
                                                )}
                                                {validFields.org_name && (
                                                    <IoCheckmarkCircleOutline className="text-green-500 w-4 h-4" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.org_name && touched.org_name && (
                                            <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                                                <IoAlertCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{errors.org_name}</span>
                                            </p>
                                        )}
                                        {validFields.org_name && (
                                            <p className="text-green-600 text-xs flex items-center gap-1 mt-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">Valid organization name</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Bond Symbol */}
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label className="text-xs sm:text-sm font-medium text-gray-700">Bond Symbol </label>
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
                                                    <IoAlertCircleOutline className="text-red-500 w-4 h-4" />
                                                )}
                                                {validFields.bondSymbol2 && (
                                                    <IoCheckmarkCircleOutline className="text-green-500 w-4 h-4" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.bondSymbol2 && touched.bondSymbol2 && (
                                            <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                                                <IoAlertCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{errors.bondSymbol2}</span>
                                            </p>
                                        )}
                                        {validFields.bondSymbol2 && (
                                            <p className="text-green-600 text-xs flex items-center gap-1 mt-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">Valid bond symbol</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Bond Type - IMPROVED CUSTOM DROPDOWN */}
                                    <div className="space-y-1.5 sm:space-y-2" ref={dropdownRef}>
                                        <label className="text-xs sm:text-sm font-medium text-gray-700">Bond Type </label>
                                        <div className="relative">
                                            {/* Custom Dropdown Trigger */}
                                            <button
                                                type="button"
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                className={`w-full p-3 pr-10 pl-10 sm:pl-12 text-left border rounded-xl text-gray-700 outline-none transition-all duration-200 flex items-center justify-between ${
                                                    errors.bond_type && touched.bond_type 
                                                        ? 'border-red-300 bg-red-50/50' 
                                                        : validFields.bond_type 
                                                            ? 'border-green-300 bg-green-50/50'
                                                            : 'border-gray-300'
                                                } ${isDropdownOpen ? 'ring-2 ring-[#5B50D9]/20 border-[#5B50D9]' : ''}`}
                                            >
                                                <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                                                    <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg ${selectedBondIcon.bg} flex items-center justify-center absolute left-2 sm:left-3 flex-shrink-0`}>
                                                        <selectedBondIcon.icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${selectedBondIcon.color}`} />
                                                    </div>
                                                    <div className="ml-7 sm:ml-8 md:ml-9 flex-1 min-w-0">
                                                        <span className="font-medium text-sm sm:text-base truncate block">{selectedBondIcon.label}</span>
                                                        <p className="text-xs text-gray-500 truncate block">{selectedBondIcon.description}</p>
                                                    </div>
                                                </div>
                                                {isDropdownOpen ? (
                                                    <IoChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                                                ) : (
                                                    <IoChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                                                )}
                                            </button>
                                            
                                            {/* Validation Icons */}
                                            <div className="absolute right-10 sm:right-12 top-1/2 transform -translate-y-1/2">
                                                {errors.bond_type && touched.bond_type && (
                                                    <IoAlertCircleOutline className="text-red-500 w-4 h-4" />
                                                )}
                                                {validFields.bond_type && (
                                                    <IoCheckmarkCircleOutline className="text-green-500 w-4 h-4" />
                                                )}
                                            </div>

                                            {/* Custom Dropdown Menu */}
                                            <AnimatePresence>
                                                {isDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                                                    >
                                                        <div className="max-h-60 sm:max-h-80 overflow-y-auto">
                                                            {bondTypeOptions.map((bondType) => {
                                                                const bondInfo = getBondIcon(bondType);
                                                                const Icon = bondInfo.icon;
                                                                const isSelected = bondDetails.bond_type === bondType;
                                                                
                                                                return (
                                                                    <button
                                                                        key={bondType}
                                                                        type="button"
                                                                        onClick={() => handleBondTypeSelect(bondType)}
                                                                        className={`w-full p-3 sm:p-4 text-left transition-all duration-200 hover:bg-gray-50/80 flex items-center gap-2 sm:gap-3 ${
                                                                            isSelected ? 'bg-blue-50/80 border-l-4 border-[#5B50D9]' : ''
                                                                        }`}
                                                                    >
                                                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${bondInfo.bg} flex items-center justify-center flex-shrink-0`}>
                                                                            <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${bondInfo.color}`} />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{bondInfo.label}</span>
                                                                                {isSelected && (
                                                                                    <IoCheckmarkCircleOutline className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0 ml-2" />
                                                                                )}
                                                                            </div>
                                                                            <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 truncate">{bondInfo.description}</p>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        {errors.bond_type && touched.bond_type && (
                                            <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                                                <IoAlertCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{errors.bond_type}</span>
                                            </p>
                                        )}
                                        {validFields.bond_type && (
                                            <p className="text-green-600 text-xs flex items-center gap-1 mt-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">Bond type selected</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Financial Details Section */}
                            <div className="bg-gradient-to-br from-green-50/50 to-green-100/30 rounded-xl p-3 sm:p-4 border border-green-200/60">
                                <h3 className="font-semibold text-green-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                                    <IoCashOutline className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Financial Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    {/* Total Units Offered */}
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label className="text-xs sm:text-sm font-medium text-gray-700">Total Units Offered </label>
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
                                                    <IoAlertCircleOutline className="text-red-500 w-4 h-4" />
                                                )}
                                                {validFields.totalUnitOffered && (
                                                    <IoCheckmarkCircleOutline className="text-green-500 w-4 h-4" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.totalUnitOffered && touched.totalUnitOffered && (
                                            <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                                                <IoAlertCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{errors.totalUnitOffered}</span>
                                            </p>
                                        )}
                                        {validFields.totalUnitOffered && (
                                            <p className="text-green-600 text-xs flex items-center gap-1 mt-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">Valid number of units</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Interest Rate - FIXED ICON POSITIONING */}
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label className="text-xs sm:text-sm font-medium text-gray-700">Interest Rate </label>
                                        <div className="relative">
                                            <input
                                                name="interest_rate"
                                                value={bondDetails.interest_rate}
                                                onChange={handleNumberInput}
                                                onBlur={handleBlur}
                                                type="text"
                                                placeholder="Enter interest rate"
                                                className={getInputClassName('interest_rate') + " pr-16 sm:pr-20"}
                                            />
                                            <span className="absolute right-10 sm:right-12 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-xs sm:text-sm">%</span>
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                {errors.interest_rate && touched.interest_rate && (
                                                    <IoAlertCircleOutline className="text-red-500 w-4 h-4" />
                                                )}
                                                {validFields.interest_rate && (
                                                    <IoCheckmarkCircleOutline className="text-green-500 w-4 h-4" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.interest_rate && touched.interest_rate && (
                                            <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                                                <IoAlertCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{errors.interest_rate}</span>
                                            </p>
                                        )}
                                        {validFields.interest_rate && (
                                            <p className="text-green-600 text-xs flex items-center gap-1 mt-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">Valid interest rate</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Face Value - FIXED ICON POSITIONING */}
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label className="text-xs sm:text-sm font-medium text-gray-700">Face Value </label>
                                        <div className="relative">
                                            <input
                                                name="face_value"
                                                value={bondDetails.face_value}
                                                onChange={handleNumberInput}
                                                onBlur={handleBlur}
                                                type="text"
                                                placeholder="Enter face value"
                                                className={getInputClassName('face_value') + " pr-16 sm:pr-20"}
                                            />
                                            <span className="absolute right-10 sm:right-12 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-xs sm:text-sm">BTN</span>
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                {errors.face_value && touched.face_value && (
                                                    <IoAlertCircleOutline className="text-red-500 w-4 h-4" />
                                                )}
                                                {validFields.face_value && (
                                                    <IoCheckmarkCircleOutline className="text-green-500 w-4 h-4" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.face_value && touched.face_value && (
                                            <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                                                <IoAlertCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{errors.face_value}</span>
                                            </p>
                                        )}
                                        {validFields.face_value && (
                                            <p className="text-green-600 text-xs flex items-center gap-1 mt-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">Valid face value</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Subscription Period */}
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label className="text-xs sm:text-sm font-medium text-gray-700">Subscription Period </label>
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
                                                    <IoAlertCircleOutline className="text-red-500 w-4 h-4" />
                                                )}
                                                {validFields.subscription_period && (
                                                    <IoCheckmarkCircleOutline className="text-green-500 w-4 h-4" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.subscription_period && touched.subscription_period && (
                                            <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                                                <IoAlertCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{errors.subscription_period}</span>
                                            </p>
                                        )}
                                        {validFields.subscription_period && (
                                            <p className="text-green-600 text-xs flex items-center gap-1 mt-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">Valid subscription period</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Section */}
                            <div className="bg-gradient-to-br from-purple-50/50 to-purple-100/30 rounded-xl p-3 sm:p-4 border border-purple-200/60">
                                <h3 className="font-semibold text-purple-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                                    <IoCalendarOutline className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Timeline
                                </h3>
                                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                    {/* Maturity Date */}
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label className="text-xs sm:text-sm font-medium text-gray-700">Maturity Date </label>
                                        <div className="relative">
                                            <input
                                                name="maturity"
                                                value={bondDetails.maturity}
                                                onChange={handleTextInput}
                                                onBlur={handleBlur}
                                                type="date"
                                                className={getInputClassName('maturity') + " appearance-none"}
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                {errors.maturity && touched.maturity && (
                                                    <IoAlertCircleOutline className="text-red-500 w-4 h-4" />
                                                )}
                                                {validFields.maturity && (
                                                    <IoCheckmarkCircleOutline className="text-green-500 w-4 h-4" />
                                                )}
                                            </div>
                                        </div>
                                        {errors.maturity && touched.maturity && (
                                            <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                                                <IoAlertCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{errors.maturity}</span>
                                            </p>
                                        )}
                                        {validFields.maturity && (
                                            <p className="text-green-600 text-xs flex items-center gap-1 mt-1">
                                                <IoCheckmarkCircleOutline className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">Valid maturity date</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Purpose Section */}
                            <div className="bg-gradient-to-br from-orange-50/50 to-orange-100/30 rounded-xl p-3 sm:p-4 border border-orange-200/60">
                                <h3 className="font-semibold text-orange-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                                    <IoDocumentTextOutline className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Bond Purpose
                                </h3>
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Purpose of the Bond </label>
                                    <div className="relative">
                                        <textarea
                                            name="purpose"
                                            value={bondDetails.purpose}
                                            onChange={handleTextInput}
                                            onBlur={handleBlur}
                                            placeholder="Describe the purpose and objectives of this bond offering in detail..."
                                            className={getInputClassName('purpose') + " resize-none pr-10 min-h-[100px] sm:min-h-[120px]"}
                                            rows={3}
                                        ></textarea>
                                        <div className="absolute right-3 top-3">
                                            {errors.purpose && touched.purpose && (
                                                <IoAlertCircleOutline className="text-red-500 w-4 h-4" />
                                            )}
                                            {validFields.purpose && (
                                                <IoCheckmarkCircleOutline className="text-green-500 w-4 h-4" />
                                            )}
                                        </div>
                                    </div>
                                    {errors.purpose && touched.purpose && (
                                        <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                                            <IoAlertCircleOutline className="w-3 h-3 flex-shrink-0" />
                                            <span className="truncate">{errors.purpose}</span>
                                        </p>
                                    )}
                                    {validFields.purpose && (
                                        <p className="text-green-600 text-xs flex items-center gap-1 mt-1">
                                            <IoCheckmarkCircleOutline className="w-3 h-3 flex-shrink-0" />
                                            <span className="truncate">Valid purpose description</span>
                                        </p>
                                    )}
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Minimum 10 characters required</span>
                                        <span className="flex-shrink-0 ml-2">{bondDetails.purpose.length}/500</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Bond Details Preview */}
                    <motion.div
                        {...fadeIn}
                        className="space-y-4 sm:space-y-6"
                    >
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/80 p-4 sm:p-6 shadow-sm">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <IoStatsChart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Bond Preview</h2>
                                    <p className="text-xs sm:text-sm text-gray-600 truncate">Review your bond configuration</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Progress Summary */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-100/50 rounded-xl p-3 sm:p-4 border border-blue-200/60">
                                    <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Validation Progress</h3>
                                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                        <span className="text-xs sm:text-sm text-blue-700 truncate">
                                            {completedFields} of {totalFields} fields completed
                                        </span>
                                        <span className="text-xs sm:text-sm font-semibold text-blue-900 flex-shrink-0 ml-2">
                                            {Math.round(progressPercentage)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-blue-200 rounded-full h-1.5 sm:h-2">
                                        <div 
                                            className="h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Bond Type with Icon Display */}
                                {selectedBondIcon && (
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 sm:p-4 border border-blue-200/60">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl ${selectedBondIcon.bg} flex items-center justify-center flex-shrink-0`}>
                                                <selectedBondIcon.icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${selectedBondIcon.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm font-medium text-blue-700 mb-0.5 sm:mb-1">Bond Type</p>
                                                <p className="text-sm sm:text-lg font-bold text-blue-900 truncate">{selectedBondIcon.label}</p>
                                                <p className="text-xs text-blue-600 mt-0.5 truncate">{selectedBondIcon.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 sm:p-4 border border-purple-200/60">
                                        <p className="text-xs sm:text-sm font-medium text-purple-700 mb-0.5 sm:mb-1">Total Units</p>
                                        <p className="text-sm sm:text-lg font-bold text-purple-900 truncate">
                                            {bondDetails.totalUnitOffered ? parseInt(bondDetails.totalUnitOffered).toLocaleString() : '0'}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-3 sm:p-4 border border-green-200/60">
                                        <p className="text-xs sm:text-sm font-medium text-green-700 mb-0.5 sm:mb-1">Interest Rate</p>
                                        <p className="text-sm sm:text-lg font-bold text-green-900 truncate">
                                            {bondDetails.interest_rate ? `${bondDetails.interest_rate}%` : 'Not set'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-3 sm:p-4 border border-orange-200/60">
                                        <p className="text-xs sm:text-sm font-medium text-orange-700 mb-0.5 sm:mb-1">Face Value</p>
                                        <p className="text-sm sm:text-lg font-bold text-orange-900 truncate">
                                            {bondDetails.face_value ? `${parseInt(bondDetails.face_value).toLocaleString()} BTN` : 'Not set'}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl p-3 sm:p-4 border border-teal-200/60">
                                        <p className="text-xs sm:text-sm font-medium text-teal-700 mb-0.5 sm:mb-1">Subscription Period</p>
                                        <p className="text-sm sm:text-lg font-bold text-teal-900 truncate">
                                            {bondDetails.subscription_period || 'Not set'}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-50/80 rounded-xl p-3 sm:p-4 border border-gray-200/60">
                                    <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Detailed Information</h3>
                                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                                        <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-gray-200/60">
                                            <span className="text-gray-600 truncate pr-2">Bond Name</span>
                                            <span className="font-medium text-gray-900 truncate text-right">{bondDetails.bondName || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-gray-200/60">
                                            <span className="text-gray-600 truncate pr-2">Organization</span>
                                            <span className="font-medium text-gray-900 truncate text-right">{bondDetails.org_name || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-gray-200/60">
                                            <span className="text-gray-600 truncate pr-2">Bond Symbol</span>
                                            <span className="font-medium text-gray-900 truncate text-right">{bondDetails.bondSymbol2 || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-gray-200/60">
                                            <span className="text-gray-600 truncate pr-2">Maturity Date</span>
                                            <span className="font-medium text-gray-900 truncate text-right">
                                                {bondDetails.maturity ? new Date(bondDetails.maturity).toLocaleDateString() : 'Not set'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5 sm:py-2">
                                            <span className="text-gray-600 truncate pr-2">Subscription Period</span>
                                            <span className="font-medium text-gray-900 truncate text-right">{bondDetails.subscription_period || 'Not set'}</span>
                                        </div>
                                    </div>
                                </div>

                                {bondDetails.purpose && (
                                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-3 sm:p-4 border border-indigo-200/60">
                                        <h3 className="font-semibold text-indigo-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Bond Purpose</h3>
                                        <p className="text-xs sm:text-sm text-indigo-800 line-clamp-3">{bondDetails.purpose}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                        >
                            <Link 
                                href="/admin"
                                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-gray-700 bg-gray-100/80 hover:bg-gray-200/80 font-semibold text-center transition-all border border-gray-300/60 text-sm sm:text-base"
                            >
                                Cancel
                            </Link>
                            <button
                                onClick={handleFinalizeClick}
                                className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-white font-semibold text-center transition-all shadow-sm flex items-center justify-center gap-2 text-sm sm:text-base ${
                                    !isFormValid || isLoading
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-[#5B50D9] to-[#6C63FF] hover:opacity-90'
                                }`}
                                disabled={!isFormValid || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                                        <span className="truncate">Processing...</span>
                                    </>
                                ) : (
                                    <span className="truncate">Finalize Bond</span>
                                )}
                            </button>
                        </motion.div>

                        {/* Loading Overlay */}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            >
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl w-full max-w-md"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#5B50D9] to-[#6C63FF] flex items-center justify-center mb-3 sm:mb-4">
                                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-4 border-white border-t-transparent"></div>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">Finalizing Bond</h3>
                                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                                            We're processing your bond configuration...
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                                            <motion.div 
                                                className="h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-[#5B50D9] to-[#6C63FF]"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 2, ease: "easeInOut" }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Validation Summary - Errors */}
                        {hasAnyTouched && hasErrors && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50/80 border border-red-200/60 rounded-xl p-3 sm:p-4"
                            >
                                <div className="flex items-center gap-1.5 sm:gap-2 text-red-800 mb-1.5 sm:mb-2">
                                    <IoAlertCircleOutline className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                    <h3 className="font-semibold text-sm sm:text-base truncate">Please fix the following issues:</h3>
                                </div>
                                <ul className="text-xs sm:text-sm text-red-700 space-y-0.5 sm:space-y-1">
                                    {Object.entries(errors).map(([field, error]) => (
                                        error && (
                                            <li key={field} className="flex items-center gap-1.5 sm:gap-2">
                                                <div className="w-1 h-1 bg-red-600 rounded-full flex-shrink-0"></div>
                                                <span className="truncate">{error}</span>
                                            </li>
                                        )
                                    ))}
                                </ul>
                            </motion.div>
                        )}

                        {/* Success / No-issues Summary */}
                        {hasAnyTouched && !hasErrors && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50/80 border border-green-200/60 rounded-xl p-3 sm:p-4"
                            >
                                <div className="flex items-center gap-1.5 sm:gap-2 text-green-800 mb-1.5 sm:mb-2">
                                    <IoCheckmarkCircleOutline className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                    <h3 className="font-semibold text-sm sm:text-base truncate">No issues yet</h3>
                                </div>
                                <p className="text-xs sm:text-sm text-green-700">
                                    {completedFields === 0 &&
                                        "You can start filling the form. Any issues will appear here."}
                                    {completedFields > 0 && completedFields < totalFields &&
                                        `No issues yet. ${completedFields} out of ${totalFields} fields are completed and valid so far.`}
                                    {completedFields === totalFields &&
                                        "No issues yet. All fields are valid and you can now finalize the bond."}
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