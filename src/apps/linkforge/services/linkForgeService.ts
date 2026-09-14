import { Profile, Block, CustomDomainRecord, AnalyticsData, UserAccount } from '../types';

const STORAGE_KEY_PROFILES = 'linkforge_profiles_v1';
const STORAGE_KEY_DOMAINS = 'linkforge_domains_v1';
const STORAGE_KEY_USERS = 'linkforge_users_v1';

// Initial default demo profiles
const DEFAULT_PROFILES: Profile[] = [
  {
    id: 'prof_1',
    userId: 'usr_billal',
    username: 'billalhossen',
    displayName: 'Billal Hossen',
    bio: 'Senior Full-Stack Architect & Tech Creator. Building cloud tools, micro-SaaS, and developer ecosystems.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    isVerified: true,
    tier: 'pro',
    themePreset: 'dark_glass',
    accentColor: '#6366f1',
    fontFamily: 'Plus Jakarta Sans',
    socialLinks: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      youtube: 'https://youtube.com',
      linkedin: 'https://linkedin.com',
      website: 'https://veloralcode.com',
      email: 'billalhossen.self@gmail.com',
    },
    customDomain: 'bio.billal.dev',
    domainStatus: 'ACTIVE',
    seoTitle: 'Billal Hossen - Full Stack Architect & Tech Portfolio',
    seoDescription: 'Explore software projects, developer tools, SaaS templates, and book a technical consultation.',
    ogImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    blocks: [
      {
        id: 'blk_1',
        type: 'LINK',
        title: 'Veloral Code Hub & Snippets',
        subtitle: 'Explore 500+ verified production frontend & fullstack code modules',
        url: '#/',
        icon: 'Code2',
        orderIndex: 0,
        isActive: true,
        clickCount: 1240,
      },
      {
        id: 'blk_2',
        type: 'EMBED_YOUTUBE',
        title: 'Building Modern Micro-SaaS with Multi-Tenant Architecture',
        subtitle: 'Watch my 15-minute complete architectural breakdown on YouTube',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        orderIndex: 1,
        isActive: true,
        clickCount: 890,
      },
      {
        id: 'blk_3',
        type: 'EMBED_SPOTIFY',
        title: 'Focus Deep Work Soundtrack',
        subtitle: 'My daily coding playlist for deep flow state',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM',
        orderIndex: 2,
        isActive: true,
        clickCount: 420,
      },
      {
        id: 'blk_4',
        type: 'CALCULATOR_ROI',
        title: 'SaaS Architecture Cost & ROI Estimator',
        subtitle: 'Calculate your projected infrastructure savings and cloud ROI',
        config: { baseCost: 150, ratePerHour: 85 },
        orderIndex: 3,
        isActive: true,
        clickCount: 630,
      },
      {
        id: 'blk_5',
        type: 'EMBED_CALCOM',
        title: 'Book a 1:1 Architecture Consultation',
        subtitle: '30-minute system design, scalability & tech stack roadmap review',
        url: 'https://cal.com',
        orderIndex: 4,
        isActive: true,
        clickCount: 310,
      },
      {
        id: 'blk_6',
        type: 'CONTACT_FORM',
        title: 'Get in Touch for Projects & Collaboration',
        subtitle: 'Drop your message directly to my inbox for consulting offers',
        orderIndex: 5,
        isActive: true,
        clickCount: 195,
      },
    ],
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prof_2',
    userId: 'usr_alex',
    username: 'alexdev',
    displayName: 'Alex Rivers',
    bio: 'DevOps & Cloud Engineer. Writing about Kubernetes, Vercel Edge Functions, and serverless architectures.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    isVerified: true,
    tier: 'pro',
    themePreset: 'cyber_neon',
    accentColor: '#10b981',
    fontFamily: 'Inter',
    socialLinks: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
    },
    blocks: [
      {
        id: 'blk_alex_1',
        type: 'LINK',
        title: 'Open Source Kubernetes Boilerplates',
        subtitle: 'Ready-to-deploy GitOps configurations',
        url: 'https://github.com',
        icon: 'Github',
        orderIndex: 0,
        isActive: true,
        clickCount: 540,
      },
      {
        id: 'blk_alex_2',
        type: 'CONTACT_FORM',
        title: 'Hire for Cloud Consulting',
        subtitle: 'Let’s discuss your infrastructure migration and scaling needs',
        orderIndex: 1,
        isActive: true,
        clickCount: 180,
      },
    ],
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_DOMAINS: CustomDomainRecord[] = [
  {
    id: 'dom_1',
    domain: 'bio.billal.dev',
    targetUsername: 'billalhossen',
    status: 'ACTIVE',
    sslConfigured: true,
    createdAt: '2026-02-10T12:00:00Z',
    lastCheckedAt: new Date().toISOString(),
    cnameRecord: 'cname.vercel-dns.com',
    aRecord: '76.76.21.21',
  },
  {
    id: 'dom_2',
    domain: 'links.alexrivers.io',
    targetUsername: 'alexdev',
    status: 'PENDING_DNS',
    sslConfigured: false,
    createdAt: '2026-03-01T08:30:00Z',
    lastCheckedAt: new Date().toISOString(),
    errorReason: 'CNAME verification record not found at host links.alexrivers.io',
    cnameRecord: 'cname.vercel-dns.com',
    aRecord: '76.76.21.21',
  },
];

