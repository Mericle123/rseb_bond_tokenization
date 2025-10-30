"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { IoSearch, IoDocumentTextOutline } from "react-icons/io5";
import { FaPlus, FaSackDollar } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { BsFileEarmarkTextFill } from "react-icons/bs";
import { fetchBond } from "@/server/bond/creation";


export default function AdminHomePage() {
  const [bonds, setBonds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBonds() {
      try {
        const data = await fetchBond();
 
        setBonds(data);
        console.log("bond: ", data)
      } catch (error) {
        console.error("Error fetching bonds:", error);
      } finally {
        setLoading(false);
      }
    }
    getBonds();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>System Overview</h1>

      {/* Overview Section */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "#E4E2FB" }}>
            <BsFileEarmarkTextFill color="#5A4BDA" />
          </div>
          <div>
            <p className={styles.statLabel}>Total Active Offerings</p>
            <p className={styles.statValue}>{bonds.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "#E4E2FB" }}>
            <FaSackDollar color="#5A4BDA" />
          </div>
          <div>
            <p className={styles.statLabel}>Total Active Value</p>
            <p className={styles.statValue}>Nu 10 K</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "#E4E2FB" }}>
            <FaUserFriends color="#5A4BDA" />
          </div>
          <div>
            <p className={styles.statLabel}>Total Registered Users</p>
            <p className={styles.statValue}>10,000</p>
          </div>
        </div>
      </div>

      {/* Active Offerings Section */}
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
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div>Bond</div>
          <div>Created</div>
          <div>Interest Rate</div>
          <div>Total Unit offered</div>
          <div>Unit available</div>
          <div>Action</div>
        </div>

        {loading ? (
          <p>Loading bonds...</p>
        ) : bonds.length === 0 ? (
          <p>No active offerings found.</p>
        ) : (
          bonds.map((bond: any) => (
            <div key={bond.id} className={styles.tableRow}>
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
              <div>{bond.tl_unit_offered || "—"}</div>
              <div>
                <Link href={`/admin/bonds/${bond.id}`} className={styles.actionButton}>
                  <IoDocumentTextOutline />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
