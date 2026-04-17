/**
 * Projects data
 * Edit this file to add, remove, or modify your projects.
 * Each project needs: id, title, category, year, description, tech[], links, image
 */

export const projects = [
  {
    id: 1,
    title: 'Nebula Commerce',
    category: 'Fullstack',
    year: '2025',
    description:
      'Modern e-commerce platform with real-time inventory, Stripe payments, and admin dashboard. Serves 10k+ monthly users.',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Redis'],
    links: {
      live: 'https://example.com',
      github: 'https://github.com/yourusername/nebula-commerce',
    },
    image: '/assets/project-1.jpg', // replace with your asset
    featured: true,
  },
  {
    id: 2,
    title: 'Atlas Analytics',
    category: 'Dashboard',
    year: '2025',
    description:
      'Real-time analytics dashboard for SaaS companies. Custom charting engine, role-based access, and export to PDF/CSV.',
    tech: ['React', 'Node.js', 'D3.js', 'MongoDB', 'Docker'],
    links: {
      live: 'https://example.com',
      github: 'https://github.com/yourusername/atlas',
    },
    image: '/assets/project-2.jpg',
    featured: true,
  },
  {
    id: 3,
    title: 'Pulse Chat',
    category: 'Realtime',
    year: '2024',
    description:
      'End-to-end encrypted messaging app with voice calls, file sharing, and group rooms. Built on WebRTC and Socket.io.',
    tech: ['React', 'Socket.io', 'WebRTC', 'Express', 'Redis'],
    links: {
      live: 'https://example.com',
      github: 'https://github.com/yourusername/pulse-chat',
    },
    image: '/assets/project-3.jpg',
    featured: false,
  },
  {
    id: 4,
    title: 'Forge DevTools',
    category: 'Tooling',
    year: '2024',
    description:
      'CLI-first developer tool suite for scaffolding, linting, and deploying monorepo projects. Open source, 1.2k stars.',
    tech: ['Node.js', 'TypeScript', 'Rust', 'CLI'],
    links: {
      github: 'https://github.com/yourusername/forge',
    },
    image: '/assets/project-4.jpg',
    featured: false,
  },
  {
    id: 5,
    title: 'Orchid Booking',
    category: 'Fullstack',
    year: '2024',
    description:
      'SaaS booking platform for small businesses with calendar sync, automated reminders, and payment processing.',
    tech: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe'],
    links: {
      live: 'https://example.com',
      github: 'https://github.com/yourusername/orchid',
    },
    image: '/assets/project-5.jpg',
    featured: false,
  },
  {
    id: 6,
    title: 'Zenith CMS',
    category: 'Fullstack',
    year: '2023',
    description:
      'Headless CMS with visual editor, content versioning, and GraphQL API. Powers 50+ production sites.',
    tech: ['Node.js', 'React', 'GraphQL', 'PostgreSQL'],
    links: {
      live: 'https://example.com',
      github: 'https://github.com/yourusername/zenith',
    },
    image: '/assets/project-6.jpg',
    featured: false,
  },
];

// Unique categories for filter pills
export const categories = [
  'All',
  ...new Set(projects.map((p) => p.category)),
];
