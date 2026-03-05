import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  LayoutDashboard, 
  Bell, 
  Smartphone, 
  FileArchive, 
  RefreshCw,
  ArrowRight,
  Clock,
  HardHat,
  Construction,
  X,
  Send,
  Loader2
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { AdminLogin, AdminDashboard } from './components/Admin';

const LeadFormModal = ({ isOpen, onClose, title }: { isOpen: boolean, onClose: () => void, title: string }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    industry: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('leads')
        .insert([
          { 
            full_name: formData.fullName,
            business_name: formData.businessName,
            email: formData.email,
            phone: formData.phone,
            industry: formData.industry,
            source_cta: title,
            created_at: new Date().toISOString()
          }
        ]);

      if (supabaseError) {
        console.error('Supabase Error Details:', supabaseError);
        throw new Error(supabaseError.message || 'Failed to save to database');
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ fullName: '', businessName: '', email: '', phone: '', industry: '' });
        onClose();
      }, 3000);
    } catch (err: any) {
      console.error('Error saving lead:', err);
      setError(err.message || 'Something went wrong. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900">{title}</h3>
                  <p className="text-zinc-500 mt-1 text-sm">Fill out the form below and our team will reach out shortly.</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-zinc-900 mb-2">Request Received!</h4>
                  <p className="text-zinc-600">We'll be in touch within one business day.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Full Name</label>
                      <input 
                        required 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Business Name</label>
                      <input 
                        required 
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                        placeholder="Excavation Co." 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Work Email</label>
                    <input 
                      required 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email" 
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                      placeholder="john@company.com" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Phone Number</label>
                    <input 
                      required 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel" 
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                      placeholder="(555) 000-0000" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Industry</label>
                    <select 
                      required 
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                    >
                      <option value="">Select your industry</option>
                      <option value="excavation">Excavation Contractor</option>
                      <option value="utility">Utility Contractor</option>
                      <option value="sitework">Sitework Company</option>
                      <option value="boring">Directional Boring</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>Processing... <Loader2 className="w-5 h-5 animate-spin" /></>
                    ) : (
                      <>Submit Request <Send className="w-5 h-5" /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ onOpenModal }: { onOpenModal: (title: string) => void }) => (
  <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full border-b border-black/5">
    <div className="flex items-center gap-2">
      <Construction className="w-8 h-8 text-emerald-600" />
      <span className="text-xl font-bold tracking-tight text-zinc-900">Dig Track Pro</span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
      <a href="#problem" className="hover:text-emerald-600 transition-colors">The Problem</a>
      <a href="#solution" className="hover:text-emerald-600 transition-colors">Our Solution</a>
      <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</a>
    </div>
    <button 
      onClick={() => onOpenModal("Start Your Free Trial")}
      className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
    >
      Start Free Trial
    </button>
  </nav>
);

const Hero = ({ onOpenModal }: { onOpenModal: (title: string) => void }) => (
  <section className="relative pt-20 pb-32 px-6 overflow-hidden">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Trusted by 500+ Contractors
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1] mb-6">
          Stop Chasing 811 Tickets. <br />
          <span className="text-emerald-600 text-4xl md:text-5xl">Start Running Your Jobs.</span>
        </h1>
        <p className="text-xl text-zinc-600 mb-8 max-w-2xl leading-relaxed">
          Dig Track Pro is the only centralized dashboard built specifically for excavation contractors to organize and track 811 tickets across every job site. Stay organized. Stay compliant. Stay in control.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => onOpenModal("Start Your Free Trial")}
            className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            Start Your 14-Day Free Trial <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onOpenModal("Talk to an Expert")}
            className="bg-white text-zinc-900 border border-zinc-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-zinc-50 transition-all"
          >
            Talk to an Expert
          </button>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="relative z-10 bg-zinc-900 rounded-2xl shadow-2xl border border-white/10 p-2 overflow-hidden aspect-video group cursor-pointer">
          <img 
            src="https://picsum.photos/seed/excavator/1200/800" 
            alt="App Dashboard Screenshot" 
            className="w-full h-full object-cover rounded-xl opacity-60 group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-600/40 group-hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <p className="text-white font-bold text-sm">Watch Demo: How to track 100+ tickets in 5 minutes</p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-600/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-600/10 blur-3xl rounded-full" />
      </motion.div>
    </div>
  </section>
);

