"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { Copy, Wallet, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/context/UserContext";
import { fetchResaleListingById } from "@/server/blockchain/bond";

// import { buyFromListingAndPersist } from "@/server/blockchain/bond"; // 👈 you'll implement this

/* ====================== Motion ====================== */
const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
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
          <code className="px-2 py-1 rounded-md bg-gray-50 text-gray-700 border border-black/5 break-all">
            {walletAddress}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copy}
            className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 ring-black/10 hover:ring-black/20 bg-white hover:shadow-md transition-all"
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

/* ====================== Slide-over shell ====================== */

function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const firstRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[100] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* overlay */}
      <button
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 supports-[backdrop-filter]:backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-[92%] sm:w-[420px] bg-white rounded-[18px] border border-black/15 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative flex items-center border-b border-black/10 px-4 py-3">
          <button
            ref={firstRef}
            onClick={onClose}
            aria-label="Back"
            className="relative z-20 p-2 rounded-full hover:bg-black/5 active:bg-black/10"
            type="button"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="absolute left-0 right-0 text-center text-[15px] font-medium tracking-[0.2px] pointer-events-none">
            {title ?? ""}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}

/* ====================== Buy (resale) sheet ====================== */

function BuyResaleSheet({
  listing,
  onClose,
}: {
  listing: any; // listing with bond + seller
  onClose: () => void;
}) {
  const currentUser = useCurrentUser();
  const [units, setUnits] = useState("0");
  const [loading, setLoading] = useState(false);

  const totalUnitsAvailable =
    Number(listing.amount_tenths ?? 0) / 10; // tenths -> units
  const faceValue = Number(listing.bond.face_value); // BTN per unit
  const nUnits = parseFloat(units) || 0;
  const totalAmount = nUnits * faceValue;

  async function handleBuy() {
    if (!currentUser) {
      alert("You must be logged in to buy.");
      return;
    }
    if (nUnits <= 0) {
      alert("Enter a valid number of units.");
      return;
    }
    if (nUnits > totalUnitsAvailable) {
      alert("Cannot buy more than listed units.");
      return;
    }

    setLoading(true);
    try {
      // 👇 Hook this into your secondary-market buy logic
      // await buyFromListingAndPersist({
      //   listingId: listing.id,
      //   buyerUserId: currentUser.id,
      //   buyerAddress: currentUser.wallet_address,
      //   buyerMnemonic: currentUser.hashed_mnemonic,
      //   amountUnits: nUnits,
      // });

      console.log("Buying from resale listing...", {
        listingId: listing.id,
        units: nUnits,
      });
      alert("Resale purchase logic not wired yet – plug buyFromListingAndPersist here.");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Resale purchase failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[420px]">
        <h4 className="mt-4 text-center text-[16px] font-semibold">
          Buy from Resale Market
        </h4>

        <p className="mt-2 text-center text-[13px] text-neutral-600">
          Seller wallet:
          <br />
          <span className="font-mono text-[12px] break-all">
            {listing.seller_wallet}
          </span>
        </p>

        <p className="mt-2 text-center text-[13px] text-neutral-600">
          Units listed:&nbsp;
          <span className="font-semibold">{totalUnitsAvailable}</span>
        </p>

        {/* Units to buy */}
        <label className="block text-left mt-4 text-[13px] font-semibold text-neutral-700">
          Units to buy (max {totalUnitsAvailable})
        </label>
        <input
          value={units}
          onChange={(e) => setUnits(e.target.value)}
          type="number"
          min={0}
          max={totalUnitsAvailable}
          step="0.1"
          className="mt-1 w-full rounded-xl border border-[#9DB6D3] px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-[#5B50D9]/60"
        />

        <label className="block text-left mt-4 text-[13px] font-semibold text-neutral-700">
          Face value per unit
        </label>
        <input
          value={faceValue.toLocaleString()}
          disabled
          className="mt-1 w-full rounded-xl border border-[#9DB6D3] px-4 py-2.5 text-[14px] outline-none bg-gray-50"
        />

        <div className="mt-5 text-center text-xl font-bold">
          Total Amount:{" "}
          <span className="text-[#5B50D9]">
            BTN Nu {totalAmount.toLocaleString()}
          </span>
        </div>

        <p className="mt-3 text-[12px] text-red-600">
          Warning: Blockchain transfers are irreversible. Double-check all
          details before confirming.
        </p>

        <button
          className="mt-5 w-full rounded-full bg-[#5B50D9] text-white py-3 font-semibold disabled:bg-neutral-400"
          type="button"
          onClick={handleBuy}
          disabled={loading || totalAmount <= 0}
        >
          {loading ? "Processing..." : "Buy from seller"}
        </button>
      </div>
    </div>
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

  if (loading || !listing) {
    return (
      <div className="flex min-h-screen bg-[#F7F8FB]">
        <InvestorSideNavbar />
        <main className="flex-1 min-w-0 p-4 sm:p-6">
          <p>Loading resale bond details...</p>
        </main>
      </div>
    );
  }

  const bond = listing.bond; // from include
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
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-neutral-100"
              aria-label="Go back"
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              Resale Bond Details
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column: main info */}
            <div>
              <div className="flex items-start gap-3">
                <div className="relative h-12 w-12 rounded-full border border-neutral-200 bg-white grid place-items-center shrink-0">
                  <Image src="/RSEB.png" alt="Issuer" width={28} height={28} />
                  <span className="absolute -bottom-0.5 left-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white bg-emerald-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {bond.bond_name} (Resale)
                  </h2>
                  <p className="text-[13px] text-neutral-600">
                    <span className="font-semibold">Symbol:</span>{" "}
                    {bond.bond_symbol}
                  </p>
                  <p className="text-[13px] text-emerald-600 mt-1">
                    Interest rate : + {bond.interest_rate} yr
                  </p>
                  <p className="text-[13px] text-neutral-500 mt-1">
                    Issuer : {bond.organization_name}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold">Details</h3>
                <dl className="mt-3 space-y-1 text-[14px]">
                  <div>
                    <dt className="font-semibold inline">Bond Name :</dt>{" "}
                    <dd className="inline"> {bond.bond_name}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Bond Symbol :</dt>{" "}
                    <dd className="inline"> {bond.bond_symbol}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Issuer :</dt>{" "}
                    <dd className="inline"> {bond.organization_name}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Face Value :</dt>{" "}
                    <dd className="inline">
                      {" "}
                      {nf.format(Number(bond.face_value))} BTN Coin
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Interest Rate :</dt>{" "}
                    <dd className="inline">
                      {" "}
                      {bond.interest_rate} per year
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">
                      Total Units Offered :
                    </dt>{" "}
                    <dd className="inline"> {bond.tl_unit_offered}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Issued Date :</dt>{" "}
                    <dd className="inline">
                      {" "}
                      {formatDMY(bond.created_at)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Maturity Date :</dt>{" "}
                    <dd className="inline">
                      {" "}
                      {formatDMY(bond.maturity)}
                    </dd>
                  </div>

                  {/* Resale-specific details */}
                  <div className="pt-2">
                    <dt className="font-semibold inline">Seller Wallet :</dt>{" "}
                    <dd className="inline break-all">
                      {listing.seller_wallet}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Units Listed :</dt>{" "}
                    <dd className="inline">{unitsListed}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Listing ID :</dt>{" "}
                    <dd className="inline">{listing.id}</dd>
                  </div>
                </dl>

                <button
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-[#5B50D9] px-6 py-2.5 text-white font-semibold"
                  onClick={() => setBuyOpen(true)}
                  type="button"
                >
                  Buy from seller
                </button>
              </div>
            </div>

            {/* Right column: About / purpose */}
            <div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold">About this bond</h3>
                <p className="mt-2 whitespace-pre-wrap text-[14px] leading-6 text-neutral-700">
                  {bond.purpose}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Slide-over for resale buy */}
        <Sheet
          open={buyOpen}
          onClose={() => setBuyOpen(false)}
          title="Purchase from Resale"
        >
          <BuyResaleSheet listing={listing} onClose={() => setBuyOpen(false)} />
        </Sheet>
      </main>
    </div>
  );
};

export default ResaleBondPage;
