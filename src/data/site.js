/**
 * Site-wide data
 * Edit this to update your name, nav links, and social profiles everywhere.
 *
 * Field `icon` pada socialLinks dipakai untuk memetakan ke react-icons
 * di komponen StaggeredMenu & Footer.
 */
export const site = {
  name: 'Evan',
  role: 'Fullstack Developer',
  tagline: 'Building fast, thoughtful software for the web.',
  location: 'Indonesia',
  email: 'evan.sibara888@gmail.com',
};

export const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/evansibara', handle: 'github', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/evan-sibara-a61a06324/', handle: 'linkedin', icon: 'linkedin' },
  { label: 'Instagram', href: 'https://www.instagram.com/evnsibara', handle: 'instagram', icon: 'instagram' },
  { label: 'Gmail', href: 'mailto:evan.sibara888@gmail.com', handle: 'gmail', icon: 'gmail' },
];