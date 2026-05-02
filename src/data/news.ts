export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  location: string;
  isFeatured?: boolean;
  photos?: string[];
}

export const news: NewsItem[] = [

{
    id: 1,
    title: 'FLASH X VIPER: UNRIVALED DOMINANCE AT INSAT DERBY',
    excerpt: 'The INSAT Derby Challenge was a high-stakes test of agility and engineering. Flash and Viper shattered expectations, turning the track into their playground. A masterclass in speed, stability, and sheer dominance that left the competition far behind.',
    date: 'April 19, 2026',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/insat/0.webp',
    location: 'INSAT Tunis',
    isFeatured: true,
    photos: [
      '/images/gallery/insat/0.webp',
    ]
  },
  {
    id: 2,
    title: 'DOUBLE GLORY AT ENICARTHAGE 8.0: NEMMELA & OLIVIA DOMINATE',
    excerpt: 'The City of Science witnessed a masterclass in engineering at ENICARTHAGE Robots 8.0. Nemmela delivered a flawless performance to secure 1st place in the Line Follower challenge, executing precise turns at high velocity. Meanwhile, Olivia powered through the grueling All-Terrain course to claim an impressive 2nd place. A powerful testament to our team\'s versatility and unyielding drive for excellence.',
    date: 'April 12, 2026',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/enicar/enicar0.webp',
    location: 'city of science, Tunis',
    photos: [
      '/images/gallery/enicar/enicar0.webp',
      '/images/gallery/enicar/enicar1.webp',
      '/images/gallery/enicar/enicar2.webp',
      '/images/gallery/enicar/enicar3.webp',
      '/images/gallery/enicar/enicar4.webp',
      '/images/gallery/enicar/enicar5.webp',
      '/images/gallery/enicar/enicar6.webp',
      '/images/gallery/enicar/enicar7.webp',
      '/images/gallery/enicar/enicar8.webp',
    ]
  },
  {
    id: 3,
    title: 'KILLER STRIKES FIRST: GOLD AT IIT ROBOTICS',
    excerpt: 'Precision meets velocity. At IIT Sfax, Killer showcased flawless line-tracking algorithms, navigating hairpin turns with absolute control. A textbook victory demonstrating our uncompromising standard of excellence on the track.',
    date: 'April 12, 2026',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/iit/iit0.webp',
    location: 'IIT Sfax',
    photos: [
      '/images/gallery/iit/iit0.webp',
      '/images/gallery/iit/iit1.webp',
      '/images/gallery/iit/iit2.webp',
      '/images/gallery/iit/iit3.webp',
      '/images/gallery/iit/iit4.webp',
      '/images/gallery/iit/iit5.webp',
    ]
  },
  {
    id: 4,
    title: 'HUNTER CONQUERS NPC 3.0: LINE FOLLOWER CHAMPION',
    excerpt: 'The track at NPC 3.0 demanded perfection, and Hunter delivered. Navigating the circuits with absolute precision, it secured 1st place in a breathtaking display of fine-tuned calibration, raw speed, and algorithmic mastery.',
    date: 'April 5, 2026',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/npc/npc0.webp',
    location: 'Polytechnique Sousse',
    photos: [
      '/images/gallery/npc/npc0.webp',
      '/images/gallery/npc/npc1.webp',
      '/images/gallery/npc/npc2.webp',
      '/images/gallery/npc/npc3.webp',
      '/images/gallery/npc/npc4.webp',
      '/images/gallery/npc/npc5.jpg',
    ]
  },
  {
    id: 5,
    title: 'FLAWLESS EXECUTION: HUNTER SWEEPS ROBOSTATION 1.0',
    excerpt: 'A testament to relentless optimization. Hunter took on the EPI Sousse circuits and emerged victorious, proving once again that our autonomous line-follower systems are engineered exclusively for the top tier.',
    date: 'Mar 28, 2026',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/epi1.webp',
    location: 'EPI Sousse',
    photos: [
      '/images/gallery/epi1.webp',
      '/images/gallery/epi2.webp',
    ]
  },
  {
    id: 6,
    title: 'DOUBLE THREAT: HUNTER & VIPER DOMINATE FSM ROBOTS',
    excerpt: 'A symphony of engineering. Hunter and Viper took the stage at FSM Monastir, dismantling the competition with unyielding performance and robust mechanics. Another legendary showcase of IEEE RAS ENIS SBC\'s prowess.',
    date: 'Feb 15, 2026',
    category: 'Competitions',
    readTime: '5 min read',
    image: '/images/gallery/fsm/fsm1.webp',
    location: 'FSM Monastir',
    photos: [
      '/images/gallery/fsm/fsm1.webp',
      '/images/gallery/fsm/fsm2.webp',
      '/images/gallery/fsm/fsm3.webp',
      '/images/gallery/fsm/fsm4.webp',
    ]
  },
  {
    id: 7,
    title: 'PODIUM SWEEP AT ENETROBOTS: NEMMELA & SANGOUR',
    excerpt: 'Total control of the track. Nemmela seized 1st place with absolute accuracy, while Sangour followed closely in 2nd. A stunning double-podium finish that reflects hours of calibration and our relentless drive for perfection.',
    date: 'Feb 08, 2026',
    category: 'Competitions',
    readTime: '4 min read',
    image: '/images/gallery/enet/enet0.webp',
    location: "ENET'Com Sfax",
    photos: [
      '/images/gallery/enet/enet0.webp',
      '/images/gallery/enet/enet1.webp',
      '/images/gallery/enet/enet2.webp',
      '/images/gallery/enet/enet3.webp',
      '/images/gallery/enet/enet4.webp',
      '/images/gallery/enet/enet5.webp',
      '/images/gallery/enet/enet6.webp',
      '/images/gallery/enet/enet7.webp',
      '/images/gallery/enet/enet8.webp',
      '/images/gallery/enet/enet9.webp',
      '/images/gallery/enet/enet10.webp',
      '/images/gallery/enet/enet11.webp',
      '/images/gallery/enet/enet12.webp',
      '/images/gallery/enet/enet13.webp',
      '/images/gallery/enet/enet14.webp',
    ]
  },
  {
    id: 8,
    title: 'ENSIT BOTPATH CONQUERED: HUNTER & RAGNAR REIGN SUPREME',
    excerpt: 'Precision in every line, discipline in every move. Hunter led the charge for Gold, with Ragnar taking Silver in a flawless 1-2 finish. At ENSIT, we didn\'t just compete—we defined the standard of autonomous navigation.',
    date: 'Feb 8, 2026',
    category: 'Competitions',
    readTime: '2 min read',
    image: '/images/gallery/ensit/ensit0.webp',
    location: 'ENSIT Tunis',
    photos: [
      '/images/gallery/ensit/ensit0.webp',
      '/images/gallery/ensit/ensit1.webp',
      '/images/gallery/ensit/ensit2.webp',
    ]
  },
  {
    id: 9,
    title: 'SANGOUR SEIZES GOLD AT ENSTAROBOTS 6.0',
    excerpt: 'Against top-tier university teams, Sangour\'s innovative architecture and flawless execution earned it the 1st place crown. A brilliant display of high-speed control and fine-tuned algorithms at ENSTAB Tunis.',
    date: 'Feb 1, 2026',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/enstab/enstab0.png',
    location: 'ENSTAB Tunis',
    photos: [
      '/images/gallery/enstab/enstab0.png',
      '/images/gallery/enstab/enstab1.png',
      '/images/gallery/enstab/enstab2.png',
    ]
  },
  {
    id: 10,
    title: 'VIPER\'S ARENA: ROCKET LEAGUE CHAMPION AT TECHNOBOT 4.0',
    excerpt: 'No hesitation, just execution. Viper stepped into the ISSAT Kairouan arena and dominated the Rocket League challenge. A powerful statement of control, strategy, and mechanical superiority that left zero room for chance.',
    date: 'Jan 25, 2026',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/issatkr.webp',
    location: 'ISSAT KAIROUAN',
    photos: [
      '/images/gallery/issatkr.webp',  
    ]
  },
  {
    id: 11,
    title: 'NEMMELA\'S TRIUMPH AT ISGIS ROBOTS CUP V4.0',
    excerpt: 'Under the intense pressure of ISGIS Sfax, Nemmela exhibited unmatched precision and rapid response times. Securing top honors on the track, it underscored our unyielding commitment to pushing the limits of robotics.',
    date: 'Jan 25, 2026',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/isgis/isgis0.png',
    location: 'ISGIS SFAX',
    photos: [
      '/images/gallery/isgis/isgis0.png',
      '/images/gallery/isgis/isgis1.png',
    ]
  },
  {
    id: 12,
    title: 'SOFIENE\'S MASTERCLASS AT APROBOT V1.0',
    excerpt: 'Engineering brilliance on full display at Lycée Bakelta. Sofiene navigated complex challenges with unparalleled stability and intelligent control, securing another triumphant victory for the ENIS SBC legacy.',
    date: 'Dec 28, 2025',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/aprobot/aprobot0.webp',
    location: 'LYCEE BAKELTA',
    photos: [
      '/images/gallery/aprobot/aprobot0.webp',
      '/images/gallery/aprobot/aprobot1.webp',
      '/images/gallery/aprobot/aprobot2.webp',
    ]
  },
  {
    id: 13,
    title: 'SANGOUR SHINES BRIGHT AT CRBOT ISIMM V3.0',
    excerpt: 'Tough conditions require robust solutions. At ISIMM Monastir, Sangour\'s cutting-edge mechanics and razor-sharp algorithms proved too much for the competition, culminating in a dominant top-tier finish.',
    date: 'Dec 14, 2025',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/isimm1.png',
    location: 'ISIMM MONATSTIR',
    photos: [
      '/images/gallery/isimm1.png',
    ]
  },
  {
    id: 14,
    title: 'VIPER STRIKES HARD AT ROBOTS LEAGUE 3.0',
    excerpt: 'A showcase of absolute resilience and power. Viper tackled the demanding courses at ESSTHS Sousse with calculated precision, delivering a gold-standard performance that left the crowd in absolute awe.',
    date: 'Nov 30, 2025',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/essths.png',
    location: 'ESSTHS Sousse',
    photos: [
      '/images/gallery/essths.png',
    ]
  },
  {
    id: 15,
    title: 'PHOENIX RISES: GLORY AT ENISROBOT 8.0',
    excerpt: 'On home turf, the pressure is highest, but Phoenix soared above it all. Executing every challenge with unwavering stability and speed, it claimed its spot at the top and solidified our dominance at ENIS.',
    date: 'Nov 23, 2025',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/enis/enis0.webp',
    location: 'ENIS',
    photos: [
      '/images/gallery/enis/enis0.webp',
      '/images/gallery/enis/enis1.webp',
      '/images/gallery/enis/enis2.webp',
      '/images/gallery/enis/enis3.webp',
      '/images/gallery/enis/enis4.webp',
      '/images/gallery/enis/enis5.webp',
      '/images/gallery/enis/enis6.webp',
      '/images/gallery/enis/enis7.webp',
    ]
  },
  {
    id: 16,
    title: 'SANGOUR\'S FLAWLESS RUN AT RALLYBOTS V1.0',
    excerpt: 'Continuous testing yields undeniable results. Sangour took on the ISET Sfax track and delivered a masterclass in autonomous navigation, proving that passion and relentless discipline are the ultimate recipe for success.',
    date: 'Nov 16, 2025',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/iset-sfax.png',
    location: 'ISET Sfax',
    photos: [
      '/images/gallery/iset-sfax.png',
    ]
  },
  
];
