import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function About() {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = "Every product tells a story. Every purchase supports a dream.";

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  // NEW LIGHT COLOR SCHEME:
  // Primary: Soft Lavender/Dusty Rose (e.g., text-fuchsia-400 or text-purple-300 in dark mode)
  // Accent: Muted Gold/Light Peach (e.g., text-amber-300)
  // Backgrounds: Very light grey in light mode, dark grey/black in dark mode

  const PRIMARY_COLOR_LIGHT = "pink-600"; // Used in light mode
  const PRIMARY_COLOR_DARK = "fuchsia-400"; // Used in dark mode (light, vibrant color)
  const ACCENT_GRADIENT_START = "from-fuchsia-300";
  const ACCENT_GRADIENT_MIDDLE = "via-purple-400";
  const ACCENT_GRADIENT_END = "to-pink-400";

  // Dynamic class helper
  const getPrimaryText = () => `text-${PRIMARY_COLOR_LIGHT} dark:text-${PRIMARY_COLOR_DARK}`;
  const getPrimaryBg = () => `bg-${PRIMARY_COLOR_LIGHT} dark:bg-${PRIMARY_COLOR_DARK}`;
  const getGradient = () => `bg-gradient-to-r ${ACCENT_GRADIENT_START} ${ACCENT_GRADIENT_MIDDLE} ${ACCENT_GRADIENT_END}`;


  return (
    <div className="bg-white dark:bg-gray-950 font-display text-gray-800 dark:text-gray-200">

      {/* ================= HERO SECTION (Clean, Open Look) ================= */}
      <div className="w-full @container pt-20">
        <div className="@[480px]:p-4 lg:p-6">
          <div
            className="flex min-h-[550px] flex-col gap-8 bg-cover bg-center bg-no-repeat @[480px]:gap-10 @[480px]:rounded-3xl items-center justify-center p-6 text-center shadow-lg dark:shadow-2xl"
            style={{
              backgroundImage:
                // Lighter overlay for a soft/clean look
                `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6)) dark:linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)),
                url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVTSeTmVoymS9NF7xvVRR87fR5fJ4dUx2A_WOoht_b7R4cZJ842YrPWCnbea7hWFnfRamO1EVyXF4Re1q1-Nq9pddw6ld0pTfit33zW5G2APF7_GRF5tsl-jPUBZmn4MEaN5zIfBG0yW-yHqwBYGV8KXEm48UQbgr4Kq8lwKMPp9-qFTEFEB0ILvniZ-5SGzu1AgqodNXwoA59oOI7_bQNALGEYFwGrnDHSiGwLhYFrLAbcicYudSdCRCFLU5qcxBcmjJZSBRvopjZ")`
            }}
          >
            <div className="flex flex-col gap-4 max-w-4xl">
              {/* Text contrast adjusted to be visible over light overlay */}
              <h1 className="text-gray-900 dark:text-white font-serif text-5xl font-extrabold leading-snug tracking-normal @[480px]:text-7xl drop-shadow-md">
                The Art of Gifting, Curated for You
              </h1>
              <h2 className="text-gray-700 dark:text-gray-300 font-light text-lg @[480px]:text-xl mt-2 drop-shadow-sm">
                Discover unique, handcrafted treasures designed to make every moment memorable and cherished.
              </h2>
            </div>

            <div className="flex-wrap gap-4 flex justify-center mt-4">
              <Link
                to="/products"
                className={`flex min-w-[150px] items-center justify-center rounded-xl h-12 px-6 
                @[480px]:h-14 @[480px]:px-8 ${getPrimaryBg()} text-white text-base font-semibold 
                @[480px]:text-lg hover:opacity-90 transition-all duration-300 shadow-lg`}
              >
                Explore Gifts
              </Link>

              <Link
                to="/vendor/register"
                className="flex min-w-[150px] items-center justify-center rounded-xl h-12 px-6 
                @[480px]:h-14 @[480px]:px-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 text-base font-semibold 
                @[480px]:text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                Become a Maker
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= OUR STORY (Refined Look) ================= */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="flex flex-col items-center text-center gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-gray-900 dark:text-white font-serif text-3xl md:text-5xl font-extrabold">
              Our <span className={getPrimaryText()}>Philosophy</span>
            </h2>
            {/* Thicker, light separator using the gradient */}
            <div className={`w-28 h-1.5 ${getGradient()} mx-auto rounded-full`}></div>
          </div>
          
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-10 md:p-16 shadow-2xl border border-gray-100 dark:border-gray-800">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className={`${getGradient()} text-white px-8 py-3 rounded-full text-base font-semibold shadow-2xl`}>
                ✨ The Heart of Craft
              </div>
            </div>
            
            <div className="mt-4">
              {/* Typewriter text with elegant, italic font and new colors */}
              <p className={`text-gray-700 dark:text-gray-300 font-serif text-xl md:text-2xl leading-relaxed text-center italic font-light mb-10`}>
                "{displayedText}"
                {currentIndex < fullText.length && (
                  <span className={`animate-pulse ${getPrimaryText()}`}>|</span>
                )}
              </p>
              
              <div className="h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-10"></div>
              
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed text-center font-light">
                We started with a simple belief: that every handmade product carries the soul of its creator. 
                Our platform was born to bridge the gap between talented artisans and people who appreciate 
                authentic, meaningful craftsmanship. We're not just building a marketplace - we're building 
                a community where creativity thrives and stories are shared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION & VALUES (Icon Card Refinement) ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="flex flex-col gap-14 @container">
          <div className="text-center flex flex-col gap-6 items-center">
            <div className="flex flex-col gap-4">
              <h1 className="text-gray-900 dark:text-white font-serif text-3xl md:text-5xl font-extrabold">
                Our <span className={getPrimaryText()}>Mission</span> & Values
              </h1>
              <div className={`w-32 h-1.5 ${getGradient()} mx-auto rounded-full`}></div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 max-w-3xl text-xl font-light">
              Guided by purpose, driven by passion. Our core principles shape everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* CARD 1 */}
            <div className="group relative bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:-translate-y-2">
              <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${getGradient()}`} style={{ opacity: 0.05 }}></div>
              <div className="relative z-10 flex flex-col items-center text-center gap-6">
                <div className={`w-18 h-18 ${getGradient()} rounded-3xl flex items-center justify-center shadow-xl`}>
                  <span className="material-symbols-outlined text-4xl text-white">grade</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h2 className={`font-serif font-bold text-2xl text-gray-900 dark:text-white group-hover:${getPrimaryText()} transition-colors`}>
                    Exceptional Quality
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                    We celebrate exceptional craftsmanship and attention to detail in every product we feature.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="group relative bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:-translate-y-2">
              <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${getGradient()}`} style={{ opacity: 0.05 }}></div>
              <div className="relative z-10 flex flex-col items-center text-center gap-6">
                <div className={`w-18 h-18 ${getGradient()} rounded-3xl flex items-center justify-center shadow-xl`}>
                  <span className="material-symbols-outlined text-4xl text-white">handshake</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h2 className={`font-serif font-bold text-2xl text-gray-900 dark:text-white group-hover:${getPrimaryText()} transition-colors`}>
                    Conscious Commerce
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                    Creating meaningful connections between creators and appreciators of handmade art.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="group relative bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:-translate-y-2">
              <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${getGradient()}`} style={{ opacity: 0.05 }}></div>
              <div className="relative z-10 flex flex-col items-center text-center gap-6">
                <div className={`w-18 h-18 ${getGradient()} rounded-3xl flex items-center justify-center shadow-xl`}>
                  <span className="material-symbols-outlined text-4xl text-white">local_florist</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h2 className={`font-serif font-bold text-2xl text-gray-900 dark:text-white group-hover:${getPrimaryText()} transition-colors`}>
                    Ethical Sourcing
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                    Promoting ethical practices and environmental consciousness in every aspect of our work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TEAM (More Elegant Profiles) ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="text-center flex flex-col items-center gap-14">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
                Meet <span className={getPrimaryText()}>Our Curators</span>
              </h2>
              <div className={`w-28 h-1.5 ${getGradient()} mx-auto rounded-full`}></div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 max-w-3xl text-xl font-light">
              The passionate minds behind our mission to revolutionize meaningful, handmade commerce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
            {/* MEMBER 1 */}
            <div className="group flex flex-col items-center gap-8 p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:-translate-y-2">
              <div className="relative">
                <div className={`w-36 h-36 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl group-hover:border-${PRIMARY_COLOR_DARK} transition-all duration-300`}>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkfPvdo5372kWVKbGcm17QMGGofovxZNi4Pjf7AH1melrGuNrcjrwcdnmeflruX-oYM3fZ3I-_tPABqFvNG7avbonyjkaCdYYKOMIE0uh5T8eE0G_cAM5Hl0m29m4k4NPWZo99FzkKWrlYqs7PKyX45ZhzniLJj6o95v9GdoN_PR1dlLfj5EBsshPG9x_VjzQm4b0V2Vl7ag6NtkZ3S0QNxco67IWrRb9ZD_MXEvMxHcHEuJmOWIsUyjQEBJFFPWsaqrPwlKkTik6V"
                    alt="Alex Johnson"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 ${getGradient()} text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-lg`}>
                  Visionary
                </div>
              </div>
              <div className="text-center">
                <h3 className={`font-serif font-bold text-2xl text-gray-900 dark:text-white group-hover:${getPrimaryText()} transition-colors mb-2`}>Alex Johnson</h3>
                <p className={`${getPrimaryText()} font-semibold text-base mb-3`}>Founder & CEO</p>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed font-light">
                  Visionary leader passionate about creating opportunities for artisans worldwide.
                </p>
              </div>
            </div>

            {/* MEMBER 2 */}
            <div className="group flex flex-col items-center gap-8 p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:-translate-y-2">
              <div className="relative">
                <div className={`w-36 h-36 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl group-hover:border-${PRIMARY_COLOR_DARK} transition-all duration-300`}>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ3K1B0k9cyhmIx00pUncDEQq-4mXXRWaNvxLAkWjxqMmYaoDIT2IPl_qcRI_OxL-y4XtC-RgMjZI6XVFjJ1W3mLEVjrKGms9iWpjcTlNkHgfFiOBAfj366ykE_UU_qsaMdocu6iGx7Musw5-6MrKetEcSntbSbDHm9HObqG64lgoiey60GWUqY6hq_Iydd9YJaPjrZuCT8l1d0iKxQnbNltp6LOxrRRPP4UAFZuWVH3qkxZ6jjTzcLMq67LxhkdwvGWSSSNrLUH04"
                    alt="Maria Garcia"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 ${getGradient()} text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-lg`}>
                  Curator
                </div>
              </div>
              <div className="text-center">
                <h3 className={`font-serif font-bold text-2xl text-gray-900 dark:text-white group-hover:${getPrimaryText()} transition-colors mb-2`}>Maria Garcia</h3>
                <p className={`${getPrimaryText()} font-semibold text-base mb-3`}>Head of Curation</p>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed font-light">
                  Bringing an artistic eye and deep appreciation for traditional craftsmanship.
                </p>
              </div>
            </div>

            {/* MEMBER 3 */}
            <div className="group flex flex-col items-center gap-8 p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:-translate-y-2">
              <div className="relative">
                <div className={`w-36 h-36 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl group-hover:border-${PRIMARY_COLOR_DARK} transition-all duration-300`}>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDtrBaF1RnLAy5YPh9vZN8TFs7jkb11S1cHzIutqc0-7NQXSUAo0eLG067FQXdOZIxH2ApcoA-ignXJQijJUBBebi27wZFKs7-NIkkrAC3qwh7R0eldNSJE_qsBM19DA9kT62fMCrS7nr_cVnuOZadAfdFk4Ev4D5sKpiMH8LHrEecxku3yToOiqtwFRcrbMV4e0LjwdmtMgrtLZJp4vNwSIsmNwWCVWI5AdSlTutNpHOhVKczs9ZQJxcIcIFTnJqDpC4hWYtgZ2tF"
                    alt="David Chen"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 ${getGradient()} text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-lg`}>
                  Developer
                </div>
              </div>
              <div className="text-center">
                <h3 className={`font-serif font-bold text-2xl text-gray-900 dark:text-white group-hover:${getPrimaryText()} transition-colors mb-2`}>David Chen</h3>
                <p className={`${getPrimaryText()} font-semibold text-base mb-3`}>Lead Developer</p>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed font-light">
                  Building the technology that makes artisan-commerce accessible to everyone.
                </p>
              </div>
            </div>

            {/* MEMBER 4 */}
            <div className="group flex flex-col items-center gap-8 p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:-translate-y-2">
              <div className="relative">
                <div className={`w-36 h-36 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl group-hover:border-${PRIMARY_COLOR_DARK} transition-all duration-300`}>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAchSpgOR-EfMOFs3s7TRCrYD3V-xHe2ax9kqnD_ZFeMJzwLKhp1Af2hnzZA3WZkSOJocySe5stVrojJcyw1kZHJRGqGsa6Rja_DDFx1USFw0P2GzGRadrv5bl-amQGGX1RHAIe_EctAsJ35T4HGP8WeUT4frC6xiEtRLiimdprf4mgYxg80Oobsx_GPZo69bfoCIGBmrb1mtOVZ5R8o6d58O97AdydqWWww3YE5IC1yDJDCvQmG7LIyDgbQZtvEd8DTyfEbTX8a9WK"
                    alt="Emily White"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 ${getGradient()} text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-lg`}>
                  Community
                </div>
              </div>
              <div className="text-center">
                <h3 className={`font-serif font-bold text-2xl text-gray-900 dark:text-white group-hover:${getPrimaryText()} transition-colors mb-2`}>Emily White</h3>
                <p className={`${getPrimaryText()} font-semibold text-base mb-3`}>Community Manager</p>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed font-light">
                  Fostering connections and building our vibrant community of creators and collectors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA (Soft Gradient) ================= */}
      <section className="w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          {/* Light/vibrant gradient is now used for the CTA background */}
          <div className={`relative ${getGradient()} rounded-3xl p-14 md:p-20 text-center overflow-hidden shadow-2xl`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-0 left-0 w-80 h-80 bg-white/30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/30 rounded-full translate-x-1/2 translate-y-1/2"></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center gap-10">
              <div className="flex flex-col gap-6 max-w-3xl">
                <h2 className="font-serif text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-md">
                  Ready to Share Your Masterpiece?
                </h2>
                <p className="text-white/80 font-light text-xl md:text-2xl leading-relaxed">
                  Whether you're an artisan ready to share your craft or a shopper seeking meaningful products, 
                  your journey into premium gifting begins here.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  to="/vendor/register"
                  className={`flex min-w-[220px] h-16 items-center justify-center rounded-xl bg-white text-gray-900 text-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1`}
                >
                  <span className="material-symbols-outlined mr-3 text-2xl">diamond</span>
                  Start Selling
                </Link>

                <Link
                  to="/products"
                  className={`flex min-w-[220px] h-16 items-center justify-center rounded-xl bg-white/20 text-white text-xl font-bold hover:bg-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 border border-white/30`}
                >
                  <span className="material-symbols-outlined mr-3 text-2xl">redeem</span>
                  Find the Perfect Gift
                </Link>
              </div>
              
              <p className="text-white/60 text-sm mt-4">
                Join hundreds of creators and thousands of conscious shoppers today
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}