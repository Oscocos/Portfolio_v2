export const SECTION_ORDER = [
  "profile",
  "skills",
  "experience",
  "work",
  "education",
  "certifications",
  "contact",
] as const;

export type SectionId = (typeof SECTION_ORDER)[number];

export const profile = {
  name: "Ollantay Z. Scocos",
  email: "olscocos@gmail.com",
  phone: "309-340-3606",
  site: "ollantayscocos.com",
  github: "github.com/Oscocos",
  citizenship: "U.S. Citizen",
  headline: "Software engineer building sharp, reliable, human systems.",
  summary:
    "I'm a software engineer with a B.S. in Computer Science + Astronomy from the University of Illinois at Urbana-Champaign. Experienced in reliable software systems, interactive web applications, and applied machine learning. \n I'm excited by positive applications of code and artificial intelligence and their intersection with every industry.",
};

export const skills = [
  "Python", "C", "C++", "TypeScript", "JavaScript", "Java",
  "HTML", "CSS", "SQL", "R", "Haskell", "MATLAB",
  "React", "Next.js", "Node.js", "Tailwind CSS",
  "Docker", "AWS", "Firebase", "Firestore", "MongoDB",
  "Git", "GitHub", "GitHub Actions", "Linux / Ubuntu", "Linux / WSL",
  "RESTful APIs", "TCP/IP", "OAuth2", "CI/CD",
  "Pandas", "NumPy", "PyTorch", "Jupyter Notebooks",
  "Visual Studio", "Visual Studio Code", "IntelliJ", "Android Studio",
  "Excel", "Word", "OpenAI API", "Framer Motion", "GSAP",
];

export type ExperienceEntry = {
  role: string;
  company: string;
  date: string;
  points: string[];
  link?: string;
  videoUrl?: string;
};

export const experience: ExperienceEntry[] = [
  {
    role: "Software Engineer",
    company: "DataAnnotation",
    date: "Jan 2024 — Present",
    link: "https://www.dataannotation.tech",
    points: [
      "· Engineered 500+ Docker containers to run and validate code, boosting AI reliability and deliverable coding performance by as much as 250%",
      "· Audited and tested 10,000+ files across complex repositories, improving stakeholder-critical output fidelity by 18%",
      "· Automated machine learning unit-test tooling on Linux/WSL, reducing manual QA effort by 20%",
      "· Architected 100+ codebases across Python, C++, TypeScript, backend, and database layers for extensive LLM evaluation",
      "· Built CI/CD testing workflows that cut validation failures by 35% and improved early defect detection",
    ],
  },
];

export type Project = {
  title: string;
  type: string;
  description: string;
  link?: string;
  videoUrl?: string;
  bullets?: string[];
};

export const projects: Project[] = [
  {
    title: "MuseShare",
    type: "TypeScript · React Native / Expo · Firebase · Firestore · REST APIs",
    videoUrl: "https://youtu.be/HwY4YCysQn8",
    description:
      "Full-stack React Native music-sharing app with messaging, profiles, social flows, Firebase workflows, and a machine-learning-backed cellular automata visual identity system",
    bullets: [
      "Developed a full-stack React Native/Expo music-sharing app with direct messaging, profiles, and social media flows",
      "Engineered a persistent cellular automata visual identity system with a machine learning layer, evolving personalized 64x64 album-palette images that reflect each user’s music activity and style",
      "Integrated music metadata APIs with Firebase workflows and TypeScript caching, reducing redundant network/database calls and improving repeated-share latency by 50%+",
      "Architected scalable Firestore data models and access patterns to support fast client-side queries"
    ],
  },
  {
    title: "Portfolio",
    type: "React · Next.js · Tailwind CSS · Framer Motion · Vercel",
    link: "https://github.com/Oscocos/portfolio",
    description:
      "Responsive modular portfolio with 50+ interactive entries, reusable components, accessible transitions, fast load times, and Vercel deployment",
    bullets: [
      "Crafted a responsive, modular portfolio site with 50+ interactive entries, animations, and fast load times using React, Next.js, Tailwind CSS, Framer Motion, and GSAP",
      "Developed reusable React components to organize and display 20+ data-driven items with clean, accessible UX and interactive transitions",
      "Implemented interactive skill bars using React and Tailwind CSS, allowing visitors to filter projects by technology; observed a 15% increase in project page views from this feature",
      "Published and maintained the site on Vercel, enabling continuous deployment via GitHub Actions with 100 ms build times and 100% uptime",
    ],
  },
  {
    title: "Wrapped Now",
    type: "JavaScript · HTML · CSS · Spotify API",
    link: "https://github.com/Oscocos/WrappedNow",
    videoUrl: "https://www.youtube.com/watch?v=qzNMApTL4_Y",
    description:
      "Spotify API web app showing top tracks and artists across multiple time ranges with OAuth2 login and interactive Wrapped-style cards",
    bullets: [
      "Engineered a web app using the Spotify API to display up to 50 top tracks/artists in a Wrapped‑style UI",
      "Introduced OAuth 2.0 authentication to enable secure user login via Spotify, ensuring safe data access and compliance with security standards",
      "Used Spotify's API and JavaScript to show 50+ top artists for 1/6/12‑month periods with interactive HTML/CSS cards",
    ],
  },
  {
    title: "TV Time",
    type: "Java · C++ · Gson API",
    description:
      "TV show data tool using Gson to parse JSON, retrieve 200+ episodes, and improve navigation through object-oriented design",
    bullets: [
      "Parsed and converted JSON using Gson API, reducing data fetching time by 35%",
      "Built an Object-Oriented structure to manage TV data efficiently",
      "Added features to retrieve episodes by various parameters",
    ],
  },
  {
    title: "QuickEats",
    type: "Java · Android · Google Places API",
    link: "https://github.com/Oscocos/RestaurantPicker",
    videoUrl: "https://www.youtube.com/watch?v=ZsWN6sNzOAA&t=129s",
    description:
      "Android app for restaurant recommendations using location services and the Google Places API",
    bullets: [
      "Developed an Android app for restaurant recommendations",
      "Integrated location services and Places API to suggest 300+ nearby options",
      "Designed UI for flexible filtering by food type and distance",
    ],
  },
];

export type EducationEntry = {
  school: string;
  degree: string;
  date: string;
  detail: string;
  link?: string;
  deansListTerms?: string;
  coursework?: string[];
};

export const education: EducationEntry = {
  school: "University of Illinois at Urbana-Champaign",
  degree: "B.S. Computer Science + Astronomy",
  date: "Jan 2018 — Dec 2023",
  link: "https://illinois.edu",
  deansListTerms: "",
  detail:
    "Dean's List. Coursework included Data Structures and Algorithms, Artificial Intelligence, Computer Architecture, Statistical Analysis, System Programming, Programming Languages, and Compilers.",
  coursework: [
    "Data Structures and Algorithms",
    "Artificial Intelligence",
    "Computer Architecture",
    "System Programming",
    "Programming Languages & Compilers",
    "Statistical Analysis",
    "Machine Learning",
    "Distributed Systems",
  ],
};

export type CertificationEntry = {
  name: string;
  date: string;
  link?: string;
  videoUrl?: string;
};

export const certification: CertificationEntry = {
  name: "AWS Certified Cloud Practitioner",
  date: "Jan 2026 — Jan 2029",
  link: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
};
