"use client"

import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { IoSearch, IoDocumentTextOutline } from 'react-icons/io5';
import { useEffect, useState,  useRef,  useCallback } from 'react';
import { fetchBond, fetchBonds } from '@/server/bond/creation';

const AssetsPage = () => {
  const [bonds, setBonds] = useState<any[]>([]); // 1. Ensure bonds is an array

  // 2. Use separate loading states
  const [bondsLoading, setBondsLoading] = useState(true); // For initial page
  const [loadingMore, setLoadingMore] = useState(false); // For subsequent pages

  // 3. Add pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Tracks if more bonds are available
  const BONDS_PER_PAGE = 15; // Define how many bonds to fetch per page

  // 4. Effect for *initial* bonds load (runs once)
  useEffect(() => {
    async function getInitialBonds() {
      setBondsLoading(true);
      try {
        const data = await fetchBonds(1, BONDS_PER_PAGE, true);
        setBonds(data);
        setPage(2); // Set the *next* page to fetch
        setHasMore(data.length === BONDS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching bonds:", error);
      } finally {
        setBondsLoading(false);
      }
    }
    getInitialBonds();
  }, []); // Empty dependency array ensures this runs only once

  // 5. Function to load more bonds
  const loadMoreBonds = async () => {
    if (loadingMore || !hasMore) return; // Don't fetch if already fetching or no more data

    setLoadingMore(true);
    try {
      const data = await fetchBonds(page, BONDS_PER_PAGE, false);
      setBonds((prevBonds) => [...prevBonds, ...data]); // Append new bonds
      setPage((prevPage) => prevPage + 1);
      setHasMore(data.length === BONDS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching more bonds:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // 6. Setup the Intersection Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastBondElementRef = useCallback(
    (node: HTMLDivElement) => { // This is the trigger element
      if (bondsLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreBonds();
        }
      });

      if (node) observer.current.observe(node);
    },
    [bondsLoading, loadingMore, hasMore]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Allocated Bonds</h1>
        <div className={styles.searchWrapper}>
          <IoSearch className={styles.searchIcon} />
          <input type="text" placeholder="Search" className={styles.searchInput} />
        </div>
      </div>

      {/* 7. CRITICAL CSS: Add max-height and overflow-y to make this div scrollable */}
      <div
        className={styles.tableContainer}
        style={{
          maxHeight: "70vh", // Or any height you prefer (e.g., 70% of viewport height)
          overflowY: "auto",  // Enables vertical scrolling
        }}
      >
        <div className={styles.tableHeader}>
          <div>Bond</div>
          <div>Interest Rate</div>
          <div>Total Unit offered</div>
          <div>Total Units Subscribed</div>
          <div>Action</div>
        </div>

        {/* 8. Show initial loading message */}
        {bondsLoading && <p style={{ padding: '20px', textAlign: 'center' }}>Loading bonds...</p>}
        
        {/* 9. Map over the bonds */}
        {!bondsLoading && bonds.length === 0 && (
          <p style={{ padding: '20px', textAlign: 'center' }}>No bonds found in your ledger.</p>
        )}

        {bonds.map((bond: any, index: number) => {
          // 10. Attach the ref to the *last* element
          if (bonds.length === index + 1) {
            return (
              <div ref={lastBondElementRef} key={bond.id} className={styles.tableRow}>
                {/* ... (render bond row) ... */}
                <div className={styles.bondCell}>
                  <div className={styles.bondIconWrapper}>
                    <Image src="/logo.png" alt="Bond Icon" width={32} height={32} />
                    <div className={`${styles.statusDot} ${styles[bond.status]}`}></div>
                  </div>
                  <span className={bond.status === 'inactive' ? styles.inactiveText : ''}>
                    {bond.bond_name}
                  </span>
                </div>
                <div className={styles.interestCell}>{bond.interest_rate}</div>
                <div>{bond.tl_unit_offered}</div>
                <div>{bond.tl_unit_subscribed}</div>
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
                    <div className={`${styles.statusDot} ${styles[bond.status]}`}></div>
                  </div>
                  <span className={bond.status === 'inactive' ? styles.inactiveText : ''}>
                    {bond.bond_name}
                  </span>
                </div>
                <div className={styles.interestCell}>{bond.interest_rate}</div>
                <div>{bond.tl_unit_offered}</div>
                <div>{bond.tl_unit_subscribed}</div>
                <div>
                  <Link href={`/admin/bonds/${bond.id}`} className={styles.actionButton}>
                    <IoDocumentTextOutline />
                  </Link>
                </div>
              </div>
            );
          }
        })}

        {/* 11. Show "loading more" spinner at the bottom */}
        {loadingMore && <p style={{ padding: '20px', textAlign: 'center' }}>Loading more...</p>}
      </div>
    </div>
  );
};

export default AssetsPage;