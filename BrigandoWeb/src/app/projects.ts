export interface CaseStudySection {
  heading: string;
  body: string;
}

export interface Project {
  slug: string;
  name: string;
  discipline: string;
  logo: string;
  /** Card colour on hover. */
  accent: string;
  summary: string;
  sections: CaseStudySection[];
}

// TODO: replace the placeholder copy below with the real case studies.
export const PROJECTS: Project[] = [
  {
    slug: 'nth-studios',
    name: 'Nth Studios',
    discipline: 'Design',
    logo: '/logos/NTH-SQ.png',
    accent: 'var(--primary-nth)',
    summary: 'A design studio focused on brand, product and digital experiences.',
    sections: [
      { heading: 'Overview', body: 'Placeholder: what Nth Studios is and who it serves.' },
      { heading: 'The challenge', body: 'Placeholder: the problem this project set out to solve.' },
      { heading: 'Approach', body: 'Placeholder: how the work was done, key decisions and tools.' },
      { heading: 'Outcome', body: 'Placeholder: results, metrics, and what came next.' },
    ],
  },
  {
    slug: 'soarer-cycles',
    name: 'Soarer Cycles',
    discipline: 'Manufacturing',
    logo: '/logos/SOARER-SQ.png',
    accent: 'var(--primary-soarer)',
    summary: 'Designing and building bicycles from the frame up.',
    sections: [
      { heading: 'Overview', body: 'Placeholder: what Soarer Cycles makes.' },
      { heading: 'The challenge', body: 'Placeholder: the problem this project set out to solve.' },
      { heading: 'Approach', body: 'Placeholder: process, materials and manufacturing.' },
      { heading: 'Outcome', body: 'Placeholder: results, metrics, and what came next.' },
    ],
  },
  {
    slug: 'brigando-tech',
    name: 'Brigando Tech',
    discipline: 'Engineering',
    logo: '/logos/BTECH-SQ.png',
    accent: 'var(--primary-btech)',
    summary: 'Software and hardware engineering for ambitious products.',
    sections: [
      { heading: 'Overview', body: 'Placeholder: what Brigando Tech does.' },
      { heading: 'The challenge', body: 'Placeholder: the problem this project set out to solve.' },
      { heading: 'Approach', body: 'Placeholder: architecture, stack and key decisions.' },
      { heading: 'Outcome', body: 'Placeholder: results, metrics, and what came next.' },
    ],
  },
  {
    slug: 'brn',
    name: 'BRN',
    discipline: 'Robotics',
    logo: '/logos/BRN-SQ.png',
    accent: 'var(--primary-brn)',
    summary: 'Robotics research and development.',
    sections: [
      { heading: 'Overview', body: 'BRN is focused on development of control-based robotic systems.' },
      { heading: 'The challenge', body: 'Placeholder: the problem this project set out to solve.' },
      { heading: 'Approach', body: 'Placeholder: mechanics, electronics and control.' },
      { heading: 'Outcome', body: 'Placeholder: results, metrics, and what came next.' },
    ],
  },
];

export function findProject(slug: string | null | undefined): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
