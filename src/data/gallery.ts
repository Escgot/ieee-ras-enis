/**
 * Gallery Image Data
 * 
 * To add your own pictures:
 * 1. Upload your images to the `public/images/gallery/` folder.
 * 2. Add the path as an entry in the appropriate row array below (e.g., '/images/gallery/your-photo.jpg').
 * 3. You can also use external URLs as shown below.
 * 
 * For the full gallery page, add a new GalleryEvent entry to the galleryEvents array.
 */

export interface GalleryEvent {
  id: string;
  name: string;
  date: string;          // e.g. "March 2025"
  location?: string;
  cover: string;         // cover/thumbnail image
  photos: string[];
}

export const galleryEvents: GalleryEvent[] = [
  {
    id: 'enet',
    name: 'ENET\'com Event',
    date: 'February 2025',
    location: 'ENET\'com, Sfax',
    cover: '/images/gallery/enet/enet0.webp',
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
    ],
  },
  {
    id: 'npc',
    name: 'NPC Competition',
    date: 'January 2025',
    location: 'Tunisia',
    cover: '/images/gallery/npc/npc0.webp',
    photos: [
      '/images/gallery/npc/npc0.webp',
      '/images/gallery/npc/npc1.webp',
      '/images/gallery/npc/npc2.webp',
      '/images/gallery/npc/npc3.webp',
      '/images/gallery/npc/npc4.webp',
      '/images/gallery/npc/npc5.jpg',
    ],
  },
  {
    id: 'workshop',
    name: 'Robotics Workshop',
    date: 'December 2024',
    location: 'ENIS, Sfax',
    cover: '/images/gallery/workshop/0.webp',
    photos: [
      '/images/gallery/workshop/0.webp',
      '/images/gallery/workshop/0.jpg',
      '/images/gallery/workshop/1.webp',
      '/images/gallery/workshop/2.webp',
      '/images/gallery/workshop/3.webp',
      '/images/gallery/workshop/comp.jpg',
    ],
  },
  {
    id: 'aprobot',
    name: 'Aprobot Event',
    date: 'November 2024',
    location: 'Tunisia',
    cover: '/images/gallery/aprobot/aprobot0.webp',
    photos: [
      '/images/gallery/aprobot/aprobot0.webp',
      '/images/gallery/aprobot/aprobot1.webp',
      '/images/gallery/aprobot/aprobot2.webp',
    ],
  },
  {
    id: 'enicar',
    name: 'ENICAR Event',
    date: 'November 2024',
    location: 'ENICAR, Tunis',
    cover: '/images/gallery/enicar/enicar0.webp',
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
    ],
  },
  {
    id: 'enstab',
    name: 'ENSTAB Event',
    date: 'October 2024',
    location: 'ENSTAB',
    cover: '/images/gallery/enstab/enstab0.png',
    photos: [
      '/images/gallery/enstab/enstab0.png',
      '/images/gallery/enstab/enstab1.png',
      '/images/gallery/enstab/enstab2.png',
    ],
  },
  {
    id: 'ensit',
    name: 'ENSIT Event',
    date: 'October 2024',
    location: 'ENSIT, Tunis',
    cover: '/images/gallery/ensit/ensit1.webp',
    photos: [
      '/images/gallery/ensit/ensit0.webp',
      '/images/gallery/ensit/ensit1.webp',
      '/images/gallery/ensit/ensit2.webp',
    ],
  },
  {
    id: 'iit',
    name: 'IIT Event',
    date: 'September 2024',
    location: 'IIT',
    cover: '/images/gallery/iit/iit0.webp',
    photos: [
      '/images/gallery/iit/iit0.webp',
      '/images/gallery/iit/iit1.webp',
      '/images/gallery/iit/iit2.webp',
      '/images/gallery/iit/iit3.webp',
      '/images/gallery/iit/iit4.webp',
      '/images/gallery/iit/iit5.webp',
    ],
  },
  {
    id: 'fsm',
    name: 'FSM Event',
    date: 'September 2024',
    location: 'FSM, Monastir',
    cover: '/images/gallery/fsm/fsm1.webp',
    photos: [
      '/images/gallery/fsm/fsm1.webp',
      '/images/gallery/fsm/fsm2.webp',
      '/images/gallery/fsm/fsm3.webp',
      '/images/gallery/fsm/fsm4.webp',
    ],
  },
  {
    id: 'isgis',
    name: 'ISGIS Event',
    date: 'August 2024',
    location: 'ISGIS',
    cover: '/images/gallery/isgis/isgis0.png',
    photos: [
      '/images/gallery/isgis/isgis0.png',
      '/images/gallery/isgis/isgis1.png',
      '/images/gallery/isgi.png',
    ],
  },
  {
    id: 'insat',
    name: 'INSAT Event',
    date: 'July 2024',
    location: 'INSAT, Tunis',
    cover: '/images/gallery/insat/0.webp',
    photos: [
      '/images/gallery/insat/0.webp',
    ],
  },
  {
    id: 'epi',
    name: 'EPI Event',
    date: 'June 2024',
    location: 'EPI',
    cover: '/images/gallery/epi1.webp',
    photos: [
      '/images/gallery/epi1.webp',
      '/images/gallery/epi2.webp',
    ],
  },
  {
    id: 'isimm',
    name: 'ISIMM Event',
    date: 'May 2024',
    location: 'ISIMM, Monastir',
    cover: '/images/gallery/isimm.jpeg',
    photos: [
      '/images/gallery/isimm.jpeg',
      '/images/gallery/isimm0.png',
      '/images/gallery/isimm1.png',
    ],
  },
  {
    id: 'radio',
    name: 'Radio Interview',
    date: 'March 2024',
    location: 'Sfax',
    cover: '/images/gallery/radio.jpg',
    photos: [
      '/images/gallery/radio.jpg',
    ],
  },
  {
    id: 'enis',
    name: 'ENIS Event',
    date: 'November 2024',
    location: 'ENIS, Sfax',
    cover: '/images/gallery/enis/enis0.webp',
    photos: [
      '/images/gallery/enis/enis0.webp',
      '/images/gallery/enis/enis1.webp',
      '/images/gallery/enis/enis2.webp',
      '/images/gallery/enis/enis3.webp',
      '/images/gallery/enis/enis4.webp',
      '/images/gallery/enis/enis5.webp',
      '/images/gallery/enis/enis6.webp',
      '/images/gallery/enis/enis7.webp',
    ],
  },
  {
    id: 'other',
    name: 'Chapter Activities',
    date: '2024',
    location: 'Tunisia',
    cover: '/images/gallery/iset-sfax.png',
    photos: [
      '/images/gallery/iset-sfax.png',
      '/images/gallery/essths.png',
      '/images/gallery/ensit.png',
      '/images/gallery/fst.png',
      '/images/gallery/enig.png',
      '/images/gallery/issatkr.webp',
    ],
  },
];