const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'usr_billal',
    name: 'Billal Hossen',
    email: 'billalhossen.self@gmail.com',
    role: 'SUPER_ADMIN',
    isSuspended: false,
    tier: 'pro',
    username: 'billalhossen',
    createdAt: '2026-01-15T10:00:00Z',
    totalViews: 8420,
    totalClicks: 3685,
  },
  {
    id: 'usr_alex',
    name: 'Alex Rivers',
    email: 'alex.rivers@cloudtech.io',
    role: 'PRO_USER',
    isSuspended: false,
    tier: 'pro',
    username: 'alexdev',
    createdAt: '2026-02-01T10:00:00Z',
    totalViews: 2150,
    totalClicks: 720,
  },
  {
    id: 'usr_sarah',
    name: 'Sarah Design',
    email: 'sarah@designflow.co',
    role: 'USER',
    isSuspended: false,
    tier: 'free',
    username: 'sarahdesign',
    createdAt: '2026-03-05T14:20:00Z',
    totalViews: 940,
    totalClicks: 280,
  },
];

class LinkForgeService {
  private profiles: Profile[] = [];
  private domains: CustomDomainRecord[] = [];
  private users: UserAccount[] = [];
  private channel: BroadcastChannel | null = null;
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      try {
        this.channel = new BroadcastChannel('linkforge_realtime_sync_v1');
        this.channel.onmessage = (event) => {
          if (event.data && event.data.type === 'SYNC_DATA') {
            this.init();
            this.listeners.forEach((cb) => cb());
          }
        };
      } catch {}
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('linkforge_')) {
          this.init();
          this.listeners.forEach((cb) => cb());
        }
      });
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private broadcastChange() {
    try {
      if (this.channel) {
        this.channel.postMessage({ type: 'SYNC_DATA', timestamp: Date.now() });
      }
    } catch {}
  }

  private init() {
    try {
      const storedProfs = localStorage.getItem(STORAGE_KEY_PROFILES);
      if (storedProfs) {
        this.profiles = JSON.parse(storedProfs);
      } else {
        this.profiles = DEFAULT_PROFILES;
        this.saveProfiles();
      }

      const storedDoms = localStorage.getItem(STORAGE_KEY_DOMAINS);
      if (storedDoms) {
        this.domains = JSON.parse(storedDoms);
      } else {
        this.domains = DEFAULT_DOMAINS;
        this.saveDomains();
      }

      const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        this.users = DEFAULT_USERS;
        this.saveUsers();
      }
    } catch (e) {
      console.warn('LinkForgeService: Storage initialization fallback', e);
      this.profiles = DEFAULT_PROFILES;
      this.domains = DEFAULT_DOMAINS;
      this.users = DEFAULT_USERS;
    }
  }

  private saveProfiles() {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(this.profiles));
      this.broadcastChange();
    } catch {}
  }

  private saveDomains() {
    try {
      localStorage.setItem(STORAGE_KEY_DOMAINS, JSON.stringify(this.domains));
      this.broadcastChange();
    } catch {}
  }

  private saveUsers() {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(this.users));
      this.broadcastChange();
    } catch {}
  }

  // --- Profiles ---
  getProfiles(): Profile[] {
    return [...this.profiles];
  }

  getProfileByUsername(username: string): Profile | undefined {
    const clean = username.replace(/^@/, '').toLowerCase().trim();
    return this.profiles.find((p) => p.username.toLowerCase() === clean);
  }

  saveProfile(updated: Profile): Profile {
    const idx = this.profiles.findIndex((p) => p.id === updated.id);
    const stamped = { ...updated, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      this.profiles[idx] = stamped;
    } else {
      this.profiles.push(stamped);
    }
    this.saveProfiles();
    return stamped;
  }

  createProfile(user: { id?: string; name?: string; email?: string; username?: string }): Profile {
    const username = (user.username || user.name?.replace(/\s+/g, '').toLowerCase() || 'user' + Date.now().toString().slice(-4)).toLowerCase();
    const newProf: Profile = {
      id: 'prof_' + Date.now(),
      userId: user.id || 'usr_' + Date.now(),
      username,
      displayName: user.name || 'New Creator',
      bio: 'Welcome to my LinkForge Bio! Click below to check out my links and projects.',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      isVerified: false,
      tier: 'pro',
      themePreset: 'dark_glass',
      accentColor: '#6366f1',
      fontFamily: 'Plus Jakarta Sans',
      socialLinks: {},
      blocks: [
        {
          id: 'blk_' + Date.now(),
          type: 'LINK',
          title: 'My Featured Project',
          subtitle: 'Check out what I am currently working on',
          url: 'https://veloralcode.com',
          orderIndex: 0,
          isActive: true,
          clickCount: 0,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.profiles.push(newProf);
    this.saveProfiles();
    return newProf;
  }

  // --- Blocks Management ---
  addBlock(username: string, blockData: Partial<Block>): Profile | undefined {
    const profile = this.getProfileByUsername(username);
    if (!profile) return undefined;

    const newBlock: Block = {
      id: 'blk_' + Date.now() + Math.random().toString(36).substring(2, 6),
      type: blockData.type || 'LINK',
      title: blockData.title || 'New Link',
      subtitle: blockData.subtitle || '',
      url: blockData.url || 'https://',
      icon: blockData.icon || 'Link',
      config: blockData.config || {},
      orderIndex: profile.blocks.length,
      isActive: true,
      clickCount: 0,
    };

    profile.blocks.push(newBlock);
    return this.saveProfile(profile);
  }

  updateBlock(username: string, blockId: string, updates: Partial<Block>): Profile | undefined {
    const profile = this.getProfileByUsername(username);
    if (!profile) return undefined;

    const idx = profile.blocks.findIndex((b) => b.id === blockId);
    if (idx >= 0) {
      profile.blocks[idx] = { ...profile.blocks[idx], ...updates };
      return this.saveProfile(profile);
    }
    return profile;
  }

  deleteBlock(username: string, blockId: string): Profile | undefined {
    const profile = this.getProfileByUsername(username);
    if (!profile) return undefined;

    profile.blocks = profile.blocks.filter((b) => b.id !== blockId);
    // Re-index order
    profile.blocks.forEach((b, i) => (b.orderIndex = i));
    return this.saveProfile(profile);
  }

  reorderBlocks(username: string, blockIds: string[]): Profile | undefined {
    const profile = this.getProfileByUsername(username);
    if (!profile) return undefined;

    const idMap = new Map(profile.blocks.map((b) => [b.id, b]));
    const reordered: Block[] = [];
    blockIds.forEach((id, index) => {
      const item = idMap.get(id);
      if (item) {
        reordered.push({ ...item, orderIndex: index });
      }
    });

    profile.blocks = reordered;
    return this.saveProfile(profile);
  }

  trackBlockClick(username: string, blockId: string): void {
    const profile = this.getProfileByUsername(username);
    if (!profile) return;

    const block = profile.blocks.find((b) => b.id === blockId);
    if (block) {
      block.clickCount = (block.clickCount || 0) + 1;
      this.saveProfile(profile);
    }
  }

  // --- Domain Verification ---
  getAllDomains(): CustomDomainRecord[] {
    return [...this.domains];
  }

  addCustomDomain(domainRaw: string, targetUsername: string): { success: boolean; domain?: CustomDomainRecord; error?: string } {
    const domain = domainRaw.trim().toLowerCase();
    if (!domain || !domain.includes('.')) {
      return { success: false, error: 'Please enter a valid domain (e.g. bio.yourbrand.com)' };
    }

    if (this.domains.some((d) => d.domain === domain)) {
      return { success: false, error: 'This domain is already mapped to an account.' };
    }

    const newRecord: CustomDomainRecord = {
      id: 'dom_' + Date.now(),
      domain,
      targetUsername,
      status: 'PENDING_DNS',
      sslConfigured: false,
      createdAt: new Date().toISOString(),
      lastCheckedAt: new Date().toISOString(),
      cnameRecord: 'cname.vercel-dns.com',
      aRecord: '76.76.21.21',
      errorReason: 'DNS propagation pending. Point your CNAME record to cname.vercel-dns.com.',
    };

    this.domains.push(newRecord);
    this.saveDomains();

    // Link to profile
    const profile = this.getProfileByUsername(targetUsername);
    if (profile) {
      profile.customDomain = domain;
      profile.domainStatus = 'PENDING_DNS';
      this.saveProfile(profile);
    }

    return { success: true, domain: newRecord };
  }

  verifyCustomDomain(domainId: string): Promise<{ success: boolean; domain: CustomDomainRecord; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dom = this.domains.find((d) => d.id === domainId);
        if (!dom) {
          resolve({ success: false, domain: null as any, message: 'Domain not found' });
          return;
        }

        // Simulate successful DNS verification with Vercel API
        dom.status = 'ACTIVE';
        dom.sslConfigured = true;
        dom.lastCheckedAt = new Date().toISOString();
        dom.errorReason = undefined;
        this.saveDomains();

        // Update profile
        const prof = this.getProfileByUsername(dom.targetUsername);
        if (prof) {
          prof.domainStatus = 'ACTIVE';
          this.saveProfile(prof);
        }

        resolve({
          success: true,
          domain: dom,
          message: `Success! ${dom.domain} is fully verified and SSL certificate is active.`,
        });
      }, 900);
    });
  }

  removeCustomDomain(domainId: string): void {
    const dom = this.domains.find((d) => d.id === domainId);
    if (dom) {
      const prof = this.getProfileByUsername(dom.targetUsername);
      if (prof && prof.customDomain === dom.domain) {
        prof.customDomain = undefined;
        prof.domainStatus = undefined;
        this.saveProfile(prof);
      }
    }
    this.domains = this.domains.filter((d) => d.id !== domainId);
    this.saveDomains();
  }

  // --- Analytics ---
  getAnalytics(username: string): AnalyticsData {
    const profile = this.getProfileByUsername(username);
    const totalClicks = profile ? profile.blocks.reduce((acc, b) => acc + (b.clickCount || 0), 0) : 1240;
    const pageViews = totalClicks > 0 ? Math.round(totalClicks * 2.65) : 3280;
    const ctr = pageViews > 0 ? Math.round((totalClicks / pageViews) * 1000) / 10 : 37.8;

    return {
      pageViews,
      totalClicks,
      ctr,
      topReferrers: [
        { source: 'Twitter / X', count: Math.round(pageViews * 0.42), percentage: 42 },
        { source: 'Instagram Bio', count: Math.round(pageViews * 0.28), percentage: 28 },
        { source: 'GitHub Profile', count: Math.round(pageViews * 0.18), percentage: 18 },
        { source: 'Direct / QR Code', count: Math.round(pageViews * 0.08), percentage: 8 },
        { source: 'LinkedIn Post', count: Math.round(pageViews * 0.04), percentage: 4 },
      ],
      deviceStats: [
        { device: 'Mobile (iOS & Android)', count: Math.round(pageViews * 0.74), percentage: 74 },
        { device: 'Desktop (Chrome, Safari, Mac/Win)', count: Math.round(pageViews * 0.22), percentage: 22 },
        { device: 'Tablet & iPad', count: Math.round(pageViews * 0.04), percentage: 4 },
      ],
      countryStats: [
        { country: 'Bangladesh', count: Math.round(pageViews * 0.38), flag: '🇧🇩' },
        { country: 'United States', count: Math.round(pageViews * 0.29), flag: '🇺🇸' },
        { country: 'United Kingdom', count: Math.round(pageViews * 0.14), flag: '🇬🇧' },
        { country: 'India', count: Math.round(pageViews * 0.11), flag: '🇮🇳' },
        { country: 'Germany', count: Math.round(pageViews * 0.08), flag: '🇩🇪' },
      ],
      recentClicks: (profile?.blocks || [])
        .filter((b) => (b.clickCount || 0) > 0)
        .slice(0, 5)
        .map((b) => ({
          blockTitle: b.title,
          timestamp: 'Just now',
          location: 'Dhaka, Bangladesh',
        })),
    };
  }

  // --- Admin ---
  getAllUsers(): UserAccount[] {
    return [...this.users];
  }

  updateUserStatus(userId: string, updates: Partial<UserAccount>): UserAccount | undefined {
    const idx = this.users.findIndex((u) => u.id === userId);
    if (idx >= 0) {
      this.users[idx] = { ...this.users[idx], ...updates };
      this.saveUsers();
      return this.users[idx];
    }
    return undefined;
  }
}

export const linkForgeService = new LinkForgeService();
