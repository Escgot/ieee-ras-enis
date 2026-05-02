import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BookOpen,
  Video,
  FileText,
  Download,
  ExternalLink,
  Code,
  Cpu,
  Wrench,
  Lightbulb,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const resources = [
  {
    category: 'Learning Materials',
    icon: BookOpen,
    items: [
      { title: 'Robotics Fundamentals Guide', type: 'PDF', size: '2.5 MB' },
      { title: 'Arduino Programming Course', type: 'Video', size: '12 videos' },
      { title: 'ROS2 Beginner Tutorial', type: 'Course', size: '8 hours' },
      { title: 'Computer Vision Basics', type: 'PDF', size: '4.1 MB' },
    ],
  },
  {
    category: 'Project Templates',
    icon: Code,
    items: [
      { title: 'Line Follower Robot', type: 'Code', size: 'GitHub' },
      { title: 'Obstacle Avoidance Bot', type: 'Code', size: 'GitHub' },
      { title: ' robotic Arm Controller', type: 'Code', size: 'GitHub' },
      { title: 'Drone Flight Controller', type: 'Code', size: 'GitHub' },
    ],
  },
  {
    category: 'Technical Docs',
    icon: FileText,
    items: [
      { title: 'Sensor Datasheets Collection', type: 'PDF', size: '15 MB' },
      { title: 'Motor Specifications', type: 'PDF', size: '3.2 MB' },
      { title: 'Circuit Diagrams', type: 'PDF', size: '8.7 MB' },
      { title: 'Safety Guidelines', type: 'PDF', size: '1.5 MB' },
    ],
  },
  {
    category: 'Workshop Recordings',
    icon: Video,
    items: [
      { title: 'Introduction to CAD Design', type: 'Video', size: '45 min' },
      { title: '3D Printing Workshop', type: 'Video', size: '60 min' },
      { title: 'PCB Design Basics', type: 'Video', size: '50 min' },
      { title: 'AI in Robotics', type: 'Video', size: '90 min' },
    ],
  },
];

const quickLinks = [
  { name: 'GitHub', icon: Code, url: '#' },
  { name: 'Documentation', icon: FileText, url: '#' },
  { name: 'Tutorials', icon: Lightbulb, url: '#' },
  { name: 'Tools', icon: Wrench, url: '#' },
  { name: 'Components', icon: Cpu, url: '#' },
];

export default function Resources() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.resource-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
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
    <section id="resources" ref={sectionRef} className="relative py-14 lg:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 neural-bg" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px]" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20 rounded-full">
              Resources
            </span>
            <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Learning <span className="text-gradient">Materials</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Access our comprehensive collection of tutorials, documentation, and project
              resources to accelerate your robotics journey.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/30 rounded-xl transition-all duration-300"
              >
                <link.icon className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-300">{link.name}</span>
              </a>
            ))}
          </div>

          {/* Resources Grid */}
          <div ref={cardsRef} className="grid md:grid-cols-2 gap-6">
            {resources.map((category, index) => (
              <div
                key={index}
                className="resource-card group bg-dark-100 border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/30 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-center gap-3 p-5 border-b border-white/10">
                  <div className="w-10 h-10 flex items-center justify-center bg-red-500/10 rounded-lg">
                    <category.icon className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-orbitron text-lg font-semibold text-white">
                    {category.category}
                  </h3>
                </div>

                {/* Items */}
                <div className="p-5">
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group/item"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center bg-red-500/10 rounded-lg">
                            {item.type === 'PDF' && <FileText className="w-4 h-4 text-red-500" />}
                            {item.type === 'Video' && <Video className="w-4 h-4 text-red-500" />}
                            {item.type === 'Code' && <Code className="w-4 h-4 text-red-500" />}
                            {item.type === 'Course' && <BookOpen className="w-4 h-4 text-red-500" />}
                            {item.type === 'GitHub' && <ExternalLink className="w-4 h-4 text-red-500" />}
                          </div>
                          <div>
                            <p className="text-sm text-white group-hover/item:text-red-500 transition-colors">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.type} • {item.size}
                            </p>
                          </div>
                        </div>
                        <button className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-red-500 rounded-lg transition-colors">
                          {item.type === 'GitHub' ? (
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover/item:text-white" />
                          ) : (
                            <Download className="w-4 h-4 text-gray-400 group-hover/item:text-white" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="px-5 pb-5">
                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    View All
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-16 p-8 bg-gradient-to-r from-red-500/10 to-purple-500/10 border border-white/10 rounded-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-orbitron text-xl font-semibold text-white mb-2">
                  Stay Updated
                </h3>
                <p className="text-gray-400">
                  Subscribe to our newsletter for the latest resources and updates.
                </p>
              </div>
              <div className="flex w-full md:w-auto gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 md:w-64 px-4 py-3 bg-dark-100 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                />
                <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
