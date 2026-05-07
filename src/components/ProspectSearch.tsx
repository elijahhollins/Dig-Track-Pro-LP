import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import {
  Search,
  Loader2,
  MapPin,
  Building2,
  Users,
  Wrench,
  Linkedin,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';

interface Prospect {
  company: string;
  city: string;
  type: string;
  size: string;
  services: string;
  priority: 'high' | 'medium' | 'low';
  priorityReason: string;
  linkedinSearch: string;
  outreachAngle: string;
}

const CONTRACTOR_TYPES = [
  'All Types',
  'Excavation',
  'Utility',
  'Underground',
  'Directional Boring',
  'Street Lighting',
];

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low: 'bg-slate-600/50 text-slate-400 border-slate-600',
};

export function ProspectSearch() {
  const [area, setArea] = useState('');
  const [type, setType] = useState('All Types');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prospects, setProspects] = useState<Prospect[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!area.trim()) return;

    setLoading(true);
    setError(null);
    setProspects([]);

    const contractorType =
      type === 'All Types'
        ? 'excavation, utility, or underground contractor'
        : type.toLowerCase();

    const systemPrompt = `You are a B2B sales research assistant for DigTrack Pro, a SaaS platform that helps excavation and utility contractors manage their 811 locate tickets and stay JULIE compliant.

The ideal customer:
- Excavation, utility, underground, directional boring, or street lighting contractor
- Based in Chicagoland / Illinois
- Running 3+ crews across 5+ active job sites
- Calls 811 / JULIE before digging

Generate a list of 8 realistic contractor companies that would be ideal DigTrack Pro customers for the given area and type.

Return ONLY a valid JSON array — no markdown, no explanation, no backticks. Exactly this structure:
[
  {
    "company": "Company Name",
    "city": "City, IL",
    "type": "contractor type",
    "size": "estimated employee count e.g. 15-30 employees",
    "services": "brief description of services",
    "priority": "high|medium|low",
    "priorityReason": "one sentence why they are a strong DigTrack Pro fit",
    "linkedinSearch": "exact search string to find them on LinkedIn",
    "outreachAngle": "specific personalized outreach angle for this company type"
  }
]`;

    const userPrompt = `Find ${contractorType} contractors in ${area} that would be ideal DigTrack Pro customers. Make them realistic and believable for the Illinois contractor market. Return only the JSON array.`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      const text = response.text ?? '';
      const clean = text.replace(/```json|```/g, '').trim();

      let parsed: Prospect[] = [];
      try {
        parsed = JSON.parse(clean);
      } catch {
        console.error('JSON parse error:', text);
        setError('Failed to parse AI response. Please try again.');
        return;
      }

      setProspects(parsed);
    } catch (err: any) {
      console.error('Gemini error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Prospect Search</h2>
        <p className="text-slate-500 text-sm mt-1">
          AI-powered search to find ideal DigTrack Pro customers in your target area.
        </p>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Enter area (e.g. Chicago, IL or Northwest Suburbs)"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
            />
          </div>

          <div className="relative w-full md:w-56">
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
            >
              {CONTRACTOR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !area.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20 whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching…
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Find Prospects
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {prospects.length > 0 && (
        <div>
          <p className="text-slate-400 text-sm mb-4">
            Found <span className="font-bold text-white">{prospects.length}</span> prospects in{' '}
            <span className="font-bold text-white">{area}</span>
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {prospects.map((p, i) => (
              <div
                key={i}
                className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4 hover:border-slate-600 transition-colors"
              >
                {/* Company header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{p.company}</h3>
                    <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {p.city}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${PRIORITY_COLORS[p.priority] ?? PRIORITY_COLORS.low}`}
                  >
                    {p.priority}
                  </span>
                </div>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-700/60 rounded-full px-2.5 py-1">
                    <Wrench className="w-3 h-3" />
                    {p.type}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-700/60 rounded-full px-2.5 py-1">
                    <Users className="w-3 h-3" />
                    {p.size}
                  </span>
                </div>

                {/* Services */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" />
                    Services
                  </p>
                  <p className="text-slate-300 text-sm">{p.services}</p>
                </div>

                {/* Priority reason */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Why DigTrack Fit
                  </p>
                  <p className="text-slate-300 text-xs leading-relaxed">{p.priorityReason}</p>
                </div>

                {/* Outreach angle */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3" />
                    Outreach Angle
                  </p>
                  <p className="text-slate-300 text-xs leading-relaxed">{p.outreachAngle}</p>
                </div>

                {/* LinkedIn search */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                    <Linkedin className="w-3 h-3" />
                    LinkedIn Search
                  </p>
                  <a
                    href={`https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(p.linkedinSearch)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 text-xs break-all transition-colors"
                  >
                    {p.linkedinSearch}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && prospects.length === 0 && !error && (
        <div className="text-center py-20 text-slate-600">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">Enter an area above to find ideal prospects.</p>
        </div>
      )}
    </div>
  );
}
