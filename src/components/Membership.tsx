import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    period: '',
    description: 'Perfect for getting started',
    icon: Sparkles,
    features: [
      'Access to workshops',
      'Community Discord',
      'Monthly newsletter',
      'Event notifications',
      'Basic project resources',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'Best for active members',
    icon: Zap,
    features: [
      'Everything in Basic',
      'Priority workshop access',
      'Project mentorship',
      'Lab equipment access',
      'Competition registration',
      'Certificate of membership',
    ],
    cta: 'Join Pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For teams and organizations',
    icon: Crown,
    features: [
      'Everything in Pro',
      'Team project support',
      'Custom workshops',
      'Sponsor recognition',
      'VIP event access',
      'Dedicated support',
    ],
    cta: 'Contact Us',
    highlighted: false,
  },
];

export default function Membership() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [_hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pricing-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="membership"
      ref={sectionRef}
      className="relative py-14 lg:py-20 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0c0c0c] to-[#0a0a0a]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="section-tag mb-6 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Membership
            </span>
            <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-5 uppercase">
              Choose Your <span className="text-gradient">Plan</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              Unlock your potential with our membership plans. Get access to exclusive resources,
              workshops, and networking opportunities.
            </p>
          </div>

          {/* Pricing Cards */}
          <div
            ref={cardsRef}
            className="grid md:grid-cols-3 gap-6 lg:gap-8 items-center"
          >
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`pricing-card relative group ${plan.highlighted ? 'md:-my-6 z-10' : ''}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Glow bg for highlighted */}
                {plan.highlighted && (
                  <div className="absolute -inset-px bg-gradient-to-b from-red-500/30 to-purple-600/20 rounded-3xl blur-md -z-10 opacity-60" />
                )}

                <div
                  className={`relative p-7 lg:p-8 rounded-3xl border transition-all duration-500 h-full flex flex-col ${
                    plan.highlighted
                      ? 'bg-gradient-to-b from-red-500/10 via-[#0f0f0f] to-[#0c0c0c] border-red-500/35 shadow-[0_0_50px_rgba(239,68,68,0.15)]'
                      : 'bg-white/[0.02] border-white/8 hover:border-white/15 hover:bg-white/[0.04]'
                  }`}
                  style={{ transition: 'transform 0.3s ease, border-color 0.4s, box-shadow 0.4s' }}
                >
                  {/* Popular Badge */}
                  {plan.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-red-600/30 animate-pulse-glow whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl mb-6 border transition-colors ${
                      plan.highlighted
                        ? 'bg-red-500/15 border-red-500/30'
                        : 'bg-white/[0.05] border-white/8'
                    }`}
                  >
                    <plan.icon className={`w-5 h-5 ${plan.highlighted ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>

                  {/* Plan Name */}
                  <h3 className="font-orbitron text-lg font-black text-white mb-1 uppercase tracking-wider">{plan.name}</h3>
                  <p className="text-gray-600 text-xs mb-5">{plan.description}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-white/5">
                    <span className={`font-orbitron text-4xl font-black ${plan.highlighted ? 'text-white' : 'text-white'}`}>
                      {plan.price}
                    </span>
                    <span className="text-gray-600 text-sm">{plan.period}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div
                          className={`w-4 h-4 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 ${
                            plan.highlighted ? 'bg-red-500/20 border border-red-500/30' : 'bg-white/8 border border-white/10'
                          }`}
                        >
                          <Check className={`w-2.5 h-2.5 ${plan.highlighted ? 'text-red-400' : 'text-gray-500'}`} />
                        </div>
                        <span className="text-sm text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className={`cyber-btn w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white shadow-lg shadow-red-600/25 hover:shadow-red-500/40'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 text-sm">
              All plans include access to our community Discord and monthly newsletter.
            </p>
            <p className="text-gray-700 text-xs mt-1">Cancel anytime · No hidden fees · Instant access</p>
          </div>
        </div>
      </div>
    </section>
  );
}
