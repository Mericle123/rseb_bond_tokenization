// app/investor/negotiations/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  CheckCircle,
  X,
  DollarSign,
  Percent,
  Calendar,
  User,
  TrendingUp,
  AlertCircle,
  Copy,
  BarChart3,
  Package,
  Coins,
  History,
  ShoppingCart,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Zap,
  Shield,
  TrendingDown,
  RefreshCw,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { useCurrentUser } from "@/context/UserContext";

// Backend DTO shape returned by /api/investor/negotiations/dashboard
// and /api/investor/negotiations/status (with optional txDigest)
type NegotiationOfferDTO = {
  id: string;
  bondId: string;
  bondName: string;
  bondSymbol: string | null;
  buyerWallet: string;
  sellerWallet: string;
  units: number;
  unitsTenths: number;
  originalInterestRate: number;
  proposedInterestRate: number;
  proposedTotalAmountNu: number;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  direction: "sent" | "received";
  createdAt: string;
  updatedAt: string;
  txDigest?: string | null;
};

interface Offer {
  id: string;
  bondId: string;
  bondName: string;
  bondSymbol: string;
  sellerWallet: string;
  buyerWallet: string;
  units: number;
  proposedInterestRate: number;
  originalInterestRate: number;
  proposedTotalAmount: number;
  originalTotalAmount: number;
  savings: number;
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "counter"
    | "expired"
    | "cancelled";
  type: "buyer_offer" | "seller_offer" | "counter_offer";
  direction: "sent" | "received";
  timestamp: Date;
  expiration: Date | null;
  bondDetails?: {
    faceValue?: number;
    maturityDate?: string;
    issuer?: string;
    purpose?: string;
    totalUnits?: number;
    market?: string;
  };
}

// Map backend DTO → UI Offer type
function mapDtoToOffer(dto: NegotiationOfferDTO, walletAddress: string): Offer {
  let status: Offer["status"];
  switch (dto.status) {
    case "pending":
    case "accepted":
    case "rejected":
      status = dto.status;
      break;
    case "cancelled":
    default:
      status = "rejected";
  }

  const type: Offer["type"] =
    dto.direction === "sent" ? "buyer_offer" : "seller_offer";

  const createdAt = new Date(dto.createdAt);
  const expiration = new Date(createdAt.getTime() + 7 * 86_400_000);

  // Calculate savings based on interest rate difference
  const interestDifference = dto.originalInterestRate - dto.proposedInterestRate;
  const savings = (dto.proposedTotalAmountNu * interestDifference) / 100;

  return {
    id: dto.id,
    bondId: dto.bondId,
    bondName: dto.bondName,
    bondSymbol: dto.bondSymbol || "",
    sellerWallet: dto.sellerWallet,
    buyerWallet: dto.buyerWallet,
    units: dto.units,
    proposedInterestRate: dto.proposedInterestRate,
    originalInterestRate: dto.originalInterestRate,
    proposedTotalAmount: dto.proposedTotalAmountNu,
    originalTotalAmount: dto.proposedTotalAmountNu,
    savings: savings,

    status,
    type,
    direction: dto.direction,

    timestamp: createdAt,
    expiration,
    bondDetails: {
      faceValue: 1000,
      maturityDate: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      issuer: "Government of Bhutan",
      purpose: "Infrastructure Development",
      totalUnits: 10000,
      market: dto.direction === "sent" ? "secondary" : "primary",
    },
  };
}

