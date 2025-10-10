"use client";
import Image from "next/image";

export default function BondsSection() {
  const bonds = [
    { name: "RICB Bond", rate: "+5% yr", amount: "Nu 1,000,000" },
    { name: "GMC Bond", rate: "+7% yr", amount: "Nu 1,000,000,000" },
    { name: "RTA Bond", rate: "+5% yr", amount: "Nu 5,000,000" },
    { name: "GovTech Bond", rate: "+2% yr", amount: "Nu 60,000" },
  ];

  const rows = [
    { name: "RICB Bond", rate: "+ 5% yr", total: "1000", available: "900/1000", face: "1.5M", status: "up" },
    { name: "RICB Bond", rate: "+ 5% yr", total: "1000", available: "1000/1000", face: "50M", status: "up" },
    { name: "RICB Bond", rate: "+ 5% yr", total: "1000", available: "305/1000", face: "5Lhaks", status: "down", disabled: true },
    { name: "RICB Bond", rate: "+ 5% yr", total: "1000", available: "306/1000", face: "9M", status: "down", disabled: true },
    { name: "RICB Bond", rate: "+ 5% yr", total: "1000", available: "2000/1000", face: "8M", status: "up" },
    { name: "RICB Bond", rate: "+ 5% yr", total: "1000", available: "309/1000", face: "7M", status: "up" },
  ];

  return (
    <main className="bg-white w-full">
      {/* BONDS SECTION */}
      <section className="w-full bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* LEFT CARD */}
            <div className="bg-white border border-gray-200 rounded-2xl px-6 sm:px-8 py-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[15px] font-semibold text-gray-800">
                  Newly added bonds
                </h2>
                <span className="flex-1 ml-3 h-[2px] bg-indigo-700 rounded"></span>
              </div>

              <ul className="space-y-3 sm:space-y-4">
                {bonds.map((bond, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-[14px] sm:text-sm text-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src="/logo.png"
                        alt={bond.name}
                        width={22}
                        height={22}
                        className="object-contain"
                      />
                      <span className="font-medium">{bond.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green-500 font-medium">
                        {bond.rate}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {bond.amount}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT CARD */}
            <div className="bg-white border border-gray-200 rounded-2xl px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex-shrink-0">
                <Image
                  src="/coin.png"
                  alt="BTN Coin"
                  width={90}
                  height={90}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-[15px] sm:text-lg font-semibold text-gray-800 leading-snug">
                  Turn your Ngultrum into Digital BTN Coins
                </h3>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                  Subscribe instantly, own your share of Bhutan’s digital future.
                </p>
                <button className="mt-4 bg-[#2F2A7B] hover:bg-[#4338CA] text-white px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 shadow-sm hover:shadow">
                  Get BTN Coins Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOKEN TABLE SECTION */}
      <section className="w-full mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-[28px] sm:text-[30px] font-extrabold tracking-tight text-neutral-900">
                Token available
              </h2>
              <p className="mt-2 text-[13px] sm:text-sm text-neutral-600 max-w-3xl">
                View real-time prices, trading volumes, market changes, and capitalization
                of all listed companies on the Royal Securities Exchange of Bhutan (RSEB).
              </p>
            </div>

            {/* Search + Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input
                  className="h-10 w-[270px] rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-neutral-200"
                  placeholder="Search"
                />
              </div>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                aria-label="Filter"
                title="Filter"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 10h4M18 16h4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-x-auto rounded-2xl">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-[13px] text-neutral-500">
                  <th className="py-3 pr-3 pl-2 font-medium">Bond</th>
                  <th className="py-3 px-3 font-medium">Interest Rate</th>
                  <th className="py-3 px-3 font-medium">Total Unit offered</th>
                  <th className="py-3 px-3 font-medium">Unit available</th>
                  <th className="py-3 px-3 font-medium">Face value(Nu)</th>
                  <th className="py-3 pl-3 pr-2 font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100">
                {rows.map((row, i) => {
                  const dim = row.disabled ? "text-neutral-300" : "text-neutral-900";
                  const rateCol = row.disabled ? "text-neutral-300" : "text-emerald-600";

                  return (
                    <tr key={i} className="align-middle">
                      {/* Bond */}
                      <td className="py-5 pr-3 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-full border border-neutral-200 bg-white grid place-items-center">
                            <Image
                              src="/RSEB.png"
                              alt="Bond"
                              width={22}
                              height={22}
                              className={`object-contain ${row.disabled ? "opacity-40" : ""}`}
                            />
                            <span
                              className={`absolute -bottom-0.5 left-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                                row.status === "up"
                                  ? "bg-emerald-500"
                                  : row.status === "down"
                                  ? "bg-red-500"
                                  : "bg-neutral-300"
                              }`}
                            />
                          </div>

                          <span className={`text-[15px] font-medium ${dim}`}>
                            {row.name}
                          </span>
                        </div>
                      </td>

                      {/* Interest */}
                      <td className={`py-5 px-3 text-[14px] font-medium ${rateCol}`}>
                        {row.rate}
                      </td>

                      <td className={`py-5 px-3 text-[14px] ${dim}`}>{row.total}</td>
                      <td className={`py-5 px-3 text-[14px] ${dim}`}>{row.available}</td>
                      <td className={`py-5 px-3 text-[14px] ${dim}`}>{row.face}</td>

                      <td className="py-5 pl-3 pr-2">
                        <button
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 focus:outline-none"
                          aria-label="Open"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14 3v5h5"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
