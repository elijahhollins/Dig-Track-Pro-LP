import React, { useState } from 'react';
import { supabase } from './supabaseClient';
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
  Send
} from 'lucide-react';

const LeadFormModal = ({ isOpen, onClose, title }: { isOpen: boolean, onClose: () => void, title: string }) => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from('leads').insert([
      { full_name: fullName, business_name: businessName, email, phone, industry },
    ]);

    setSubmitting(false);

    if (insertError) {
      setError('Failed to submit form. Please check your connection and try again.');
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFullName('');
      setBusinessName('');
      setEmail('');
      setPhone('');
      setIndustry('');
      onClose();
    }, 3000);
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Full Name</label>
                      <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" placeholder="John Doe" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Business Name</label>
                      <input required type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" placeholder="Excavation Co." />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Work Email</label>
                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" placeholder="john@company.com" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Phone Number</label>
                    <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" placeholder="(555) 000-0000" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Industry</label>
                    <select required value={industry} onChange={e => setIndustry(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white">
                      <option value="">Select your industry</option>
                      <option value="excavation">Excavation Contractor</option>
                      <option value="utility">Utility Contractor</option>
                      <option value="sitework">Sitework Company</option>
                      <option value="boring">Directional Boring</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <button type="submit" disabled={submitting} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting ? 'Submitting…' : <><span>Submit Request</span> <Send className="w-5 h-5" /></>}
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
    <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
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
        className="relative hidden lg:block"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 p-4 aspect-video flex flex-col gap-4">
          <div className="h-8 w-full bg-zinc-100 rounded-lg flex items-center px-3 gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-zinc-50 rounded-xl p-4 border border-zinc-100">
              <div className="h-4 w-32 bg-zinc-200 rounded mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 w-full bg-white rounded-lg border border-zinc-100 flex items-center px-3 justify-between">
                    <div className="h-2 w-24 bg-zinc-100 rounded" />
                    <div className="h-4 w-12 bg-emerald-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 flex flex-col items-center justify-center gap-2">
              <Clock className="text-emerald-600 w-8 h-8" />
              <div className="h-2 w-16 bg-zinc-200 rounded" />
            </div>
          </div>
        </div>
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

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 bg-zinc-50 px-6">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-16">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-12">
        {[
          { step: "1", title: "Upload Your Tickets", desc: "Quickly enter your ticket details or upload your 811 confirmation emails. We'll extract the key dates for tracking." },
          { step: "2", title: "Organize by Project", desc: "Assign tickets to specific jobs or crews. This keeps your dashboard clean and ensures the right people see the right info." },
          { step: "3", title: "Stay Productive", desc: "Receive automated alerts when it's time to renew. Your office stays organized, and your crews stay digging." }
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
        <a href="#" className="hover:text-emerald-600">Support</a>
      </div>
    </div>
  </footer>
);

export default function App() {
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
