import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, 
  LogOut, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  User,
  Search,
  Filter,
  ArrowUpDown,
  Loader2,
  ChevronRight,
  Construction,
  Settings,
  Image as ImageIcon,
  Type,
  Save,
  Plus,
  Trash2,
  Upload,
  Globe,
  MessageSquare
} from 'lucide-react';

interface Lead {
  id: string;
  created_at: string;
  full_name: string;
  business_name: string;
  email: string;
  phone: string;
  industry: string;
  source_cta: string;
}

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-2 mb-8 justify-center">
              <Construction className="w-8 h-8 text-emerald-600" />
              <span className="text-xl font-bold tracking-tight text-zinc-900">Dig Track Admin</span>
            </div>
            
            <h1 className="text-2xl font-bold text-zinc-900 mb-2 text-center">Welcome Back</h1>
            <p className="text-zinc-500 text-center mb-8">Sign in to manage your leads</p>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="admin@digtrack.pro"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Password</label>
                <input 
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button 
                disabled={loading}
                type="submit"
                className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
        <p className="text-center mt-8 text-zinc-400 text-xs">
          Secure access only. Unauthorized attempts are logged.
        </p>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'leads' | 'site'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Site Content State
  const [siteContent, setSiteContent] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchSiteContent();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
    } finally {
      if (activeTab === 'leads') setLoading(false);
    }
  };

  const fetchSiteContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('id', 'main')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSiteContent(data.content);
      } else {
        // Default content if none exists
        const defaultContent = {
          hero: {
            title: "Stop Chasing 811 Tickets. Start Running Your Jobs.",
            subtitle: "Dig Track Pro is the only centralized dashboard built specifically for excavation contractors to organize and track 811 tickets across every job site.",
            image: "https://picsum.photos/seed/excavator/1200/800"
          },
          showcase: [
            { img: "https://picsum.photos/seed/heavy-machinery/800/600", title: "Central Dashboard", desc: "A bird's eye view of every active ticket across all your projects." },
            { img: "https://picsum.photos/seed/construction-worker/800/600", title: "Mobile Field Access", desc: "Foremen can check ticket status and upload mark-out photos on site." },
            { img: "https://picsum.photos/seed/blueprint/800/600", title: "Smart Notifications", desc: "Never miss a renewal deadline with our proactive alert system." }
          ],
          cta: {
            title: "Stop Managing Tickets. Start Managing Your Business.",
            subtitle: "The \"Ticket Chaos\" ends today. Join the hundreds of contractors who have traded their sticky notes for Dig Track Pro."
          },
          footer: {
            text: `© ${new Date().getFullYear()} Dig Track Pro. Built for contractors who move the earth.`
          }
        };
        setSiteContent(defaultContent);
      }
    } catch (err: any) {
      console.error('Error fetching site content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSiteContent = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({ id: 'main', content: siteContent });

      if (error) throw error;
      alert('Site content saved successfully!');
    } catch (err: any) {
      console.error('Error saving site content:', err);
      alert('Failed to save content: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `site/${fileName}`;

      // Try to upload to 'site-assets' bucket
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes('bucket not found')) {
          throw new Error('Storage bucket "site-assets" not found. Please create it in your Supabase dashboard with public access.');
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      // Update state based on path
      const newContent = { ...siteContent };
      if (path === 'hero') {
        newContent.hero.image = publicUrl;
      } else if (path.startsWith('showcase-')) {
        const idx = parseInt(path.split('-')[1]);
        newContent.showcase[idx].img = publicUrl;
      }
      setSiteContent(newContent);
      alert('Image uploaded successfully!');
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const filteredLeads = leads.filter(lead => 
    lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Sidebar/Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">Lead Dashboard</h1>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Dig Track Pro Admin</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('leads')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'leads' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                <User className="w-4 h-4" />
                Leads
              </button>
              <button 
                onClick={() => setActiveTab('site')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'site' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                <Settings className="w-4 h-4" />
                Site Editor
              </button>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-zinc-500 hover:text-red-600 transition-colors font-medium text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'leads' ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Total Leads</p>
                <h3 className="text-3xl font-bold text-zinc-900">{leads.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Last 7 Days</p>
                <h3 className="text-3xl font-bold text-zinc-900">
                  {leads.filter(l => new Date(l.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Conversion Rate</p>
                <h3 className="text-3xl font-bold text-zinc-900">100%</h3>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search leads by name, business or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-all">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-all">
                    <ArrowUpDown className="w-4 h-4" />
                    Sort
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50/50">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Lead Info</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Business</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Industry</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Source</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Date</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-900">{lead.full_name}</span>
                            <span className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" /> {lead.email}
                            </span>
                            <span className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" /> {lead.phone}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-zinc-700 font-medium">
                            <Building2 className="w-4 h-4 text-zinc-400" />
                            {lead.business_name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider">
                            {lead.industry}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-zinc-600">{lead.source_cta}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-zinc-500 text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-zinc-400 hover:text-emerald-600">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                          No leads found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">Site Content Editor</h2>
                <p className="text-zinc-500 text-sm">Update your landing page text and images in real-time.</p>
              </div>
              <button 
                onClick={handleSaveSiteContent}
                disabled={saving}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-70"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Hero Section Editor */}
              <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                  <ImageIcon className="text-emerald-600 w-5 h-5" />
                  <h3 className="font-bold text-zinc-900">Hero Section</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Hero Title</label>
                    <input 
                      type="text"
                      value={siteContent?.hero?.title || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, hero: { ...siteContent.hero, title: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Hero Subtitle</label>
                    <textarea 
                      rows={3}
                      value={siteContent?.hero?.subtitle || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, hero: { ...siteContent.hero, subtitle: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Hero Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-16 rounded-lg border border-zinc-200 overflow-hidden bg-zinc-50">
                        {siteContent?.hero?.image ? (
                          <img src={siteContent.hero.image} alt="Hero preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input 
                          type="text"
                          placeholder="Image URL"
                          value={siteContent?.hero?.image || ''}
                          onChange={(e) => setSiteContent({ ...siteContent, hero: { ...siteContent.hero, image: e.target.value } })}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-[10px] font-bold text-zinc-600 cursor-pointer transition-all">
                          <Upload className="w-3 h-3" />
                          Upload Image
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleImageUpload(e, 'hero')}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section Editor */}
              <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                  <MessageSquare className="text-emerald-600 w-5 h-5" />
                  <h3 className="font-bold text-zinc-900">Call to Action (CTA)</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">CTA Title</label>
                    <input 
                      type="text"
                      value={siteContent?.cta?.title || 'Stop Managing Tickets. Start Managing Your Business.'}
                      onChange={(e) => setSiteContent({ ...siteContent, cta: { ...(siteContent.cta || {}), title: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">CTA Subtitle</label>
                    <textarea 
                      rows={3}
                      value={siteContent?.cta?.subtitle || 'The "Ticket Chaos" ends today. Join the hundreds of contractors who have traded their sticky notes for Dig Track Pro.'}
                      onChange={(e) => setSiteContent({ ...siteContent, cta: { ...(siteContent.cta || {}), subtitle: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Section Editor */}
              <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                  <Globe className="text-emerald-600 w-5 h-5" />
                  <h3 className="font-bold text-zinc-900">Footer Section</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Footer Text</label>
                    <input 
                      type="text"
                      value={siteContent?.footer?.text || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, footer: { ...(siteContent.footer || {}), text: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Showcase Editor */}
              <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6 lg:col-span-2">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="text-emerald-600 w-5 h-5" />
                    <h3 className="font-bold text-zinc-900">Product Showcase</h3>
                  </div>
                  <button 
                    onClick={() => {
                      const newShowcase = [...(siteContent?.showcase || []), { img: '', title: 'New Feature', desc: '' }];
                      setSiteContent({ ...siteContent, showcase: newShowcase });
                    }}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>

                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {siteContent?.showcase?.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 relative group">
                      <button 
                        onClick={() => {
                          const newShowcase = siteContent.showcase.filter((_: any, i: number) => i !== idx);
                          setSiteContent({ ...siteContent, showcase: newShowcase });
                        }}
                        className="absolute top-2 right-2 p-1.5 text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-3">
                        <input 
                          type="text"
                          placeholder="Title"
                          value={item.title}
                          onChange={(e) => {
                            const newShowcase = [...siteContent.showcase];
                            newShowcase[idx].title = e.target.value;
                            setSiteContent({ ...siteContent, showcase: newShowcase });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm font-bold"
                        />
                        <textarea 
                          placeholder="Description"
                          rows={2}
                          value={item.desc}
                          onChange={(e) => {
                            const newShowcase = [...siteContent.showcase];
                            newShowcase[idx].desc = e.target.value;
                            setSiteContent({ ...siteContent, showcase: newShowcase });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs resize-none"
                        />
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-lg border border-zinc-200 overflow-hidden bg-white shrink-0">
                            {item.img ? (
                              <img src={item.img} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <input 
                              type="text"
                              placeholder="Image URL"
                              value={item.img}
                              onChange={(e) => {
                                const newShowcase = [...siteContent.showcase];
                                newShowcase[idx].img = e.target.value;
                                setSiteContent({ ...siteContent, showcase: newShowcase });
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs"
                            />
                            <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-zinc-100 rounded-lg text-[10px] font-bold text-zinc-600 cursor-pointer border border-zinc-200 transition-all">
                              <Upload className="w-3 h-3" />
                              Upload
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleImageUpload(e, `showcase-${idx}`)}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
