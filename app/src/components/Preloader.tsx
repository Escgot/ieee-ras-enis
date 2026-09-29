import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Terminal, Cpu, Zap, CornerDownLeft } from 'lucide-react';

/* ── Web Audio Synthesizer for High-Tech Awwwards Sound Design ── */
class PreloaderSound {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private userInteracted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isMuted = localStorage.getItem('ras_sound_muted') === 'true';

      const unlock = () => {
        this.userInteracted = true;
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('touchstart', unlock);
      };

      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
      window.addEventListener('touchstart', unlock, { passive: true });
    }
  }

  private initCtx() {
    // Only instantiate if the user has performed a gesture to comply with browser autoplay policy
    if (!this.userInteracted) return;

    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch {
          // Autoplay policy prevented instantiation
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playTick(progress: number) {
    if (this.isMuted || !this.userInteracted) return;
    try {
      this.initCtx();
      if (!this.ctx || this.ctx.state !== 'running') return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      // Frequency rises subtly from 800Hz to 1600Hz as progress advances
      const freq = 700 + (progress / 100) * 900;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.015);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.015);
    } catch {
      // Graceful fallback for strict autoplay policy
    }
  }

  playComplete() {
    if (this.isMuted || !this.userInteracted) return;
    try {
      this.initCtx();
      if (!this.ctx || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;

      // Rich harmonic chord (sub bass + crystal overtones)
      const freqs = [110, 220, 440, 880];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const vol = idx === 0 ? 0.05 : 0.02 / (idx + 1);
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 0.9);
      });
    } catch {
      // Graceful fallback
    }
  }

  toggleMute(): boolean {
    this.userInteracted = true;
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ras_sound_muted', String(this.isMuted));
    }
    if (!this.isMuted) {
      this.initCtx();
      this.playTick(50);
    }
    return this.isMuted;
  }

  getMuted(): boolean {
    return this.isMuted;
  }
}

const soundManager = new PreloaderSound();

/* Telemetry phase stages */
const PHASES = [
  { threshold: 0, text: 'SYS.INIT // ALLOCATING QUANTUM CORES', code: '0x00A1' },
  { threshold: 22, text: 'KINEMATICS // CALIBRATING ACTUATORS & SERVOS', code: '0x02B4' },
  { threshold: 48, text: 'NEURAL LINK // SYNCHRONIZING COMPUTER VISION', code: '0x05F9' },
  { threshold: 72, text: 'TELEMETRY // OPTIMIZING SENSOR ARRAY & BUS', code: '0x08C2' },
  { threshold: 92, text: 'OVERDRIVE // PREPARING AUTONOMOUS SEQUENCE', code: '0x0FD3' },
  { threshold: 100, text: 'AUTHENTICATED // SYSTEM ONLINE & DEPLOYED', code: '0xFFFF' },
];

