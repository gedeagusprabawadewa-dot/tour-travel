
import React from 'react';
import { Booking, BookingStatus, ServiceType } from '../types';

interface BookingCardProps {
  booking: Booking;
  onClick: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onClick }) => {
  const isPackage = booking.type === ServiceType.PACKAGE;
  
  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.ACTIVE:
        return { label: 'Active Trip', color: 'bg-orange-500 text-white' };
      case BookingStatus.COMPLETED:
        return { label: 'Completed', color: 'bg-slate-900 text-white' };
      case BookingStatus.UPCOMING:
        return { label: 'Upcoming', color: 'bg-emerald-500 text-white' };
    }
  };

  const status = getStatusConfig(booking.status);

  return (
    <div 
      onClick={onClick}
      className={`group cursor-pointer bg-white rounded-[32px] sm:rounded-[40px] overflow-hidden border border-slate-100 transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(249,115,22,0.15)] flex flex-col ${isPackage ? 'lg:flex-row lg:col-span-2' : ''}`}
    >
      {/* Media Content */}
      <div className={`relative overflow-hidden ${isPackage ? 'w-full lg:w-[45%] h-56 sm:h-72 lg:h-auto' : 'w-full h-56 sm:h-64'}`}>
        <img 
          src={booking.image} 
          alt={booking.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex gap-2">
           <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md ${status.color}`}>
            {status.label}
          </span>
          {isPackage && (
            <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest shadow-xl bg-white/20 backdrop-blur-md text-white border border-white/20">
              Bundle
            </span>
          )}
        </div>
        
        {/* Floating Price/Meta Tag */}
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6">
          <div className="bg-white/90 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-xl flex flex-col items-center min-w-[70px] sm:min-w-[80px]">
             <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</span>
             <span className="text-base sm:text-lg font-black text-slate-900">${booking.paidAmount + (booking.onSiteAmount || 0)}</span>
          </div>
        </div>
      </div>

      {/* Details Content */}
      <div className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] ${isPackage ? 'text-sky-600' : 'text-orange-500'}`}>
              {isPackage ? 'Full Itinerary' : booking.type}
            </span>
            <div className="w-1 h-1 bg-slate-200 rounded-full" />
            <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{booking.date}</span>
          </div>

          <h3 className={`font-black text-slate-900 group-hover:text-orange-500 transition-colors mb-3 sm:mb-4 leading-tight ${isPackage ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-lg sm:text-xl'}`}>
            {booking.name}
          </h3>

          {isPackage ? (
            <div className="space-y-4 sm:space-y-6">
              <p className="text-slate-500 font-medium leading-relaxed max-w-md text-xs sm:text-sm">
                A seamless {booking.totalDays}-day experience including transfers, accommodation, and curated daily explorations.
              </p>
              <div className="bg-slate-50 rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 border border-slate-100">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Itinerary Progress</span>
                  <span className="text-[8px] sm:text-[10px] font-black text-sky-600">Day {booking.currentDay} of {booking.totalDays}</span>
                </div>
                <div className="h-1.5 sm:h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-1000" 
                    style={{ width: `${((booking.currentDay || 0) / (booking.totalDays || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {booking.pois && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex -space-x-1.5 sm:-space-x-2">
                    {booking.pois.slice(0, 4).map((poi, i) => (
                      <div key={poi.id} className={`w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full border-2 border-white ${poi.isCompleted ? 'bg-emerald-400' : 'bg-slate-100 shadow-inner'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {booking.pois.filter(p => p.isCompleted).length} / {booking.pois.length} Locations
                  </span>
                </div>
              )}
              {booking.difficulty && (
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" />
                  <span className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">{booking.difficulty} Level</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex -space-x-2 sm:-space-x-3">
              {[1, 2].map(i => (
                <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white bg-slate-200 overflow-hidden shadow-lg">
                  <img src={`https://picsum.photos/seed/bali_${booking.id}_${i}/100/100`} alt="Attendee" />
                </div>
              ))}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white bg-slate-900 flex items-center justify-center text-[8px] sm:text-[10px] font-black text-white shadow-lg">+3</div>
            </div>
            <span className="text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:inline">Group Active</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 text-slate-900 font-black text-[10px] sm:text-xs uppercase tracking-widest group-hover:text-orange-500 transition-colors">
            Manage <svg className="w-4 h-4 sm:w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
