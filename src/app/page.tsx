import FlightTracker from '@/components/FlightTracker';
import { Plane } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f4f6] font-sans selection:bg-blue-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md border border-white/10">
              <Plane className="w-7 h-7 text-white rotate-45" />
            </div>
            <span className="text-2xl font-bold tracking-tight">AeroTrack</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-white/80 font-semibold text-sm">
            <a href="#" className="hover:text-white transition-colors">Book a Flight</a>
            <a href="#" className="hover:text-white transition-colors">Manage Trip</a>
            <a href="#" className="hover:text-white transition-colors">Check-in</a>
            <a href="#" className="text-white relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-white after:rounded-full">Flight Status</a>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="hidden sm:block text-white/90 hover:text-white font-semibold text-sm transition-colors">Log In</button>
            <button className="bg-white text-blue-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-white/90 transition-all shadow-[0_4px_20px_rgb(255,255,255,0.15)] hover:shadow-[0_4px_25px_rgb(255,255,255,0.25)] hover:scale-105 active:scale-95">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[650px] w-full overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900" />
        {/* Subtle overlay pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f3f4f6] to-transparent h-40 bottom-0 top-auto z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 pt-48 h-full flex flex-col items-center text-center">
          <span className="inline-block py-2 px-5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/90 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
            Real-time global flight tracking
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-8 leading-tight drop-shadow-xl">
            Where is your flight?
          </h1>
          <p className="text-lg md:text-2xl text-blue-100/80 max-w-3xl font-medium drop-shadow-md">
            Enter your flight number below to track departures, arrivals, terminal gates, and real-time status with our premium tracker.
          </p>
        </div>
      </div>

      <div className="relative z-30 -mt-32 pb-24">
        <FlightTracker />
      </div>


    </main>
  );
}
