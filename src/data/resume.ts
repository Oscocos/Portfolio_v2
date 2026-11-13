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
      "· Develop Python and JavaScript/TypeScript testing infrastructure to validate LLM-generated implementations through automated unit tests, integration tests, and behavioral checks",
      "· Build and debug Docker environments, managing dependencies, reproducing application states, and isolating execution failures across codebases",
      "· Independently design and build software engineering evaluations, creating original applications, repositories, and coding challenges to assess LLM capabilities",
      "· Review, execute, and debug AI-generated code, resolving build failures, runtime errors, and incorrect behavior across multi-file repositories",
      "· Created reusable validation tools to standardize evaluation results, reproduce defects, and reduce repetitive manual testing",
      "· Evaluate model reasoning, code quality, and instruction adherence through RLHF, providing technical feedback and corrected implementations",
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
    videoUrl: "https://apps.apple.com/us/app/museshare/id6784826862",
    description:
      "Full-stack React Native music-sharing app with messaging, profiles, social flows, Firebase workflows, and a machine-learning-backed cellular automata visual identity system",
    bullets: [
      "Engineered and released a full-stack music-sharing app with messaging, live notifications, user profiles, music integrations, and iOS sharing extensions",
      "Trained and tuned a neural cellular automata (NCA) model that evolves persistent visual identities from music activity, adding decay, stability controls, and color correction",
      "Integrated Metal-accelerated on-device inference, compressing and persisting 96×96×16 NCA states in Firestore to enable continuous evolution across user interactions",
      "Designed a simulation-driven rendering system using NCA-derived topology, ray-marched volumetric clouds, flow fields, and Boids-based particle simulation"
    ],
  },
  {
    title: "ChirpTrace",
    type: "React Native · Expo · TypeScript, ONNX Runtime",
    link: "https://apps.apple.com/us/app/chirptrace/id6822016979",
    description:
      "Bird neural net identifier and visualizer with local phone inference",
    bullets: [
      "Built a mobile audio-analysis app combining real-time spectral visualization with on-device BirdNET classification",
      "Utilized BirdNET and YAMNet through ONNX Runtime, supporting concurrent model inference with responsive performancen",
      "Implemented premium feature gating for YAMNet-based wildlife and environmental sound detection, unlocked through in-app purchases",
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