export default function Preloader() {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('loader') === 'true') return true;
      return !sessionStorage.getItem('ras_preloader_seen');
    }
    return true;
  });

  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(() => soundManager.getMuted());
  const [isExiting, setIsExiting] = useState(false);
  const [utcTime, setUtcTime] = useState('');
  const lastSoundTickRef = useRef(0);
  const hasTriggeredCompleteSound = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  // Live UTC Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(
        `${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')}:${now.getUTCSeconds().toString().padStart(2, '0')}.${Math.floor(now.getUTCMilliseconds() / 100)}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  // Listen for replay event
  useEffect(() => {
    const handleReplay = () => {
      sessionStorage.removeItem('ras_preloader_seen');
      setProgress(0);
      setIsExiting(false);
      setLoading(true);
      hasTriggeredCompleteSound.current = false;
      lastSoundTickRef.current = 0;
    };
    window.addEventListener('replay_preloader', handleReplay);
    return () => window.removeEventListener('replay_preloader', handleReplay);
  }, []);

  // Smooth cinematic counter progression
  useEffect(() => {
    if (!loading) return;

    const startTime = performance.now();
    const totalDuration = 2200; // 2.2 seconds natural luxury curve

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / totalDuration, 1);

      // Custom multi-stage easing: quick start -> smooth middle with micro-hesitation -> crisp finish
      let easedProgress: number;
      if (t < 0.3) {
        // Fast initial boot up to ~35%
        easedProgress = (t / 0.3) * 35;
      } else if (t < 0.7) {
        // Steady analytical ramp with slight curve up to ~78%
        const normalized = (t - 0.3) / 0.4;
        easedProgress = 35 + Math.pow(normalized, 0.9) * 43;
      } else {
        // Decisive sprint into 100%
        const normalized = (t - 0.7) / 0.3;
        easedProgress = 78 + Math.pow(normalized, 1.2) * 22;
      }

      const nextVal = Math.min(Math.round(easedProgress), 100);
      setProgress(nextVal);

      // Trigger audio ticks every ~5%
      if (nextVal - lastSoundTickRef.current >= 4 && nextVal < 100) {
        soundManager.playTick(nextVal);
        lastSoundTickRef.current = nextVal;
      }

      if (nextVal < 100) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        // Climax at 100%
        if (!hasTriggeredCompleteSound.current) {
          soundManager.playComplete();
          hasTriggeredCompleteSound.current = true;
        }
        sessionStorage.setItem('ras_preloader_seen', 'true');
        // Brief tension hold at 100% before triggering the architectural curtain reveal
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setLoading(false);
          }, 1100);
        }, 320);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);

    const handleSkip = (e?: KeyboardEvent | MouseEvent) => {
      // Don't skip if clicking the mute toggle specifically
      if (e && (e.target as HTMLElement)?.closest('[data-no-skip="true"]')) {
        return;
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setProgress(100);
      if (!hasTriggeredCompleteSound.current) {
        soundManager.playComplete();
        hasTriggeredCompleteSound.current = true;
      }
      sessionStorage.setItem('ras_preloader_seen', 'true');
      setIsExiting(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Escape' || e.key === 'Enter') {
        handleSkip(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [loading]);

  const toggleSound = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  }, []);

  const triggerSkip = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setProgress(100);
    if (!hasTriggeredCompleteSound.current) {
      soundManager.playComplete();
      hasTriggeredCompleteSound.current = true;
    }
    sessionStorage.setItem('ras_preloader_seen', 'true');
    setIsExiting(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (!loading) return null;

  // Determine current active phase
  const currentPhase = [...PHASES].reverse().find((p) => progress >= p.threshold) || PHASES[0];

  // Number formatting: 3 digits with leading zeros
  const formattedCount = progress.toString().padStart(3, '0');

  // SVG Circular Track Constants
  const circleRadius = 140;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Column panels for Awwwards Shutter Exit
  const columnCount = 6;
  const columns = Array.from({ length: columnCount });

  return (
    <AnimatePresence>
      {loading && (
        <div
          onClick={triggerSkip}
          className="fixed inset-0 z-[2000000] cursor-pointer select-none overflow-hidden bg-[#050508] text-white"
        >
          {/* ========================================================= */}
          {/* 1. AWWWARDS ARCHITECTURAL SHUTTER CURTAIN (Exit Slabs)     */}
          {/* ========================================================= */}
          <div className="absolute inset-0 z-0 flex w-full h-full pointer-events-none">
            {columns.map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 0 }}
                animate={isExiting ? { y: '-105%' } : { y: 0 }}
                transition={{
                  duration: 0.9,
                  // Staggered wave lift from center outward or left-to-right
                  delay: isExiting ? (i % 2 === 0 ? i * 0.05 : (columnCount - i) * 0.05) : 0,
                  ease: [0.83, 0, 0.17, 1], // Custom cinematic bezier
                }}
                className="relative flex-1 h-full bg-[#050508] border-r border-white/[0.03] will-change-transform"
              >
                {/* Glowing laser blade at the bottom of each lifting shutter */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600/40 via-red-500 to-rose-400 shadow-[0_0_20px_rgba(239,68,68,0.9)]" />
              </motion.div>
            ))}
          </div>

          {/* ========================================================= */}
          {/* 2. ATMOSPHERIC HIGH-TECH CYBERNETIC MATRIX & SCANNER      */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            {/* Fine SVG Blueprint Grid */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
                `,
                backgroundSize: '48px 48px',
              }}
            />

            {/* Radial Vignette & Depth Glow */}
            <div className="absolute inset-0 bg-radial-vignette opacity-80" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Continuous Vertical Scanning Laser Sweep */}
            <motion.div
              animate={{ top: ['-10%', '110%'] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-40 shadow-[0_0_15px_#ef4444]"
            />

            {/* Subtle holographic robot backdrop */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] mix-blend-screen pointer-events-none">
              <img
                src="/images/preloader/robot-loader.webp"
                alt="Robotics Interface"
                className="w-[420px] h-[420px] sm:w-[500px] sm:h-[500px] object-cover scale-105 filter grayscale contrast-150 [mask-image:radial-gradient(circle_at_50%_40%,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_75%)]"
              />
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* 3. FOUR CORNERS PRECISION HUD TELEMETRY                   */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-20 pointer-events-none p-6 sm:p-10 flex flex-col justify-between"
          >
            {/* Top Bar: Left Coordinates & Right Controls */}
            <div className="flex justify-between items-start">
              {/* Top Left: Sfax ENIS Coordinates & Identity */}
              <div className="flex items-start gap-3">
                <Terminal className="w-3.5 h-3.5 text-red-500 mt-0.5" />
                <div className="flex flex-col font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-white/60 uppercase">
                  <span className="text-white font-black tracking-[0.3em]">IEEE RAS ENIS // SB CHAPTER</span>
                  <span className="text-red-400 font-bold">LOC: 34.7406° N, 10.7603° E (SFAX)</span>
                  <span className="text-white/40 text-[8px] hidden sm:inline">CORE IDENTIFIER: RAS-2026-AUTONOMOUS</span>
                </div>
              </div>

              {/* Top Right: Sound Toggle & Keyboard Skip Badge */}
              <div className="flex items-center gap-3 pointer-events-auto" data-no-skip="true">
                {/* Sound Toggle */}
                <button
                  onClick={toggleSound}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-red-500/40 transition-all duration-300 font-mono text-[10px] text-white/80 group"
                  title="Toggle Audio Feedback"
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-white/40 group-hover:text-red-400 transition-colors" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  )}
                  <span className="tracking-widest uppercase text-[9px]">
                    {isMuted ? 'SOUND: OFF' : 'SOUND: ON'}
                  </span>
                </button>

                {/* Keyboard Skip Tag */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/5 font-mono text-[9px] text-white/40 tracking-wider">
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold text-[8px]">SPACE</span>
                  <span>TO SKIP</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar: UTC Clock & Status Matrix */}
            <div className="flex justify-between items-end font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-white/50">
              <div className="flex flex-col gap-1">
                <span className="text-white/30 text-[8px]">SYS_CLOCK // HIGH_PRECISION</span>
                <span className="text-white/90 font-numeric font-bold tracking-widest">{utcTime || '00:00:00.0'} UTC</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-red-500/70" />
                  <span className="text-white/70">BANDWIDTH: 100% UNCONSTRAINED</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-emerald-400 font-bold">READY</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* 4. THE CENTER STAGE: MONOLITHIC COUNTER & KINETIC CORE   */}
          {/* ========================================================= */}
          <div className="relative z-30 flex flex-col items-center justify-center w-full h-full px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={
                isExiting
                  ? { opacity: 0, y: -90, scale: 1.05, filter: 'blur(12px)' }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              transition={{
                duration: isExiting ? 0.7 : 0.8,
                ease: [0.83, 0, 0.17, 1],
              }}
              className="relative flex flex-col items-center max-w-4xl w-full"
            >
              {/* Dynamic Phase Pill Tag */}
              <div className="mb-4 sm:mb-8 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md max-w-[90vw] sm:max-w-none">
                <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                <span className="font-mono text-[8px] sm:text-[10px] text-white/80 font-bold tracking-[0.15em] sm:tracking-[0.25em] uppercase truncate">
                  {currentPhase.text}
                </span>
                <span className="font-mono text-[8px] sm:text-[9px] text-red-400 font-black shrink-0">[{currentPhase.code}]</span>
              </div>

              {/* Central Geometric Orbital Core + Number Container */}
              <div className="relative flex items-center justify-center w-full min-h-[260px] sm:min-h-[340px]">
                {/* SVG Precision Circular Reticle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] -rotate-90">
                    {/* Background faint track */}
                    <circle
                      cx="50%"
                      cy="50%"
                      r={circleRadius}
                      className="stroke-white/[0.04] fill-none"
                      strokeWidth="2"
                    />
                    {/* Animated glowing progress arc */}
                    <motion.circle
                      cx="50%"
                      cy="50%"
                      r={circleRadius}
                      className="stroke-red-500 fill-none filter drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      style={{ strokeDashoffset }}
                      transition={{ ease: 'linear' }}
                    />
                  </svg>

                  {/* Outer Mechanical Tick Dial (Rotating slowly) */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="absolute w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border border-dashed border-white/[0.06] flex items-center justify-center"
                  >
                    {/* Corner ticks on ring */}
                    <div className="absolute top-0 w-2 h-0.5 bg-red-500/40" />
                    <div className="absolute bottom-0 w-2 h-0.5 bg-red-500/40" />
                    <div className="absolute left-0 w-0.5 h-2 bg-red-500/40" />
                    <div className="absolute right-0 w-0.5 h-2 bg-red-500/40" />
                  </motion.div>

                  {/* Inner Counter-Rotating Hologram Ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                    className="absolute w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] rounded-full border border-white/[0.03] border-t-red-500/30"
                  />
                </div>

                {/* THE GIANT MONOLITHIC AWWWARDS COUNTER */}
                <div className="relative z-10 flex items-baseline justify-center select-none">
                  <div className="flex items-baseline font-syne font-black tracking-tighter">
                    {/* Main Counter Display */}
                    <span className="text-[5.5rem] sm:text-[8rem] md:text-[10rem] lg:text-[11.5rem] leading-none bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)] tabular-nums">
                      {formattedCount}
                    </span>
                    {/* Precision Percent Tag */}
                    <span className="font-mono text-2xl sm:text-3xl md:text-4xl font-extrabold text-red-500 ml-2 drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]">
                      %
                    </span>
                  </div>

                  {/* Ghost 3D Reflection Below */}
                  <div
                    aria-hidden="true"
                    className="absolute -bottom-14 sm:-bottom-20 left-0 right-0 flex justify-center opacity-10 blur-[3px] scale-y-[-0.6] pointer-events-none select-none font-syne font-black text-[5.5rem] sm:text-[8rem] md:text-[10rem] lg:text-[11.5rem] tracking-tighter text-red-500"
                  >
                    {formattedCount}
                  </div>
                </div>
              </div>

              {/* STAGGERED EDITORIAL BRANDING MANIFESTO */}
              <div className="mt-3 sm:mt-6 text-center overflow-hidden">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <h1 className="font-syne text-base sm:text-2xl md:text-3xl font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white">
                    IEEE RAS <span className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">CHAPTER</span> ENIS
                  </h1>
                  <p className="mt-1 font-mono text-[8px] sm:text-[11px] text-white/50 uppercase tracking-[0.18em] sm:tracking-[0.35em]">
                    Robotics & Automation Society // Student Branch
                  </p>
                </motion.div>
              </div>

              {/* ========================================================= */}
              {/* 5. PRECISION PROGRESS RAIL & TELEMETRY EQUALIZER          */}
              {/* ========================================================= */}
              <div className="w-full max-w-lg mt-6 sm:mt-10 flex flex-col items-center">
                {/* Precision Track */}
                <div className="w-full relative h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                  {/* Laser Beam */}
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 via-rose-400 to-red-500 rounded-full shadow-[0_0_12px_rgba(239,68,68,1)]"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: 'linear' }}
                  />
                  {/* Glowing Laser Head Tip */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_#fff,0_0_30px_#ef4444]"
                    style={{ left: `calc(${progress}% - 6px)` }}
                    transition={{ ease: 'linear' }}
                  />
                </div>

                {/* Milestone Indicators (25% / 50% / 75% / 100%) */}
                <div className="w-full flex justify-between mt-2 font-mono text-[8px] sm:text-[9px] tracking-wider sm:tracking-widest text-white/30">
                  <span className={progress >= 25 ? 'text-red-400 font-bold transition-colors' : ''}>25%<span className="hidden sm:inline"> // INGEST</span></span>
                  <span className={progress >= 50 ? 'text-red-400 font-bold transition-colors' : ''}>50%<span className="hidden sm:inline"> // PARSE</span></span>
                  <span className={progress >= 75 ? 'text-red-400 font-bold transition-colors' : ''}>75%<span className="hidden sm:inline"> // SYNC</span></span>
                  <span className={progress >= 100 ? 'text-red-400 font-bold transition-colors' : ''}>100%<span className="hidden sm:inline"> // ENGAGE</span></span>
                </div>

                {/* Telemetry Equalizer Spectrum (Live simulated audio/DSP bars) */}
                <div className="flex items-center justify-center gap-1.5 mt-6">
                  {Array.from({ length: 16 }).map((_, idx) => {
                    const height = 4 + Math.sin(idx * 0.8 + progress * 0.1) * 8 + (progress > 50 ? 4 : 0);
                    return (
                      <motion.div
                        key={idx}
                        className="w-[2px] rounded-full bg-white/20 transition-all duration-150"
                        style={{
                          height: `${Math.max(3, height)}px`,
                          backgroundColor: idx % 3 === 0 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(255, 255, 255, 0.25)',
                        }}
                      />
                    );
                  })}
                </div>

                {/* Click / Space to Enter Hint Button */}
                <div className="mt-8 flex items-center gap-2 group">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 group-hover:border-red-500/50 bg-white/[0.02] group-hover:bg-red-500/10 transition-all duration-300">
                    <Zap className="w-3 h-3 text-red-500 group-hover:animate-bounce" />
                    <span className="font-mono text-[9px] sm:text-[10px] text-white/60 group-hover:text-white tracking-[0.2em] uppercase transition-colors">
                      {progress < 100 ? 'CLICK ANYWHERE OR PRESS SPACE TO ENTER' : 'DEPLOYING AUTONOMOUS SYSTEMS...'}
                    </span>
                    <CornerDownLeft className="w-3 h-3 text-white/30 group-hover:text-red-400 transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Precision Outer Framing Corners */}
          <div className="absolute top-6 left-6 w-8 h-8 border-l border-t border-red-500/30 pointer-events-none" />
          <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-red-500/30 pointer-events-none" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-l border-b border-red-500/30 pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-r border-b border-red-500/30 pointer-events-none" />
        </div>
      )}
    </AnimatePresence>
  );
}
