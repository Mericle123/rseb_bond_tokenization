// app/investor/negotiations/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Send, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  Filter,
  Eye,
  CheckCircle,
  X,
  MessageCircle,
  DollarSign,
  Percent,
  Calendar,
  User,
  Shield,
  TrendingUp,
  AlertCircle,
  Copy,
  ExternalLink,
  BarChart3,
  Package,
  Coins,
  History,
  ShoppingCart,
  Inbox,
  ArrowUp,
  ArrowDown,
  MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { useCurrentUser } from "@/context/UserContext";
import { getNegotiationDashboardData } from "@/server/db_actions/action";
import { updateNegotiationStatusForUser } from "@/server/lib/negotiations";

// Backend DTO shape returned by /api/investor/negotiations/dashboard
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
};

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
    savings: 0,

    status,
    type,
    direction: dto.direction,        // ✅ ADD THIS

    timestamp: createdAt,
    expiration,
    messages: [],
    bondDetails: undefined,
  };
}


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

  proposedTotalAmount: number;  // BTN (human)
  originalTotalAmount: number;  // BTN (human)
  savings: number;              // BTN (human)

  // DB status + extra UI states
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "counter"
    | "expired"
    | "cancelled";

  // Derived from who is the current user
  type: "buyer_offer" | "seller_offer" | "counter_offer";
  direction: "sent" | "received"; // sent = you are buyer, received = you are seller

  timestamp: Date;
  expiration: Date | null;

  messages: Message[];

  bondDetails?: {
    faceValue?: number;
    maturityDate?: string;
    issuer?: string;
    purpose?: string;
    totalUnits?: number;
    market?: string;
  };
}


interface Message {
  id: string;
  text: string;
  sender: "buyer" | "seller";
  senderWallet: string;
  timestamp: Date;
  type: "message" | "offer_update" | "system";
}

interface NegotiationStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  active: number;
}

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3 }
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

