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
    title: 'FLASH X VIPER DOMINATES DERBY CHALLENGE AT INSAT',
    excerpt: 'The Derby Challenge at INSAT brought together some of the sharpest university teams in a high-speed test of precision, control, and algorithmic efficiency. After an intense showdown on the track, it was Sangour who claimed the top spot, outperforming the competition with exceptional stability and speed.',
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
    title: 'SANGOUR TAKES 1ST PLACE AT LINE FOLLOWER CHALLENGE AT IIT ROBOTICS',
    excerpt: 'The Line Follower Challenge at IIT Robots brought together some of the sharpest university teams in a high-speed test of precision, control, and algorithmic efficiency. After an intense showdown on the track, it was Sangour who claimed the top spot, outperforming the competition with exceptional stability and speed.',
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
    id: 3,
    title: 'HUNTER TAKES 1ST PLACE AT LINE FOLLOWER CHALLENGE AT NPC 3.0',
    excerpt: 'The NPC 3.0 competition brought together some of the sharpest university teams in a high-speed test of precision, control, and algorithmic efficiency. After an intense showdown on the track, it was Sangour who claimed the top spot, outperforming the competition with exceptional stability and speed.',
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
    id: 4,
    title: 'HUNTER TAKES 1ST PLACE AT LINE FOLLOWER CHALLENGE AT ROBOSTATION 1.0',
    excerpt: 'Join our annual build challenge and showcase your engineering skills.',
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
    id: 5,
    title: 'HUNTER AND VIPER DESTROYING THE FSM ROBOTS',
    excerpt: 'The FSM Robots competition was a thrilling event that tested the skills of the best robotics teams in the country. Our team, Sangour, emerged victorious, showcasing the power of our innovative robot design.',
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
    id: 6,
    title: 'NEMMELA TAKES 1ST PLACE AT LINE FOLLOWER CHALLENGE AT ENETROBOTS',
    excerpt: 'ENETROBOTS wasn’t just a race — it was a test of precision under pressure.\nAt ENET’Com, the Line Follower Challenge turned into a battlefield of control and consistency.\nNEMMELA rose above the track and secured 🏆 1st Place, executing every turn with confidence and accuracy.\nClose behind, SANGOUR claimed 🥈 2nd Place, proving once again that discipline and fine-tuning make champions.\nA double podium finish that reflects hours of calibration, relentless testing, and a team that never compromises on performance.\nAnother strong statement from IEEE RAS ENIS SBC — where every line is mastered, and every challenge is owned.\nRespect to ENET’Com for hosting a competitive and inspiring event.\nDifferent track. Same mindset.\nWe build. We optimize. We win. 🔥',
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
    id: 7,
    title: 'HUNTER TAKES 1ST PLACE AT LINE FOLLOWER CHALLENGE AT ENSIT BOTPATH',
    excerpt: 'ENSIT BOTPATH wasn’t just about staying on track — it was about mastering it.\nAt ENSIT, the Line Follower Challenge turned into a showcase of precision and control.\nHUNTER led the charge and secured 🏆 1st Place, delivering a flawless performance from start to finish.\nRight behind, RAGNAR claimed 🥈 2nd Place, proving once again that consistency and sharp tuning make all the difference.\nA double podium finish — built on countless test runs, fine adjustments, and a team that refuses to settle for “good enough.”\nThis is IEEE RAS ENIS SBC in motion:\nPrecision in every line.\nDiscipline in every move.\nResults that speak.\nRespect to ENSIT for hosting a competitive and challenging event that brought out the best in every team.\nSame challenge. Same dominance.\nWe build. We refine. We win. 🔥',
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
    id: 8,
    title: 'SANGOUR TAKES 1ST PLACE AT LINE FOLLOWER CHALLENGE AT ENSTAROBOTS 6.0',
    excerpt: 'The ENSTAROBOTS 6.0 competition was a thrilling event that tested the skills of the best robotics teams in the country. Our team, Sangour, emerged victorious, showcasing the power of our innovative robot design.',
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
    id: 9,
    title: 'VIPER TAKES 1ST PLACE AT ROCKET LEAGUE CHALLENGE AT TECHNOBOT 4.0',
    excerpt: 'At ISSAT Kairouan, on 25-01-2026, VIPER stepped into the Robot League with one goal: domination.\nAnd it delivered.\n🏆 1st Place secured — not by chance, but through control, precision, and a machine built to outperform.\nEvery movement on the field reflected hours of testing, refined strategy, and a team that refuses average.\nNo shortcuts. No hesitation. Just execution.\nThis victory adds another milestone to IEEE RAS ENIS SBC — where passion meets discipline, and results speak louder than words.',
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
    id: 10,
    title: 'NEMMELA DELIVERED STRONG RESULTS ACROSS MULTIPLE CHALLENGES AT ISGIS ROBOTS CUP V4.0',
    excerpt: 'ISGIS ROBOTS CUP V4.0 delivered strong results across multiple challenges, reflecting the team’s focus on performance and reliability.\nNEMMELA secured 1st Place in the Line Follower Challenge 🏆\nWith precise tracking and fast response, it demonstrated consistent and efficient performance.\nAnd the results continued.\nVIPER achieved 1st Place in the All-Terrain Challenge 🏆\nHandling obstacles with stability and control, it proved its robustness in demanding conditions.\nThese results are the outcome of continuous testing, iterative improvements, and a team committed to refining every detail.\nThis achievement belongs to IEEE RAS ENIS SBC — driven by passion, guided by discipline, and focused on progress.\n',
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
    id: 11,
    title: 'SOFIENE DELIVERED STRONG RESULTS ACROSS MULTIPLE CHALLENGES AT APROBOT V1.0',
    excerpt: 'APROBOT V1.0 delivered strong results across multiple challenges, reflecting the team’s focus on performance and reliability.\nHUNTER secured 1st Place in the Line Follower Challenge 🏆\nWith precise tracking and fast response, it demonstrated consistent and efficient performance.\nAnd the results continued.\nVIPER achieved 1st Place in the All-Terrain Challenge 🏆\nHandling obstacles with stability and control, it proved its robustness in demanding conditions.\nThese results are the outcome of continuous testing, iterative improvements, and a team committed to refining every detail.\nThis achievement belongs to IEEE RAS ENIS SBC — driven by passion, guided by discipline, and focused on progress.\n',
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
    id: 12,
    title: 'SANGOUR DELIVERED STRONG RESULTS ACROSS MULTIPLE CHALLENGES AT CRBOT ISIMM V3.0',
    excerpt: 'CRBOT ISIMM V3.0 delivered strong results across multiple challenges, reflecting the team’s focus on performance and reliability.\nHUNTER secured 1st Place in the Line Follower Challenge 🏆\nWith precise tracking and fast response, it demonstrated consistent and efficient performance.\nAnd the results continued.\nVIPER achieved 1st Place in the All-Terrain Challenge 🏆\nHandling obstacles with stability and control, it proved its robustness in demanding conditions.\nThese results are the outcome of continuous testing, iterative improvements, and a team committed to refining every detail.\nThis achievement belongs to IEEE RAS ENIS SBC — driven by passion, guided by discipline, and focused on progress.\n',
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
    id: 13,
    title: 'VIPER DELIVERED STRONG RESULTS ACROSS MULTIPLE CHALLENGES AT ROBOTS LEAGUE 3.0',
    excerpt: 'ROBOTS LEAGUE 3.0 delivered strong results across multiple challenges, reflecting the team’s focus on performance and reliability.\nHUNTER secured 1st Place in the Line Follower Challenge 🏆\nWith precise tracking and fast response, it demonstrated consistent and efficient performance.\nAnd the results continued.\nVIPER achieved 1st Place in the All-Terrain Challenge 🏆\nHandling obstacles with stability and control, it proved its robustness in demanding conditions.\nThese results are the outcome of continuous testing, iterative improvements, and a team committed to refining every detail.\nThis achievement belongs to IEEE RAS ENIS SBC — driven by passion, guided by discipline, and focused on progress.\n',
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
    id: 14,
    title: 'PHEONIX DELIVERED STRONG RESULTS ACROSS MULTIPLE CHALLENGES AT ENISROBOT 8.0',
    excerpt: 'ENISROBOT 8.0 delivered strong results across multiple challenges, reflecting the team’s focus on performance and reliability.\nHUNTER secured 1st Place in the Line Follower Challenge 🏆\nWith precise tracking and fast response, it demonstrated consistent and efficient performance.\nAnd the results continued.\nVIPER achieved 1st Place in the All-Terrain Challenge 🏆\nHandling obstacles with stability and control, it proved its robustness in demanding conditions.\nThese results are the outcome of continuous testing, iterative improvements, and a team committed to refining every detail.\nThis achievement belongs to IEEE RAS ENIS SBC — driven by passion, guided by discipline, and focused on progress.\n',
    date: 'Nov 23, 2025',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/enis.png',
    location: 'ENIS',
    photos: [
      '/images/gallery/enis.png',
    ]
  },
  {
    id: 15,
    title: 'SANGOUR DELIVERED STRONG RESULTS ACROSS MULTIPLE CHALLENGES AT RALLYBOTS V1.0',
    excerpt: 'RALLYBOTS V1.0 delivered strong results across multiple challenges, reflecting the team’s focus on performance and reliability.\nHUNTER secured 1st Place in the Line Follower Challenge 🏆\nWith precise tracking and fast response, it demonstrated consistent and efficient performance.\nAnd the results continued.\nVIPER achieved 1st Place in the All-Terrain Challenge 🏆\nHandling obstacles with stability and control, it proved its robustness in demanding conditions.\nThese results are the outcome of continuous testing, iterative improvements, and a team committed to refining every detail.\nThis achievement belongs to IEEE RAS ENIS SBC — driven by passion, guided by discipline, and focused on progress.\n',
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