const Problem = () => (
  <section id="problem" className="py-24 bg-zinc-50 px-6">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">The "Ticket Chaos" is Costing You More Than You Realize.</h2>
        <p className="text-lg text-zinc-600 leading-relaxed">
          If you’re running an excavation company, a utility crew, or a sitework business, you know the "811 dance." It starts with an email. Then a portal login. Then a phone call from a foreman asking if the gas line has been marked. Then another email.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {[
          { icon: <AlertTriangle className="text-red-500" />, title: "The Inbox Black Hole", desc: "Tickets are scattered across office emails and foremen's personal accounts." },
          { icon: <Clock className="text-amber-500" />, title: "The Renewal Guessing Game", desc: "Nobody knows exactly when a ticket expires without logging into clunky portals." },
          { icon: <Smartphone className="text-blue-500" />, title: "The Communication Gap", desc: "The office thinks the ticket is good; the field knows the locators haven't shown up." },
          { icon: <FileArchive className="text-zinc-500" />, title: "The Documentation Disaster", desc: "Scrambling to find original tickets and photos when a utility hit happens." },
          { icon: <HardHat className="text-emerald-500" />, title: "The Idle Crew Cost", desc: "Every hour a crew waits for a renewal is an hour of lost profit." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 flex gap-4">
            <div className="shrink-0">{item.icon}</div>
            <div>
              <h3 className="font-bold text-zinc-900 mb-1">{item.title}</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Solution = () => (
  <section id="solution" className="py-24 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">One Dashboard. Every Ticket. Total Control.</h2>
          <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
            Dig Track Pro was built by people who understand the dirt business. We didn't build this for the utility companies or the locators. We built it for the contractors who actually have to move the earth.
          </p>
          <div className="space-y-6">
            {[
              { icon: <LayoutDashboard />, title: "Centralized Ticket Management", desc: "Stop digging through emails. See every active ticket in your company on one clean, manual-entry dashboard." },
              { icon: <Bell />, title: "Proactive Expiration Alerts", desc: "Set your dates and get alerts 48h, 24h, and 2h before a ticket goes 'cold' so you're never caught off guard." },
              { icon: <Smartphone />, title: "Field-First Access", desc: "Give foremen a mobile-optimized view of their specific jobs without them calling the office." },
              { icon: <FileArchive />, title: "Photo & Document Archiving", desc: "Upload mark-out photos directly to the ticket record. Every record is archived forever for your protection." },
              { icon: <Clock />, title: "Renewal Tracking", desc: "Log your renewal dates and track the history of every ticket. Never lose track of which tickets need attention." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 mb-1">{feature.title}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <h4 className="text-emerald-400 font-bold mb-4 uppercase tracking-wider text-sm">Risk Protection</h4>
            <h3 className="text-2xl font-bold mb-6">Protect Your Profit and Your Reputation.</h3>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              In excavation, your reputation is everything. But one utility hit can change that in an instant. Most hits aren't caused by negligence; they're caused by bad information.
            </p>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-emerald-400" />
                <span className="font-bold">Insurance Policy for Your Digs</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Dig Track Pro acts as your insurance policy against "expired ticket" hits. By centralizing your documentation, you also protect yourself against "falsely attributed" hits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ProductShowcase = () => (
  <section className="py-24 px-6 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Built for the Field, Managed in the Office</h2>
        <p className="text-zinc-600 max-w-2xl mx-auto">Take a look at how Dig Track Pro transforms your messy ticket management into a streamlined workflow.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { 
            img: "https://picsum.photos/seed/heavy-machinery/800/600", 
            title: "Central Dashboard", 
            desc: "A bird's eye view of every active ticket across all your projects." 
          },
          { 
            img: "https://picsum.photos/seed/construction-worker/800/600", 
            title: "Mobile Field Access", 
            desc: "Foremen can check ticket status and upload mark-out photos on site." 
          },
          { 
            img: "https://picsum.photos/seed/blueprint/800/600", 
            title: "Smart Notifications", 
            desc: "Never miss a renewal deadline with our proactive alert system." 
          }
        ].map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="bg-zinc-50 rounded-3xl overflow-hidden border border-zinc-200 group"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-zinc-900 mb-2">{item.title}</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 bg-zinc-50 px-6">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-16">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-12">
        {[
          { step: "1", title: "Upload Your Tickets", desc: "Quickly enter your ticket details or upload your 811 confirmation emails. We'll extract the key dates for tracking." },
          { step: "2", title: "Organize by Project", desc: "Assign tickets to specific jobs or crews. This keeps your dashboard clean and ensures the right people see the right info." },
          { step: "3", title: "Stay Productive", desc: "Receive proactive alerts when it's time to renew. Your office stays organized, and your crews stay digging." }
        ].map((item, i) => (
          <div key={i} className="relative">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-6 shadow-lg shadow-emerald-600/20">
              {item.step}
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">{item.title}</h3>
            <p className="text-zinc-600 leading-relaxed">{item.desc}</p>
            {i < 2 && (
              <div className="hidden lg:block absolute top-6 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-zinc-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTA = ({ onOpenModal }: { onOpenModal: (title: string) => void }) => (
  <section className="py-24 px-6">
    <div className="max-w-5xl mx-auto bg-emerald-600 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-600/30">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
      <div className="relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Stop Managing Tickets. <br />Start Managing Your Business.</h2>
        <p className="text-xl text-emerald-50 mb-12 max-w-2xl mx-auto">
          The "Ticket Chaos" ends today. Join the hundreds of contractors who have traded their sticky notes for Dig Track Pro.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => onOpenModal("Start Your Free Trial")}
            className="bg-white text-emerald-600 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-emerald-50 transition-all shadow-xl"
          >
            Start Your Free Trial
          </button>
          <button 
            onClick={() => onOpenModal("Talk to an Expert")}
            className="bg-emerald-700/50 text-white border border-white/20 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-emerald-700/70 transition-all"
          >
            Talk to an Expert
          </button>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 border-t border-zinc-200 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2">
        <Construction className="w-6 h-6 text-emerald-600" />
        <span className="text-lg font-bold text-zinc-900">Dig Track Pro</span>
      </div>
      <div className="text-sm text-zinc-500">
        © {new Date().getFullYear()} Dig Track Pro. Built for contractors who move the earth.
      </div>
      <div className="flex gap-6 text-sm font-medium text-zinc-600">
        <a href="#" className="hover:text-emerald-600">Privacy</a>
        <a href="#" className="hover:text-emerald-600">Terms</a>
        <Link to="/admin" className="opacity-0 hover:opacity-100 transition-opacity text-[10px]">Admin</Link>
      </div>
    </div>
  </footer>
);

function LandingPage() {
  const [modalState, setModalState] = useState<{ isOpen: boolean; title: string }>({
    isOpen: false,
    title: "",
  });

  const openModal = (title: string) => setModalState({ isOpen: true, title });
  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar onOpenModal={openModal} />
      <main>
        <Hero onOpenModal={openModal} />
        <Problem />
        <ProductShowcase />
        <Solution />
        <HowItWorks />
        <CTA onOpenModal={openModal} />
      </main>
      <Footer />
      <LeadFormModal 
        isOpen={modalState.isOpen} 
        onClose={closeModal} 
        title={modalState.title} 
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

function AdminRoutes() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={session ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />} 
      />
      <Route 
        path="/dashboard" 
        element={session ? <AdminDashboard /> : <Navigate to="/admin" replace />} 
      />
    </Routes>
  );
}
