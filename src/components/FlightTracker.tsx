'use client';

import React, { useState } from 'react';
import { Search, PlaneTakeoff, PlaneLanding, Clock, MapPin, AlertCircle } from 'lucide-react';
import type { Flight } from '@/lib/mockFlights';

export default function FlightTracker() {
  const [flightNumber, setFlightNumber] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightNumber.trim()) return;

    setIsLoading(true);
    setError('');
    setHasSearched(false);

    try {
      const res = await fetch(`/api/flights?flightNumber=${encodeURIComponent(flightNumber)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch flights');
      }

      setFlights(data.data);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while searching for flights.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoString: string, timeZone: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  };

  const getGoogleCalendarUrl = (flight: Flight) => {
    const formatForCalendar = (isoString: string) => {
      const date = new Date(isoString);
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const start = formatForCalendar(flight.departureTime);
    const end = formatForCalendar(flight.arrivalTime);
    const title = encodeURIComponent(`${flight.airline} Flight ${flight.flightNumber}`);
    const location = encodeURIComponent(`${flight.origin.airport} to ${flight.destination.airport}`);
    const details = encodeURIComponent(
      `Flight: ${flight.airline} ${flight.flightNumber}\n` +
      `From: ${flight.origin.city} (${flight.origin.airport}) - Terminal ${flight.origin.terminal}, Gate ${flight.origin.gate}\n` +
      `To: ${flight.destination.city} (${flight.destination.airport}) - Terminal ${flight.destination.terminal}, Gate ${flight.destination.gate}\n` +
      `Status: ${flight.status}\n`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Form Card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 mb-12 transform transition-all duration-300">
        <form onSubmit={handleSearch} className="relative flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-7 w-7 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="text"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
              placeholder="Flight number (e.g. AA123)"
              className="block w-full pl-16 pr-6 py-5 sm:py-6 text-xl sm:text-2xl font-bold text-slate-900 border-2 border-slate-100 rounded-2xl bg-white/80 focus:bg-white hover:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 placeholder:text-slate-300 placeholder:font-medium outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !flightNumber.trim()}
            className="w-full md:w-auto px-10 py-5 sm:py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black tracking-wide text-lg sm:text-xl rounded-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_8px_25px_rgb(79,70,229,0.3)] hover:shadow-[0_12px_35px_rgb(79,70,229,0.4)] flex items-center justify-center min-w-[180px] hover:scale-[1.02] active:scale-95"
          >
            {isLoading ? (
              <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Track Flight'
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-6 bg-red-50/90 backdrop-blur-md border-l-4 border-red-500 rounded-r-2xl rounded-l-md flex items-start gap-4 text-red-800 shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <AlertCircle className="w-7 h-7 shrink-0 mt-0.5 text-red-500" />
          <div>
            <h3 className="font-extrabold text-xl mb-1 text-red-900">Search Failed</h3>
            <p className="text-red-700/90 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && !isLoading && (
        <div className="space-y-8 pb-20">
          {flights.length === 0 ? (
            <div className="text-center py-24 px-6 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in zoom-in-95 duration-500">
              <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-slate-100">
                <PlaneTakeoff className="w-14 h-14 text-slate-300" />
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">No flights found</h3>
              <p className="text-slate-500 text-xl max-w-lg mx-auto font-medium">We couldn't find any flights matching "{flightNumber}". Please check the flight number and try again.</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 px-4 sm:px-2 gap-4">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  Search Results
                </h2>
                <span className="bg-blue-100 border border-blue-200 text-blue-800 px-5 py-2 rounded-full font-black text-sm tracking-wide shadow-sm">
                  {flights.length} {flights.length === 1 ? 'Flight' : 'Flights'} Found
                </span>
              </div>
              
              <div className="grid gap-12">
                {flights.map((flight) => (
                  <a
                    href={getGoogleCalendarUrl(flight)}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={flight.id}
                    className="relative block bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100/50 overflow-hidden flex flex-col lg:flex-row transform transition-all hover:shadow-[0_25px_70px_rgba(0,0,0,0.12)] hover:-translate-y-1 cursor-pointer"
                  >
                    
                    {/* Main Boarding Pass Section */}
                    <div className="flex-1 p-8 sm:p-12">
                      {/* Top Row: Airline & Status */}
                      <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 flex items-center justify-center shadow-sm">
                            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">
                              {flight.airline.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Airline</p>
                            <h3 className="font-extrabold text-slate-900 text-2xl tracking-tight">{flight.airline}</h3>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 sm:mb-1">Current Status</p>
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-sm border
                            ${flight.status.toLowerCase() === 'on time' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              flight.status.toLowerCase() === 'delayed' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              flight.status.toLowerCase() === 'cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                              'bg-blue-50 text-blue-700 border-blue-100'
                            }
                          `}>
                            <span className={`w-2.5 h-2.5 rounded-full mr-3 shadow-sm ${
                              flight.status.toLowerCase() === 'on time' ? 'bg-emerald-500' :
                              flight.status.toLowerCase() === 'delayed' ? 'bg-amber-500' :
                              flight.status.toLowerCase() === 'cancelled' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`}></span>
                            {flight.status}
                          </span>
                        </div>
                      </div>

                      {/* Flight Route Details */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-4 mb-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden sm:flex absolute left-[25%] right-[25%] top-[40%] -mt-px items-center">
                          <div className="w-2.5 h-2.5 rounded-full border-[3px] border-slate-300 bg-white z-10 shadow-sm"></div>
                          <div className="flex-1 border-t-[3px] border-dashed border-slate-200 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-100 flex items-center justify-center rounded-full shadow-md text-blue-600">
                              <PlaneTakeoff className="w-5 h-5" />
                            </div>
                          </div>
                          <div className="w-2.5 h-2.5 rounded-full border-[3px] border-slate-300 bg-white z-10 shadow-sm"></div>
                        </div>

                        {/* Origin */}
                        <div className="z-10 bg-white sm:pb-3 sm:pr-8 text-center sm:text-left w-full sm:w-auto">
                          <h4 className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tighter mb-2">{flight.origin.airport}</h4>
                          <p className="text-slate-500 font-bold text-xl">{flight.origin.city}</p>
                        </div>
                        
                        {/* Mobile Connect Icon */}
                        <div className="sm:hidden flex items-center justify-center w-full">
                          <div className="h-14 w-px border-l-[3px] border-dashed border-slate-200 relative">
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-100 flex items-center justify-center rounded-full shadow-md text-blue-600">
                                <PlaneTakeoff className="w-5 h-5 rotate-90" />
                             </div>
                          </div>
                        </div>

                        {/* Destination */}
                        <div className="z-10 bg-white sm:pb-3 sm:pl-8 text-center sm:text-right w-full sm:w-auto">
                          <h4 className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tighter mb-2">{flight.destination.airport}</h4>
                          <p className="text-slate-500 font-bold text-xl">{flight.destination.city}</p>
                        </div>
                      </div>

                      {/* Flight Information Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-inner">
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Departure</p>
                          <p className="font-bold text-slate-800 text-lg mb-1">{formatDate(flight.departureTime, flight.departureTimeZone).split(', ').slice(1).join(', ')}</p>
                          <p className="text-sm font-semibold text-slate-500">Terminal {flight.origin.terminal} • Gate {flight.origin.gate}</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Arrival</p>
                          <p className="font-bold text-slate-800 text-lg mb-1">{formatDate(flight.arrivalTime, flight.arrivalTimeZone).split(', ').slice(1).join(', ')}</p>
                          <p className="text-sm font-semibold text-slate-500">Terminal {flight.destination.terminal} • Gate {flight.destination.gate}</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Flight No</p>
                          <p className="font-black text-2xl text-slate-800">{flight.flightNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Duration</p>
                          <p className="font-bold text-xl text-slate-800">{flight.duration}</p>
                        </div>
                      </div>
                    </div>

                    {/* Divider Line */}
                    <div className="hidden lg:flex flex-col items-center justify-center relative w-px border-l-[3px] border-dashed border-slate-200 bg-white">
                      <div className="w-8 h-8 rounded-full bg-[#f3f4f6] shadow-inner absolute -top-4"></div>
                      <div className="w-8 h-8 rounded-full bg-[#f3f4f6] shadow-inner absolute -bottom-4"></div>
                    </div>

                    {/* Right Side Boarding Pass Tear-off */}
                    <div className="lg:w-80 bg-white flex flex-col justify-between p-8 sm:p-12 lg:p-10 relative">
                      {/* Mobile divider */}
                      <div className="lg:hidden absolute top-0 left-0 right-0 h-px border-t-[3px] border-dashed border-slate-200">
                        <div className="w-8 h-8 rounded-full bg-[#f3f4f6] shadow-inner absolute -left-4 -top-4"></div>
                        <div className="w-8 h-8 rounded-full bg-[#f3f4f6] shadow-inner absolute -right-4 -top-4"></div>
                      </div>

                      <div className="hidden lg:block">
                        <div className="flex items-center justify-between mb-8 opacity-40">
                           <PlaneTakeoff className="w-8 h-8 text-indigo-900" />
                           <p className="font-black text-indigo-900 text-sm tracking-[0.2em] uppercase">BOARDING PASS</p>
                        </div>
                        <div className="space-y-8">
                          <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Passenger</p>
                            <p className="font-black text-xl text-slate-900 tracking-tight">DOE / JOHN</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Seat</p>
                              <p className="font-black text-3xl text-slate-900 tracking-tighter">12A</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Class</p>
                              <p className="font-black text-3xl text-slate-900 tracking-tighter">ECON</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mock Barcode */}
                      <div className="mt-12 lg:mt-auto">
                        <div className="w-full flex justify-between h-20 opacity-80 mix-blend-multiply">
                          {[...Array(40)].map((_, i) => (
                            <div key={i} className="h-full bg-slate-900 block rounded-[1px]" style={{
                              width: `${(i * 13 % 4) + 1}px`,
                              marginRight: `${(i * 7 % 3)}px`,
                              opacity: (i * 11 % 100) > 80 ? 0 : 1
                            }} />
                          ))}
                        </div>
                        <p className="text-center text-xs font-mono font-bold text-slate-500 mt-3 tracking-[0.3em]">{flight.id.replace(/-/g, '').substring(0, 16).toUpperCase()}</p>
                      </div>
                    </div>

                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
