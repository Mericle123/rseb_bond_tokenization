"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { Copy, Wallet, ArrowLeft, Calendar, Hash, User, Coins, Percent, Package, TrendingDown, X, ArrowRight, Shield, Clock, CheckCircle2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from "@/context/UserContext";
import { fetchResaleListingById } from "@/server/db_actions/action";

// import { buyFromListingAndPersist } from "@/server/blockchain/bond"; // 👈 you'll implement this
// import { createNegotiationOffer } from "@/server/blockchain/negotiation"; // 👈 you'll implement this

/* ====================== Motion ====================== */
const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
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

const nf = new Intl.NumberFormat("en-IN");

function formatDMY(dateISO: string) {
  const d = new Date(dateISO);
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day % 100 !== 11
      ? "st"
      : day % 10 === 2 && day % 100 !== 12
        ? "nd"
        : day % 10 === 3 && day % 100 !== 13
          ? "rd"
          : "th";
  const month = d.toLocaleString("en-GB", { month: "long" });
  return `${day}${suffix} ${month} ${d.getFullYear()}`;
}

/* ====================== Full Screen Loading Component ====================== */
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
      <p className="text-xl font-semibold text-gray-700 mt-8">Loading resale bond details...</p>
      <p className="text-gray-500 mt-2">Please wait while we fetch the information</p>
      
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

/* ============= Wallet strip for current user ============= */
function WalletStrip({ walletAddress }: { walletAddress: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    } catch {}
  };
  return (
    <motion.div
      {...fadeIn}
      className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4">
        <div className="flex items-center gap-2 text-sm text-gray-800">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20">
            <Wallet className="w-4 h-4 text-[#5B50D9]" strokeWidth={1.75} />
          </span>
          <span className="font-medium">Your wallet:</span>
          <code className="px-2 py-1 rounded-md bg-gray-50 text-gray-700 border border-black/5 break-all font-mono text-sm">
            {walletAddress}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copy}
            className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 ring-black/10 hover:ring-black/20 bg-white hover:shadow-md transition-all font-medium"
            aria-label="Copy wallet address"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? "Wallet address copied" : ""}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ====================== Enhanced Buy Modal Component ====================== */