interface NegotiationStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  active: number;
  potentialSavings: number;
}

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.15 },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// ===== Typewriter Loader =====
function TypewriterLoader() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* From Uiverse.io by Nawsome */}
      <div className="typewriter">
        <div className="slide">
          <i />
        </div>
        <div className="paper" />
        <div className="keyboard" />
      </div>
      <p className="mt-4 text-gray-600 text-sm sm:text-base">
        Loading negotiations...
      </p>

      <style jsx>{`
        .typewriter {
          --blue: #5c86ff;
          --blue-dark: #275efe;
          --key: #fff;
          --paper: #eef0fd;
          --text: #d3d4ec;
          --tool: #fbc56c;
          --duration: 3s;
          position: relative;
          -webkit-animation: bounce05 var(--duration) linear infinite;
          animation: bounce05 var(--duration) linear infinite;
        }

        .typewriter .slide {
          width: 92px;
          height: 20px;
          border-radius: 3px;
          margin-left: 14px;
          transform: translateX(14px);
          background: linear-gradient(var(--blue), var(--blue-dark));
          -webkit-animation: slide05 var(--duration) ease infinite;
          animation: slide05 var(--duration) ease infinite;
        }

        .typewriter .slide:before,
        .typewriter .slide:after,
        .typewriter .slide i:before {
          content: "";
          position: absolute;
          background: var(--tool);
        }

        .typewriter .slide:before {
          width: 2px;
          height: 8px;
          top: 6px;
          left: 100%;
        }

        .typewriter .slide:after {
          left: 94px;
          top: 3px;
          height: 14px;
          width: 6px;
          border-radius: 3px;
        }

        .typewriter .slide i {
          display: block;
          position: absolute;
          right: 100%;
          width: 6px;
          height: 4px;
          top: 4px;
          background: var(--tool);
        }

        .typewriter .slide i:before {
          right: 100%;
          top: -2px;
          width: 4px;
          border-radius: 2px;
          height: 14px;
        }

        .typewriter .paper {
          position: absolute;
          left: 24px;
          top: -26px;
          width: 40px;
          height: 46px;
          border-radius: 5px;
          background: var(--paper);
          transform: translateY(46px);
          -webkit-animation: paper05 var(--duration) linear infinite;
          animation: paper05 var(--duration) linear infinite;
        }

        .typewriter .paper:before {
          content: "";
          position: absolute;
          left: 6px;
          right: 6px;
          top: 7px;
          border-radius: 2px;
          height: 4px;
          transform: scaleY(0.8);
          background: var(--text);
          box-shadow: 0 12px 0 var(--text), 0 24px 0 var(--text),
            0 36px 0 var(--text);
        }

        .typewriter .keyboard {
          width: 120px;
          height: 56px;
          margin-top: -10px;
          z-index: 1;
          position: relative;
        }

        .typewriter .keyboard:before,
        .typewriter .keyboard:after {
          content: "";
          position: absolute;
        }

        .typewriter .keyboard:before {
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 7px;
          background: linear-gradient(135deg, var(--blue), var(--blue-dark));
          transform: perspective(10px) rotateX(2deg);
          transform-origin: 50% 100%;
        }

        .typewriter .keyboard:after {
          left: 2px;
          top: 25px;
          width: 11px;
          height: 4px;
          border-radius: 2px;
          box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key),
            45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key),
            90px 0 0 var(--key), 22px 10px 0 var(--key),
            37px 10px 0 var(--key), 52px 10px 0 var(--key),
            60px 10px 0 var(--key), 68px 10px 0 var(--key),
            83px 10px 0 var(--key);
          -webkit-animation: keyboard05 var(--duration) linear infinite;
          animation: keyboard05 var(--duration) linear infinite;
        }

        @keyframes bounce05 {
          85%,
          92%,
          100% {
            transform: translateY(0);
          }

          89% {
            transform: translateY(-4px);
          }

          95% {
            transform: translateY(2px);
          }
        }

        @keyframes slide05 {
          5% {
            transform: translateX(14px);
          }

          15%,
          30% {
            transform: translateX(6px);
          }

          40%,
          55% {
            transform: translateX(0);
          }

          65%,
          70% {
            transform: translateX(-4px);
          }

          80%,
          89% {
            transform: translateX(-12px);
          }

          100% {
            transform: translateX(14px);
          }
        }

        @keyframes paper05 {
          5% {
            transform: translateY(46px);
          }

          20%,
          30% {
            transform: translateY(34px);
          }

          40%,
          55% {
            transform: translateY(22px);
          }

          65%,
          70% {
            transform: translateY(10px);
          }

          80%,
          85% {
            transform: translateY(0);
          }

          92%,
          100% {
            transform: translateY(46px);
          }
        }

        @keyframes keyboard05 {
          5%,
          12%,
          21%,
          30%,
          39%,
          48%,
          57%,
          66%,
          75%,
          84% {
            box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key),
              45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key),
              90px 0 0 var(--key), 22px 10px 0 var(--key),
              37px 10px 0 var(--key), 52px 10px 0 var(--key),
              60px 10px 0 var(--key), 68px 10px 0 var(--key),
              83px 10px 0 var(--key);
          }

          9% {
            box-shadow: 15px 2px 0 var(--key), 30px 0 0 var(--key),
              45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key),
              90px 0 0 var(--key), 22px 10px 0 var(--key),
              37px 10px 0 var(--key), 52px 10px 0 var(--key),
              60px 10px 0 var(--key), 68px 10px 0 var(--key),
              83px 10px 0 var(--key);
          }

          18% {
            box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key),
              45px 0 0 var(--key), 60px 2px 0 var(--key), 75px 0 0 var(--key),
              90px 0 0 var(--key), 22px 10px 0 var(--key),
              37px 10px 0 var(--key), 52px 10px 0 var(--key),
              60px 10px 0 var(--key), 68px 10px 0 var(--key),
              83px 10px 0 var(--key);
          }

          27% {
            box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key),
              45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key),
              90px 0 0 var(--key), 22px 12px 0 var(--key),
              37px 10px 0 var(--key), 52px 10px 0 var(--key),
              60px 10px 0 var(--key), 68px 10px 0 var(--key),
              83px 10px 0 var(--key);
          }

          36% {
            box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key),
              45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key),
              90px 0 0 var(--key), 22px 10px 0 var(--key),
              37px 10px 0 var(--key), 52px 12px 0 var(--key),
              60px 12px 0 var(--key), 68px 12px 0 var(--key),
              83px 10px 0 var(--key);
          }

          45% {
            box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key),
              45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key),
              90px 2px 0 var(--key), 22px 10px 0 var(--key),
              37px 10px 0 var(--key), 52px 10px 0 var(--key),
              60px 10px 0 var(--key), 68px 10px 0 var(--key),
              83px 10px 0 var(--key);
          }

          54% {
            box-shadow: 15px 0 0 var(--key), 30px 2px 0 var(--key),
              45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key),
              90px 0 0 var(--key), 22px 10px 0 var(--key),
              37px 10px 0 var(--key), 52px 10px 0 var(--key),
              60px 10px 0 var(--key), 68px 10px 0 var(--key),
              83px 10px 0 var(--key);
          }

          63% {
            box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key),
              45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key),
              90px 0 0 var(--key), 22px 10px 0 var(--key),
              37px 10px 0 var(--key), 52px 10px 0 var(--key),
              60px 10px 0 var(--key), 68px 10px 0 var(--key),
              83px 12px 0 var(--key);
          }

          72% {
            box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key),
              45px 2px 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key),
              90px 0 0 var(--key), 22px 10px 0 var(--key),
              37px 10px 0 var(--key), 52px 10px 0 var(--key),
              60px 10px 0 var(--key), 68px 10px 0 var(--key),
              83px 10px 0 var(--key);
          }

          81% {
            box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key),
              45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key),
              90px 0 0 var(--key), 22px 10px 0 var(--key),
              37px 12px 0 var(--key), 52px 10px 0 var(--key),
              60px 10px 0 var(--key), 68px 10px 0 var(--key),
              83px 10px 0 var(--key);
          }
        }
      `}</style>
    </div>
  );
}

