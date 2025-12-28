
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Booking, ServiceType, BookingStatus, POI, ChecklistItem } from '../types';
import { generateMemoryBookSummary } from '../geminiService';

interface ServiceDetailsProps {
  booking: Booking;
  onUpdate: (b: Booking) => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ booking, onUpdate }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'todo' | 'info' | 'history'>('todo');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePOI = (poiId: string) => {
    if (!booking.pois) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedPois = booking.pois.map(p => {
      if (p.id === poiId) {
        const becomingCompleted = !p.isCompleted;
        if (becomingCompleted) {
          return {
            ...p,
            isCompleted: true,
            arrivedAt: p.arrivedAt || now,
            completedAt: now
          };
        } else {
          return {
            ...p,
            isCompleted: false,
            completedAt: undefined
          };
        }
      }
      return p;
    });
    onUpdate({ ...booking, pois: updatedPois });
  };

  const toggleGear = (gearId: string) => {
    if (!booking.gearList) return;
    const updatedGear = booking.gearList.map(g => g.id === gearId ? { ...g, isCompleted: !g.isCompleted } : g);
    onUpdate({ ...booking, gearList: updatedGear });
  };

  const toggleInclusion = (id: string) => {
    if (!booking.packageInclusions) return;
    const updated = booking.packageInclusions.map(i => i.id === id ? { ...i, isCompleted: !i.isCompleted } : i);
    onUpdate({ ...booking, packageInclusions: updated });
  };

  const selectActivity = (option: string) => {
    onUpdate({
      ...booking,
      isOpenDay: false,
      selectedActivity: option
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpdate({ ...booking, photos: [...booking.photos, base64] });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    const text = await generateMemoryBookSummary(booking);
    setSummary(text);
    setIsGeneratingSummary(false);
  };

  const signWaiver = () => {
    onUpdate({ ...booking, waiverSigned: true });
  };

  const submitReview = () => {
    if (reviewRating === 0) return;
    onUpdate({
      ...booking,
      review: {
        rating: reviewRating,
        comment: reviewComment
      }
    });
    setIsReviewing(false);
  };

  const canEdit = booking.status === BookingStatus.ACTIVE || (booking.status === BookingStatus.UPCOMING && booking.type === ServiceType.ACTIVITY);

  return (
    <div className="space-y-4 sm:space-y-6 pb-24 relative">
      {/* Hero Header */}
      <div className="relative h-48 sm:h-64 rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl">
        <img src={booking.image} className="w-full h-full object-cover" alt={booking.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <button 
          onClick={() => navigate('/')}
          className="absolute top-4 sm:top-6 left-4 sm:left-6 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors border border-white/20 shadow-xl"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/20 backdrop-blur-md text-[8px] sm:text-[10px] font-black text-white uppercase tracking-widest border border-white/10">{booking.type}</span>
            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg ${booking.status === BookingStatus.ACTIVE ? 'bg-orange-500' : booking.status === BookingStatus.COMPLETED ? 'bg-slate-900' : 'bg-emerald-500'} text-white`}>
              {booking.status === BookingStatus.COMPLETED ? 'Memories Saved' : booking.status}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">{booking.name}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-[20px] sm:rounded-[24px]">
        {[
          { id: 'todo', label: 'Checklist' },
          { id: 'info', label: 'Details' },
          { id: 'history', label: 'Memories' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2.5 sm:py-3 rounded-[14px] sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="space-y-4 sm:space-y-6 min-h-[400px]">
        {activeTab === 'todo' && (
          <div className="space-y-4">
            {/* Safety Waiver - Mobile Adjusted */}
            {booking.type === ServiceType.ACTIVITY && !booking.waiverSigned && booking.status !== BookingStatus.COMPLETED && (
              <div className="p-5 sm:p-6 bg-red-50 border border-red-100 rounded-[24px] sm:rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h4 className="text-xs sm:text-sm font-black text-red-800 uppercase tracking-widest mb-1">Safety Waiver Required</h4>
                  <p className="text-[10px] sm:text-xs text-red-600 font-medium leading-relaxed">Please sign the digital waiver before your {booking.name} adventure starts.</p>
                </div>
                <button 
                  onClick={signWaiver}
                  className="w-full md:w-auto px-6 sm:px-8 py-3 bg-red-600 text-white rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                >
                  Sign Now
                </button>
              </div>
            )}

            {/* Open Day Selection - Action Bar Style */}
            {booking.type === ServiceType.PACKAGE && booking.isOpenDay && (
              <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-sky-100 shadow-lg shadow-sky-500/5">
                <div className="flex items-center gap-4 mb-5 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">Pick an Activity for Day {booking.currentDay}</h3>
                    <p className="text-[8px] sm:text-[10px] font-black text-sky-600 uppercase tracking-[0.2em] mt-1">Choice Required</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  {booking.openDayOptions?.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectActivity(option)}
                      className="w-full p-4 sm:p-5 bg-white border border-slate-100 rounded-xl sm:rounded-2xl text-left hover:border-sky-500 transition-all flex items-center justify-between active:scale-[0.98]"
                    >
                      <span className="text-[11px] sm:text-sm font-bold text-slate-700">{option}</span>
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Activity Result */}
            {booking.type === ServiceType.PACKAGE && !booking.isOpenDay && booking.selectedActivity && (
              <div className="bg-emerald-50 rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <span className="text-[8px] sm:text-[9px] font-black text-emerald-600 uppercase tracking-widest">Day {booking.currentDay} Set</span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">{booking.selectedActivity}</h4>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline View - Optimized for Narrow Screens */}
            {booking.type === ServiceType.TOUR && booking.pois && (
              <div className="bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 sm:gap-3">
                    <span className="w-1 h-5 sm:w-1.5 sm:h-6 bg-orange-500 rounded-full" />
                    Timeline
                  </h3>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {booking.pois.filter(p => p.isCompleted).length} / {booking.pois.length}
                  </span>
                </div>
                <div className="space-y-8 sm:space-y-10 relative">
                  <div className="absolute left-[13px] sm:left-[15px] top-4 bottom-4 w-0.5 bg-slate-100" />
                  {booking.pois.map((poi, idx) => (
                    <div key={poi.id} className="relative pl-10 sm:pl-12 group">
                      <div className={`absolute left-0 top-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${poi.isCompleted ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-100 text-slate-300'}`}>
                        {poi.isCompleted ? (
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                        ) : <span className="text-[9px] sm:text-[10px] font-black">{idx + 1}</span>}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <h4 className={`text-xs sm:text-sm font-black uppercase tracking-tight transition-colors ${poi.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{poi.name}</h4>
                          {poi.arrivedAt && <p className="text-[8px] sm:text-[10px] font-bold text-orange-400 mt-0.5 uppercase tracking-widest">{poi.arrivedAt}</p>}
                        </div>
                        {canEdit && (
                          <button 
                            onClick={() => togglePOI(poi.id)}
                            className={`p-2 rounded-lg transition-all ${poi.isCompleted ? 'text-orange-500 bg-orange-50' : 'text-slate-200'}`}
                          >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lists (Gear/Inclusions) - Compact Mobile Grid */}
            {(booking.gearList || booking.packageInclusions) && (
              <div className="bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm">
                <h3 className="text-base sm:text-lg font-black text-slate-900 mb-5 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className={`w-1 h-5 sm:w-1.5 sm:h-6 rounded-full ${booking.type === ServiceType.ACTIVITY ? 'bg-sky-600' : 'bg-emerald-500'}`} />
                  Checklist
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {(booking.type === ServiceType.ACTIVITY ? booking.gearList : booking.packageInclusions)?.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => canEdit && (booking.type === ServiceType.ACTIVITY ? toggleGear(item.id) : toggleInclusion(item.id))}
                      className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${item.isCompleted ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'}`}
                    >
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center border transition-colors ${item.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300'}`}>
                        {item.isCompleted && <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`text-[11px] sm:text-sm font-bold tracking-tight ${item.isCompleted ? 'text-emerald-700 line-through opacity-60' : 'text-slate-700'}`}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Review Sentiment - Large but scalable */}
            {booking.review && (
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-emerald-100">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-[8px] sm:text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em]">Traveler's Sentiment</h3>
                  <div className="flex gap-0.5 sm:gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < booking.review!.rating ? 'text-orange-400' : 'text-slate-200'} fill-current`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                </div>
                <p className="text-slate-800 font-medium italic text-base sm:text-lg leading-relaxed mb-4">"{booking.review.comment}"</p>
              </div>
            )}

            {/* Driver Expert Card */}
            {booking.driver && (
              <div className="bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm overflow-hidden relative">
                <h3 className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 sm:mb-6">Local Expert</h3>
                <div className="flex items-center gap-4 sm:gap-6 mb-6">
                  <img src={booking.driver.photo} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-orange-500/10" alt={booking.driver.name} />
                  <div className="flex-1">
                    <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-0.5">{booking.driver.name}</h4>
                    <span className="inline-block px-1.5 py-0.5 bg-slate-100 rounded text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest">{booking.driver.plate}</span>
                  </div>
                </div>
                <a 
                  href={booking.driver.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 sm:py-4 bg-emerald-500 text-white rounded-[16px] sm:rounded-[20px] flex items-center justify-center gap-2 sm:gap-3 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.1em]">WhatsApp Chat</span>
                </a>
              </div>
            )}

            {/* Billing - Compact Mobile Row */}
            <div className="bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm">
              <h3 className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 sm:mb-6">Finance</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-bold text-slate-500">Paid Online</span>
                  <span className="font-black text-slate-900">${booking.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-bold text-slate-500">On-site (Cash)</span>
                  <span className="font-black text-orange-600">${booking.onSiteAmount.toFixed(2)}</span>
                </div>
                <div className="pt-4 mt-2 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-widest">Total</span>
                  <span className="text-lg sm:text-xl font-black text-slate-900">${(booking.paidAmount + booking.onSiteAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-none mb-1">Moments</h3>
                  <p className="text-[10px] sm:text-xs font-medium text-slate-400">Store your visual memories</p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-xl shadow-orange-500/20 active:scale-95"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              </div>

              {booking.photos.length === 0 ? (
                <div className="py-12 sm:py-20 border-2 border-dashed border-slate-100 rounded-[24px] sm:rounded-[32px] flex flex-col items-center text-slate-300">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest">No Captures</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {booking.photos.map((src, idx) => (
                    <div key={idx} className="aspect-square rounded-xl sm:rounded-[24px] overflow-hidden border border-slate-100">
                      <img src={src} className="w-full h-full object-cover" alt={`Moment ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Summary - Action Sheet Style UI */}
            <div className="bg-slate-900 rounded-[32px] sm:rounded-[40px] p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-500 flex items-center justify-center text-white">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black mb-0.5">AI Summary</h3>
                    <p className="text-slate-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">Island Spirits</p>
                  </div>
                </div>

                {summary ? (
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 italic text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8 border border-white/10 text-slate-200">
                    "{summary}"
                  </div>
                ) : (
                  <button 
                    onClick={handleGenerateSummary}
                    disabled={isGeneratingSummary}
                    className="w-full py-4 sm:py-5 bg-white text-slate-900 font-black rounded-2xl sm:rounded-3xl text-[10px] sm:text-xs uppercase tracking-[0.2em] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isGeneratingSummary ? 'Channeling...' : 'Manifest My Experience'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Floating Action Button - Review */}
      {booking.status === BookingStatus.COMPLETED && !booking.review && !isReviewing && (
        <div className="fixed bottom-6 left-0 right-0 px-6 sm:px-4 max-w-lg mx-auto z-40">
           <button 
            onClick={() => setIsReviewing(true)}
            className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all uppercase text-[10px] sm:text-xs tracking-widest"
           >
            Rate this Experience
          </button>
        </div>
      )}

      {/* Review Modal - Mobile-first slide-up/fade */}
      {isReviewing && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[40px] p-8 sm:p-10 shadow-2xl relative animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setIsReviewing(false)} className="absolute top-6 right-6 text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
            <div className="text-center mb-8">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">How was it?</h3>
              <p className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest mt-1">{booking.name}</p>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${star <= reviewRating ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-50 text-slate-300'}`}
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Your thoughts..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:p-6 text-sm sm:text-base min-h-[100px]"
              />
              <button onClick={submitReview} disabled={reviewRating === 0} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl active:scale-95 transition-all uppercase text-[10px] sm:text-xs tracking-widest disabled:opacity-30">Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;