function BuyNowModal({
  listing,
  isOpen,
  onClose,
  onConfirm
}: {
  listing: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (buyData: any) => Promise<void>;
}) {
  const [units, setUnits] = useState("1");
  const [buyLoading, setBuyLoading] = useState(false);
  const [step, setStep] = useState<"input" | "confirm" | "processing" | "success">("input");
  const [transactionHash, setTransactionHash] = useState("");

  if (!listing || !isOpen) return null;

  const bond = listing.bond;
  const totalUnitsAvailable = Number(listing.amount_tenths ?? 0) / 10;
  
  // Pricing calculation
  const faceValuePerUnit = Number(bond.face_value) / 10;
  const baseRatePct = parseFloat(bond.interest_rate ?? "0");
  const MS_PER_DAY = 86_400_000;
  const issuedAt = new Date(bond.created_at);
  const now = new Date();
  const daysHeld = Math.max(
    1,
    Math.floor((now.getTime() - issuedAt.getTime()) / MS_PER_DAY)
  );
  const baseInterestPerUnit = faceValuePerUnit * (baseRatePct / 100) * (daysHeld / 365);
  const baseResalePricePerUnit = faceValuePerUnit + baseInterestPerUnit;

  const nUnits = parseFloat(units) || 0;
  const totalFace = nUnits * faceValuePerUnit;
  const totalBaseInterest = nUnits * baseInterestPerUnit;
  const totalBaseAmount = totalFace + totalBaseInterest;

  const isValid = nUnits > 0 && nUnits <= totalUnitsAvailable;
  const sliderPercentage = (nUnits / totalUnitsAvailable) * 100;

  const resetModal = () => {
    setUnits("1");
    setStep("input");
    setTransactionHash("");
    setBuyLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleConfirm = async () => {
    if (!isValid) return;
    setStep("confirm");
  };

  const executePurchase = async () => {
    try {
      setStep("processing");
      setBuyLoading(true);
      
      const buyData = {
        listingId: listing.id,
        units: nUnits,
        totalAmount: totalBaseAmount,
        faceValue: totalFace,
        interest: totalBaseInterest,
        pricePerUnit: baseResalePricePerUnit
      };

      // 👇 Plug your actual purchase logic here
      // await buyFromListingAndPersist(buyData);
      
      console.log("Executing purchase...", buyData);
      
      // Simulate transaction hash
      setTransactionHash(`0x${Math.random().toString(16).slice(2, 42)}`);
      setStep("success");
      
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Purchase failed:", error);
      setStep("input");
      setBuyLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md"
            >
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                
                {/* Header */}
                <div className="relative p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
                  <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-xl">
                      <Coins className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {step === "success" ? "Purchase Successful!" : "Buy Now"}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {step === "success" 
                          ? "Your purchase has been completed successfully" 
                          : `Purchase ${bond.bond_name} at current market price`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  
                  {/* Bond Info Card */}
                  {(step === "input" || step === "confirm") && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src="/RSEB.png"
                            alt="Issuer"
                            width={32}
                            height={32}
                            className="rounded-lg"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{bond.bond_name}</h3>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Percent className="w-4 h-4 text-emerald-600" />
                              <span>{baseRatePct}% / yr</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Available Units</p>
                          <p className="font-semibold text-gray-900">{totalUnitsAvailable.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Price/Unit</p>
                          <p className="font-semibold text-gray-900">BTN Nu {baseResalePricePerUnit.toLocaleString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 1: Input Amount */}
                  {step === "input" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      {/* Units Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Units to Purchase
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max={totalUnitsAvailable}
                            step="1"
                            value={units}
                            onChange={(e) => setUnits(e.target.value)}
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                            placeholder="1"
                          />
                          <button
                            type="button"
                            onClick={() => setUnits(totalUnitsAvailable.toString())}
                            className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                          >
                            MAX
                          </button>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Available: {totalUnitsAvailable} units</span>
                        </div>
                      </div>

                      {/* Amount Slider */}
                      <div className="mt-4">
                        <input
                          type="range"
                          min="1"
                          max={totalUnitsAvailable}
                          step="1"
                          value={units || 1}
                          onChange={(e) => setUnits(e.target.value)}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0%</span>
                          <span>{sliderPercentage.toFixed(0)}%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      {nUnits > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-blue-50 rounded-xl p-4 border border-blue-200"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Info className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Price Breakdown</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Principal Amount:</span>
                              <span className="font-semibold text-blue-900">BTN Nu {totalFace.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Accrued Interest:</span>
                              <span className="font-semibold text-blue-900">BTN Nu {totalBaseInterest.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-blue-200">
                              <span className="text-emerald-700 font-semibold">Total Amount:</span>
                              <span className="font-bold text-emerald-900">BTN Nu {totalBaseAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Seller Info */}
                      <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">Seller Information</span>
                        </div>
                        <p className="text-xs text-amber-700 mt-1 break-all">
                          Wallet: {listing.seller_wallet}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Confirmation */}
                  {step === "confirm" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-center py-4">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Coins className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Confirm Purchase
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Review your purchase details before confirming
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bond Name:</span>
                          <span className="font-medium">{bond.bond_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Units:</span>
                          <span className="font-medium">{nUnits.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price per Unit:</span>
                          <span className="font-medium">BTN Nu {baseResalePricePerUnit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-medium text-emerald-600">BTN Nu {totalBaseAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-gray-700 font-semibold">Seller:</span>
                          <span className="text-xs font-medium text-gray-600 break-all">{listing.seller_wallet}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Processing */}
                  {step === "processing" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Processing Purchase
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Completing your bond purchase...
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>This may take a few seconds</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Success */}
                  {step === "success" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Purchase Successful!
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        You have successfully purchased {nUnits.toLocaleString()} units of {bond.bond_name}
                      </p>
                      
                      {transactionHash && (
                        <div className="bg-gray-50 rounded-xl p-3 text-xs">
                          <p className="text-gray-600 mb-1">Transaction Hash:</p>
                          <code className="text-gray-800 break-all">{transactionHash}</code>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Footer Actions */}
                {(step === "input" || step === "confirm") && (
                  <div className="px-6 pb-6">
                    <div className="flex gap-3">
                      {step === "input" ? (
                        <>
                          <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleConfirm}
                            disabled={!isValid || buyLoading}
                            className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setStep("input")}
                            className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                          >
                            Back
                          </button>
                          <button
                            onClick={executePurchase}
                            disabled={buyLoading}
                            className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            {buyLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Confirm Purchase"
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Custom slider styles */}
          <style jsx>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: #10b981;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            }
            
            .slider::-moz-range-thumb {
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: #10b981;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}

/* ====================== Negotiation Modal Component ====================== */
function NegotiationModal({
  listing,
  isOpen,
  onClose,
  onConfirm
}: {
  listing: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (offerData: any) => Promise<void>;
}) {
  const [proposedInterest, setProposedInterest] = useState("");
  const [negotiationLoading, setNegotiationLoading] = useState(false);
  const [step, setStep] = useState<"input" | "confirm" | "processing" | "success">("input");
  const [transactionHash, setTransactionHash] = useState("");

  if (!listing || !isOpen) return null;

  const bond = listing.bond;
  const totalUnitsAvailable = Number(listing.amount_tenths ?? 0) / 10;
  
  // Base pricing calculation
  const faceValuePerUnit = Number(bond.face_value) / 10;
  const baseRatePct = parseFloat(bond.interest_rate ?? "0");
  const MS_PER_DAY = 86_400_000;
  const issuedAt = new Date(bond.created_at);
  const now = new Date();
  const daysHeld = Math.max(
    1,
    Math.floor((now.getTime() - issuedAt.getTime()) / MS_PER_DAY)
  );
  const baseInterestPerUnit = faceValuePerUnit * (baseRatePct / 100) * (daysHeld / 365);
  const baseResalePricePerUnit = faceValuePerUnit + baseInterestPerUnit;

  // Proposed interest calculation
  const proposedRatePct = parseFloat(proposedInterest) || baseRatePct;
  const proposedInterestPerUnit = faceValuePerUnit * (proposedRatePct / 100) * (daysHeld / 365);
  const proposedPricePerUnit = faceValuePerUnit + proposedInterestPerUnit;

  const totalBaseAmount = totalUnitsAvailable * baseResalePricePerUnit;
  const totalProposedAmount = totalUnitsAvailable * proposedPricePerUnit;
  const savings = totalBaseAmount - totalProposedAmount;

  const isValid = proposedRatePct >= baseRatePct - 0.2 && proposedRatePct <= baseRatePct + 0.2;
  const interestAdjustment = proposedRatePct - baseRatePct;

  const resetModal = () => {
    setProposedInterest("");
    setStep("input");
    setTransactionHash("");
    setNegotiationLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleConfirm = async () => {
    if (!isValid) return;
    setStep("confirm");
  };

  const executeNegotiation = async () => {
    try {
      setStep("processing");
      setNegotiationLoading(true);
      
      const offerData = {
        listingId: listing.id,
        proposedInterestRate: proposedRatePct,
        proposedTotalAmount: totalProposedAmount,
        baseTotalAmount: totalBaseAmount,
        savings: savings,
        units: totalUnitsAvailable
      };

      // 👇 Plug your actual negotiation logic here
      // await createNegotiationOffer(offerData);
      
      console.log("Creating negotiation offer...", offerData);
      
      // Simulate transaction hash
      setTransactionHash(`0x${Math.random().toString(16).slice(2, 42)}`);
      setStep("success");
      
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Negotiation failed:", error);
      setStep("input");
      setNegotiationLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md"
            >
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                
                {/* Header */}
                <div className="relative p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                  <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <TrendingDown className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {step === "success" ? "Offer Sent!" : "Negotiate Price"}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {step === "success" 
                          ? "Your negotiation offer has been sent to the seller" 
                          : `Propose a better price for ${bond.bond_name}`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  
                  {/* Bond Info Card */}
                  {(step === "input" || step === "confirm") && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src="/RSEB.png"
                            alt="Issuer"
                            width={32}
                            height={32}
                            className="rounded-lg"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{bond.bond_name}</h3>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Percent className="w-4 h-4 text-emerald-600" />
                              <span>{baseRatePct}% / yr (current)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Available Units</p>
                          <p className="font-semibold text-gray-900">{totalUnitsAvailable.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Current Price/Unit</p>
                          <p className="font-semibold text-gray-900">BTN Nu {baseResalePricePerUnit.toLocaleString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 1: Input Proposed Interest */}
                  {step === "input" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      {/* Proposed Interest Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Proposed Interest Rate (%)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min={baseRatePct - 0.2}
                            max={baseRatePct + 0.2}
                            step="0.01"
                            value={proposedInterest}
                            onChange={(e) => setProposedInterest(e.target.value)}
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            placeholder={baseRatePct.toString()}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            %
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Min: {(baseRatePct - 0.2).toFixed(2)}%</span>
                          <span>Current: {baseRatePct}%</span>
                          <span>Max: {(baseRatePct + 0.2).toFixed(2)}%</span>
                        </div>
                      </div>

                      {/* Interest Rate Adjustment Slider */}
                      <div className="mt-4">
                        <input
                          type="range"
                          min={baseRatePct - 0.2}
                          max={baseRatePct + 0.2}
                          step="0.01"
                          value={proposedInterest || baseRatePct}
                          onChange={(e) => setProposedInterest(e.target.value)}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer interest-slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>-0.2%</span>
                          <span className="font-semibold">
                            {interestAdjustment > 0 ? '+' : ''}{interestAdjustment.toFixed(2)}%
                          </span>
                          <span>+0.2%</span>
                        </div>
                        <div className="text-center text-sm mt-2">
                          <span className="text-gray-600">Proposed Rate: </span>
                          <span className={`font-semibold ${
                            interestAdjustment > 0 ? 'text-emerald-600' : 
                            interestAdjustment < 0 ? 'text-purple-600' : 'text-gray-600'
                          }`}>
                            {proposedRatePct.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      {/* Price Comparison */}
                      {proposedInterest && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-blue-50 rounded-xl p-4 border border-blue-200"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Info className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Price Comparison</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Original Total:</span>
                              <span className="font-semibold text-blue-900">BTN Nu {totalBaseAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-700">Proposed Total:</span>
                              <span className="font-semibold text-purple-900">BTN Nu {totalProposedAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-blue-200">
                              <span className="text-emerald-700">Your Savings:</span>
                              <span className="font-bold text-emerald-900">BTN Nu {savings.toLocaleString()}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Rules Info */}
                      <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">Negotiation Rules</span>
                        </div>
                        <p className="text-xs text-amber-700 mt-1">
                          You can adjust the interest rate by ±0.2%. The seller will review your offer and can accept, reject, or counter-offer.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Confirmation */}
                  {step === "confirm" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-center py-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <TrendingDown className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Confirm Offer
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Review your negotiation offer before sending to the seller
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bond Name:</span>
                          <span className="font-medium">{bond.bond_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Units:</span>
                          <span className="font-medium">{totalUnitsAvailable.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Rate:</span>
                          <span className="font-medium text-gray-900">{baseRatePct}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Proposed Rate:</span>
                          <span className="font-medium text-purple-600">{proposedRatePct.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Proposed Total:</span>
                          <span className="font-medium text-purple-600">BTN Nu {totalProposedAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-gray-700 font-semibold">Your Savings:</span>
                          <span className="font-bold text-emerald-600">BTN Nu {savings.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Processing */}
                  {step === "processing" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Sending Offer
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Creating your negotiation offer...
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>This may take a few seconds</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Success */}
                  {step === "success" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Offer Sent Successfully!
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Your negotiation offer has been sent to the seller
                      </p>
                      
                      {transactionHash && (
                        <div className="bg-gray-50 rounded-xl p-3 text-xs">
                          <p className="text-gray-600 mb-1">Transaction Hash:</p>
                          <code className="text-gray-800 break-all">{transactionHash}</code>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Footer Actions */}
                {(step === "input" || step === "confirm") && (
                  <div className="px-6 pb-6">
                    <div className="flex gap-3">
                      {step === "input" ? (
                        <>
                          <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleConfirm}
                            disabled={!isValid || negotiationLoading}
                            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setStep("input")}
                            className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                          >
                            Back
                          </button>
                          <button
                            onClick={executeNegotiation}
                            disabled={negotiationLoading}
                            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            {negotiationLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Sending...
                              </>
                            ) : (
                              "Send Offer"
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Custom slider styles */}
          <style jsx>{`
            .interest-slider::-webkit-slider-thumb {
              appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: #8b5cf6;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            }
            
            .interest-slider::-moz-range-thumb {
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: #8b5cf6;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}

/* ====================== PAGE ====================== */
interface ResalePageProps {
  params: { listingId: string };
}

const ResaleBondPage = ({ params }: ResalePageProps) => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const { listingId } = params;

  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyOpen, setBuyOpen] = useState(false);
  const [negotiationOpen, setNegotiationOpen] = useState(false);

  const walletAddress = currentUser?.wallet_address || "";

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchResaleListingById(listingId);
        setListing(data);
      } catch (err) {
        console.error("Resale listing not found:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [listingId]);

  const handleBuyConfirm = async (buyData: any) => {
    // Implement your purchase logic here
    console.log("Purchase data:", buyData);
    // await buyFromListingAndPersist(buyData);
  };

  const handleNegotiationConfirm = async (offerData: any) => {
    // Implement your negotiation logic here
    console.log("Negotiation offer:", offerData);
    // await createNegotiationOffer(offerData);
  };

  if (loading || !listing) {
    return <FullScreenLoading />;
  }

  const bond = listing.bond;
  const unitsListed = Number(listing.amount_tenths ?? 0) / 10;

  return (
    <div className="flex min-h-screen bg-[#F7F8FB]">
      <InvestorSideNavbar />

      <main className="flex-1 min-w-0 p-4 sm:p-6">
        {walletAddress && <WalletStrip walletAddress={walletAddress} />}

        <motion.section
          {...fadeIn}
          className="mt-6 rounded-2xl border border-black/15 bg-white px-4 sm:px-6 py-5 sm:py-6 shadow-sm"
        >
          {/* Back + title */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Go back"
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Resale Bond Details
            </h1>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left column: Bond overview and key metrics */}
            <div className="xl:col-span-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bond Header Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-start gap-4">
                    <div className="relative h-14 w-14 rounded-full border border-white bg-white grid place-items-center shadow-sm">
                      <Image src="/RSEB.png" alt="Issuer" width={32} height={32} />
                      <span className="absolute -bottom-0.5 left-0.5 h-3 w-3 rounded-full ring-2 ring-white bg-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {bond.bond_name} <span className="text-indigo-600">(Resale)</span>
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">{bond.bond_symbol}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{bond.organization_name}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full">
                          <Percent className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-semibold text-emerald-700">
                            {bond.interest_rate}% per year
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Coins className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">Face Value</h3>
                        <p className="text-lg font-bold text-gray-900">
                          {nf.format(Number(bond.face_value) / 10)} BTN
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">Units Available</h3>
                        <p className="text-lg font-bold text-gray-900">{unitsListed}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates Grid */}
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">Issued Date</h3>
                        <p className="text-sm font-medium text-gray-900">{formatDMY(bond.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">Maturity Date</h3>
                        <p className="text-sm font-medium text-gray-900">{formatDMY(bond.maturity)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resale Details Card */}
                <div className="lg:col-span-2 bg-amber-50 rounded-xl border border-amber-200 p-5">
                  <h3 className="text-lg font-bold text-amber-900 mb-4">Resale Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-amber-800 mb-2">Seller Details</h4>
                      <div className="bg-white rounded-lg p-3 border border-amber-100">
                        <p className="text-xs font-medium text-amber-700 mb-1">Seller Wallet</p>
                        <code className="text-xs font-mono text-gray-900 break-all bg-amber-50 px-2 py-1 rounded">
                          {listing.seller_wallet}
                        </code>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-amber-800 mb-2">Listing Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-amber-100">
                          <span className="text-xs font-medium text-amber-700">Units Listed</span>
                          <span className="text-sm font-bold text-gray-900">{unitsListed}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-amber-100">
                          <span className="text-xs font-medium text-amber-700">Listing ID</span>
                          <code className="text-xs font-mono text-gray-900">{listing.id}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 rounded-full bg-emerald-600 text-white py-3 font-bold hover:bg-emerald-700 transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
                      onClick={() => setBuyOpen(true)}
                      type="button"
                    >
                      <Coins className="w-4 h-4" />
                      Buy Now
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 font-bold hover:from-purple-600 hover:to-purple-700 transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
                      onClick={() => setNegotiationOpen(true)}
                      type="button"
                    >
                      <TrendingDown className="w-4 h-4" />
                      Negotiate Price
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: About / purpose */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-5 h-full">
                <h3 className="text-lg font-bold text-gray-900 mb-4">About this Bond</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm leading-6 text-gray-700 whitespace-pre-wrap">
                    {bond.purpose || "No description available for this bond."}
                  </p>
                </div>
                
                {/* Additional bond info */}
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-800">Bond Specifications</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bond Name</span>
                      <span className="font-medium text-gray-900">{bond.bond_name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bond Symbol</span>
                      <span className="font-medium text-gray-900">{bond.bond_symbol}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Issuer</span>
                      <span className="font-medium text-gray-900">{bond.organization_name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Interest Rate</span>
                      <span className="font-medium text-emerald-600">{bond.interest_rate}% p.a.</span>
                    </div>
                  </div>
                </div>

                {/* Purchase Options Info Card */}
                <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-blue-800">Purchase Options</h4>
                  </div>
                  <div className="space-y-2 text-xs text-blue-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span><strong>Buy Now:</strong> Purchase immediately at current market price</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span><strong>Negotiate:</strong> Propose a better interest rate to the seller</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Enhanced Buy Now Modal */}
        <BuyNowModal
          listing={listing}
          isOpen={buyOpen}
          onClose={() => setBuyOpen(false)}
          onConfirm={handleBuyConfirm}
        />

        {/* Negotiation Modal */}
        <NegotiationModal
          listing={listing}
          isOpen={negotiationOpen}
          onClose={() => setNegotiationOpen(false)}
          onConfirm={handleNegotiationConfirm}
        />
      </main>
    </div>
  );
};

export default ResaleBondPage;