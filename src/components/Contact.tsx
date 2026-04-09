import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, CheckCircle, Instagram, Facebook, Linkedin, Send } from 'lucide-react';
import DiscordIcon from './DiscordIcon';

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'contact@rasenis.org', href: 'mailto:contact@rasenis.org', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', hoverBg: 'group-hover:bg-red-500' },
  { icon: Phone, label: 'Phone', value: '+216 74 123 456', href: 'tel:+21674123456', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', hoverBg: 'group-hover:bg-purple-500' },
  { icon: MapPin, label: 'Location', value: 'ENIS, Sfax, Tunisia', href: '#', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', hoverBg: 'group-hover:bg-red-500' },
];

const socials = [
  { icon: Instagram, href: 'https://www.instagram.com/ieee.ras.enis/', label: 'Instagram', hoverColor: 'hover:bg-[#E4405F] hover:border-[#E4405F] hover:shadow-[0_0_15px_#E4405F66]' },
  { icon: Facebook, href: 'https://www.facebook.com/IEEERASENIS', label: 'Facebook', hoverColor: 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_0_15px_#1877F266]' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/ieee-ras-chapter-enis-student-branch/posts/?feedView=all', label: 'LinkedIn', hoverColor: 'hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:shadow-[0_0_15px_#0A66C266]' },
  { icon: DiscordIcon, href: 'https://discord.gg/HXxBRJUq', label: 'Discord', hoverColor: 'hover:bg-[#5865F2] hover:border-[#5865F2] hover:shadow-[0_0_15px_#5865F266]' },
];

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-left',
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
      gsap.fromTo('.contact-right',
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
      gsap.fromTo('.contact-info-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-14 lg:py-20 overflow-hidden bg-transparent"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <span className="section-tag mb-6 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Get In Touch
            </span>
            <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 uppercase">
              Contact <span className="text-gradient">Us</span>
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mt-4 leading-relaxed">
              Have a question, partnership idea, or just want to say hi? We'd love to hear from you.
            </p>
          </div>

          {/* 3-column grid */}
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">

            {/* Column 1: Info + Socials */}
            <div className="lg:col-span-3 space-y-4 contact-left">
              {contactInfo.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className={`contact-info-item group flex items-center gap-4 p-4 bg-white/[0.02] border ${item.border} rounded-2xl hover:border-opacity-60 transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5`}
                >
                  <div className={`w-11 h-11 flex-shrink-0 flex items-center justify-center ${item.bg} border ${item.border} rounded-xl ${item.hoverBg} hover:border-transparent transition-all duration-300`}>
                    <item.icon className={`w-4 h-4 ${item.color} group-hover:text-white transition-colors`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-0.5">{item.label}</p>
                    <p className={`text-sm text-white font-medium group-hover:${item.color} transition-colors truncate`}>
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}

              {/* Social Links */}
              <div className="p-4 bg-white/[0.02] border border-white/6 rounded-2xl">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-4">Follow Us</p>
                <div className="flex flex-wrap gap-2.5 sm:gap-3">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-white/5 border border-white/8 rounded-xl transition-all duration-300 text-gray-500 hover:text-white hover:scale-110 ${s.hoverColor}`}
                    >
                      <s.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Map */}
            <div className="lg:col-span-4 contact-left" style={{ transitionDelay: '0.1s' }}>
              <div className="relative w-full h-full min-h-[280px] lg:min-h-0 bg-white/[0.02] border border-white/6 rounded-3xl overflow-hidden group">
                {/* Map border glow on hover */}
                <div className="absolute inset-0 rounded-3xl border border-red-500/0 group-hover:border-red-500/15 transition-colors duration-500 z-10 pointer-events-none" />

                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4111.773082045189!2d10.714615326368852!3d34.72608243184951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13002ca414596f93%3A0xe3e9722b14d6ef6!2sIEEE%20ENIS%20SB!5e1!3m2!1sen!2stn!4v1775397193565!5m2!1sen!2stn"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 280 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale group-hover:grayscale-0 transition-all duration-700 opacity-50 group-hover:opacity-90"
                />

                {/* Map overlay label */}
                <div className="absolute bottom-4 left-4 z-10 px-3 py-2 glass-dark rounded-xl border border-white/10">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">IEEE ENIS SB</p>
                  <p className="text-[9px] text-gray-600">Sfax, Tunisia</p>
                </div>
              </div>
            </div>

            {/* Column 3: Form */}
            <div className="lg:col-span-5 contact-right">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="p-6 sm:p-7 bg-white/[0.02] border border-white/6 rounded-3xl flex flex-col gap-4 hover:border-white/10 transition-colors duration-500"
              >
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-green-500/10 border border-green-500/20 rounded-full mb-5 animate-scale-in">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="font-orbitron text-xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-500 text-sm">We'll get back to you shortly.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {(['name', 'email'] as const).map((field) => (
                        <div key={field} className="relative">
                          <input
                            type={field === 'email' ? 'email' : 'text'}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            onFocus={() => setFocusedField(field)}
                            onBlur={() => setFocusedField(null)}
                            required
                            placeholder={field === 'name' ? 'Your Name' : 'Email Address'}
                            className={`w-full px-4 py-3 bg-white/[0.03] border rounded-xl text-white text-sm placeholder-gray-700 focus:outline-none transition-all duration-300 ${
                              focusedField === field
                                ? 'border-red-500/50 bg-red-500/[0.03] shadow-[0_0_15px_rgba(239,68,68,0.08)]'
                                : 'border-white/8 hover:border-white/15'
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="relative">
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full px-4 py-3 bg-white/[0.03] border rounded-xl text-sm focus:outline-none transition-all duration-300 appearance-none cursor-pointer ${
                          formData.subject ? 'text-white' : 'text-gray-700'
                        } ${
                          focusedField === 'subject'
                            ? 'border-red-500/50 bg-red-500/[0.03]'
                            : 'border-white/8 hover:border-white/15'
                        }`}
                      >
                        <option value="" className="bg-[#0d0d0d] text-gray-500">Select a topic</option>
                        <option value="general" className="bg-[#0d0d0d] text-white">General Inquiry</option>
                        <option value="news" className="bg-[#0d0d0d] text-white">News & Updates</option>
                        <option value="sponsorship" className="bg-[#0d0d0d] text-white">Sponsorship</option>
                        <option value="collaboration" className="bg-[#0d0d0d] text-white">Collaboration</option>
                        <option value="membership" className="bg-[#0d0d0d] text-white">Membership</option>
                        <option value="other" className="bg-[#0d0d0d] text-white">Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        required
                        rows={4}
                        placeholder="Your message..."
                        className={`w-full px-4 py-3 bg-white/[0.03] border rounded-xl text-white text-sm placeholder-gray-700 focus:outline-none transition-all duration-300 resize-none ${
                          focusedField === 'message'
                            ? 'border-red-500/50 bg-red-500/[0.03] shadow-[0_0_15px_rgba(239,68,68,0.08)]'
                            : 'border-white/8 hover:border-white/15'
                        }`}
                      />
                      {/* Character hint */}
                      <span className="absolute bottom-3 right-3 text-[10px] text-gray-700">
                        {formData.message.length}/500
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative group w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-rose-400 disabled:from-red-900 disabled:to-red-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg shadow-red-600/20 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98] cyber-btn overflow-hidden flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>

                    <p className="text-center text-[10px] text-gray-700">
                      We typically respond within 24 hours.
                    </p>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