/* ── Flat lists for the homepage marquee (unchanged) ── */
export const row1Images = [
  "/images/gallery/isimm.jpeg",
  "/images/gallery/isgi0.png",
  "/images/gallery/enet/enet0.webp",
  "/images/gallery/enet/enet4.webp",
  "/images/gallery/enet/enet9.webp",
  "/images/gallery/enstab/enstab0.png",
  "/images/gallery/enstab/enstab1.png",
  "/images/gallery/enstab/enstab2.png",
  "/images/gallery/enicar/enicar0.webp",
  "/images/gallery/isimm0.png",
  "/images/gallery/ensit/ensit1.webp",
  "/images/gallery/isgi.png",
  '/images/gallery/aprobot/aprobot0.webp',
  '/images/gallery/aprobot/aprobot1.webp',
  "/images/gallery/npc/npc0.webp",
  "/images/gallery/epi1.webp",
  "/images/gallery/workshop/0.webp",
  "/images/gallery/workshop/3.webp",
];

export const row2Images = [
  "/images/gallery/iset-sfax.png",
  "/images/gallery/essths.png",
  "/images/gallery/enet/enet3.webp",
  "/images/gallery/enet/enet1.webp",
  "/images/gallery/enet/enet5.webp",
  "/images/gallery/npc/npc1.webp",
  "/images/gallery/npc/npc2.webp",
  "/images/gallery/radio.jpg",
  "/images/gallery/isimm1.png",
  "/images/gallery/ensit.png",
  "/images/gallery/fst.png",
  "/images/gallery/enet/enet6.webp",
  "/images/gallery/enet/enet7.webp",
  "/images/gallery/enig.png",
  "/images/gallery/epi2.webp",
  "/images/gallery/workshop/2.webp",
  "/images/gallery/enicar/enicar8.webp",
];
