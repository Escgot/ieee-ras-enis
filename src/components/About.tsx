import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Lightbulb, Users, Trophy } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 200, suffix: '+', label: 'Members', icon: Users },
  { value: 7, suffix: '+', label: 'Projects', icon: Lightbulb },
  { value: 70, suffix: '+', label: 'Competition Wins', icon: Trophy },
  { value: 2010, suffix: '', label: 'Founded', icon: Target },
];

const pillars = [
  { title: 'Innovation', desc: 'Pushing boundaries in robotics and automation', color: 'from-red-500/10 to-red-500/5', border: 'border-red-500/20', icon: '⚡' },
  { title: 'Collaboration', desc: 'Teamwork drives exceptional results', color: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/20', icon: '🤝' },
  { title: 'Excellence', desc: 'Striving for the highest standards', color: 'from-red-500/10 to-red-500/5', border: 'border-red-500/20', icon: '🏆' },
  { title: 'Learning', desc: 'Continuous growth mindset', color: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/20', icon: '🧠' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: value,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: function () {
            setCount(Math.floor(this.targets()[0].val));
          },
        });
      },
      once: true,
    });

    return () => trigger.kill();
  }, [value]);

  return (
    <span ref={counterRef} className="counter-value">
      {count}{suffix}
    </span>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // 3D tilt on stat cards
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLDivElement>('.stat-card');
    const handlers: Array<{ el: HTMLDivElement; mm: (e: MouseEvent) => void; ml: () => void }> = [];

    cards.forEach((card) => {
      const mm = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
        card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateZ(6px)`;
      };
      const ml = () => {
        card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      };
      card.addEventListener('mousemove', mm);
      card.addEventListener('mouseleave', ml);
      handlers.push({ el: card, mm, ml });
    });

    return () => {
      handlers.forEach(({ el, mm, ml }) => {
        el.removeEventListener('mousemove', mm);
        el.removeEventListener('mouseleave', ml);
      });
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current,
        { opacity: 0, x: -60, scale: 0.93 },
        {
          opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        }
      );

      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 60 },
        {
          opacity: 1, x: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        }
      );

      gsap.fromTo('.stat-card',
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
        }
      );

      gsap.fromTo('.pillar-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: contentRef.current, start: 'top 80%' },
        }
      );

      // Section parallax
      gsap.to(sectionRef.current, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-14 lg:py-20 overflow-hidden bg-transparent">
      {/* Borders and Grid */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="section-tag mb-6 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              About Us
            </span>
            <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mt-4">
              Building the{' '}
              <span className="text-gradient">Future</span>{' '}
              Together
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Image Column */}
            <div ref={imageRef} className="relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden holographic">
                {/* Animated scan line */}
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                  <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent animate-scan" />
                </div>

                <img
                  src="/images/about-team.webp"
                  alt="RAS ENIS Team"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />

                {/* Border glow */}
                <div className="absolute inset-0 rounded-3xl border border-white/10" />
                <div className="absolute inset-0 rounded-3xl border border-red-500/0 hover:border-red-500/20 transition-colors duration-500" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 px-6 py-4 glass-dark rounded-2xl shadow-2xl border border-red-500/20 animate-float">
                <div className="font-orbitron text-2xl font-black text-red-500">14+</div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">Years of Excellence</div>
              </div>

              {/* Top-left floating element */}
              <div className="absolute -top-4 -left-4 w-14 h-14 flex items-center justify-center glass-dark rounded-2xl border border-purple-500/20 animate-float" style={{ animationDelay: '1.5s' }}>
                <span className="text-2xl">🤖</span>
              </div>
            </div>

            {/* Content Column */}
            <div ref={contentRef} className="space-y-8">
              <div className="space-y-4">
                <p className="text-lg text-gray-300 leading-relaxed">
                  IEEE Robotics & Automation Society at ENIS{' '}
                  <span className="text-white font-medium">(École Nationale d'Ingénieurs de Sfax)</span>{' '}
                  is a student chapter dedicated to advancing robotics and automation technology.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  Since 2010, we've been empowering the next generation of engineers — through hands-on projects,
                  workshops, hackathons, and international competitions. Our mission: shape the future of intelligent machines.
                </p>
              </div>

              {/* Pillars grid */}
              <div className="grid grid-cols-2 gap-3">
                {pillars.map((item, index) => (
                  <div
                    key={index}
                    className={`pillar-card group relative p-4 bg-gradient-to-br ${item.color} border ${item.border} rounded-2xl hover:scale-[1.03] transition-all duration-300 cursor-default premium-card`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">{item.icon}</span>
                      <div>
                        <h4 className="font-orbitron font-bold text-white text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>


            </div>
          </div>

          {/* Stats Row */}
          <div ref={statsRef} className="mt-12 grid grid-cols-4 gap-2 sm:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-card group relative p-3 sm:p-8 glass-dark border border-white/8 rounded-2xl sm:rounded-3xl hover:border-red-500/30 transition-all duration-500 cursor-default overflow-hidden"
                style={{ transition: 'transform 0.2s ease, border-color 0.3s' }}
              >
                {/* Hover glow bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                <div className="relative">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center bg-red-500/10 border border-red-500/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-5 group-hover:bg-red-500/20 transition-colors">
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  </div>
                  <div className="font-orbitron text-lg sm:text-4xl font-black text-white mb-0.5 sm:mb-1 counter-value">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[8px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium line-clamp-1">{stat.label}</div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-purple-500 group-hover:w-full transition-all duration-700 rounded-b-3xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
