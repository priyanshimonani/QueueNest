import React, { useEffect, useRef } from "react"

const Dashboard = () => {

  const revealRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show")
          }
        })
      },
      { threshold: 0.2 }
    )

    revealRefs.current.forEach(el => el && observer.observe(el))
  }, [])

  // Added icons to the features array
  const features = [
    {
      title: "Real-Time Updates",
      desc: "Track queue movement live instantly. No refreshing required—just watch the magic happen.",
      span: "md:col-span-2",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Smart Queue Logic",
      desc: "Optimized handling for faster, fairer service.",
      span: "",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Token Swap",
      desc: "Running late? Securely exchange your position with mutual consent.",
      span: "",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      title: "Multi-Venue Support",
      desc: "One account for Banks, Hospitals, Government offices, and Events.",
      span: "md:col-span-2",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-[#feffe0] via-yellow-50 to-orange-50 text-gray-800 overflow-hidden relative">



      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[85vh] text-center">

        {/* Animated Background Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 flex flex-col items-center">



          <h1 className="hero-title text-7xl md:text-9xl font-black tracking-tighter mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#059669] via-[#10b981] to-[#34d399] animate-gradient-x">
              QueueNest
            </span>
          </h1>

          <p className="text-2xl md:text-4xl text-gray-700 font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Wait Smart. <span className="text-[#10b981] underline decoration-wavy decoration-2 underline-offset-4">Not Long.</span>
          </p>

          <p className="text-gray-500 mb-10 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Join virtual queues, track your live position, and get your time back.
            The smartest way to handle lines is here.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 animate-bounce-in" style={{ animationDelay: '0.6s' }}>
            <a href="/search">
              <button className="primary-btn group relative overflow-hidden">
                <span className="relative z-10">Join Queue Now →</span>
                <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-emerald-600/20"></div>
              </button>
            </a>
            <a href='/loginadmin'>
              <button className="secondary-btn bg-white/50 backdrop-blur-sm hover:bg-white">
                Admin Panel
              </button>
            </a>

          </div>

        </div>
      </section>

      {/* --- IMPROVED POWERFUL FEATURES SECTION --- */}
      <section className="px-6 pb-32 max-w-6xl mx-auto relative z-20">

        <div
          className="text-center mb-20 reveal"
          ref={el => revealRefs.current[0] = el}
        >
          <h2 className="text-4xl font-bold mb-4 title1 text-gray-800">
            Powerful Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to modernize waiting systems.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 auto-rows-fr">

          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => revealRefs.current[index + 1] = el}
              className={`bento-card group reveal ${feature.span || ""}`}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <div className="feature-icon-wrapper mb-4 text-[#10b981] group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-white transition-colors duration-300">
                {feature.title}
              </h3>

              <p className="text-sm leading-relaxed text-gray-600 group-hover:text-white/90 transition-colors duration-300">
                {feature.desc}
              </p>

              {/* Decorative circle inside card */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}

        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pb-10 text-gray-500 relative z-20">
        © 2025 QueueNest. All rights reserved.
      </footer>

      {/* Animations + Styles */}
      <style>{`
        /* --- ANIMATIONS --- */
        @keyframes blob {
          0% { transform: translate3d(0px, 0px, 0) scale(1) rotate(0deg); }
          20% { transform: translate3d(40px, -35px, 0) scale(1.08) rotate(4deg); }
          40% { transform: translate3d(-30px, -60px, 0) scale(0.95) rotate(-5deg); }
          60% { transform: translate3d(-55px, 18px, 0) scale(1.12) rotate(3deg); }
          80% { transform: translate3d(28px, 42px, 0) scale(0.98) rotate(-4deg); }
          100% { transform: translate3d(0px, 0px, 0) scale(1) rotate(0deg); }
        }
        .animate-blob {
          animation: blob 12s ease-in-out infinite;
          will-change: transform;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 3s ease infinite; }

        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }

        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { opacity: 0; animation: slide-up 0.8s ease-out forwards; }

        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in { opacity: 0; animation: bounce-in 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000) forwards; }

        /* --- UTILS --- */
        .reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s ease; }
        .reveal.show { opacity: 1; transform: translateY(0); }

        /* --- UPDATED BENTO CARD STYLES --- */
        .bento-card {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 1.5rem;
          padding: 2.5rem 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          position: relative;
          overflow: hidden;
        }

        /* Hover Effect: Gradient Background */
        .bento-card:hover {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -5px rgba(16, 185, 129, 0.4);
          border-color: transparent;
        }

        /* Icon Animation on Hover */
        .bento-card:hover .feature-icon-wrapper {
          transform: scale(1.1) rotate(-5deg);
        }
        
        .feature-icon-wrapper {
          display: inline-flex;
          padding: 12px;
          border-radius: 1rem;
          background: rgba(16, 185, 129, 0.1);
          width: fit-content;
          transition: all 0.4s ease;
        }

        /* Icon background changes on hover */
        .bento-card:hover .feature-icon-wrapper {
          background: rgba(255, 255, 255, 0.2);
        }

        /* --- BUTTONS --- */
        .primary-btn {
          background: #10b981;
          color: white;
          padding: 1rem 2.5rem;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(16,185,129,0.2);
        }
        .primary-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(16,185,129,0.4); }

        .secondary-btn {
          border: 2px solid #10b981;
          color: #10b981;
          padding: 0.9rem 2.2rem;
          border-radius: 9999px;
          font-weight: 700;
          transition: all 0.3s ease;
        }
        .secondary-btn:hover { background: #10b981; color: white; transform: translateY(-3px); box-shadow: 0 10px 25px rgba(16,185,129,0.2); }

      `}</style>

    </div>
  )
}

export default Dashboard
