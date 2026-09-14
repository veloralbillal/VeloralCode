import React, { useState, useMemo } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  Calendar,
  Calculator,
  Mail,
  Send,
  Sparkles,
  Share2,
  Globe,
  Github,
  Twitter,
  Youtube,
  Instagram,
  Linkedin,
  Disc as DiscordIcon,
  Check,
  TrendingUp,
  Layers,
  Link2,
  Code2,
  Star,
  GitFork,
  Newspaper,
  ShoppingBag,
  Clock,
  Tag,
} from 'lucide-react';
import { Profile, Block } from '../types';
import { linkForgeService } from '../services/linkForgeService';
import { BioMainNav } from './BioMainNav';

interface BioViewProps {
  profile: Profile;
  isSimulator?: boolean;
  onBlockClick?: (blockId: string) => void;
  onShare?: () => void;
  onNavigate?: (route: string) => void;
  onOpenMainMenu?: () => void;
}

export const BioView: React.FC<BioViewProps> = ({
  profile,
  isSimulator = false,
  onBlockClick,
  onShare,
  onNavigate,
  onOpenMainMenu,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Interactive widgets state
  const [calculatorHours, setCalculatorHours] = useState<number>(10);
  const [calculatorHourlyRate, setCalculatorHourlyRate] = useState<number>(65);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Tip Jar / Coffee state
  const [selectedTipAmount, setSelectedTipAmount] = useState<number>(5);
  const [tipSuccess, setTipSuccess] = useState(false);

  const handleLinkClick = (block: Block, e?: React.MouseEvent) => {
    linkForgeService.trackBlockClick(profile.username, block.id);
    if (onBlockClick) {
      onBlockClick(block.id);
    }
  };

  const handleShareProfile = () => {
    const shareUrl = `${window.location.origin}/#/app/linkforge?bio=${profile.username}`;
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    if (onShare) onShare();
  };

  // Theme styles
  const getThemeStyles = () => {
    switch (profile.themePreset) {
      case 'midnight_velvet':
        return {
          bg: 'bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-slate-100',
          card: 'bg-purple-950/40 border-purple-800/40 hover:border-purple-600/70 hover:bg-purple-900/40 text-purple-100',
          accentBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          glow: '#9333ea',
        };
      case 'cyber_neon':
        return {
          bg: 'bg-slate-950 text-emerald-100',
          card: 'bg-slate-900/80 border-emerald-500/30 hover:border-emerald-400 hover:bg-slate-800/90 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
          accentBadge: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50',
          glow: '#10b981',
        };
      case 'rose_gold':
        return {
          bg: 'bg-gradient-to-b from-slate-950 via-rose-950/60 to-slate-950 text-rose-100',
          card: 'bg-rose-950/30 border-rose-800/40 hover:border-rose-500/60 hover:bg-rose-900/30 text-rose-100',
          accentBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          glow: '#f43f5e',
        };
      case 'clean_minimal':
        return {
          bg: 'bg-slate-900 text-slate-200',
          card: 'bg-slate-800/60 border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-100',
          accentBadge: 'bg-slate-800 text-slate-300 border-slate-700',
          glow: '#64748b',
        };
      case 'dark_glass':
      default:
        return {
          bg: 'bg-slate-950 text-slate-100',
          card: 'bg-white/5 border-white/10 hover:border-indigo-500/50 hover:bg-white/10 text-slate-100 backdrop-blur-md',
          accentBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          glow: profile.accentColor || '#6366f1',
        };
    }
  };

  const theme = getThemeStyles();
  const sortedBlocks = useMemo(() => {
    return [...(profile.blocks || [])]
      .filter((b) => b.isActive)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }, [profile.blocks]);

  // Compute available categories for the in-page navigation tabs
  const categories = useMemo(() => {
    const list = [{ id: 'all', label: 'All', count: sortedBlocks.length }];
    const linkCount = sortedBlocks.filter((b) => b.type === 'LINK').length;
    if (linkCount > 0) list.push({ id: 'link', label: 'Links', count: linkCount });

    const toolCount = sortedBlocks.filter((b) =>
      b.type === 'CALCULATOR_ROI' || b.type === 'EMBED_CALCOM'
    ).length;
    if (toolCount > 0) list.push({ id: 'tools', label: 'Tools', count: toolCount });

    const contactCount = sortedBlocks.filter((b) => b.type === 'CONTACT_FORM').length;
    if (contactCount > 0) list.push({ id: 'contact', label: 'Contact', count: contactCount });

    return list;
  }, [sortedBlocks]);

  const displayedBlocks = useMemo(() => {
    if (activeCategory === 'all') return sortedBlocks;
    if (activeCategory === 'link') return sortedBlocks.filter((b) => b.type === 'LINK');
    if (activeCategory === 'tools')
      return sortedBlocks.filter((b) => b.type === 'CALCULATOR_ROI' || b.type === 'EMBED_CALCOM');
    if (activeCategory === 'contact')
      return sortedBlocks.filter((b) => b.type === 'CONTACT_FORM');
    return sortedBlocks;
  }, [sortedBlocks, activeCategory]);

  // Calculate annual savings for ROI calculator
  const weeklySavings = calculatorHours * calculatorHourlyRate;
  const annualSavings = weeklySavings * 50;

  return (
    <div
      className={`relative w-full ${isSimulator ? 'min-h-full p-3 sm:p-4' : 'min-h-screen py-4 sm:py-8 px-3 sm:px-6'} ${
        theme.bg
      } transition-colors flex flex-col justify-between overflow-x-hidden`}
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[320px] blur-[120px] opacity-25 pointer-events-none rounded-full"
        style={{ backgroundColor: theme.glow }}
      />

      {/* Main Menu Navigation Header Bar */}
      <BioMainNav
        profile={profile}
        isSimulator={isSimulator}
        onNavigate={onNavigate}
        onShare={handleShareProfile}
        copiedLink={copiedLink}
        onOpenMainMenu={onOpenMainMenu}
      />

      {/* Main Content Container */}
      <div className="w-full max-w-md mx-auto space-y-5 relative z-10">
        {/* Profile Card / Avatar */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative inline-block">
            <div
              className="p-1 rounded-full border-2 transition-transform duration-300 hover:scale-105"
              style={{ borderColor: profile.accentColor || '#6366f1' }}
            >
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                alt={profile.displayName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`;
                }}
              />
            </div>
            {profile.isVerified && (
              <div
                className="absolute bottom-1 right-1 bg-indigo-600 text-white p-1 rounded-full shadow-md border-2 border-slate-950"
                title="Verified Creator"
              >
                <CheckCircle2 className="w-3.5 h-3.5 fill-white text-indigo-600" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {profile.displayName}
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">@{profile.username}</p>
          </div>

          {profile.bio && (
            <p className="text-xs sm:text-sm text-slate-300/90 max-w-sm mx-auto leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Social Icons Bar */}
          {profile.socialLinks && Object.values(profile.socialLinks).some(Boolean) && (
            <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
              {profile.socialLinks.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition active:scale-95"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition active:scale-95"
                  title="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.youtube && (
                <a
                  href={profile.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition active:scale-95"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.instagram && (
                <a
                  href={profile.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition active:scale-95"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition active:scale-95"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.discord && (
                <a
                  href={profile.socialLinks.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition active:scale-95"
                  title="Discord"
                >
                  <DiscordIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {/* In-page Category Navigation Tabs */}
          {categories.length > 2 && (
            <div className="pt-2 flex items-center justify-center gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                    activeCategory === cat.id
                      ? 'bg-white text-slate-900 shadow-md font-bold'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1 py-0.2 rounded-full ${
                      activeCategory === cat.id ? 'bg-slate-200 text-slate-900' : 'bg-black/30 text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Blocks Container */}
        <div className="space-y-3 pt-2">
          {displayedBlocks.map((block) => {
            switch (block.type) {
              case 'LINK':
                return (
                  <a
                    key={block.id}
                    href={block.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(block, e)}
                    className={`group flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-200 active:scale-98 ${theme.card}`}
                  >
                    <div className="text-left pr-2">
                      <p className="font-bold text-sm tracking-tight">{block.title}</p>
                      {block.subtitle && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{block.subtitle}</p>
                      )}
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/15 text-slate-300 group-hover:text-white shrink-0 transition">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                );

              case 'EMBED_YOUTUBE': {
                // Extract video id safely
                let videoId = 'dQw4w9WgXcQ';
                if (block.url) {
                  const match = block.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                  if (match && match[1]) videoId = match[1];
                }
                return (
                  <div key={block.id} className="space-y-1.5">
                    {block.title && (
                      <p className="text-xs font-bold text-slate-300 px-1">{block.title}</p>
                    )}
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-black">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                        title={block.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                );
              }

              case 'EMBED_SPOTIFY': {
                let spotifyEmbedUrl = 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0';
                if (block.url && block.url.includes('spotify.com')) {
                  spotifyEmbedUrl = block.url.replace('open.spotify.com/', 'open.spotify.com/embed/');
                }
                return (
                  <div key={block.id} className="space-y-1.5">
                    {block.title && (
                      <p className="text-xs font-bold text-slate-300 px-1">{block.title}</p>
                    )}
                    <div className="w-full rounded-2xl overflow-hidden border border-white/15 shadow-lg">
                      <iframe
                        src={spotifyEmbedUrl}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-2xl"
                      />
                    </div>
                  </div>
                );
              }

              case 'EMBED_CALCOM':
                return (
                  <div
                    key={block.id}
                    className={`p-4 rounded-2xl border transition-all ${theme.card} flex items-center justify-between gap-3`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm">{block.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {block.subtitle || 'Schedule a 1-on-1 session'}
                        </p>
                      </div>
                    </div>
                    <a
                      href={block.url || 'https://cal.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleLinkClick(block)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition shrink-0"
                    >
                      Book Time
                    </a>
                  </div>
                );

              case 'CALCULATOR_ROI':
                return (
                  <div
                    key={block.id}
                    className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 text-left ${theme.card}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                          <Calculator className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold">{block.title}</h3>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Interactive
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Hours Saved / Week:</span>
                          <span className="font-bold text-white">{calculatorHours} hrs</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="40"
                          value={calculatorHours}
                          onChange={(e) => setCalculatorHours(Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Estimated Hourly Rate:</span>
                          <span className="font-bold text-white">${calculatorHourlyRate} / hr</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="250"
                          step="5"
                          value={calculatorHourlyRate}
                          onChange={(e) => setCalculatorHourlyRate(Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Calculated Outcome */}
                    <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-slate-400">Projected Annual Savings</p>
                        <p className="text-lg font-black text-emerald-400">
                          ${annualSavings.toLocaleString()} / year
                        </p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                );

              case 'CONTACT_FORM':
                return (
                  <div
                    key={block.id}
                    className={`p-4 sm:p-5 rounded-2xl border space-y-3 text-left ${theme.card}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold">{block.title}</h3>
                        {block.subtitle && (
                          <p className="text-[11px] text-slate-400">{block.subtitle}</p>
                        )}
                      </div>
                    </div>

                    {contactSubmitted ? (
                      <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-center space-y-1 text-emerald-300">
                        <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                        <p className="text-xs font-bold">Message sent successfully!</p>
                        <p className="text-[11px] text-emerald-400/80">
                          Thanks for reaching out. We will get back to you shortly.
                        </p>
                        <button
                          onClick={() => {
                            setContactSubmitted(false);
                            setContactMessage('');
                          }}
                          className="text-[10px] text-emerald-400 underline mt-2 cursor-pointer"
                        >
                          Send another note
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setContactSubmitted(true);
                          linkForgeService.trackBlockClick(profile.username, block.id);
                        }}
                        className="space-y-2.5"
                      >
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Your Email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
                        />
                        <textarea
                          required
                          rows={2}
                          placeholder="What project or idea are you working on?"
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 resize-none"
                        />
                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md shadow-indigo-600/30 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Message</span>
                        </button>
                      </form>
                    )}
                  </div>
                );

              case 'EMBED_GITHUB':
                return (
                  <a
                    key={block.id}
                    href={block.url || 'https://github.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(block, e)}
                    className={`group block p-4 rounded-2xl border transition-all text-left ${theme.card} space-y-2`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold font-mono text-indigo-400">GitHub Repo</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-tight">{block.title}</h4>
                      {block.subtitle && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{block.subtitle}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> 1.2k</span>
                      <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5 text-slate-300" /> 240</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-indigo-300">TypeScript</span>
                    </div>
                  </a>
                );

              case 'NEWSLETTER':
                return (
                  <div key={block.id} className={`p-4 rounded-2xl border text-left ${theme.card} space-y-3`}>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
                        <Newspaper className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{block.title}</h4>
                        {block.subtitle && <p className="text-[11px] text-slate-400">{block.subtitle}</p>}
                      </div>
                    </div>
                    {newsletterSubscribed ? (
                      <div className="p-3 rounded-xl bg-teal-950/50 border border-teal-500/40 text-center text-teal-300 text-xs font-bold">
                        🎉 Subscribed successfully! Welcome aboard.
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setNewsletterSubscribed(true);
                          linkForgeService.trackBlockClick(profile.username, block.id);
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="email"
                          required
                          placeholder="Enter your email"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          className="flex-1 px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-teal-500"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shrink-0 cursor-pointer"
                        >
                          Join
                        </button>
                      </form>
                    )}
                  </div>
                );

              case 'PRODUCT_CARD':
                return (
                  <div key={block.id} className={`p-4 rounded-2xl border text-left ${theme.card} flex items-center justify-between gap-3`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm">{block.title}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                            $29
                          </span>
                        </div>
                        {block.subtitle && <p className="text-xs text-slate-400 mt-0.5">{block.subtitle}</p>}
                      </div>
                    </div>
                    <a
                      href={block.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleLinkClick(block, e)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 shadow-md shadow-pink-600/30 transition shrink-0"
                    >
                      Buy Now
                    </a>
                  </div>
                );

              case 'COUNTDOWN':
                return (
                  <div key={block.id} className={`p-4 rounded-2xl border text-left ${theme.card} space-y-2.5`}>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm">{block.title || 'Limited Time Launch'}</h4>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                        <div className="text-base font-black text-orange-400">05</div>
                        <div className="text-[9px] uppercase text-slate-400 font-bold">Days</div>
                      </div>
                      <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                        <div className="text-base font-black text-orange-400">12</div>
                        <div className="text-[9px] uppercase text-slate-400 font-bold">Hours</div>
                      </div>
                      <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                        <div className="text-base font-black text-orange-400">45</div>
                        <div className="text-[9px] uppercase text-slate-400 font-bold">Mins</div>
                      </div>
                      <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                        <div className="text-base font-black text-orange-400">30</div>
                        <div className="text-[9px] uppercase text-slate-400 font-bold">Secs</div>
                      </div>
                    </div>
                  </div>
                );

              case 'PORTFOLIO_GRID':
                return (
                  <div key={block.id} className={`p-4 rounded-2xl border text-left ${theme.card} space-y-3`}>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{block.title || 'Featured Work'}</h4>
                        {block.subtitle && <p className="text-[11px] text-slate-400">{block.subtitle}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <a
                        href={block.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => handleLinkClick(block, e)}
                        className="group relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-white/10 block hover:border-purple-500/50 transition"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400"
                          alt="Project 1"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex items-end p-2">
                          <span className="text-[11px] font-bold text-white flex items-center gap-1">
                            UI/UX Design <ExternalLink className="w-3 h-3 text-purple-400" />
                          </span>
                        </div>
                      </a>
                      <a
                        href={block.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => handleLinkClick(block, e)}
                        className="group relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-white/10 block hover:border-purple-500/50 transition"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400"
                          alt="Project 2"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex items-end p-2">
                          <span className="text-[11px] font-bold text-white flex items-center gap-1">
                            FullStack App <ExternalLink className="w-3 h-3 text-purple-400" />
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                );

              case 'TIP_JAR':
                return (
                  <div key={block.id} className={`p-4 sm:p-5 rounded-2xl border text-left ${theme.card} space-y-3`}>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{block.title || 'Buy Me a Coffee ☕'}</h4>
                        {block.subtitle && <p className="text-[11px] text-slate-400">{block.subtitle}</p>}
                      </div>
                    </div>

                    {tipSuccess ? (
                      <div className="p-3 rounded-xl bg-yellow-950/50 border border-yellow-500/40 text-center text-yellow-300 text-xs font-bold space-y-1">
                        <p>☕ Thank you so much for the coffee!</p>
                        <p className="text-[10px] text-yellow-400/80">Your support keeps this creator going.</p>
                        <button
                          onClick={() => setTipSuccess(false)}
                          className="text-[10px] underline text-yellow-300 mt-1 cursor-pointer"
                        >
                          Send another tip
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-4 gap-2">
                          {[3, 5, 10, 25].map((amt) => (
                            <button
                              key={amt}
                              onClick={() => setSelectedTipAmount(amt)}
                              className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                                selectedTipAmount === amt
                                  ? 'bg-yellow-500 text-slate-955 border-yellow-400 shadow-md shadow-yellow-500/20'
                                  : 'bg-black/30 text-white border-white/10 hover:border-yellow-500/50'
                              }`}
                            >
                              ${amt}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            setTipSuccess(true);
                            linkForgeService.trackBlockClick(profile.username, block.id);
                          }}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-black text-xs hover:opacity-95 transition shadow-lg shadow-yellow-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>☕ Support ${selectedTipAmount}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>

        {/* Minimal Footer */}
        <div className="pt-6 pb-2 text-center">
          <a
            href="#/app/linkforge"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-slate-400 hover:text-white transition"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Create your bio on</span>
            <strong className="font-black text-indigo-400">LinkForge</strong>
          </a>
        </div>
      </div>
    </div>
  );
};