// Enhanced Filter Dropdown Component
function FilterDropdown({ 
  onFilterChange, 
  activeFilter,
  onClose,
  filterType 
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
      { key: "accepted", label: "Accepted", icon: <CheckCircle2 className="w-4 h-4" /> },
      { key: "rejected", label: "Rejected", icon: <XCircle className="w-4 h-4" /> },
      { key: "counter", label: "Counter", icon: <MessageCircle className="w-4 h-4" /> }
    ],
    bond: [
      { key: "all", label: "All Bonds", icon: <Package className="w-4 h-4" /> },
      { key: "primary", label: "Primary Market", icon: <TrendingUp className="w-4 h-4" /> },
      { key: "secondary", label: "Secondary Market", icon: <BarChart3 className="w-4 h-4" /> }
    ],
    type: [
      { key: "all", label: "All Types", icon: <FileText className="w-4 h-4" /> },
      { key: "buyer_offer", label: "Buyer Offers", icon: <ShoppingCart className="w-4 h-4" /> },
      { key: "seller_offer", label: "Seller Offers", icon: <Coins className="w-4 h-4" /> },
      { key: "counter_offer", label: "Counter Offers", icon: <MessageCircle className="w-4 h-4" /> }
    ]
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
          Filter by {filterType === "status" ? "Status" : filterType === "bond" ? "Bond Type" : "Offer Type"}
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

// ========================= Full Screen Loading Component =========================

function FullScreenLoading() {
  return (
    <div className="fixed inset-0 bg-[#F7F8FB] z-50 flex flex-col items-center justify-center">
      <div className="relative">
        <svg
          id="svg-global"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 94 136"
          height="200"
          width="140"
          className="mx-auto"
        >
          <path
            stroke="#4B22B5"
            d="M87.3629 108.433L49.1073 85.3765C47.846 84.6163 45.8009 84.6163 44.5395 85.3765L6.28392 108.433C5.02255 109.194 5.02255 110.426 6.28392 111.187L44.5395 134.243C45.8009 135.004 47.846 135.004 49.1073 134.243L87.3629 111.187C88.6243 110.426 88.6243 109.194 87.3629 108.433Z"
            id="line-v1"
          ></path>
          <path
            stroke="#5728CC"
            d="M91.0928 95.699L49.2899 70.5042C47.9116 69.6734 45.6769 69.6734 44.2986 70.5042L2.49568 95.699C1.11735 96.5298 1.11735 97.8767 2.49568 98.7074L44.2986 123.902C45.6769 124.733 47.9116 124.733 49.2899 123.902L91.0928 98.7074C92.4712 97.8767 92.4712 96.5298 91.0928 95.699Z"
            id="line-v2"
          ></path>
          <g id="node-server">
            <path
              fill="url(#paint0_linear_204_217)"
              d="M2.48637 72.0059L43.8699 96.9428C45.742 98.0709 48.281 97.8084 50.9284 96.2133L91.4607 71.7833C92.1444 71.2621 92.4197 70.9139 92.5421 70.1257V86.1368C92.5421 87.9686 92.0025 87.9681 91.3123 88.3825C84.502 92.4724 51.6503 112.204 50.0363 113.215C48.2352 114.343 45.3534 114.343 43.5523 113.215C41.9261 112.197 8.55699 91.8662 2.08967 87.926C1.39197 87.5011 1.00946 86.5986 1.00946 85.4058V70.1257C1.11219 70.9289 1.49685 71.3298 2.48637 72.0059Z"
            ></path>
            <path
              stroke="url(#paint2_linear_204_217)"
              fill="url(#paint1_linear_204_217)"
              d="M91.0928 68.7324L49.2899 43.5375C47.9116 42.7068 45.6769 42.7068 44.2986 43.5375L2.49568 68.7324C1.11735 69.5631 1.11735 70.91 2.49568 71.7407L44.2986 96.9356C45.6769 97.7663 47.9116 97.7663 49.2899 96.9356L91.0928 71.7407C92.4712 70.91 92.4712 69.5631 91.0928 68.7324Z"
            ></path>
            <mask
              height="41"
              width="67"
              y="50"
              x="13"
              maskUnits="userSpaceOnUse"
              style={{ maskType: 'luminance' }}
              id="mask0_204_217"
            >
              <path
                fill="white"
                d="M78.3486 68.7324L49.0242 51.0584C47.6459 50.2276 45.4111 50.2276 44.0328 51.0584L14.7084 68.7324C13.3301 69.5631 13.3301 70.91 14.7084 71.7407L44.0328 89.4148C45.4111 90.2455 47.6459 90.2455 49.0242 89.4148L78.3486 71.7407C79.7269 70.91 79.727 69.5631 78.3486 68.7324Z"
              ></path>
            </mask>
            <g mask="url(#mask0_204_217)">
              <path
                fill="#332C94"
                d="M78.3486 68.7324L49.0242 51.0584C47.6459 50.2276 45.4111 50.2276 44.0328 51.0584L14.7084 68.7324C13.3301 69.5631 13.3301 70.91 14.7084 71.7407L44.0328 89.4148C45.4111 90.2455 47.6459 90.2455 49.0242 89.4148L78.3486 71.7407C79.7269 70.91 79.727 69.5631 78.3486 68.7324Z"
              ></path>
              <mask
                height="29"
                width="48"
                y="56"
                x="23"
                maskUnits="userSpaceOnUse"
                style={{ maskType: 'luminance' }}
                id="mask1_204_217"
              >
                <path
                  fill="white"
                  d="M68.9898 68.7324L49.0242 56.699C47.6459 55.8683 45.4111 55.8683 44.0328 56.699L24.0673 68.7324C22.6889 69.5631 22.6889 70.91 24.0673 71.7407L44.0328 83.7741C45.4111 84.6048 47.6459 84.6048 49.0242 83.7741L68.9898 71.7407C70.3681 70.91 70.3681 69.5631 68.9898 68.7324Z"
                ></path>
              </mask>
              <g mask="url(#mask1_204_217)">
                <path
                  fill="#5E5E5E"
                  d="M68.9898 68.7324L49.0242 56.699C47.6459 55.8683 45.4111 55.8683 44.0328 56.699L24.0673 68.7324C22.6889 69.5631 22.6889 70.91 24.0673 71.7407L44.0328 83.7741C45.4111 84.6048 47.6459 84.6048 49.0242 83.7741L68.9898 71.7407C70.3681 70.91 70.3681 69.5631 68.9898 68.7324Z"
                ></path>
                <path
                  fill="#71B1C6"
                  d="M70.1311 69.3884L48.42 56.303C47.3863 55.6799 45.7103 55.6799 44.6765 56.303L22.5275 69.6523C21.4938 70.2754 21.4938 71.2855 22.5275 71.9086L44.2386 84.994C45.2723 85.617 46.9484 85.617 47.9821 84.994L70.1311 71.6446C71.1648 71.0216 71.1648 70.0114 70.1311 69.3884Z"
                ></path>
                <path
                  fill="#80C0D4"
                  d="M70.131 70.8923L48.4199 57.8069C47.3862 57.1839 45.7101 57.1839 44.6764 57.8069L22.5274 71.1562C21.4937 71.7793 21.4937 72.7894 22.5274 73.4125L44.2385 86.4979C45.2722 87.1209 46.9482 87.1209 47.982 86.4979L70.131 73.1486C71.1647 72.5255 71.1647 71.5153 70.131 70.8923Z"
                ></path>
                <path
                  fill="#89D3EB"
                  d="M69.751 72.1675L48.4199 59.3111C47.3862 58.6881 45.7101 58.6881 44.6764 59.3111L23.2004 72.2548C22.1667 72.8779 22.1667 73.888 23.2004 74.5111L44.5315 87.3674C45.5653 87.9905 47.2413 87.9905 48.2751 87.3674L69.751 74.4238C70.7847 73.8007 70.7847 72.7905 69.751 72.1675Z"
                ></path>
                <path
                  fill="#97E6FF"
                  d="M68.5091 72.9231L48.4199 60.8153C47.3862 60.1922 45.7101 60.1922 44.6764 60.8153L24.8146 72.7861C23.7808 73.4091 23.7808 74.4193 24.8146 75.0424L44.9038 87.1502C45.9375 87.7733 47.6135 87.7733 48.6473 87.1502L68.5091 75.1794C69.5428 74.5563 69.5428 73.5462 68.5091 72.9231Z"
                ></path>
                <path
                  fill="#97E6FF"
                  d="M66.6747 73.3219L48.4199 62.3197C47.3862 61.6966 45.7101 61.6966 44.6764 62.3197L26.4412 73.3101C25.4075 73.9332 25.4075 74.9433 26.4412 75.5664L44.696 86.5686C45.7297 87.1917 47.4058 87.1917 48.4395 86.5686L66.6747 75.5782C67.7084 74.9551 67.7084 73.945 66.6747 73.3219Z"
                ></path>
              </g>
              <path
                strokeWidth="0.5"
                stroke="#F4F4F4"
                d="M68.9898 68.7324L49.0242 56.699C47.6459 55.8683 45.4111 55.8683 44.0328 56.699L24.0673 68.7324C22.6889 69.5631 22.6889 70.91 24.0673 71.7407L44.0328 83.7741C45.4111 84.6048 47.6459 84.6048 49.0242 83.7741L68.9898 71.7407C70.3681 70.91 70.3681 69.5631 68.9898 68.7324Z"
              ></path>
            </g>
          </g>
          <g id="particles">
            <path
              fill="url(#paint3_linear_204_217)"
              d="M43.5482 32.558C44.5429 32.558 45.3493 31.7162 45.3493 30.6778C45.3493 29.6394 44.5429 28.7976 43.5482 28.7976C42.5535 28.7976 41.7471 29.6394 41.7471 30.6778C41.7471 31.7162 42.5535 32.558 43.5482 32.558Z"
              className="particle p1"
            ></path>
            <path
              fill="url(#paint4_linear_204_217)"
              d="M50.0323 48.3519C51.027 48.3519 51.8334 47.5101 51.8334 46.4717C51.8334 45.4333 51.027 44.5915 50.0323 44.5915C49.0375 44.5915 48.2311 45.4333 48.2311 46.4717C48.2311 47.5101 49.0375 48.3519 50.0323 48.3519Z"
              className="particle p2"
            ></path>
            <path
              fill="url(#paint5_linear_204_217)"
              d="M40.3062 62.6416C41.102 62.6416 41.7471 61.9681 41.7471 61.1374C41.7471 60.3067 41.102 59.6332 40.3062 59.6332C39.5104 59.6332 38.8653 60.3067 38.8653 61.1374C38.8653 61.9681 39.5104 62.6416 40.3062 62.6416Z"
              className="particle p3"
            ></path>
            <path
              fill="url(#paint6_linear_204_217)"
              d="M50.7527 73.9229C52.1453 73.9229 53.2743 72.7444 53.2743 71.2906C53.2743 69.8368 52.1453 68.6583 50.7527 68.6583C49.3601 68.6583 48.2311 69.8368 48.2311 71.2906C48.2311 72.7444 49.3601 73.9229 50.7527 73.9229Z"
              className="particle p4"
            ></path>
            <path
              fill="url(#paint7_linear_204_217)"
              d="M48.5913 76.9312C49.1882 76.9312 49.672 76.4262 49.672 75.8031C49.672 75.1801 49.1882 74.675 48.5913 74.675C47.9945 74.675 47.5107 75.1801 47.5107 75.8031C47.5107 76.4262 47.9945 76.9312 48.5913 76.9312Z"
              className="particle p5"
            ></path>
            <path
              fill="url(#paint8_linear_204_217)"
              d="M52.9153 67.1541C53.115 67.1541 53.2768 66.9858 53.2768 66.7781C53.2768 66.5704 53.115 66.402 52.9153 66.402C52.7156 66.402 52.5538 66.5704 52.5538 66.7781C52.5538 66.9858 52.7156 67.1541 52.9153 67.1541Z"
              className="particle p6"
            ></path>
            <path
              fill="url(#paint9_linear_204_217)"
              d="M52.1936 43.8394C52.7904 43.8394 53.2743 43.3344 53.2743 42.7113C53.2743 42.0883 52.7904 41.5832 52.1936 41.5832C51.5967 41.5832 51.1129 42.0883 51.1129 42.7113C51.1129 43.3344 51.5967 43.8394 52.1936 43.8394Z"
              className="particle p7"
            ></path>
            <path
              fill="url(#paint10_linear_204_217)"
              d="M57.2367 29.5497C57.8335 29.5497 58.3173 29.0446 58.3173 28.4216C58.3173 27.7985 57.8335 27.2935 57.2367 27.2935C56.6398 27.2935 56.156 27.7985 56.156 28.4216C56.156 29.0446 56.6398 29.5497 57.2367 29.5497Z"
              className="particle p8"
            ></path>
            <path
              fill="url(#paint11_linear_204_217)"
              d="M43.9084 34.8144C44.3063 34.8144 44.6289 34.4777 44.6289 34.0623C44.6289 33.647 44.3063 33.3102 43.9084 33.3102C43.5105 33.3102 43.188 33.647 43.188 34.0623C43.188 34.4777 43.5105 34.8144 43.9084 34.8144Z"
              className="particle p9"
            ></path>
          </g>
          <g id="reflectores">
            <path
              fillOpacity="0.2"
              fill="url(#paint12_linear_204_217)"
              d="M49.2037 57.0009L68.7638 68.7786C69.6763 69.3089 69.7967 69.9684 69.794 70.1625V13.7383C69.7649 13.5587 69.6807 13.4657 69.4338 13.3096L48.4832 0.601307C46.9202 -0.192595 46.0788 -0.208238 44.6446 0.601307L23.6855 13.2118C23.1956 13.5876 23.1966 13.7637 23.1956 14.4904L23.246 70.1625C23.2948 69.4916 23.7327 69.0697 25.1768 68.2447L43.9084 57.0008C44.8268 56.4344 45.3776 56.2639 46.43 56.2487C47.5299 56.2257 48.1356 56.4222 49.2037 57.0009Z"
            ></path>
            <path
              fillOpacity="0.2"
              fill="url(#paint13_linear_204_217)"
              d="M48.8867 27.6696C49.9674 26.9175 68.6774 14.9197 68.6774 14.9197C69.3063 14.5327 69.7089 14.375 69.7796 13.756V70.1979C69.7775 70.8816 69.505 71.208 68.7422 71.7322L48.9299 83.6603C48.2003 84.1258 47.6732 84.2687 46.5103 84.2995C45.3295 84.2679 44.8074 84.1213 44.0907 83.6603L24.4348 71.8149C23.5828 71.3313 23.2369 71.0094 23.2316 70.1979L23.1884 13.9816C23.1798 14.8398 23.4982 15.3037 24.7518 16.0874C24.7518 16.0874 42.7629 26.9175 44.2038 27.6696C45.6447 28.4217 46.0049 28.4217 46.5452 28.4217C47.0856 28.4217 47.806 28.4217 48.8867 27.6696Z"
            ></path>
          </g>
          <g id="panel-rigth">
            <mask fill="white" id="path-26-inside-1_204_217">
              <path
                d="M72 91.8323C72 90.5121 72.9268 88.9068 74.0702 88.2467L87.9298 80.2448C89.0731 79.5847 90 80.1198 90 81.44V81.44C90 82.7602 89.0732 84.3656 87.9298 85.0257L74.0702 93.0275C72.9268 93.6876 72 93.1525 72 91.8323V91.8323Z"
              ></path>
            </mask>
            <path
              fill="#91DDFB"
              d="M72 91.8323C72 90.5121 72.9268 88.9068 74.0702 88.2467L87.9298 80.2448C89.0731 79.5847 90 80.1198 90 81.44V81.44C90 82.7602 89.0732 84.3656 87.9298 85.0257L74.0702 93.0275C72.9268 93.6876 72 93.1525 72 91.8323V91.8323Z"
            ></path>
            <path
              mask="url(#path-26-inside-1_204_217)"
              fill="#489CB7"
              d="M72 89.4419L90 79.0496L72 89.4419ZM90.6928 81.44C90.6928 82.9811 89.6109 84.8551 88.2762 85.6257L74.763 93.4275C73.237 94.3085 72 93.5943 72 91.8323V91.8323C72 92.7107 72.9268 92.8876 74.0702 92.2275L87.9298 84.2257C88.6905 83.7865 89.3072 82.7184 89.3072 81.84L90.6928 81.44ZM72 94.2227V89.4419V94.2227ZM88.2762 80.0448C89.6109 79.2742 90.6928 79.8989 90.6928 81.44V81.44C90.6928 82.9811 89.6109 84.8551 88.2762 85.6257L87.9298 84.2257C88.6905 83.7865 89.3072 82.7184 89.3072 81.84V81.84C89.3072 80.5198 88.6905 79.8056 87.9298 80.2448L88.2762 80.0448Z"
            ></path>
            <mask fill="white" id="path-28-inside-2_204_217">
              <path
                d="M67 94.6603C67 93.3848 67.8954 91.8339 69 91.1962V91.1962C70.1046 90.5584 71 91.0754 71 92.3509V92.5129C71 93.7884 70.1046 95.3393 69 95.977V95.977C67.8954 96.6147 67 96.0978 67 94.8223V94.6603Z"
              ></path>
            </mask>
            <path
              fill="#91DDFB"
              d="M67 94.6603C67 93.3848 67.8954 91.8339 69 91.1962V91.1962C70.1046 90.5584 71 91.0754 71 92.3509V92.5129C71 93.7884 70.1046 95.3393 69 95.977V95.977C67.8954 96.6147 67 96.0978 67 94.8223V94.6603Z"
            ></path>
            <path
              mask="url(#path-28-inside-2_204_217)"
              fill="#489CB7"
              d="M67 92.3509L71 90.0415L67 92.3509ZM71.6928 92.5129C71.6928 94.0093 70.6423 95.8288 69.3464 96.577L69.3464 96.577C68.0505 97.3252 67 96.7187 67 95.2223V94.8223C67 95.6559 67.8954 95.8147 69 95.177L69 95.177C69.7219 94.7602 70.3072 93.7465 70.3072 92.9129L71.6928 92.5129ZM67 97.1317V92.3509V97.1317ZM69.2762 91.0367C70.6109 90.2661 71.6928 90.8908 71.6928 92.4319V92.5129C71.6928 94.0093 70.6423 95.8288 69.3464 96.577L69 95.177C69.7219 94.7602 70.3072 93.7465 70.3072 92.9129V92.7509C70.3072 91.4754 69.7219 90.7794 69 91.1962L69.2762 91.0367Z"
            ></path>
          </g>
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="92.0933"
              x2="92.5421"
              y1="92.0933"
              x1="1.00946"
              id="paint0_linear_204_217"
            >
              <stop stopColor="#5727CC"></stop>
              <stop stopColor="#4354BF" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="91.1638"
              x2="6.72169"
              y1="70"
              x1="92.5"
              id="paint1_linear_204_217"
            >
              <stop stopColor="#4559C4"></stop>
              <stop stopColor="#332C94" offset="0.29"></stop>
              <stop stopColor="#5727CB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="85.0762"
              x2="3.55544"
              y1="70"
              x1="92.5"
              id="paint2_linear_204_217"
            >
              <stop stopColor="#91DDFB"></stop>
              <stop stopColor="#8841D5" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="32.558"
              x2="43.5482"
              y1="28.7976"
              x1="43.5482"
              id="paint3_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="48.3519"
              x2="50.0323"
              y1="44.5915"
              x1="50.0323"
              id="paint4_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="62.6416"
              x2="40.3062"
              y1="59.6332"
              x1="40.3062"
              id="paint5_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="73.9229"
              x2="50.7527"
              y1="68.6583"
              x1="50.7527"
              id="paint6_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="76.9312"
              x2="48.5913"
              y1="74.675"
              x1="48.5913"
              id="paint7_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="67.1541"
              x2="52.9153"
              y1="66.402"
              x1="52.9153"
              id="paint8_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="43.8394"
              x2="52.1936"
              y1="41.5832"
              x1="52.1936"
              id="paint9_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="29.5497"
              x2="57.2367"
              y1="27.2935"
              x1="57.2367"
              id="paint10_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="34.8144"
              x2="43.9084"
              y1="33.3102"
              x1="43.9084"
              id="paint11_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="16.0743"
              x2="62.9858"
              y1="88.5145"
              x1="67.8638"
              id="paint12_linear_204_217"
            >
              <stop stopColor="#97E6FF"></stop>
              <stop stopOpacity="0" stopColor="white" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="39.4139"
              x2="31.4515"
              y1="88.0938"
              x1="36.2597"
              id="paint13_linear_204_217"
            >
              <stop stopColor="#97E6FF"></stop>
              <stop stopOpacity="0" stopColor="white" offset="1"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <p className="text-xl font-semibold text-gray-700 mt-8">Loading negotiations...</p>
      <p className="text-gray-500 mt-2">Please wait while we fetch your negotiation data</p>
      
      <style jsx>{`
        #svg-global {
          zoom: 1.2;
          overflow: visible;
        }

        @keyframes fade-particles {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-40px);
            opacity: 0;
          }
        }

        #particles {
          animation: fade-particles 5s infinite alternate;
        }
        .particle {
          animation: floatUp linear infinite;
        }

        .p1 {
          animation-duration: 2.2s;
          animation-delay: 0s;
        }
        .p2 {
          animation-duration: 2.5s;
          animation-delay: 0.3s;
        }
        .p3 {
          animation-duration: 2s;
          animation-delay: 0.6s;
        }
        .p4 {
          animation-duration: 2.8s;
          animation-delay: 0.2s;
        }
        .p5 {
          animation-duration: 2.3s;
          animation-delay: 0.4s;
        }
        .p6 {
          animation-duration: 3s;
          animation-delay: 0.1s;
        }
        .p7 {
          animation-duration: 2.1s;
          animation-delay: 0.5s;
        }
        .p8 {
          animation-duration: 2.6s;
          animation-delay: 0.2s;
        }
        .p9 {
          animation-duration: 2.4s;
          animation-delay: 0.3s;
        }

        @keyframes bounce-lines {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        #line-v1,
        #line-v2,
        #node-server,
        #panel-rigth,
        #reflectores,
        #particles {
          animation: bounce-lines 3s ease-in-out infinite alternate;
        }
        #line-v2 {
          animation-delay: 0.2s;
        }

        #node-server,
        #panel-rigth,
        #reflectores,
        #particles {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}

export default function NegotiationsPage() {
  const currentUser = useCurrentUser();
  const walletAddress = currentUser?.wallet_address || "";

  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [activeTab, setActiveTab] = useState<"my_resale" | "offers" | "history">("my_resale");
  const [bondFilter, setBondFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "reject" | "counter">("accept");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<"status" | "bond" | "type" | null>(null);

  // Enhanced mock data for all tabs
// Load offers from backend for current user
  // Load offers from backend
  useEffect(() => {
    if (!currentUser?.id || !walletAddress) return;
    const userId = currentUser.id
    const controller = new AbortController();

    const loadOffers = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/investor/negotiations/dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
          signal: controller.signal,
        });

        if (!res.ok) {
          console.error("Failed to fetch negotiation dashboard");
          setOffers([]);
          setFilteredOffers([]);
          return;
        }

        const data = (await res.json()) as {
          sent: NegotiationOfferDTO[];
          received: NegotiationOfferDTO[];
        };

        const allDtos = [...data.sent, ...data.received];
        const mappedOffers = allDtos.map((dto) =>
          mapDtoToOffer(dto, walletAddress)
        );

        setOffers(mappedOffers);
        setFilteredOffers(mappedOffers);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.error("Error loading negotiations:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadOffers();

    return () => controller.abort();
  }, [currentUser?.id, walletAddress]);

  // Filter offers based on active tab, search, and filters
// Filter offers based on active tab, search, and filters
useEffect(() => {
  let filtered = offers;

  // Tab filtering
  if (activeTab === "my_resale") {
    // You are the seller -> offers you RECEIVED
    filtered = filtered.filter((offer) => offer.direction === "received");
  } else if (activeTab === "offers") {
    // You are the buyer -> offers you SENT that are still active
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

  // Bond filter
  if (bondFilter !== "all") {
    filtered = filtered.filter(
      (offer) => offer.bondDetails?.market === bondFilter
    );
  }

  // Status filter
  if (statusFilter !== "all") {
    filtered = filtered.filter((offer) => offer.status === statusFilter);
  }

  // Type filter
  if (typeFilter !== "all") {
    filtered = filtered.filter((offer) => offer.type === typeFilter);
  }

  // Search filter (kept as you had it)
  if (searchQuery) {
    filtered = filtered.filter(
      (offer) =>
        offer.bondName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.bondSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.sellerWallet
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        offer.buyerWallet.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  setFilteredOffers(filtered);
}, [offers, activeTab, bondFilter, statusFilter, typeFilter, searchQuery, walletAddress]);

  const stats: NegotiationStats = {
    total: offers.length,
    pending: offers.filter(o => o.status === "pending").length,
    accepted: offers.filter(o => o.status === "accepted").length,
    rejected: offers.filter(o => o.status === "rejected").length,
    active: offers.filter(o => 
      o.status === "pending" || o.status === "counter"
    ).length
  };

  const sendMessage = (offerId: string) => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      sender: selectedOffer?.sellerWallet === walletAddress ? "seller" : "buyer",
      senderWallet: walletAddress,
      timestamp: new Date(),
      type: "message"
    };

    setOffers(prev => prev.map(offer => 
      offer.id === offerId 
        ? { ...offer, messages: [...offer.messages, message] }
        : offer
    ));

    setNewMessage("");
  };

  const handleOfferAction = (offerId: string, action: "accept" | "reject" | "counter") => {
    setActionType(action);
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    if (!selectedOffer || !currentUser?.id) return;

    try {
      // For now: "counter" only updates local UI (no backend call yet)
      if (actionType === "counter") {
        setOffers((prev) =>
          prev.map((offer) =>
            offer.id === selectedOffer.id
              ? {
                  ...offer,
                  status: "counter",
                  messages: [
                    ...offer.messages,
                    {
                      id: `msg-${Date.now()}`,
                      text: "Counter offer sent",
                      sender:
                        selectedOffer.sellerWallet === walletAddress
                          ? "seller"
                          : "buyer",
                      senderWallet: walletAddress,
                      timestamp: new Date(),
                      type: "offer_update",
                    },
                  ],
                }
              : offer
          )
        );
        return;
      }

      // Backend call for accept / reject
      const res = await fetch("/api/investor/negotiations/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: selectedOffer.id,
          userId: currentUser.id,
          action: actionType, // "accept" | "reject"
        }),
      });

      if (!res.ok) {
        console.error("Failed to update negotiation status");
        return;
      }

      const updated = (await res.json()) as NegotiationOfferDTO;

      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === updated.id
            ? {
                ...offer,
                status: (updated.status === "cancelled"
                  ? "rejected"
                  : updated.status) as Offer["status"],
                messages: [
                  ...offer.messages,
                  {
                    id: `msg-${Date.now()}`,
                    text:
                      actionType === "accept"
                        ? "Offer accepted"
                        : "Offer rejected",
                    sender:
                      selectedOffer.sellerWallet === walletAddress
                        ? "seller"
                        : "buyer",
                    senderWallet: walletAddress,
                    timestamp: new Date(),
                    type: "offer_update",
                  },
                ],
              }
            : offer
        )
      );
    } catch (err) {
      console.error("Error confirming action:", err);
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
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "expired":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};


  const getTypeColor = (type: Offer["type"]) => {
    switch (type) {
      case "buyer_offer": return "bg-purple-100 text-purple-800 border-purple-200";
      case "seller_offer": return "bg-orange-100 text-orange-800 border-orange-200";
      case "counter_offer": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'BTN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "my_resale": return <Coins className="w-4 h-4" />;
      case "offers": return <Inbox className="w-4 h-4" />;
      case "history": return <History className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // Handle dropdown toggle - only one can be open at a time
  const handleDropdownToggle = (dropdown: "status" | "bond" | "type") => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F7F8FB]">
        <InvestorSideNavbar />
        <main className="flex-1 min-w-0 p-6">
          <FullScreenLoading />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FB]">
      <InvestorSideNavbar />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:ml-0">
        {/* Header */}
        <motion.div {...fadeIn} className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Negotiation Channel</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Manage your bond purchase offers and negotiations
          </p>
        </motion.div>

        {/* Stats Overview - Responsive Grid */}
        <motion.div {...fadeIn} className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Offers</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-[#5B50D9]" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.accepted}</p>
              </div>
              <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
              <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Offers List Sidebar - Responsive */}
          <div className="xl:col-span-1">
            <motion.div {...fadeIn} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 h-fit">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Negotiations</h2>
                <Users className="w-5 h-5 text-gray-500" />
              </div>

              {/* Tabs - Enhanced design */}
              <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("my_resale")}
                  className={`flex items-center gap-2 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "my_resale" 
                      ? "border-[#5B50D9] text-[#5B50D9]" 
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {getTabIcon("my_resale")}
                  My Resale
                </button>
                <button
                  onClick={() => setActiveTab("offers")}
                  className={`flex items-center gap-2 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "offers" 
                      ? "border-[#5B50D9] text-[#5B50D9]" 
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {getTabIcon("offers")}
                  Offers
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex items-center gap-2 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "history" 
                      ? "border-[#5B50D9] text-[#5B50D9]" 
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {getTabIcon("history")}
                  History
                </button>
              </div>

              {/* Search and Filters - Enhanced responsive dropdowns */}
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

                {/* Responsive filter grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {/* Status Filter */}
                  <div className="filter-dropdown-container relative">
                    <button 
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#5B50D9] focus:border-transparent outline-none bg-white text-left flex items-center justify-between"
                      onClick={() => handleDropdownToggle("status")}
                    >
                      <span className="truncate">
                        {statusFilter === "all" ? "Status" : 
                         statusFilter === "pending" ? "Pending" :
                         statusFilter === "accepted" ? "Accepted" :
                         statusFilter === "rejected" ? "Rejected" : "Counter"}
                      </span>
                      <ArrowDown className={`w-3 h-3 text-gray-400 transition-transform ${activeDropdown === "status" ? "rotate-180" : ""}`} />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === "status" && (
                        <FilterDropdown
                          onFilterChange={setStatusFilter}
                          activeFilter={statusFilter}
                          onClose={() => setActiveDropdown(null)}
                          filterType="status"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bond Filter */}
                  <div className="filter-dropdown-container relative">
                    <button 
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#5B50D9] focus:border-transparent outline-none bg-white text-left flex items-center justify-between"
                      onClick={() => handleDropdownToggle("bond")}
                    >
                      <span className="truncate">
                        {bondFilter === "all" ? "Bond" : 
                         bondFilter === "primary" ? "Primary" : "Secondary"}
                      </span>
                      <ArrowDown className={`w-3 h-3 text-gray-400 transition-transform ${activeDropdown === "bond" ? "rotate-180" : ""}`} />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === "bond" && (
                        <FilterDropdown
                          onFilterChange={setBondFilter}
                          activeFilter={bondFilter}
                          onClose={() => setActiveDropdown(null)}
                          filterType="bond"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Type Filter */}
                  <div className="filter-dropdown-container relative">
                    <button 
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#5B50D9] focus:border-transparent outline-none bg-white text-left flex items-center justify-between"
                      onClick={() => handleDropdownToggle("type")}
                    >
                      <span className="truncate">
                        {typeFilter === "all" ? "Type" : 
                         typeFilter === "buyer_offer" ? "Buyer" :
                         typeFilter === "seller_offer" ? "Seller" : "Counter"}
                      </span>
                      <ArrowDown className={`w-3 h-3 text-gray-400 transition-transform ${activeDropdown === "type" ? "rotate-180" : ""}`} />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === "type" && (
                        <FilterDropdown
                          onFilterChange={setTypeFilter}
                          activeFilter={typeFilter}
                          onClose={() => setActiveDropdown(null)}
                          filterType="type"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Offers List - Responsive height */}
              <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
                {filteredOffers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    {...fadeIn}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedOffer?.id === offer.id
                        ? "border-[#5B50D9] bg-[#5B50D9]/5"
                        : "border-gray-200 bg-white"
                    }`}
                    onClick={() => setSelectedOffer(offer)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight flex-1 pr-2">
                        {offer.bondName}
                      </h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-2 text-xs text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Units:</span>
                        <span className="font-medium">{offer.units}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Rate:</span>
                        <span className="font-medium">{offer.proposedInterestRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Amount:</span>
                        <span className="font-medium">{formatCurrency(offer.proposedTotalAmount)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(offer.type)}`}>
                        {offer.type === "buyer_offer" ? "Buying" : 
                         offer.type === "seller_offer" ? "Selling" : "Counter"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOffer(offer);
                          setShowOfferModal(true);
                        }}
                        className="text-xs text-[#5B50D9] hover:text-[#4a40c4] font-medium flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Details
                      </button>
                    </div>
                  </motion.div>
                ))}

                {filteredOffers.length === 0 && (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <FileText className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                    <p className="text-sm">No offers found</p>
                    <p className="text-xs mt-1">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Chat & Offer Details Section - Responsive */}
          <div className="xl:col-span-3">
            {selectedOffer ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-h-[500px] sm:min-h-[600px]">
                {/* Enhanced Chat Section */}
                <div className="lg:col-span-2">
                  <motion.div {...fadeIn} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full">
                    {/* Enhanced Chat Header */}
                    <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                            {selectedOffer.bondName} ({selectedOffer.bondSymbol})
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-600">
                              With: {selectedOffer.sellerWallet === walletAddress ? 
                                formatWalletAddress(selectedOffer.buyerWallet) : 
                                formatWalletAddress(selectedOffer.sellerWallet)}
                            </p>
                            <button
                              onClick={() => copyToClipboard(
                                selectedOffer.sellerWallet === walletAddress ? 
                                selectedOffer.buyerWallet : selectedOffer.sellerWallet
                              )}
                              className="p-1 hover:bg-gray-100 rounded transition-colors group"
                              title="Copy wallet address"
                            >
                              <Copy className={`w-3 h-3 ${
                                copiedAddress === (selectedOffer.sellerWallet === walletAddress ? 
                                selectedOffer.buyerWallet : selectedOffer.sellerWallet)
                                  ? "text-green-500" 
                                  : "text-gray-400 group-hover:text-gray-600"
                              }`} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(selectedOffer.status)}`}>
                            {selectedOffer.status.charAt(0).toUpperCase() + selectedOffer.status.slice(1)}
                          </span>
                          {selectedOffer.status === "pending" && selectedOffer.sellerWallet === walletAddress && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOfferAction(selectedOffer.id, "accept")}
                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg sm:rounded-xl hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2"
                              >
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleOfferAction(selectedOffer.id, "reject")}
                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg sm:rounded-xl hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2"
                              >
                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Messages Area - Fixed message alignment */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 bg-gray-50/50">
                      {selectedOffer.messages.map((message) => {
                        // Determine if the message is from the current user
                        const isCurrentUser = message.senderWallet === walletAddress;
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 relative ${
                                isCurrentUser
                                  ? "bg-[#5B50D9] text-white rounded-br-none shadow-md"
                                  : "bg-white text-gray-900 rounded-bl-none border border-gray-200 shadow-sm"
                              } ${message.type === "system" ? "bg-amber-100 text-amber-900 border border-amber-200" : ""}`}
                            >
                              {message.type === "system" && (
                                <div className="flex items-center gap-2 mb-1">
                                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="text-xs font-medium">System</span>
                                </div>
                              )}
                              <p className="text-sm sm:text-base">{message.text}</p>
                              <div className="flex items-center justify-between mt-2 sm:mt-3">
                                <p
                                  className={`text-xs ${
                                    isCurrentUser
                                      ? "text-blue-100"
                                      : message.type === "system" ? "text-amber-700" : "text-gray-500"
                                  }`}
                                >
                                  {message.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                {message.type === "message" && (
                                  <div className="flex items-center gap-1">
                                    <span className={`text-xs ${
                                      isCurrentUser ? "text-blue-100" : "text-gray-500"
                                    }`}>
                                      {isCurrentUser ? "You" : "Them"}
                                    </span>
                                    <button
                                      onClick={() => copyToClipboard(message.senderWallet)}
                                      className="ml-1 p-1 hover:bg-black/10 rounded transition-colors"
                                      title="Copy sender address"
                                    >
                                      <Copy className={`w-3 h-3 ${
                                        copiedAddress === message.senderWallet
                                          ? "text-green-300"
                                          : isCurrentUser 
                                            ? "text-blue-100" 
                                            : "text-gray-400"
                                      }`} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Enhanced Message Input */}
                    {(selectedOffer.status === "pending" || selectedOffer.status === "counter") && (
                      <div className="p-4 sm:p-6 border-t border-gray-200 bg-white">
                        <div className="flex gap-3 sm:gap-4">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage(selectedOffer.id)}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B50D9] focus:border-transparent"
                          />
                          <button
                            onClick={() => sendMessage(selectedOffer.id)}
                            disabled={!newMessage.trim()}
                            className="px-4 sm:px-6 py-3 bg-[#5B50D9] text-white rounded-xl hover:bg-[#4a40c4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm sm:text-base"
                          >
                            <Send className="w-4 h-4" />
                            <span className="hidden sm:inline">Send</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Offer Details Sidebar - Responsive */}
                <div className="lg:col-span-1">
                  <motion.div {...fadeIn} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 h-full">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Offer Details</h3>
                    
                    {/* Bond Information */}
                    <div className="mb-4 sm:mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Bond Information</h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <p className="text-xs text-gray-500">Bond Name</p>
                          <p className="text-sm font-medium">{selectedOffer.bondName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Symbol</p>
                          <p className="text-sm font-medium">{selectedOffer.bondSymbol}</p>
                        </div>
                        {selectedOffer.bondDetails && (
                          <>
                            <div>
                              <p className="text-xs text-gray-500">Issuer</p>
                              <p className="text-sm font-medium">{selectedOffer.bondDetails.issuer}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Market</p>
                              <p className="text-sm font-medium capitalize">{selectedOffer.bondDetails.market}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Offer Terms */}
                    <div className="mb-4 sm:mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Offer Terms</h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Units</span>
                          <span className="text-sm font-bold">{selectedOffer.units}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Proposed Rate</span>
                          <span className="text-sm font-bold text-green-600">{selectedOffer.proposedInterestRate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Original Rate</span>
                          <span className="text-sm text-gray-700">{selectedOffer.originalInterestRate}%</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <span className="text-xs text-gray-500">Rate Difference</span>
                          <span className="text-sm font-bold text-green-600">
                            -{(selectedOffer.originalInterestRate - selectedOffer.proposedInterestRate).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Financial Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Proposed Amount:</span>
                          <span className="text-sm font-bold">{formatCurrency(selectedOffer.proposedTotalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Original Amount:</span>
                          <span className="text-sm text-gray-700">{formatCurrency(selectedOffer.originalTotalAmount)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-xs text-green-600 font-semibold">Your Savings:</span>
                          <span className="text-sm font-bold text-green-600">{formatCurrency(selectedOffer.savings)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {selectedOffer.status === "pending" && selectedOffer.sellerWallet === walletAddress && (
                      <div className="space-y-2 sm:space-y-3">
                        <button
                          onClick={() => handleOfferAction(selectedOffer.id, "accept")}
                          className="w-full bg-green-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept Offer
                        </button>
                        <button
                          onClick={() => handleOfferAction(selectedOffer.id, "reject")}
                          className="w-full bg-red-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <X className="w-4 h-4" />
                          Reject Offer
                        </button>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            ) : (
              <motion.div {...fadeIn} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 h-[400px] sm:h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500 p-6">
                  <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Offer Selected</h3>
                  <p className="text-sm">Select an offer from the list to view details and start chatting</p>
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
                  className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">Offer Details</h3>
                      <button
                        onClick={() => setShowOfferModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Bond Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Bond Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Bond Name</p>
                          <p className="font-medium">{selectedOffer.bondName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Symbol</p>
                          <p className="font-medium">{selectedOffer.bondSymbol}</p>
                        </div>
                        {selectedOffer.bondDetails && (
                          <>
                            <div>
                              <p className="text-sm text-gray-600">Issuer</p>
                              <p className="font-medium">{selectedOffer.bondDetails.issuer}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Market</p>
                              <p className="font-medium capitalize">{selectedOffer.bondDetails.market}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Units</p>
                              <p className="font-medium">{selectedOffer.bondDetails.totalUnits.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Maturity</p>
                              <p className="font-medium">
                                {new Date(selectedOffer.bondDetails.maturityDate).toLocaleDateString()}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Offer Terms */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Offer Terms</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Units</p>
                          <p className="text-lg font-bold">{selectedOffer.units}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Proposed Rate</p>
                          <p className="text-lg font-bold text-green-600">{selectedOffer.proposedInterestRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Original Rate</p>
                          <p className="text-lg font-medium text-gray-700">{selectedOffer.originalInterestRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Rate Difference</p>
                          <p className="text-lg font-medium text-green-600">
                            -{(selectedOffer.originalInterestRate - selectedOffer.proposedInterestRate).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Financial Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Proposed Amount:</span>
                          <span className="font-bold">{formatCurrency(selectedOffer.proposedTotalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Original Amount:</span>
                          <span className="font-medium">{formatCurrency(selectedOffer.originalTotalAmount)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-green-600 font-semibold">Your Savings:</span>
                          <span className="text-green-600 font-bold">{formatCurrency(selectedOffer.savings)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Counterparty Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Counterparty</h4>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-sm">Wallet Address</p>
                            <p className="text-xs text-gray-600 font-mono">
                              {formatWalletAddress(
                                selectedOffer.sellerWallet === walletAddress ? 
                                selectedOffer.buyerWallet : selectedOffer.sellerWallet
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(
                            selectedOffer.sellerWallet === walletAddress ? 
                            selectedOffer.buyerWallet : selectedOffer.sellerWallet
                          )}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Copy wallet address"
                        >
                          <Copy className={`w-4 h-4 ${
                            copiedAddress === (selectedOffer.sellerWallet === walletAddress ? 
                            selectedOffer.buyerWallet : selectedOffer.sellerWallet)
                              ? "text-green-500" 
                              : "text-gray-400"
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
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
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">
                      {actionType === "accept" ? "Accept Offer" : 
                       actionType === "reject" ? "Reject Offer" : "Send Counter Offer"}
                    </h3>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 mb-6">
                      {actionType === "accept" 
                        ? "Are you sure you want to accept this offer? This action will finalize the transaction."
                        : actionType === "reject"
                        ? "Are you sure you want to reject this offer? This action cannot be undone."
                        : "Are you sure you want to send a counter offer?"}
                    </p>

                    {selectedOffer && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{selectedOffer.bondName}</p>
                          <p className="text-sm text-gray-600">
                            {selectedOffer.units} units • {selectedOffer.proposedInterestRate}% interest
                          </p>
                          <p className="text-lg font-bold text-gray-900 mt-2">
                            {formatCurrency(selectedOffer.proposedTotalAmount)}
                          </p>
                        </div>
                      </div>
                    )}

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
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {actionType === "accept" ? "Accept Offer" : 
                         actionType === "reject" ? "Reject Offer" : "Send Counter"}
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