// Enhanced Filter Dropdown Component
function FilterDropdown({
  onFilterChange,
  activeFilter,
  onClose,
  filterType,
}: {
  onFilterChange: (filter: string) => void;
  activeFilter: string;
  onClose: () => void;
  filterType: "status" | "bond" | "type";
}) {
  const filters = {
    status: [
      { key: "all", label: "All Status", icon: <FileText className="w-4 h-4" /> },
      { key: "pending", label: "Pending", icon: <Clock className="w-4 h-4" /> },
      {
        key: "accepted",
        label: "Accepted",
        icon: <CheckCircle2 className="w-4 h-4" />,
      },
      { key: "rejected", label: "Rejected", icon: <XCircle className="w-4 h-4" /> },
      {
        key: "counter",
        label: "Counter",
        icon: <RefreshCw className="w-4 h-4" />,
      },
    ],
    bond: [
      { key: "all", label: "All Bonds", icon: <Package className="w-4 h-4" /> },
      {
        key: "primary",
        label: "Primary Market",
        icon: <TrendingUp className="w-4 h-4" />,
      },
      {
        key: "secondary",
        label: "Secondary Market",
        icon: <BarChart3 className="w-4 h-4" />,
      },
    ],
    type: [
      { key: "all", label: "All Types", icon: <FileText className="w-4 h-4" /> },
      {
        key: "buyer_offer",
        label: "Buying",
        icon: <ShoppingCart className="w-4 h-4" />,
      },
      {
        key: "seller_offer",
        label: "Selling",
        icon: <Coins className="w-4 h-4" />,
      },
      {
        key: "counter_offer",
        label: "Counter Offers",
        icon: <RefreshCw className="w-4 h-4" />,
      },
    ],
  };

  const currentFilters = filters[filterType];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
    >
      <div className="px-4 py-2 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-700">
          Filter by{" "}
          {filterType === "status"
            ? "Status"
            : filterType === "bond"
            ? "Bond Type"
            : "Offer Type"}
        </span>
      </div>
      {currentFilters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => {
            onFilterChange(filter.key);
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-150 ${
            activeFilter === filter.key
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            {filter.icon}
            <span>{filter.label}</span>
          </div>
        </button>
      ))}
    </motion.div>
  );
}

// Quick Action Card Component (kept for future use if needed)
function QuickActionCard({
  title,
  description,
  icon,
  color,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-95"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </motion.div>
  );
}

