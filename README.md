# 🤖 IEEE RAS ENIS Student Branch Website

<div align="center">
  <img src="./public/images/ras_banner.png" alt="IEEE RAS ENIS Banner" width="800">
  <p align="center">
    <strong>Innovating the Future, One Line of Code at a Time.</strong>
  </p>
  <p align="center">
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"></a>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"></a>
  </p>
</div>

---

## 📖 Overview

A premium, high-performance web platform for the **IEEE Robotics and Automation Society (RAS)** Student Branch at the **National School of Engineers of Sfax (ENIS)**. This website serves as a central hub for members, showcasing projects, events, news, and a community-driven shop.

## ⚡ Key Features

- **🚀 Cinematic Experience**: High-fidelity animations powered by **GSAP** and **ScrollTrigger** for a professional, immersive feel.
- **🛡️ Secure Dashboard**: Role-based access control for members and administrators to manage content.
- **🏪 Society Shop**: Integrated marketplace for society merchandise and electronics components.
- **📂 Project Showcase**: A dynamic gallery of robotics and automation projects developed by the branch.
- **📅 Event Management**: Real-time updates on upcoming workshops, competitions (like RoboCup), and seminars.
- **☁️ Supabase Integration**: Real-time database and authentication for seamless user management.
- **🌐 Responsive & Accessible**: Optimized for all devices with a mobile-first approach and glassmorphism aesthetic.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) |
| **Animations** | [GSAP](https://greensock.com/gsap/) + [Framer Motion](https://www.framer.com/motion/) |
| **Backend** | [Supabase](https://supabase.com/) (PostgreSQL + Auth) |
| **Utilities** | [Lenis Scroll](https://lenis.darkroom.engineering/), [Lucide React](https://lucide.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |

---

## 📂 Project Structure

```bash
app/
├── src/
│   ├── components/      # Reusable UI & Layout components
│   ├── sections/        # Main landing page sections (Hero, About, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript definitions
│   ├── lib/             # Utility functions & Supabase client
│   ├── App.tsx          # Main entry point & Routing
│   └── main.tsx         # React DOM rendering
├── public/              # Static assets (images, fonts)
└── tailwind.config.js   # Custom theme & animation config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v20+)
- **npm** or **yarn**
- **Supabase Account** (for backend features)

### Installation

1. **Clone the repo**:
   ```bash
   git clone https://github.com/your-org/ras-enis-website.git
   cd ras-enis-website/app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file in the `app` directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

---

## 🛠️ Deployment

The project is optimized for deployment on **Vercel**.

```bash
npm run build
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Developed with 🤖 and ☕ by the <strong>IEEE RAS ENIS</strong> Web Team.</p>
  <p>
    <a href="https://instagram.com/ras_enis"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram"></a>
    <a href="https://facebook.com/ras_enis"><img src="https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white" alt="Facebook"></a>
  </p>
</div>
