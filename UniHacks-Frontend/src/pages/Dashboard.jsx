import React, { useEffect, useRef } from "react"
import CountUp from "../components/CountUp"
import TrueFocus from "../components/TrueFocus"

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

      {/* --- HERO SECTION (HEAVILY ANIMATED) --- */}
      <section className="relative px-6 py-20 lg:py-32  mx-auto flex flex-col items-center justify-center min-h-[90vh] text-center">
        
        {/* 1. Swirling Fluid Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-swirl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-green-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-swirl-reverse"></div>
            <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
        </div>

        {/* 2. Winding Queue Animation (Left Side) */}
        <div className="absolute left-0 top-1/6 w-full h-full pointer-events-none hidden lg:block opacity-80">
  <svg width="400" height="600" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Path */}
    <path 
      id="queuePath" 
      d="M-50 550C50 550 100 500 100 400C100 300 200 250 250 150C300 50 200 -50 100 50" 
      stroke="#10b981" 
      strokeWidth="2" 
      strokeDasharray="10 10" 
      className="opacity-10" 
    />
    
    {/* Tiny People Walking */}
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i} className="animate-follow-path" style={{ animationDelay: `${i * 2.5}s` }}>
        
        {/* Walking Character Rig */}
        <g className="walking-person" transform="scale(0.6) translate(0, -20)">
          
          {/* Shadow/Glow Base */}
          <ellipse cx="0" cy="25" rx="12" ry="4" fill="#10b981" className="opacity-20 animate-pulse" />

          {/* Legs */}
          <g className="leg-group">
            {/* Back Leg */}
            <path className="leg back-leg" d="M-2 10 L-4 25" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
            {/* Front Leg */}
            <path className="leg front-leg" d="M2 10 L4 25" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Torso / Body */}
          <rect x="-6" y="-8" width="12" height="18" rx="4" fill="#10b981" className="body-bob" />
          
          {/* Arms */}
          <g className="arm-group">
             <path className="arm back-arm" d="M-6 -4 L-10 8" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
             <path className="arm front-arm" d="M6 -4 L10 8" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Head */}
          <circle cx="0" cy="-18" r="6" fill="#10b981" className="head-bob" />
          
          {/* Position Indicator Tag */}
          <g transform="translate(0, -45)" className="opacity-80">
            <rect x="-15" y="-8" width="30" height="30" rx="7" fill="white" className="shadow-sm" />
            <text x="0" y="15" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#059669" style={{fontFamily: 'Arial'}}>
              {`#${5-i}`}
            </text>
          </g>

        </g>
      </g>
    ))}
  </svg>
</div>
     

        <div className="absolute right-[7%] top-1/2 hidden -translate-y-1/2 pointer-events-none lg:block z-10">
          <CountUp
            from={0}
            to={50}
            duration={2.3}
            repeat={true}
            repeatDelay={1.4}
            startWhen={true}
            className="hero-countup text-[8rem] font-black leading-none tracking-[-0.08em] text-emerald-500/18"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* 4. Glowing Logo */}
          <div className="hero-title mb-6 filter drop-shadow-sm">
            <TrueFocus
              sentence="Quenest"
              separator=""
              blurAmount={2}
              borderColor="#10b981"
              glowColor="rgba(16, 185, 129, 0.35)"
              animationDuration={0.45}
              pauseBetweenAnimations={0.2}
            />
          </div>

          {/* 5. Typing Effect Text */}
          <div className="overflow-hidden whitespace-nowrap mx-auto border-r-4 border-emerald-500 animate-typing w-fit">
            <p className="text-2xl md:text-4xl text-gray-700 font-bold mb-2">
              Wait Smart. <span className="text-[#10b981] underline decoration-wavy decoration-2 underline-offset-4">Not Long.</span>
            </p>
          </div>

          <p className="text-gray-500 mt-6 mb-8 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '1.1s' }}>
            Join virtual queues, track your live position, and get your time back.
            The smartest way to handle lines is here.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 animate-bounce-in" style={{ animationDelay: '1.35s' }}>
            <a href="/search">
              <button className="primary-btn group relative overflow-hidden animate-button-pulse">
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
        {/* --- GRADIENT TRANSITION CURVE --- */}
<div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-[0] z-30 animate-curve-reveal">
  <svg 
    viewBox="0 0 1200 120" 
    preserveAspectRatio="none" 
    className="relative block w-full h-[80px] md:h-[120px]"
    style={{ filter: 'drop-shadow(0px -12px 10px rgba(0,0,0,0.04))' }}
  >
    <defs>
      {/* Horizontal Gradient: Transparent Left to Solid Right */}
      <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#feffe0" stopOpacity="0" />
        <stop offset="100%" stopColor="#feffe0" stopOpacity="1" />
      </linearGradient>
    </defs>
    
    <path 
      d="M0,0 C480,100 720,100 1200,0 L1200,120 L0,120 Z" 
      fill="url(#fadeGradient)" 
      className="animate-wave-slow"
    />
  </svg>