// Timeline Event Component
function TimelineEvent({ event, isLast }: { event: any; isLast: boolean }) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "created":
        return <FileText className="w-4 h-4" />;
      case "counter":
        return <RefreshCw className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "created":
        return "bg-blue-100 text-blue-600";
      case "counter":
        return "bg-purple-100 text-purple-600";
      case "accepted":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`p-2 rounded-full ${getEventColor(event.type)}`}>
          {getEventIcon(event.type)}
        </div>
        {!isLast && <div className="flex-1 w-0.5 bg-gray-200 my-2"></div>}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-sm text-gray-900">{event.title}</h4>
          <span className="text-xs text-gray-500">{event.time}</span>
        </div>
        <p className="text-xs text-gray-600">{event.description}</p>
        {event.details && (
          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-700">{event.details}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NegotiationsPage() {
  const currentUser = useCurrentUser();
  const walletAddress = currentUser?.wallet_address || "";

  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  // 🔹 CHANGED: activeTab can now be null (no tab selected)
  const [activeTab, setActiveTab] = useState<"my_resale" | "offers" | "history" | null>(null);

  const [bondFilter, setBondFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "reject" | "counter">(
    "accept"
  );
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<
    "status" | "bond" | "type" | null
  >(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Load offers from backend
  useEffect(() => {
    if (!currentUser?.id || !walletAddress) return;
    loadOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, walletAddress]);

  const loadOffers = async () => {
    if (!currentUser?.id || !walletAddress) return;

    try {
      setLoading(true);

      const res = await fetch("/api/investor/negotiations/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          walletAddress,
        }),
      });

      if (!res.ok) {
        console.error(
          "Failed to load negotiations:",
          res.status,
          await res.text()
        );
        setOffers([]);
        setFilteredOffers([]);
        return;
      }

      // Expecting: { sent: NegotiationOfferDTO[]; received: NegotiationOfferDTO[] }
      const data = await res.json();

      const allDtos: NegotiationOfferDTO[] = [
        ...(data.sent ?? []),
        ...(data.received ?? []),
      ];

      const mappedOffers = allDtos.map((dto) => mapDtoToOffer(dto, walletAddress));

      setOffers(mappedOffers);
      setFilteredOffers(mappedOffers);

      // 🔸 Removed auto-select of first offer to keep UX consistent
      // with "no tab selected until user chooses".
    } catch (err) {
      console.error("Error loading negotiations:", err);
      setOffers([]);
      setFilteredOffers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter offers based on view mode, tab, and filters
  useEffect(() => {
    let filtered = offers;

    // Tab filtering
    if (activeTab === "my_resale") {
      filtered = filtered.filter((offer) => offer.direction === "received");
    } else if (activeTab === "offers") {
      filtered = filtered.filter(
        (offer) =>
          offer.direction === "sent" &&
          (offer.status === "pending" || offer.status === "counter")
      );
    } else if (activeTab === "history") {
      filtered = filtered.filter((offer) =>
        ["accepted", "rejected", "expired"].includes(offer.status)
      );
    }
    // if activeTab is null → no tab filter; show all

    // Apply filters
    if (bondFilter !== "all") {
      filtered = filtered.filter(
        (offer) => offer.bondDetails?.market === bondFilter
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((offer) => offer.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((offer) => offer.type === typeFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (offer) =>
          offer.bondName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.bondSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.sellerWallet.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.buyerWallet.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOffers(filtered);
  }, [offers, activeTab, bondFilter, statusFilter, typeFilter, searchQuery]);

  const stats: NegotiationStats = {
    total: offers.length,
    pending: offers.filter((o) => o.status === "pending").length,
    accepted: offers.filter((o) => o.status === "accepted").length,
    rejected: offers.filter((o) => o.status === "rejected").length,
    active: offers.filter(
      (o) => o.status === "pending" || o.status === "counter"
    ).length,
    potentialSavings: offers
      .filter((o) => o.status === "pending")
      .reduce((sum, o) => sum + o.savings, 0),
  };

  const handleOfferAction = (
    offerId: string,
    action: "accept" | "reject" | "counter"
  ) => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;

    setSelectedOffer(offer);
    setActionType(action);
    setShowConfirmModal(true);
  };

  // 🔹 UPDATED: use backend API for accept/reject; keep counter client-side for now
  const confirmAction = async () => {
    if (!selectedOffer) return;

    // Counter offer is still off-chain / local
    if (actionType === "counter") {
      try {
        const updatedOffer: Offer = {
          ...selectedOffer,
          status: "counter",
          type: "counter_offer",
        };

        setOffers((prev) =>
          prev.map((o) => (o.id === selectedOffer.id ? updatedOffer : o))
        );
        setSelectedOffer(updatedOffer);
      } catch (err) {
        console.error("Error confirming counter action:", err);
      } finally {
        setShowConfirmModal(false);
      }
      return;
    }

    // For accept/reject we hit the status API
    if (!currentUser?.id) {
      console.error("Missing currentUser.id");
      setShowConfirmModal(false);
      return;
    }

    try {
      const res = await fetch("/api/investor/negotiations/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerId: selectedOffer.id,
          userId: currentUser.id,
          action: actionType, // "accept" | "reject"
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(
          "Failed to update negotiation status:",
          res.status,
          text
        );
        setShowConfirmModal(false);
        return;
      }

      const data = await res.json();
      // data is NegotiationOfferDTO or { ...dto, txDigest }
      const dto = data as NegotiationOfferDTO;

      const updatedOffer = mapDtoToOffer(dto, walletAddress);

      setOffers((prev) =>
        prev.map((o) => (o.id === updatedOffer.id ? updatedOffer : o))
      );
      setSelectedOffer(updatedOffer);
    } catch (err) {
      console.error("Error confirming action via API:", err);
    } finally {
      setShowConfirmModal(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const getStatusColor = (status: Offer["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "counter":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: Offer["type"]) => {
    switch (type) {
      case "buyer_offer":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "seller_offer":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "counter_offer":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "BTN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "my_resale":
        return <Coins className="w-4 h-4" />;
      case "offers":
        return <ShoppingCart className="w-4 h-4" />;
      case "history":
        return <History className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleDropdownToggle = (dropdown: "status" | "bond" | "type") => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".filter-dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    await loadOffers();
    setIsRefreshing(false);
  };

  const handleShareReport = async () => {
    setIsSharing(true);
    try {
      // Simulate share process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create share data
      const shareData = {
        title: "My Negotiations Report",
        text: `Check out my bond negotiations summary:\n\nTotal Offers: ${stats.total}\nActive: ${stats.active}\nPending: ${stats.pending}\nAccepted: ${stats.accepted}\nPotential Savings: ${formatCurrency(
          stats.potentialSavings
        )}`,
        url: window.location.href,
      };

      // Try Web Share API first
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.text);
        alert("Report copied to clipboard! You can now paste it anywhere.");
      }
    } catch (error: any) {
      console.error("Share failed:", error);
      if (error?.toString?.().includes("AbortError")) return;
      alert("Failed to share report");
    } finally {
      setIsSharing(false);
    }
  };

  const getTimelineEvents = (offer: Offer) => {
    const events = [
      {
        type: "created",
        title: "Offer Created",
        time: offer.timestamp.toLocaleDateString(),
        description: `${
          offer.type === "buyer_offer" ? "Buy" : "Sell"
        } offer submitted`,
        details: `${offer.units} units @ ${offer.proposedInterestRate}%`,
      },
    ];

    if (offer.status === "accepted") {
      events.push({
        type: "accepted",
        title: "Offer Accepted",
        time: new Date(offer.timestamp.getTime() + 86400000).toLocaleDateString(),
        description: "Both parties agreed to terms",
        details: `Transaction completed for ${formatCurrency(
          offer.proposedTotalAmount
        )}`,
      });
    } else if (offer.status === "rejected") {
      events.push({
        type: "rejected",
        title: "Offer Rejected",
        time: new Date(offer.timestamp.getTime() + 86400000).toLocaleDateString(),
        description: "Offer was declined",
        details: "No further action required",
      });
    } else if (offer.status === "counter") {
      events.push({
        type: "counter",
        title: "Counter Offer Sent",
        time: new Date().toLocaleDateString(),
        description: "New terms proposed",
        details: "Awaiting response from counterparty",
      });
    }

    return events;
  };

  // Render offers based on view mode
  const renderOffers = () => {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 max-h-[500px] overflow-y-auto">
          {filteredOffers.map((offer) => (
            <motion.div
              key={offer.id}
              {...fadeIn}
              whileHover={{ scale: 1.01 }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedOffer?.id === offer.id
                  ? "border-[#5B50D9] bg-[#5B50D9]/5"
                  : "border-gray-200 bg-white"
              }`}
              onClick={() => setSelectedOffer(offer)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                    {offer.bondName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {offer.bondSymbol}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      offer.status
                    )}`}
                  >
                    {offer.status.charAt(0).toUpperCase() +
                      offer.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Units</p>
                  <p className="text-sm font-semibold">{offer.units}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Rate</p>
                  <p className="text-sm font-semibold text-green-600">
                    {offer.proposedInterestRate}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(offer.proposedTotalAmount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Type</p>
                  <p
                    className={`px-2 py-0.5 rounded-full text-xs font-medium inline-block ${getTypeColor(
                      offer.type
                    )}`}
                  >
                    {offer.type === "buyer_offer"
                      ? "Buying"
                      : offer.type === "seller_offer"
                      ? "Selling"
                      : "Counter"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {offer.timestamp.toLocaleDateString()}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOffer(offer);
                    setShowOfferModal(true);
                  }}
                  className="text-xs text-[#5B50D9] hover:text-[#4a40c4] font-medium flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  View
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      );
    } else {
      // List view
      return (
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredOffers.map((offer) => (
            <motion.div
              key={offer.id}
              {...fadeIn}
              whileHover={{ scale: 1.01 }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedOffer?.id === offer.id
                  ? "border-[#5B50D9] bg-[#5B50D9]/5"
                  : "border-gray-200 bg-white"
              }`}
              onClick={() => setSelectedOffer(offer)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                    {offer.bondName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {offer.bondSymbol}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      offer.status
                    )}`}
                  >
                    {offer.status.charAt(0).toUpperCase() +
                      offer.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Units</p>
                  <p className="text-sm font-semibold">{offer.units}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Rate</p>
                  <p className="text-sm font-semibold text-green-600">
                    {offer.proposedInterestRate}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(offer.proposedTotalAmount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Type</p>
                  <p
                    className={`px-2 py-0.5 rounded-full text-xs font-medium inline-block ${getTypeColor(
                      offer.type
                    )}`}
                  >
                    {offer.type === "buyer_offer"
                      ? "Buying"
                      : offer.type === "seller_offer"
                      ? "Selling"
                      : "Counter"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {offer.timestamp.toLocaleDateString()}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOffer(offer);
                    setShowOfferModal(true);
                  }}
                  className="text-xs text-[#5B50D9] hover:text-[#4a40c4] font-medium flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  View
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }
  };

  // ===== Initial loading state with Typewriter animation =====
  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F7F8FB]">
        <InvestorSideNavbar />
        <main className="flex-1 min-w-0 p-6 flex items-center justify-center">
          <TypewriterLoader />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FB] relative">
      {/* Refresh overlay with typewriter loader */}
      {isRefreshing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <TypewriterLoader />
        </div>
      )}

      <InvestorSideNavbar />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:ml-0">
        {/* Header */}
        <motion.div {...fadeIn} className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Negotiation Manager
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Track and manage your bond negotiations in real-time
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
              <button
                onClick={handleShareReport}
                disabled={isSharing}
                className="px-4 py-2 bg-[#5B50D9] text-white rounded-xl text-sm font-medium hover:bg-[#4a40c4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Share2
                  className={`w-4 h-4 ${isSharing ? "animate-pulse" : ""}`}
                />
                {isSharing ? "Sharing..." : "Share Report"}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Offers List Sidebar */}
          <div className="xl:col-span-1">
            <motion.div
              {...fadeIn}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 h-fit"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Negotiations
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg ${
                      viewMode === "grid"
                        ? "bg-gray-100 text-[#5B50D9]"
                        : "hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    <GridIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg ${
                      viewMode === "list"
                        ? "bg-gray-100 text-[#5B50D9]"
                        : "hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
                {["my_resale", "offers", "history"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() =>
                      setActiveTab((prev) =>
                        prev === tab ? null : (tab as any)
                      )
                    }
                    className={`flex items-center gap-2 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? "border-[#5B50D9] text-[#5B50D9]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {getTabIcon(tab)}
                    {tab === "my_resale"
                      ? "My Resale"
                      : tab === "offers"
                      ? "My Offers"
                      : "History"}
                  </button>
                ))}
              </div>

              {/* Search and Filters */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bonds or addresses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#5B50D9] focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {(["status", "bond", "type"] as const).map((filterType) => (
                    <div
                      key={filterType}
                      className="filter-dropdown-container relative"
                    >
                      <button
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#5B50D9] focus:border-transparent outline-none bg-white text-left flex items-center justify-between"
                        onClick={() => handleDropdownToggle(filterType)}
                      >
                        <span className="truncate">
                          {filterType === "status"
                            ? statusFilter === "all"
                              ? "Status"
                              : statusFilter
                            : filterType === "bond"
                            ? bondFilter === "all"
                              ? "Bond"
                              : bondFilter
                            : typeFilter === "all"
                            ? "Type"
                            : typeFilter}
                        </span>
                        <ArrowDown
                          className={`w-3 h-3 text-gray-400 transition-transform ${
                            activeDropdown === filterType ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === filterType && (
                          <FilterDropdown
                            onFilterChange={
                              filterType === "status"
                                ? setStatusFilter
                                : filterType === "bond"
                                ? setBondFilter
                                : setTypeFilter
                            }
                            activeFilter={
                              filterType === "status"
                                ? statusFilter
                                : filterType === "bond"
                                ? bondFilter
                                : typeFilter
                            }
                            onClose={() => setActiveDropdown(null)}
                            filterType={filterType}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offers List */}
              <div className="space-y-2 sm:space-y-3 max-h-[500px] overflow-y-auto">
                {renderOffers()}

                {filteredOffers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No negotiations found</p>
                    <p className="text-xs mt-1">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Offer Details Section */}
          <div className="xl:col-span-3">
            {selectedOffer ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Main Details Card */}
                <div className="lg:col-span-2">
                  <motion.div
                    {...fadeIn}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 h-full"
                  >
                    {/* Header with Actions */}
                    <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 truncate">
                                {selectedOffer.bondName}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-gray-600">
                                  {selectedOffer.bondSymbol}
                                </span>
                                <span className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                  {selectedOffer.bondDetails?.market ===
                                  "primary"
                                    ? "Primary Market"
                                    : "Secondary Market"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(
                              selectedOffer.status
                            )}`}
                          >
                            {selectedOffer.status.toUpperCase()}
                          </span>
                          {selectedOffer.status === "pending" &&
                            selectedOffer.direction === "received" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleOfferAction(
                                      selectedOffer.id,
                                      "accept"
                                    )
                                  }
                                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleOfferAction(
                                      selectedOffer.id,
                                      "reject"
                                    )
                                  }
                                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                                >
                                  <X className="w-4 h-4" />
                                  Reject
                                </button>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-3 rounded-xl">
                          <p className="text-xs text-gray-600">Units</p>
                          <p className="text-lg font-bold text-gray-900">
                            {selectedOffer.units}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl">
                          <p className="text-xs text-gray-600">Proposed Rate</p>
                          <p className="text-lg font-bold text-green-600">
                            {selectedOffer.proposedInterestRate}%
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl">
                          <p className="text-xs text-gray-600">Original Rate</p>
                          <p className="text-lg font-bold text-gray-700">
                            {selectedOffer.originalInterestRate}%
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl">
                          <p className="text-xs text-gray-600">Total Amount</p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(
                              selectedOffer.proposedTotalAmount
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Financial Analysis */}
                    <div className="p-4 sm:p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Financial Analysis
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm text-gray-600">
                              Your Savings
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              {formatCurrency(selectedOffer.savings)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              Rate Difference
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              -
                              {(
                                selectedOffer.originalInterestRate -
                                selectedOffer.proposedInterestRate
                              ).toFixed(2)}
                              %
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-blue-600" />
                              <h5 className="font-medium text-blue-900">
                                Annual Interest
                              </h5>
                            </div>
                            <p className="text-2xl font-bold text-blue-900">
                              {formatCurrency(
                                (selectedOffer.proposedTotalAmount *
                                  selectedOffer.proposedInterestRate) /
                                  100
                              )}
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
                              Based on proposed rate
                            </p>
                          </div>

                          <div className="p-4 bg-purple-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-4 h-4 text-purple-600" />
                              <h5 className="font-medium text-purple-900">
                                Face Value
                              </h5>
                            </div>
                            <p className="text-2xl font-bold text-purple-900">
                              {formatCurrency(
                                selectedOffer.units *
                                  (selectedOffer.bondDetails?.faceValue || 1000)
                              )}
                            </p>
                            <p className="text-sm text-purple-700 mt-1">
                              Total bond value
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Sidebar with Timeline and Details */}
                <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                  {/* Timeline */}
                  <motion.div
                    {...fadeIn}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Negotiation Timeline
                    </h3>
                    <div className="space-y-4">
                      {getTimelineEvents(selectedOffer).map((event, index) => (
                        <TimelineEvent
                          key={index}
                          event={event}
                          isLast={
                            index ===
                            getTimelineEvents(selectedOffer).length - 1
                          }
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Counterparty Info */}
                  <motion.div
                    {...fadeIn}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Counterparty
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Wallet Address
                            </p>
                            <p className="text-xs text-gray-600 font-mono">
                              {formatWalletAddress(
                                selectedOffer.sellerWallet === walletAddress
                                  ? selectedOffer.buyerWallet
                                  : selectedOffer.sellerWallet
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              selectedOffer.sellerWallet === walletAddress
                                ? selectedOffer.buyerWallet
                                : selectedOffer.sellerWallet
                            )
                          }
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Copy wallet address"
                        >
                          <Copy
                            className={`w-4 h-4 ${
                              copiedAddress ===
                              (selectedOffer.sellerWallet === walletAddress
                                ? selectedOffer.buyerWallet
                                : selectedOffer.sellerWallet)
                                ? "text-green-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-700 mb-1">Your Role</p>
                        <p className="text-sm font-medium text-blue-900">
                          {selectedOffer.direction === "sent"
                            ? "Buyer"
                            : "Seller"}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Bond Details */}
                  <motion.div
                    {...fadeIn}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Bond Details
                    </h3>
                    <div className="space-y-3">
                      {selectedOffer.bondDetails && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Issuer
                            </span>
                            <span className="text-sm font-medium">
                              {selectedOffer.bondDetails.issuer}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Purpose
                            </span>
                            <span className="text-sm font-medium">
                              {selectedOffer.bondDetails.purpose}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Maturity Date
                            </span>
                            <span className="text-sm font-medium">
                              {new Date(
                                selectedOffer.bondDetails.maturityDate!
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Total Units
                            </span>
                            <span className="text-sm font-medium">
                              {selectedOffer.bondDetails.totalUnits?.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            ) : (
              <motion.div
                {...fadeIn}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 h-[600px] flex flex-col items-center justify-center"
              >
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a Negotiation
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Choose a negotiation from the list to view detailed
                    information, track its progress, and take action.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <RefreshCw className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Offer Details Modal */}
        <AnimatePresence>
          {showOfferModal && selectedOffer && (
            <>
              <motion.div
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowOfferModal(false)}
              />

              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#5B50D9] rounded-lg">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {selectedOffer.bondName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {selectedOffer.bondSymbol}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowOfferModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Offer Summary
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                              <span className="text-gray-600">Status</span>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                  selectedOffer.status
                                )}`}
                              >
                                {selectedOffer.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                              <span className="text-gray-600">Type</span>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                                  selectedOffer.type
                                )}`}
                              >
                                {selectedOffer.type.replace("_", " ")}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                              <span className="text-gray-600">Created</span>
                              <span className="font-medium">
                                {selectedOffer.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Financial Details
                          </h4>
                          <div className="space-y-3">
                            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                              <p className="text-sm text-green-700 mb-2">
                                Proposed Terms
                              </p>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs text-green-600">
                                    Interest Rate
                                  </p>
                                  <p className="text-xl font-bold text-green-700">
                                    {selectedOffer.proposedInterestRate}%
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-green-600">
                                    Total Amount
                                  </p>
                                  <p className="text-xl font-bold text-green-700">
                                    {formatCurrency(
                                      selectedOffer.proposedTotalAmount
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                              <p className="text-sm text-blue-700 mb-2">
                                Savings Analysis
                              </p>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-blue-600">
                                    Total Savings
                                  </p>
                                  <p className="text-xl font-bold text-blue-700">
                                    {formatCurrency(selectedOffer.savings)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-blue-600">
                                    Rate Reduction
                                  </p>
                                  <p className="text-xl font-bold text-blue-700">
                                    {(
                                      selectedOffer.originalInterestRate -
                                      selectedOffer.proposedInterestRate
                                    ).toFixed(2)}
                                    %
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Counterparty Information
                          </h4>
                          <div className="space-y-3">
                            <div className="p-4 bg-gray-50 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium">
                                    Wallet Address
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      selectedOffer.sellerWallet ===
                                        walletAddress
                                        ? selectedOffer.buyerWallet
                                        : selectedOffer.sellerWallet
                                    )
                                  }
                                  className="text-xs text-[#5B50D9] hover:text-[#4a40c4]"
                                >
                                  {copiedAddress ===
                                  (selectedOffer.sellerWallet === walletAddress
                                    ? selectedOffer.buyerWallet
                                    : selectedOffer.sellerWallet)
                                    ? "Copied!"
                                    : "Copy"}
                                </button>
                              </div>
                              <p className="text-xs font-mono text-gray-700 break-all">
                                {selectedOffer.sellerWallet === walletAddress
                                  ? selectedOffer.buyerWallet
                                  : selectedOffer.sellerWallet}
                              </p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl">
                              <div className="flex items-center gap-2 mb-1">
                                <Shield className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                  Your Role
                                </span>
                              </div>
                              <p className="text-sm text-blue-700">
                                {selectedOffer.direction === "sent"
                                  ? "You initiated this offer as the buyer"
                                  : "You received this offer as the seller"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Bond Information
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {selectedOffer.bondDetails &&
                              Object.entries({
                                Issuer: selectedOffer.bondDetails.issuer,
                                Purpose: selectedOffer.bondDetails.purpose,
                                Market: selectedOffer.bondDetails.market,
                                Maturity: new Date(
                                  selectedOffer.bondDetails.maturityDate!
                                ).toLocaleDateString(),
                                "Face Value": formatCurrency(
                                  selectedOffer.bondDetails.faceValue || 0
                                ),
                                "Total Units":
                                  selectedOffer.bondDetails.totalUnits?.toLocaleString(),
                              }).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="p-3 bg-gray-50 rounded-lg"
                                >
                                  <p className="text-xs text-gray-600">{key}</p>
                                  <p className="text-sm font-medium mt-1">
                                    {value}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {selectedOffer.status === "pending" &&
                      selectedOffer.direction === "received" && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={() => {
                                handleOfferAction(
                                  selectedOffer.id,
                                  "accept"
                                );
                                setShowOfferModal(false);
                              }}
                              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-5 h-5" />
                              Accept Offer
                            </button>
                            <button
                              onClick={() => {
                                handleOfferAction(
                                  selectedOffer.id,
                                  "reject"
                                );
                                setShowOfferModal(false);
                              }}
                              className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <X className="w-5 h-5" />
                              Reject Offer
                            </button>
                            <button
                              onClick={() => {
                                handleOfferAction(
                                  selectedOffer.id,
                                  "counter"
                                );
                                setShowOfferModal(false);
                              }}
                              className="flex-1 bg-[#5B50D9] text-white py-3 rounded-xl font-semibold hover:bg-[#4a40c4] transition-colors flex items-center justify-center gap-2"
                            >
                              <RefreshCw className="w-5 h-5" />
                              Counter Offer
                            </button>
                          </div>
                        </div>
                      )}
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && selectedOffer && (
            <>
              <motion.div
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowConfirmModal(false)}
              />

              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                  <div
                    className={`p-6 ${
                      actionType === "accept"
                        ? "bg-gradient-to-r from-green-50 to-emerald-50"
                        : actionType === "reject"
                        ? "bg-gradient-to-r from-red-50 to-rose-50"
                        : "bg-gradient-to-r from-purple-50 to-violet-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-2 rounded-lg ${
                          actionType === "accept"
                            ? "bg-green-100 text-green-600"
                            : actionType === "reject"
                            ? "bg-red-100 text-red-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {actionType === "accept" ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : actionType === "reject" ? (
                          <X className="w-6 h-6" />
                        ) : (
                          <RefreshCw className="w-6 h-6" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {actionType === "accept"
                          ? "Accept Offer"
                          : actionType === "reject"
                          ? "Reject Offer"
                          : "Send Counter Offer"}
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      {actionType === "accept"
                        ? "You are about to accept this offer. This will finalize the transaction and transfer the bonds."
                        : actionType === "reject"
                        ? "You are about to reject this offer. This action cannot be undone."
                        : "You are about to send a counter offer with modified terms."}
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <p className="font-semibold text-gray-900 text-center">
                        {selectedOffer.bondName}
                      </p>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Units</p>
                          <p className="font-bold">{selectedOffer.units}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Amount</p>
                          <p className="font-bold">
                            {formatCurrency(
                              selectedOffer.proposedTotalAmount
                            )}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Rate</p>
                          <p className="font-bold text-green-600">
                            {selectedOffer.proposedInterestRate}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Savings</p>
                          <p className="font-bold text-green-600">
                            {formatCurrency(selectedOffer.savings)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowConfirmModal(false)}
                        className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmAction}
                        className={`flex-1 px-4 py-3 text-white font-medium rounded-xl transition-colors ${
                          actionType === "accept"
                            ? "bg-green-600 hover:bg-green-700"
                            : actionType === "reject"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-[#5B50D9] hover:bg-[#4a40c4]"
                        }`}
                      >
                        {actionType === "accept"
                          ? "Confirm Acceptance"
                          : actionType === "reject"
                          ? "Confirm Rejection"
                          : "Send Counter Offer"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Icon components
function GridIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="4" cy="18" r="1" />
    </svg>
  );
}
