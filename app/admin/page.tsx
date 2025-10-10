"use client";
import Image from "next/image";

export default function UserPage() {
  return (
    <main className="min-h-screen bg-white text-[#0f172a]">
      {/* TOP BAR */}
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-6xl flex items-center justify-between h-14 px-4">
          {/* logo placeholder */}
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-slate-200 flex items-center justify-center text-[10px] text-slate-500">
              LOGO
            </div>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <a className="text-slate-600 hover:text-slate-900" href="#">About us</a>
            <button className="rounded-full border border-slate-300 px-4 py-1.5 text-slate-700 hover:bg-slate-50">
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* HERO GRID (3 cols) */}
      <section className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* left big purple card */}
        <div className="rounded-2xl p-8 text-white shadow-sm bg-gradient-to-br from-[#6348ff] to-[#1f2ccf]">
          <p className="text-[11px] mb-2 opacity-70">Invest in the nation's growth</p>
          <h1 className="text-4xl leading-[1.15] font-semibold">
            Bhutan&apos;s <br /> Digital <br /> Bond <br /> Market
          </h1>
          <p className="mt-3 text-[12px] opacity-85">
            With secure, transparent digital bonds.
          </p>
        </div>

        {/* middle stack: Mission (top) + Claim (bottom) */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-[#e5f0ff] p-6 shadow-sm">
            <h2 className="text-[22px] font-bold text-[#1f2ccf]">Mission</h2>
            <p className="mt-2 text-[12px] leading-5 text-slate-700">
              “To develop and establish a fair, orderly and transparent securities
              market with the objective to facilitate efficient mobilization and
              allocation of capital and ensure apt regulation to maintain market
              integrity and investor confidence”
            </p>
          </div>

          <div className="rounded-2xl bg-[#121525] p-5 text-white shadow-md">
            <div className="flex items-start gap-4">
              {/* small image placeholder */}
              <div className="h-20 w-24 rounded-lg bg-slate-700/60 flex items-center justify-center text-[10px]">
                IMG
              </div>
              <div>
                <h3 className="text-lg font-extrabold">Claim Your<br/>Unclaimed Funds</h3>
                <p className="mt-2 text-[12px] leading-5 text-slate-200">
                  The Royal Securities Exchange of Bhutan (RSEB) is safeguarding
                  Nu. 84.7 million in unclaimed funds, including Nu. 75.8 million
                  in dividends from 14 listed companies and Nu. 9.9 million in
                  share proceeds from 5 delisted companies.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* right: Vision (top) */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-[#e7dcff] p-6 shadow-sm">
            <h2 className="text-[22px] font-bold text-[#5b28ff]">Vision</h2>
            <p className="mt-2 text-[12px] leading-5 text-slate-700">
              “To become an integral part of the financial system and participate
              in the nation building”
            </p>
          </div>
          {/* empty to match spacing of left column height visually */}
          <div className="hidden md:block" />
        </div>
      </section>

      {/* ABOUT + 3 FEATURE CARDS */}
      <section className="mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* About text */}
        <div className="md:col-span-2">
          <h3 className="text-[22px] font-extrabold mb-2">About RSEB</h3>
          <p className="text-[12px] leading-6 text-slate-700">
            The Royal Securities Exchange of Bhutan (RSEB), established in August 1993
            under the Royal Monetary Authority, began trading on 11 October the same year.
            Its aim is to promote share ownership, mobilize savings, raise equity, and
            provide liquidity. Supported by the Asian Development Bank, it was later
            incorporated under the Companies Act 2000 and is regulated by the Financial
            Services Act 2011. RSEB became autonomous in 1996 and now operates with five
            brokerage firms—subsidiaries of four financial institutions plus DrukYul
            Securities Broker Pvt. Ltd. Shareholders increased from 1,829 in 1993 to over
            62,610 by 2018, with listed companies rising from four to 21 and market
            capitalization from Nu. 493.40 million to Nu. 28.36 billion. In April 2012,
            RSEB introduced the Integrated System, developed by InfoTech Pvt. Ltd. with
            World Bank support, replacing the manual system and improving market efficiency.
          </p>
        </div>

        {/* three square cards */}
        <div className="flex flex-col gap-4">
          {/* center big logo card */}
          <div className="rounded-2xl border shadow-sm bg-white p-6 flex items-center justify-center">
            <div className="h-24 w-40 rounded-md bg-slate-200 flex items-center justify-center text-[11px] text-slate-600">
              RSEB LOGO (IMG)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#e5f0ff] p-6 text-center shadow-sm">
              <div className="h-10 w-10 mx-auto rounded-full bg-slate-200 mb-3 flex items-center justify-center text-[10px]">ICON</div>
              <p className="text-sm font-semibold text-[#1f82ff]">SUI<br/>Blockchain</p>
            </div>
            <div className="rounded-2xl bg-[#e9dcff] p-6 text-center shadow-sm">
              <div className="h-10 w-10 mx-auto rounded-full bg-slate-200 mb-3 flex items-center justify-center text-[10px]">ICON</div>
              <p className="text-sm font-semibold text-[#6a33ff]">Secure<br/>wallet</p>
            </div>
          </div>
        </div>
      </section>

      {/* PURPLE GRADIENT STRIPE */}
      <section className="mt-10 w-full">
        <div className="bg-gradient-to-r from-[#5d39ff] via-[#7138ff] to-[#2e2b8f] text-white">
          <div className="mx-auto max-w-6xl px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* left decorative blob placeholder */}
            <div className="hidden md:block">
              <div className="h-56 w-56 rounded-full bg-white/20 blur-sm" />
            </div>

            {/* text & two feature cards */}
            <div>
              <span className="inline-block text-[10px] tracking-wide uppercase bg-white/15 px-3 py-1 rounded-full">
                Innovation &amp; Resilience
              </span>
              <h3 className="mt-3 text-2xl font-extrabold leading-snug">
                The Future of <br/> Scalable Blockchain.
              </h3>
              <p className="mt-3 text-[12px] leading-6 text-white/90">
                Sui harnesses cutting-edge architecture and parallel transaction processing to deliver
                unmatched speed, security, and efficiency—paving the way for a new era of decentralized
                applications and digital assets.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/95 text-slate-800 p-5">
                  <h4 className="font-semibold">High Performance</h4>
                  <p className="mt-2 text-[12px] text-slate-600">
                    Experience lightning-fast transactions powered by Sui’s unique object-centric
                    model and horizontal scalability.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/95 text-slate-800 p-5">
                  <h4 className="font-semibold">Secure by Design</h4>
                  <p className="mt-2 text-[12px] text-slate-600">
                    Designed with security at its core to protect users and assets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY + ANGLED GOAL CARD */}
      <section className="mx-auto max-w-6xl px-4 py-14 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-[20px] font-extrabold mb-3">Our story</h3>
          <p className="text-[12px] leading-6 text-slate-700">
            Founded in 2023, RSEB Bhutan was born out of a vision to simplify and modernize Bhutan’s
            energy and resources sector. For years, stakeholders from businesses to individuals faced
            challenges in accessing transparent, reliable, and efficient energy-related services.
            What began as an initiative to bridge these gaps has grown into a trusted platform that
            empowers communities, supports sustainable practices, and fosters economic growth. Today,
            RSEB Bhutan plays a vital role in streamlining processes, enhancing accessibility, and
            driving innovation within the sector. As we continue our journey, we remain committed to
            building a future where technology and sustainability work hand in hand—delivering meaningful
            impact for Bhutan and beyond.
          </p>
        </div>

        {/* angled card look w/ drop shadow */}
        <div className="relative">
          <div className="rotate-3 rounded-2xl bg-[#efeaff] p-6 shadow-[0_25px_40px_-12px_rgba(34,0,84,0.25)]">
            <h4 className="font-bold text-[#5b28ff]">Our Goal at RSEB Bhutan</h4>
            <p className="mt-2 text-[12px] text-slate-700">
              The RSEB provides a platform for equity capital, encourages wider share ownership,
              and manages unclaimed funds for shareholders.
            </p>
          </div>
        </div>
      </section>

      {/* CORE VALUE SECTION */}
      <section className="mx-auto max-w-6xl px-4 pt-4 pb-16">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* three purple gradient tiles (left column on screenshot) */}
          <div className="space-y-6">
            {[
              { t: "Transparency", d: "We uphold openness and accountability, fostering trust among all stakeholders." },
              { t: "Sustainability", d: "We are dedicated to protecting the environment and ensuring long-term growth." },
              { t: "Innovation", d: "We embrace technology and creativity to drive progress in Bhutan’s energy sector." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl p-6 text-white bg-gradient-to-br from-[#5b28ff] to-[#2e2b8f] shadow">
                <h5 className="text-lg font-semibold">{c.t}</h5>
                <p className="mt-2 text-[12px] text-white/90">{c.d}</p>
              </div>
            ))}
          </div>

          {/* huge headline in middle (spans visually) */}
          <div className="flex items-start justify-center">
            <h2 className="text-[48px] md:text-[56px] leading-none font-extrabold text-slate-900 text-center md:text-left">
              Our Core Value
            </h2>
          </div>

          {/* right mission paragraph stack */}
          <div className="text-center md:text-right text-[14px] text-slate-700">
            <p>The principles that guide everything we do at RSEB</p>
            <div className="mt-8 leading-7">
              Our <span className="font-bold">mission</span> is to build trust, drive
              progress, and <span className="font-bold">create</span> a resilient future
              where innovation, sustainability, and community empowerment go hand in hand
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#221f4b] text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* left block */}
          <div className="flex gap-3">
            <div className="h-12 w-12 rounded-full bg-white/90 text-[#221f4b] flex items-center justify-center text-[10px]">LOGO</div>
            <div className="text-sm">
              <div className="font-bold">Claim Your<br/>Unclaimed Funds</div>
            </div>
          </div>

          {/* middle links */}
          <div className="flex items-center justify-center">
            <ul className="flex gap-6 text-[12px] text-white/80">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">About RSEB</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          {/* right contacts + feedback */}
          <div className="text-[12px]">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-white/80">Call us :</div>
                <div className="mt-1">+975 17495130</div>
              </div>
              <div>
                <div className="text-white/80">Email :</div>
                <div className="mt-1">note@gmail.com</div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <input
                className="flex-1 rounded-md bg-white/95 text-slate-800 px-3 py-2 text-[12px] placeholder:text-slate-400"
                placeholder="Write your feedback"
              />
              <button className="h-9 w-9 rounded-md bg-white/90 text-[#221f4b] text-xs font-bold">▶</button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20">
          <p className="mx-auto max-w-6xl px-4 py-3 text-center text-[10px] text-white/70">
            ©2025 Royal Securities Exchange of Bhutan. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
