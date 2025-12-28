
import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { INITIAL_BOOKINGS } from './constants';
import { Booking, ServiceType, BookingStatus } from './types';
import BookingCard from './components/BookingCard';
import ServiceDetails from './components/ServiceDetails';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Miller',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    quote: "BaliQuest made our honeymoon absolutely seamless. The real-time itinerary tracking and the direct WhatsApp link to our driver Wayan was a lifesaver in Ubud's busy streets.",
    rating: 5
  },
  {
    id: 2,
    name: 'David Chen',
    location: 'Singapore',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    quote: "The 5-day explorer package was incredible value. I loved how the app handled all our transfers between Seminyak and the islands. Truly a worry-free luxury experience.",
    rating: 5
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    location: 'Madrid, Spain',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    quote: "The digital memory book feature is pure magic. It captured the spiritual essence of our temple tours perfectly. I've already shared my summary with all my friends!",
    rating: 5
  }
];

function AppContent() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'BUNDLE' | 'SINGLE'>('ALL');
  const navigate = useNavigate();

  const updateBooking = (updatedBooking: Booking) => {
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
  };

  const filteredBookings = useMemo(() => {
    if (activeCategory === 'SINGLE') {
      return bookings.filter(b => b.type === ServiceType.TOUR || b.type === ServiceType.ACTIVITY);
    }
    if (activeCategory === 'BUNDLE') {
      return bookings.filter(b => b.type === ServiceType.PACKAGE);
    }
    return bookings;
  }, [bookings, activeCategory]);

  const packages = filteredBookings.filter(b => b.type === ServiceType.PACKAGE);
  const singles = filteredBookings.filter(b => b.type !== ServiceType.PACKAGE);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Global Floating WhatsApp Button */}
      <a 
        href="https://wa.me/628123456789" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-[150] w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 hover:scale-110 hover:rotate-6 transition-all active:scale-95 group"
        aria-label="Contact support on WhatsApp"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
        <div className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
          Quick Support
        </div>
      </a>

      {/* Premium Navbar */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:rotate-6 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </div>
            <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">BaliQuest</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollToSection('experiences')} className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors">Experiences</button>
            <button onClick={() => scrollToSection('packages')} className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors">Packages</button>
            <button onClick={() => scrollToSection('itinerary')} className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors">My Itinerary</button>
            <button onClick={() => scrollToSection('about')} className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors">About Us</button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="hidden sm:block text-sm font-bold text-slate-500 px-4 py-2 hover:bg-slate-50 rounded-xl transition-colors">Login</button>
            <button onClick={() => scrollToSection('itinerary')} className="bg-slate-900 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xl shadow-slate-900/10 hover:bg-orange-600 transition-all whitespace-nowrap">My Itinerary</button>
          </div>
        </div>
      </header>

      <main className="pt-16 sm:pt-20">
        <Routes>
          <Route path="/" element={
            <div className="space-y-12 sm:space-y-20 pb-12 sm:pb-20">
              {/* Hero Section */}
              <section className="relative px-4 sm:px-6 pt-4 sm:pt-10">
                <div className="max-w-7xl mx-auto">
                  <div className="relative h-[450px] sm:h-[600px] rounded-[32px] sm:rounded-[48px] overflow-hidden shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1600&q=80" 
                      className="w-full h-full object-cover" 
                      alt="Uluwatu Cliff Bali"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                    
                    <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20">
                      <div className="max-w-2xl">
                        <span className="inline-block px-3 py-1 bg-orange-500 text-white rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-4 sm:mb-6 shadow-lg">Premium Experiences</span>
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-4 sm:mb-6">
                          Discover the <span className="text-orange-400 italic">Unseen</span> Beauty of Bali
                        </h1>
                        <p className="text-white/80 text-sm sm:text-lg md:text-xl max-w-lg mb-6 sm:mb-10 font-medium">
                          From private island escapes to multi-day cultural immersions. We craft journeys that stay with you forever.
                        </p>
                        
                        <div className="bg-white/10 backdrop-blur-2xl p-1.5 sm:p-2 rounded-[24px] sm:rounded-[32px] flex flex-col sm:flex-row gap-1 sm:gap-2 border border-white/20 shadow-2xl max-w-3xl">
                          <div className="flex-1 flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <div className="flex flex-col">
                              <span className="text-[8px] sm:text-[10px] font-black text-white/50 uppercase tracking-widest">Location</span>
                              <input type="text" placeholder="Where to go?" className="bg-transparent border-none p-0 text-white text-xs sm:text-base font-bold placeholder:text-white/30 focus:ring-0 w-full" />
                            </div>
                          </div>
                          <div className="flex-1 flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t sm:border-t-0 sm:border-l border-white/10">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <div className="flex flex-col">
                              <span className="text-[8px] sm:text-[10px] font-black text-white/50 uppercase tracking-widest">Date</span>
                              <input type="text" placeholder="When?" className="bg-transparent border-none p-0 text-white text-xs sm:text-base font-bold placeholder:text-white/30 focus:ring-0 w-full" />
                            </div>
                          </div>
                          <button className="bg-orange-500 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-[18px] sm:rounded-[24px] font-black uppercase text-[10px] sm:text-xs tracking-widest hover:bg-orange-600 transition-colors shadow-xl shadow-orange-500/20">
                            Explore
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Experiences Section */}
              <section id="experiences" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                <div className="text-center mb-10 sm:mb-16">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-3 sm:mb-4">Curated Adventures</span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight">Signature Experiences</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto font-medium text-sm sm:text-base px-4">Hand-picked single-day activities that capture the soul of Bali. Each experience is vetted for quality, safety, and cultural authenticity.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { title: 'Spiritual Temples', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80', price: '45', count: '12 Tours' },
                    { title: 'Hidden Waterfalls', img: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?auto=format&fit=crop&w=600&q=80', price: '35', count: '8 Tours' },
                    { title: 'Surf & Coast', img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80', price: '55', count: '15 Tours' },
                    { title: 'Active Volcanoes', img: 'https://images.unsplash.com/photo-1542125387-c71274d94f0a?auto=format&fit=crop&w=600&q=80', price: '80', count: '5 Tours' },
                  ].map((cat, i) => (
                    <div key={i} className="group relative h-64 sm:h-96 rounded-[24px] sm:rounded-[32px] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                      <img src={cat.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                        <span className="text-white/60 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{cat.count}</span>
                        <h3 className="text-lg sm:text-xl font-black text-white mb-1 sm:mb-2">{cat.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-orange-400 font-bold text-sm sm:text-base">from ${cat.price}</span>
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl flex items-center justify-center text-white group-hover:bg-orange-500 transition-colors">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Packages Section */}
              <section id="packages" className="bg-slate-900 py-16 sm:py-32 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
                  <div className="relative z-10 text-center lg:text-left">
                    <span className="inline-block px-3 py-1 bg-orange-500 text-white rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-4 sm:mb-6 shadow-lg">Bundled Journeys</span>
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6 sm:mb-8">
                      Everything Handled. <br className="hidden sm:block"/>
                      <span className="text-orange-500 italic">Pure Exploration.</span>
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-lg mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                      Our multi-day packages take the stress out of planning. We bundle the best hotels, private drivers, and curated activities into a single seamless experience.
                    </p>
                    
                    <div className="space-y-4 sm:space-y-6 mb-10 sm:mb-12">
                      {[
                        { icon: '🏨', text: 'Stunning Boutique Accommodations' },
                        { icon: '🚗', text: 'Private Driver & Luxury Transfers' },
                        { icon: '🗺️', text: 'Full Digital Itinerary & Guides' },
                      ].map((perk, i) => (
                        <div key={i} className="flex items-center justify-center lg:justify-start gap-4 text-white font-bold text-sm sm:text-base">
                          <span className="text-xl sm:text-2xl">{perk.icon}</span>
                          <span>{perk.text}</span>
                        </div>
                      ))}
                    </div>

                    <button className="bg-white text-slate-900 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-2xl">
                      View Signature Packages
                    </button>
                  </div>

                  <div className="relative mt-8 lg:mt-0">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-3 sm:space-y-4 pt-8 sm:pt-12">
                         <img src="https://images.unsplash.com/photo-1573108724029-4c46571d6490?auto=format&fit=crop&w=400&q=80" className="rounded-[20px] sm:rounded-[32px] w-full h-48 sm:h-64 object-cover shadow-2xl" alt="Bali Villa Pool" />
                         <img src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=400&q=80" className="rounded-[20px] sm:rounded-[32px] w-full h-64 sm:h-80 object-cover shadow-2xl" alt="Bali Temple Gate" />
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                         <img src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=400&q=80" className="rounded-[20px] sm:rounded-[32px] w-full h-64 sm:h-80 object-cover shadow-2xl" alt="Bali River" />
                         <img src="https://images.unsplash.com/photo-1537519646099-335112f03225?auto=format&fit=crop&w=400&q=80" className="rounded-[20px] sm:rounded-[32px] w-full h-48 sm:h-64 object-cover shadow-2xl" alt="Bali Coast" />
                      </div>
                    </div>
                    {/* Floating Badge */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 w-24 h-24 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center text-white shadow-2xl border-[6px] sm:border-8 border-slate-900 rotate-12">
                      <span className="text-[8px] sm:text-[10px] font-black uppercase">Starts at</span>
                      <span className="text-xl sm:text-2xl font-black">$499</span>
                    </div>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-32 -right-32 w-64 sm:w-96 h-64 sm:h-96 bg-orange-500/10 blur-[80px] sm:blur-[120px] rounded-full" />
                <div className="absolute -bottom-32 -left-32 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/10 blur-[80px] sm:blur-[120px] rounded-full" />
              </section>

              {/* My Itinerary Section */}
              <section id="itinerary" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">My Itinerary</h2>
                    <p className="text-slate-500 font-medium max-w-lg text-sm sm:text-base">Manage your active bookings and upcoming adventures.</p>
                  </div>
                  
                  <div className="flex p-1 bg-slate-100 rounded-xl sm:rounded-2xl w-full sm:w-fit overflow-x-auto">
                    {(['ALL', 'BUNDLE', 'SINGLE'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                          activeCategory === cat ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {cat === 'BUNDLE' ? 'Packages' : cat === 'SINGLE' ? 'Activities' : 'All'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-10 sm:space-y-16">
                  {(activeCategory === 'ALL' || activeCategory === 'BUNDLE') && packages.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
                      {packages.map(booking => (
                        <BookingCard key={booking.id} booking={booking} onClick={() => navigate(`/booking/${booking.id}`)} />
                      ))}
                    </div>
                  )}

                  {(activeCategory === 'ALL' || activeCategory === 'SINGLE') && singles.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {singles.map(booking => (
                        <BookingCard key={booking.id} booking={booking} onClick={() => navigate(`/booking/${booking.id}`)} />
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* About Us Section */}
              <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 border-t border-slate-100">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
                  <div className="relative">
                    <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80" className="rounded-[32px] sm:rounded-[48px] shadow-2xl object-cover h-[350px] sm:h-[500px] w-full" alt="Ketut Ardhana Guide" />
                    <div className="absolute -bottom-6 sm:-bottom-10 right-4 sm:-right-10 bg-white p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] shadow-xl border border-slate-50 max-w-[240px] sm:max-w-xs">
                      <p className="text-slate-500 italic text-xs sm:text-sm font-medium leading-relaxed">
                        "We started BaliQuest to bridge the gap between digital travelers and the deep cultural heartbeat of our island."
                      </p>
                      <div className="mt-4">
                        <span className="block font-black text-slate-900 text-xs sm:text-sm">Ketut Ardhana</span>
                        <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase">Co-Founder</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center lg:text-left pt-8 lg:pt-0">
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">Our Mission</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 sm:mb-8 leading-tight">The Spirit of Bali in Every Journey.</h2>
                    <div className="space-y-4 sm:space-y-6 text-slate-500 font-medium leading-relaxed text-sm sm:text-base">
                      <p>BaliQuest isn't just a booking platform. We are a locally-owned collective dedicated to preserving the cultural integrity of our home while providing world-class travel technology.</p>
                      <p>Every driver you meet, every guide you chat with, and every host you stay with is part of our local empowerment network.</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-10 sm:mt-12">
                       <div>
                         <span className="block text-2xl sm:text-3xl font-black text-slate-900">70%</span>
                         <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase">Local Revenue</span>
                       </div>
                       <div>
                         <span className="block text-2xl sm:text-3xl font-black text-slate-900">120+</span>
                         <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase">Guides</span>
                       </div>
                       <div>
                         <span className="block text-2xl sm:text-3xl font-black text-slate-900">15+</span>
                         <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase">Villages</span>
                       </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Testimonials Section */}
              <section className="bg-slate-50/50 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                  <div className="text-center mb-12 sm:mb-16">
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-3 sm:mb-4">Traveler Stories</span>
                    <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">What Our Adventurers Say</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {TESTIMONIALS.map((t) => (
                      <div key={t.id} className="bg-white p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] shadow-sm border border-slate-100 relative group hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500">
                        <div className="absolute top-6 sm:top-8 right-8 sm:right-10 text-slate-100 group-hover:text-orange-100 transition-colors">
                          <svg className="w-8 h-8 sm:w-12 sm:h-12 fill-current" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V5C14.017 3.89543 14.9124 3 16.017 3H19.017C21.2261 3 23.017 4.79086 23.017 7V15C23.017 18.3137 20.3307 21 17.017 21H14.017ZM1.017 21L1.017 18C1.017 16.8954 1.91243 16 3.017 16H6.017C6.56928 16 7.017 15.5523 7.017 15V9C7.017 8.44772 6.56928 8 6.017 8H3.017C1.91243 8 1.017 7.10457 1.017 6V5C1.017 3.89543 1.91243 3 3.017 3H6.017C8.22614 3 10.017 4.79086 10.017 7V15C10.017 18.3137 7.33071 21 4.017 21H1.017Z" /></svg>
                        </div>
                        <div className="flex gap-0.5 sm:gap-1 mb-6">
                          {[...Array(t.rating)].map((_, i) => (
                            <svg key={i} className="w-3.5 h-3.5 text-orange-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          ))}
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed mb-8 relative z-10 text-sm sm:text-base">"{t.quote}"</p>
                        <div className="flex items-center gap-4 border-t border-slate-50 pt-8">
                          <img src={t.avatar} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover shadow-sm" alt={t.name} />
                          <div>
                            <h4 className="font-black text-slate-900 leading-none mb-1 text-sm sm:text-base">{t.name}</h4>
                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Newsletter / CTA Section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="bg-slate-900 rounded-[32px] sm:rounded-[48px] p-8 sm:p-20 text-center relative overflow-hidden shadow-2xl shadow-slate-900/40">
                  <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-2xl sm:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">Want personalized travel tips?</h2>
                    <p className="text-slate-400 text-sm sm:text-lg mb-8 sm:mb-10">Join 50,000+ travelers getting exclusive Bali deals and hidden gem locations every week.</p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
                      <input type="email" placeholder="Email address" className="flex-1 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3 sm:py-4 text-white focus:ring-orange-500 focus:border-orange-500 placeholder:text-white/30 text-sm" />
                      <button className="bg-orange-500 text-white px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 whitespace-nowrap">Subscribe</button>
                    </div>
                  </div>
                  {/* Decorative */}
                  <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-orange-500/10 blur-[80px] sm:blur-[100px] rounded-full" />
                  <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-sky-500/10 blur-[80px] sm:blur-[100px] rounded-full" />
                </div>
              </section>
            </div>
          } />
          <Route path="/booking/:id" element={<ServiceDetailsWrapper bookings={bookings} updateBooking={updateBooking} />} />
        </Routes>
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center sm:text-left">
          <div className="col-span-2 md:col-span-1 flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 mb-6">
               <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </div>
              <span className="text-lg font-black text-slate-900">BaliQuest</span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">Redefining Balinese hospitality through technology and local heart. Since 2018.</p>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-100 rounded-lg hover:bg-orange-100 hover:text-orange-600 cursor-pointer transition-colors" />)}
            </div>
          </div>
          {['Explore', 'Company', 'Support'].map((col) => (
            <div key={col} className="col-span-1">
              <h4 className="font-black text-slate-900 uppercase text-[9px] sm:text-xs tracking-widest mb-4 sm:mb-6">{col}</h4>
              <ul className="space-y-3 sm:space-y-4">
                {col === 'Explore' ? (
                  ['Experiences', 'Packages', 'Destinations'].map((item) => (
                    <li key={item}><a href="#" className="text-[11px] sm:text-sm font-medium text-slate-400 hover:text-orange-500 transition-colors">{item}</a></li>
                  ))
                ) : col === 'Company' ? (
                  ['About Us', 'Sustainability', 'Guides'].map((item) => (
                    <li key={item}><a href="#" className="text-[11px] sm:text-sm font-medium text-slate-400 hover:text-orange-500 transition-colors">{item}</a></li>
                  ))
                ) : (
                  ['FAQ', 'Safety First', 'Contact'].map((item) => (
                    <li key={item}><a href="#" className="text-[11px] sm:text-sm font-medium text-slate-400 hover:text-orange-500 transition-colors">{item}</a></li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 mt-12 sm:mt-20 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <p className="text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">© 2024 BaliQuest. All Rights Reserved.</p>
          <div className="flex gap-6 sm:gap-8">
            <a href="#" className="text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceDetailsWrapper({ bookings, updateBooking }: { bookings: Booking[], updateBooking: (b: Booking) => void }) {
  const { id } = useParams();
  const booking = bookings.find(b => b.id === id);
  if (!booking) return <div className="text-center py-40 font-black text-slate-300 text-2xl sm:text-3xl uppercase tracking-tighter">Experience Not Found</div>;
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <ServiceDetails booking={booking} onUpdate={updateBooking} />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
