"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import styles from "./page.module.css";
import { IoSearch, IoDocumentTextOutline } from "react-icons/io5";
import { FaPlus, FaSackDollar } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { BsFileEarmarkTextFill } from "react-icons/bs";
import { fetchBond, fetchBonds } from "@/server/bond/creation";
import { useCurrentUser } from "@/context/UserContext";
import { getBtncBalance } from "@/server/blockchain/btnc";


export default function AdminHomePage() {
  const [bonds, setBonds] = useState<any[]>([]); // Ensure bonds is typed as an array
  
  // --- STATE CHANGES ---
  // 1. Separate loading states for clarity
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [bondsLoading, setBondsLoading] = useState(true); // For the initial page load
  const [loadingMore, setLoadingMore] = useState(false); // For subsequent page loads

  const [currentUser, setCurrentUser] = useState(useCurrentUser());
  const [walletAddress, setWalletAddress] = useState(currentUser.wallet_address);
  const [balance, setBalance] = useState<string | null>(null);

  // 2. Add pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Tracks if more bonds are available
  const BONDS_PER_PAGE = 10; // Define how many bonds to fetch per page

  // --- EFFECT FOR BALANCE ---
  // This effect now *only* handles balance loading
  useEffect(() => {
    async function loadBalance() {
      if (!walletAddress) {
        setBalanceLoading(false);
        return;
      }
      setBalanceLoading(true); // Set loading true *before* the fetch
      try {
        const data = await getBtncBalance({ address: walletAddress });
        setBalance(data.balanceHuman);
      } catch (e) {
        console.error(e);
      } finally {
        setBalanceLoading(false);
      }
    }
    loadBalance();
  }, [walletAddress]);


  // --- EFFECT FOR INITIAL BONDS ---
  // This effect runs *once* on mount to get the first page of bonds
  useEffect(() => {
    async function getInitialBonds() {
      setBondsLoading(true);
      try {
        // 3. Call fetchBond with pagination parameters
        const data = await fetchBonds(1, BONDS_PER_PAGE, false);
        setBonds(data);
        setPage(2); // Set the *next* page to fetch
        setHasMore(data.length === BONDS_PER_PAGE); // If we got a full page, assume there's more
      } catch (error) {
        console.error("Error fetching bonds:", error);
      } finally {
        setBondsLoading(false);
      }
    }
    getInitialBonds();
  }, []); // Empty dependency array ensures this runs only once


  // --- FUNCTION TO LOAD MORE BONDS ---
  // 4. This function is called by the IntersectionObserver
  const loadMoreBonds = async () => {
    if (loadingMore || !hasMore) return; // Don't fetch if already fetching or no more data

    setLoadingMore(true);
    try {
      const data = await fetchBonds(page, BONDS_PER_PAGE);
      setBonds((prevBonds) => [...prevBonds, ...data]); // Append new bonds
      setPage((prevPage) => prevPage + 1); // Increment page number
      setHasMore(data.length === BONDS_PER_PAGE); // Check if there's more data
    } catch (error) {
      console.error("Error fetching more bonds:", error);
    } finally {
      setLoadingMore(false);
    }
  };


  // --- INTERSECTION OBSERVER ---
  // 5. Setup the observer to trigger 'loadMoreBonds'
  const observer = useRef<IntersectionObserver | null>(null);
  const lastBondElementRef = useCallback(
    (node: HTMLDivElement) => { // This node is the element we attach the ref to
      if (bondsLoading) return; // Don't observe while initial data is loading

      if (observer.current) observer.current.disconnect(); // Disconnect old observer

      observer.current = new IntersectionObserver((entries) => {
        // If the trigger element is intersecting (visible) and we have more...
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreBonds(); // ...load more bonds.
        }
      });

      if (node) observer.current.observe(node); // Start observing the new node
    },
    [bondsLoading, loadingMore, hasMore] // Re-create observer if these change
  );

  return (
    <div className={styles.container}> {/* Styles removed for demo, add yours back */}
      <h1 className={styles.title}>Admin Wallet</h1>
      <p>{walletAddress}</p>
      <h2 id="wallet-summary-title" className="text-lg font-semibold text-gray-900">
        {/* 6. Use the specific 'balanceLoading' state */}
        {balanceLoading ? (
          "Loading balance..."
        ) : balance && parseFloat(balance.replace(",", "")) > 0 ? ( // Handle formatted numbers
          <>
            {balance} <span className="text-sm font-medium text-gray-500">BTN₵</span>
          </>
        ) : (
          "No coins"
        )}
      </h2>
      <h1 className={styles.title}>System Overview</h1>

      {/* Overview Section (unchanged) */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "#E4E2FB" }}>
            <BsFileEarmarkTextFill color="#5A4BDA" />
          </div>
          <div>
            <p className={styles.statLabel}>Total Active Offerings</p>
            {/* This bonds.length will now grow as user scrolls */}
            <p className={styles.statValue}>{bonds.length}</p>
          </div>
        </div>
        {/* ... other stat cards ... */}
      </div>

      {/* Active Offerings Section (unchanged) */}
      <div className={styles.offeringsHeader}>
        <h2 className={styles.subtitle}>Active Offerings</h2>
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <IoSearch className={styles.searchIcon} />
            <input type="text" placeholder="Search" className={styles.searchInput} />
          </div>
          <Link href="/admin/create-bond" className={styles.createButton}>
            Create Bond <FaPlus />
          </Link>
        </div>
      </div>

      {/* Offerings Table */}
      {/* 7. CRITICAL CSS: Add max-height and overflow-y to make the container scrollable */}
      <div
        className={styles.tableContainer}
        style={{
          maxHeight: "600px", // Or any height you prefer
          overflowY: "auto",   // Enables vertical scrolling *within* this div
          border: "1px solid #eee", // Added for visual clarity
        }}
      >
        <div className={styles.tableHeader} style={{ position: "sticky", top: 0, background: "white" }}> {/* Sticky header */}
          <div>Bond</div>
          <div>Created</div>
          <div>Interest Rate</div>
          <div>Total Unit offered</div>
          {/* <div>Unit available</div> */}
          <div>Action</div>
        </div>

        {/* 8. Use 'bondsLoading' for the *initial* load */}
        {bondsLoading ? (
          <p>Loading bonds...</p>
        ) : bonds.length === 0 ? (
          <p>No active offerings found.</p>
        ) : (
          bonds.map((bond: any, index: number) => {
            // 9. Attach the ref to the *last* element in the *current* list
            if (bonds.length === index + 1) {
              return (
                <div ref={lastBondElementRef} key={bond.id} className={styles.tableRow}>
                  {/* ... (render bond row) ... */}
                  <div className={styles.bondCell}>
                    <div className={styles.bondIconWrapper}>
                      <Image src="/logo.png" alt="Bond Icon" width={32} height={32} />
                      <div className={styles.availabilityDot}></div>
                    </div>
                    <span>{bond.bond_name}</span>
                  </div>
                  <div>{new Date(bond.created_at).toLocaleDateString()}</div>
                  <div className={styles.interestCell}>{bond.interest_rate || "—"}</div>
                  <div>{bond.tl_unit_offered}</div>
                  {/* <div>{bond.tl_units_available || "—"}</div> Fixed this from original code */}
                  <div>
                    <Link href={`/admin/bonds/${bond.id}`} className={styles.actionButton}>
                      <IoDocumentTextOutline />
                    </Link>
                  </div>
                </div>
              );
            } else {
              // This is a normal row
              return (
                <div key={bond.id} className={styles.tableRow}>
                  {/* ... (render bond row) ... */}
                   <div className={styles.bondCell}>
                    <div className={styles.bondIconWrapper}>
                      <Image src="/logo.png" alt="Bond Icon" width={32} height={32} />
                      <div className={styles.availabilityDot}></div>
                    </div>
                    <span>{bond.bond_name}</span>
                  </div>
                  <div>{new Date(bond.created_at).toLocaleDateString()}</div>
                  <div className={styles.interestCell}>{bond.interest_rate || "—"}</div>
                  <div>{bond.tl_unit_offered}</div>
                  {/* <div>{bond.unit_available || "—"}</div> Fixed this from original code */}
                  <div>
                    <Link href={`/admin/bonds/${bond.id}`} className={styles.actionButton}>
                      <IoDocumentTextOutline />
                    </Link>
                  </div>
                </div>
              );
            }
          })
        )}
        
        {/* 10. Show a "loading more" spinner at the bottom */}
        {loadingMore && <p style={{ textAlign: "center", padding: "1rem" }}>Loading more...</p>}
      </div>
    </div>
  );
}