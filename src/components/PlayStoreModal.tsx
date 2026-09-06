import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Layers,
  Terminal,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface PlayStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl?: string;
}

export const PlayStoreModal: React.FC<PlayStoreModalProps> = ({
  isOpen,
  onClose,
  appUrl = window.location.origin,
}) => {
  const [activeTab, setActiveTab] = useState<'twa' | 'assets' | 'listing' | 'assetlinks'>('twa');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const bubblewrapCommand = `# 1. Install Google's official Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize your Android project from this live PWA Manifest
bubblewrap init --manifest=${appUrl}/manifest.webmanifest

# 3. Build your production Android App Bundle (.aab) ready for Google Play
bubblewrap build`;

  const assetLinksJson = `[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.wingman.ai",
      "sha256_cert_fingerprints": [
        "YOUR_RELEASE_KEYSTORE_SHA256_FINGERPRINT_HERE"
      ]
    }
  }
]`;

  const storeListing = {
    title: 'WingMan AI: Dating Reply Coach',
    shortDesc: 'Overcome texting anxiety. Read vibes, interest level, & send genuine replies.',
    fullDesc: `Stuck on read? Not sure if their message was playful or distant? WingMan AI is your confidential dating coach and conversation analyzer designed to turn texting anxiety into authentic confidence.

✨ WHAT WINGMAN AI DOES:
• Instant Screenshot Analysis: Upload screenshots from Hinge, Tinder, Bumble, Instagram, WhatsApp, or iMessage.
• Subtext & Vibe Reading: Discover genuine interest scores (0-100), hidden cues, and emotional pacing beneath the surface.
• Genuine Reply Options: Receive contextual replies calibrated to your chosen style (Mix, Smooth, Playful, or Direct).
• Ask WingMan & Reply Workshop: Draft your own message and let WingMan spot overthinking or stiff wording before you hit send.
• Strategy Coach: Ask live questions on when to ask them out, how to revive stalled chats, or calibrate teases.

🔒 ZERO CRINGE:
WingMan AI never generates manipulative lines. We coach you on what works and how to communicate in your authentic voice.

Calibrated for Android flagship 1080x2400 displays.`,
    category: 'Lifestyle / Dating',
    targetAudience: '18+',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c0c12] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Background Ambient Blur */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center text-green-400 shadow-lg shadow-green-950/40">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-400">
                  Google Play Store Kit
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                  1080 × 2400 Android Verified
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Publish Rizzz to Google Play Console
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 sm:px-6 pt-3 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar relative z-10 bg-black/20">
          <button
            onClick={() => setActiveTab('twa')}
            className={`flex items-center gap-2 px-3.5 py-2 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'twa'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>1-Click Packaging (.AAB / APK)</span>
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`flex items-center gap-2 px-3.5 py-2 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'assets'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Play Store Assets (512x512 & Banner)</span>
          </button>

          <button
            onClick={() => setActiveTab('listing')}
            className={`flex items-center gap-2 px-3.5 py-2 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'listing'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Store Listing Copy</span>
          </button>

          <button
            onClick={() => setActiveTab('assetlinks')}
            className={`flex items-center gap-2 px-3.5 py-2 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'assetlinks'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Asset Links</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 relative z-10 no-scrollbar">
          {/* TAB 1: TWA & BUBBLEWRAP PACKAGING */}
          {activeTab === 'twa' && (
            <div className="space-y-6">
              {/* Ready Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Display Aspect Ratio</span>
                  </div>
                  <p className="text-xs text-gray-300 font-mono">1080 × 2400 (20:9)</p>
                  <p className="text-[11px] text-gray-500 mt-1">Calibrated for Android phone viewports</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Web App Manifest</span>
                  </div>
                  <p className="text-xs text-gray-300 font-mono">/manifest.webmanifest</p>
                  <p className="text-[11px] text-gray-500 mt-1">Standalone mode, theme_color #050508</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Play Store Icon</span>
                  </div>
                  <p className="text-xs text-gray-300 font-mono">512 × 512 px PNG</p>
                  <p className="text-[11px] text-gray-500 mt-1">Maskable and standard compliant</p>
                </div>
              </div>

              {/* Method A: Google Official Bubblewrap */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                      Option 1 (Google Recommended)
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      Generate Android App Bundle (.aab) with Google Bubblewrap
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCopy(bubblewrapCommand, 'bubblewrap')}
                    className="flex items-center gap-1 text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition-all"
                  >
                    {copiedKey === 'bubblewrap' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        <span>Copy Commands</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  Run these 3 commands in your terminal. Bubblewrap automatically downloads your app icons, configures Android Studio build tools, and compiles your signed <code className="text-indigo-300">.aab</code> package for Google Play Store upload:
                </p>

                <div className="bg-neutral-950 border border-white/10 rounded-xl p-4 font-mono text-xs text-indigo-200 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{bubblewrapCommand}</pre>
                </div>
              </div>

              {/* Method B: PWABuilder (No Terminal Required) */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">
                      Option 2 (Zero Terminal Required)
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      1-Click Android Package with PWABuilder
                    </h3>
                  </div>
                  <a
                    href={`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(appUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
                  >
                    <span>Open in PWABuilder</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  PWABuilder tests the live manifest, validates Google Play compliance, and generates a pre-signed Android App Bundle (.aab) with your custom key store directly in your web browser.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between text-xs text-gray-300">
                  <span className="font-mono text-indigo-300 truncate">{appUrl}/manifest.webmanifest</span>
                  <button
                    onClick={() => handleCopy(`${appUrl}/manifest.webmanifest`, 'manifestUrl')}
                    className="text-gray-400 hover:text-white ml-2 shrink-0"
                  >
                    {copiedKey === 'manifestUrl' ? 'Copied!' : 'Copy URL'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLAY STORE GRAPHIC ASSETS */}
          {activeTab === 'assets' && (
            <div className="space-y-6">
              <p className="text-xs text-gray-400">
                Google Play Store requires specific asset formats before you can publish. Both mandatory assets have been custom generated for Rizzz:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 512x512 High Res Icon */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">High-Res App Icon</h4>
                      <span className="text-[11px] text-gray-400">512 × 512 px PNG (Mandatory)</span>
                    </div>
                    <a
                      href="/icon-512.png"
                      download="rizzz-icon-512.png"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 hover:text-white transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>

                  <div className="w-32 h-32 mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl p-1 bg-black/40">
                    <img
                      src="/icon-512.png"
                      alt="Rizzz 512x512 Play Store Icon"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>

                  <p className="text-[11px] text-gray-500 text-center">
                    Rendered with Android squircle safe-zone padding.
                  </p>
                </div>

                {/* 1024x500 Feature Graphic */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Play Store Feature Graphic</h4>
                      <span className="text-[11px] text-gray-400">1024 × 500 px PNG (Mandatory)</span>
                    </div>
                    <a
                      href="/playstore-feature-graphic.png"
                      download="rizzz-feature-graphic.png"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 hover:text-white transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>

                  <div className="w-full h-32 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40">
                    <img
                      src="/playstore-feature-graphic.png"
                      alt="Rizzz Play Store Feature Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-[11px] text-gray-500 text-center">
                    Banner displayed at the top of your Google Play Store product page.
                  </p>
                </div>
              </div>

              {/* 1080x2400 Screenshots Notice */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 text-xs text-indigo-200 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">1080 × 2400 Screenshot Capture: </span>
                  Switch to the <span className="text-indigo-300 font-semibold">1080×2400 Android Phone View</span> on the main screen to capture pixel-perfect screenshots of the Vibe Analyzer, Soft-Flirt Reply recommendations, and Strategy Coach for your Play Store listing!
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STORE LISTING COPY */}
          {activeTab === 'listing' && (
            <div className="space-y-4">
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    App Title (Max 30 characters)
                  </span>
                  <button
                    onClick={() => handleCopy(storeListing.title, 'appTitle')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    {copiedKey === 'appTitle' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs font-semibold text-white">
                  {storeListing.title}
                </div>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Short Description (Max 80 characters)
                  </span>
                  <button
                    onClick={() => handleCopy(storeListing.shortDesc, 'shortDesc')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    {copiedKey === 'shortDesc' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-gray-200">
                  {storeListing.shortDesc}
                </div>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Full Description (Play Store Formatted)
                  </span>
                  <button
                    onClick={() => handleCopy(storeListing.fullDesc, 'fullDesc')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    {copiedKey === 'fullDesc' ? 'Copied!' : 'Copy Full Description'}
                  </button>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-gray-300 font-sans leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto no-scrollbar">
                  {storeListing.fullDesc}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DIGITAL ASSET LINKS */}
          {activeTab === 'assetlinks' && (
            <div className="space-y-4">
              <div className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Digital Asset Links Verification</h3>
                    <p className="text-xs text-gray-400">
                      Required by Google Play Trusted Web Activities (TWA) to remove the browser address bar.
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(assetLinksJson, 'assetlinks')}
                    className="flex items-center gap-1 text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition-all"
                  >
                    {copiedKey === 'assetlinks' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-neutral-950 border border-white/10 rounded-xl p-4 font-mono text-xs text-indigo-200 overflow-x-auto">
                  <pre>{assetLinksJson}</pre>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed">
                  This file is already active at <code className="text-indigo-300">/.well-known/assetlinks.json</code>. Once you build your release APK/AAB with your own keystore, simply replace the SHA-256 fingerprint with your release certificate fingerprint from Google Play Console &gt; Setup &gt; App Integrity.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3 text-xs relative z-10">
          <div className="flex items-center gap-2 text-gray-400">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>Google Play Policy & TWA Standard Compliant</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
