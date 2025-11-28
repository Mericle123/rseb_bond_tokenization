"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/context/UserContext";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { fetchPendingSubscriptionsForUser } from "@/server/blockchain/bond"; // path from step 1
import { motion } from "framer-motion";

const nf = new Intl.NumberFormat("en-IN");

type PendingSubscription = Awaited<
  ReturnType<typeof fetchPendingSubscriptionsForUser>
>[number];

export default function PendingSubscriptionsPage() {
  const currentUser = useCurrentUser();
  const [items, setItems] = useState<PendingSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;

    (async () => {
      setLoading(true);
      try {
        const data = await fetchPendingSubscriptionsForUser(currentUser.id);
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser?.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F7F8FB]">
        <InvestorSideNavbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 text-lg">Loading pending subscriptions…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FB]">
      <InvestorSideNavbar/>

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Pending Subscriptions
          </h1>
          <p className="text-gray-600 mt-1">
            These are your bond subscriptions that have not been allocated yet.
          </p>
        </header>

        {items.length === 0 ? (
          <div className="mt-10 text-center text-gray-500">
            You have no pending subscriptions.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700">
                {items.length} subscription(s) awaiting allocation
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Bond
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Committed Amount
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Interest
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Subscribed At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/60">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">
                          {s.bond.bond_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {s.bond.organization_name} • {s.bond.bond_symbol}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {nf.format(Number(s.committed_amount) / 10)} units
                      </td>
                      <td className="px-4 py-3">
                        {s.bond.interest_rate}% p.a.
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(s.created_at).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