</div>
      </section>

      {/* --- FEATURES SECTION (UNTOUCHED) --- */}
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
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center pb-10 text-gray-500 relative z-20">
        © 2025 QueueNest. All rights reserved.
      </footer>

      {/* --- ENHANCED ANIMATIONS --- */}
      <style>{`
        /* 1. Fluid Swirl Background */
        @keyframes swirl {
          0% { transform: rotate(0deg) translate(0, 0) scale(1); }
          50% { transform: rotate(180deg) translate(50px, 50px) scale(1.2); }
          100% { transform: rotate(360deg) translate(0, 0) scale(1); }
        }
        .animate-swirl { animation: swirl 20s linear infinite; }
        .animate-swirl-reverse { animation: swirl 25s linear infinite reverse; }

        /* 2. Follow Path (Queue Animation) */
        /* 1. The Path Movement */
.animate-follow-path {
  offset-path: path("M-50 550C50 550 100 500 100 400C100 300 200 250 250 150C300 50 200 -50 100 50");
  animation: follow-path 12s linear infinite;
  position: absolute;
}

/* 2. Leg Stride Animation */
@keyframes stride {
  0%, 100% { transform: rotate(-25deg); }
  50% { transform: rotate(25deg); }
}

.front-leg {
  animation: stride 0.8s ease-in-out infinite;
  transform-origin: 0% 10px;
}

.back-leg {
  animation: stride 0.8s ease-in-out infinite reverse;
  transform-origin: 0% 10px;
}

/* 3. Arm Swing Animation (Opposite of legs) */
@keyframes swing {
  0%, 100% { transform: rotate(30deg); }
  50% { transform: rotate(-30deg); }
}

.front-arm {
  animation: swing 0.8s ease-in-out infinite;
  transform-origin: 6px -4px;
}

.back-arm {
  animation: swing 0.8s ease-in-out infinite reverse;
  transform-origin: -6px -4px;
}

/* 4. Torso and Head Bobbing */
@keyframes body-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.body-bob, .head-bob {
  animation: body-bob 0.4s ease-in-out infinite;
}

/* 5. Smooth Fade for Path Following */
@keyframes follow-path {
  0% { offset-distance: 0%; opacity: 0; }
  5% { opacity: 1; }
  95% { opacity: 1; }
  100% { offset-distance: 100%; opacity: 0; }
}
          

        /* 3. Typing Effect */
        @keyframes typing {
          from { width: 0 }
          to { width: 50% }
        }
        @keyframes blink {
          50% { border-color: transparent }
        }
        .animate-typing {
          animation: typing 1.1s steps(40, end), blink .75s step-end infinite;
          white-space: nowrap;
          overflow: hidden;
        }

        /* 4. Particle Effects */
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
          opacity: 0;
          filter: blur(2px);
        }
        @keyframes flow-in {
          0% { transform: translate(100px, 100px); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translate(-300px, -200px); opacity: 0; }
        }
        .p1 { animation: flow-in 4s infinite 0s; }
        .p2 { animation: flow-in 4s infinite 1.3s; }
        .p3 { animation: flow-in 4s infinite 2.6s; }

        /* 5. Glow Effects */
        @keyframes logo-glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(16,185,129,0.2)); }
          50% { filter: drop-shadow(0 0 25px rgba(16,185,129,0.5)); }
        }
        .animate-logo-glow { animation: logo-glow 4s ease-in-out infinite; }

        @keyframes button-pulse {
          0% { box-shadow: 0 0 0 0 rgba(16,185,129, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(16,185,129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129, 0); }
        }
        .animate-button-pulse { animation: button-pulse 2s infinite; }

        /* --- REST OF YOUR ORIGINAL STYLES --- */
        @keyframes blob {
          0% { transform: translate3d(0px, 0px, 0) scale(1) rotate(0deg); }
          20% { transform: translate3d(40px, -35px, 0) scale(1.08) rotate(4deg); }
          40% { transform: translate3d(-30px, -60px, 0) scale(0.95) rotate(-5deg); }
          60% { transform: translate3d(-55px, 18px, 0) scale(1.12) rotate(3deg); }
          80% { transform: translate3d(28px, 42px, 0) scale(0.98) rotate(-4deg); }
          100% { transform: translate3d(0px, 0px, 0) scale(1) rotate(0deg); }
        }
        .animate-blob { animation: blob 12s ease-in-out infinite; will-change: transform; }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 3s ease infinite; }
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
        .reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s ease; }
        .reveal.show { opacity: 1; transform: translateY(0); }
        .bento-card {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 1.5rem;
          padding: 2.5rem 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        .bento-card:hover {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -5px rgba(16, 185, 129, 0.4);
        }
        .feature-icon-wrapper {
          display: inline-flex;
          padding: 12px;
          border-radius: 1rem;
          background: rgba(16, 185, 129, 0.1);
          width: fit-content;
          transition: all 0.4s ease;
        }
        .bento-card:hover .feature-icon-wrapper { background: rgba(255, 255, 255, 0.2); transform: scale(1.1) rotate(-5deg); }
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
        .secondary-btn {
          border: 2px solid #10b981;
          color: #10b981;
          padding: 0.9rem 2.2rem;
          border-radius: 9999px;
          font-weight: 700;
          transition: all 0.3s ease;
        }
        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .hero-countup {
          animation: float-card 5.5s ease-in-out infinite;
          text-shadow: 0 0 25px rgba(16, 185, 129, 0.08);
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}</style>

    </div>
  )
}

export default Dashboard
