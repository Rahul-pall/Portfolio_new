export const profile = {
  name: 'Rahul Pal',
  role: 'Full Stack Developer',
  location: 'Karnal, Haryana, India',
  email: 'r.kumar111998a@gmail.com',
  phone: '+91 88140 97213',
  github: 'https://github.com/Rahul-pall',
  linkedin: 'https://linkedin.com/in/rahul-pal-71498a244',
  roles: ['ERP systems', 'AI assistants', 'WhatsApp bots', 'E-commerce', 'REST APIs', 'CI/CD pipelines'],
  stats: [
    { value: 2.5, suffix: '+', label: 'Years shipping', decimals: 1 },
    { value: 54, suffix: '', label: 'ERP API modules', decimals: 0 },
    { value: 100, suffix: '+', label: 'Backend services', decimals: 0 },
    { value: 68, suffix: '', label: 'Acceptance tests', decimals: 0 },
  ],
};

export type Category = 'AI' | 'Enterprise' | 'E-commerce' | 'Open source';

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  kind: string;
  categories: Category[];
  year: string;
  role: string;
  accent: string;
  live?: string;
  repo?: string;
  cover?: string;
  gallery: { src: string; alt: string; mobile?: boolean }[];
  summary: string;
  problem: string;
  built: { title: string; text: string }[];
  metrics?: { value: string; label: string }[];
  stack: string[];
  code?: string;
};

export const projects: Project[] = [
  {
    slug: 'amasia-erp',
    title: 'Amasia Rice ERP',
    tagline: 'Every grain accounted for.',
    kind: 'Enterprise · ERP / CRM · AI',
    categories: ['Enterprise', 'AI'],
    year: '2025 — now',
    role: 'Full stack developer · architecture, backend, frontend, AI, deployment',
    accent: '#7BE36A',
    live: 'https://erpdash.sunildhiman.tech/',
    cover: '/projects/erpdash.jpg',
    gallery: [
      { src: '/projects/erpdash.jpg', alt: 'Amasia ERP staff login with feature overview' },
      { src: '/projects/erpdash-mobile.jpg', alt: 'Amasia ERP on a phone as an installable PWA', mobile: true },
    ],
    summary:
      'One system for a rice trading business: orders to delivery, procurement and quality checks, CRM, tasks, HR, maintenance and exports. Staff install it on their phones as a PWA.',
    problem:
      'Orders arrived on WhatsApp late at night, stock lived in spreadsheets, and every question about a depot or a customer balance meant calling the office.',
    built: [
      { title: 'AI assistant dock', text: 'Staff ask “Rohini me kitna stock hai?” in Hindi or English. OpenAI writes the sentence; the figures come from server lookups, and every reply lists the data it read.' },
      { title: 'WhatsApp AI order bot', text: 'On the Meta Cloud API. Turns “20 bora 1121 sella bhejo” into a draft order, answers only from the owner’s FAQ and catalogue, and hands complaints to a person.' },
      { title: 'WhatsApp CRM', text: 'Lead intake, shared inbox, campaigns, message templates, triggers and meeting scheduling.' },
      { title: 'Seven business modules', text: 'Order-to-Delivery, Procurement & QC, CRM, Tasks & Checklists, HR & Hiring, Maintenance and Export in one app.' },
      { title: 'Pluggable data layer', text: 'Google Sheets API, PostgreSQL or local JSON behind one interface, with migration CLI scripts.' },
      { title: 'Secure by default', text: 'JWT auth, role permissions, Zod validation, Helmet and rate limiting on every route.' },
    ],
    metrics: [
      { value: '54', label: 'API route modules' },
      { value: '100+', label: 'backend services' },
      { value: '7', label: 'business modules' },
    ],
    stack: ['React', 'Vite PWA', 'Node.js', 'Express', 'PostgreSQL', 'Google Sheets API', 'OpenAI', 'Meta WhatsApp API', 'JWT', 'Zod', 'GitHub Actions', 'Render'],
  },
  {
    slug: 'wattan-se',
    title: 'Wattan Se Store',
    tagline: 'Try it for just ₹39.',
    kind: 'E-commerce · D2C',
    categories: ['E-commerce'],
    year: '2026',
    role: 'Full stack developer · storefront, admin console, payments, CI/CD',
    accent: '#8BD94F',
    live: 'https://shop.sunildhiman.tech/',
    cover: '/projects/shop.jpg',
    gallery: [
      { src: '/projects/shop.jpg', alt: 'Wattan Se home page with the ₹39 trial offer' },
      { src: '/projects/shop-packs.jpg', alt: 'Wattan Se shop page with 200 g, 1 kg and 5 kg packs' },
      { src: '/projects/shop-journey.jpg', alt: 'Wattan Se journey page' },
      { src: '/projects/shop-mobile.jpg', alt: 'Wattan Se storefront on a phone', mobile: true },
    ],
    summary:
      'A D2C rice storefront with OTP login, cart, checkout, invoices and a full admin console for orders, stock, pincodes, images and page content.',
    problem:
      'A trial-pack offer only works if the rules hold: one trial per mobile, the right payment method per pack and pincode, and credit that is paid back only once.',
    built: [
      { title: 'Rules on the server', text: 'UPI or COD by pack size and pincode, one trial pack per mobile via a unique index, all totals from one pricing function.' },
      { title: 'Verified payments', text: 'Orders are marked paid only from a signature-verified callback; duplicates, retries and amount mismatches are handled.' },
      { title: 'Store credit lifecycle', text: 'Trial credit is pending until delivery, reserved at checkout, redeemed once and restored on cancellation.' },
      { title: 'Admin console', text: 'Dashboard with 14-day sales chart, orders, delivery requests, stock with reasons, pincode CSV import, page text and reviews.' },
    ],
    metrics: [
      { value: '68', label: 'acceptance tests' },
      { value: '3', label: 'pack sizes' },
      { value: '₹39', label: 'trial offer' },
    ],
    stack: ['React', 'Vite', 'Node.js', 'Express', 'PostgreSQL (Neon)', 'PGlite', 'GitHub Actions', 'cPanel'],
  },
  {
    slug: 'daily-hurdles',
    title: 'Daily Hurdles',
    tagline: 'Capture your thoughts. Get clarity.',
    kind: 'AI app · Voice + text',
    categories: ['AI'],
    year: '2026',
    role: 'Full stack developer · product, AI integration, testing, deployment',
    accent: '#B4E35A',
    live: 'https://dailyhurdle.sunildhiman.tech/',
    cover: '/projects/dailyhurdle.jpg',
    gallery: [
      { src: '/projects/dailyhurdle.jpg', alt: 'Daily Hurdles login page' },
      { src: '/projects/dailyhurdle-signup.jpg', alt: 'Daily Hurdles sign-up page' },
      { src: '/projects/dailyhurdle-mobile.jpg', alt: 'Daily Hurdles on a phone', mobile: true },
    ],
    summary:
      'Talk or type through your day. OpenAI transcribes the voice note and returns a calm summary: key points, challenges and next steps.',
    problem:
      'Shared hosting had no SSH, a broken server-side npm install and an FTP link that dropped long uploads, and Prisma’s native engine crashed under its limits.',
    built: [
      { title: 'Voice to summary', text: 'OpenAI speech-to-text and GPT-4o-mini turn a recording into a structured summary. The API key never leaves the server.' },
      { title: 'Roles and isolation', text: 'JWT auth with User and Admin roles. Users see only their own entries; admins reply from a panel.' },
      { title: 'Tests without secrets', text: 'Vitest + Supertest with mocked OpenAI and Prisma, so CI runs with no database or API key.' },
      { title: 'Deploy that survives cPanel', text: 'GitHub Actions tests, builds and ships over FTPS; node_modules goes up as one archive instead of ~4,000 files.' },
    ],
    metrics: [
      { value: '480→47', label: 'MB deploy bundle' },
      { value: '4,000→1', label: 'files uploaded' },
      { value: '2', label: 'OpenAI models' },
    ],
    stack: ['React', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'OpenAI', 'Vitest', 'GitHub Actions'],
  },
  {
    slug: 'mern-auth',
    title: 'MERN Auth System',
    tagline: 'Sign up, sign in, stay secure.',
    kind: 'Full stack · Authentication',
    categories: ['Open source'],
    year: '2025',
    role: 'Solo project',
    accent: '#4FE3FF',
    gallery: [],
    summary: 'A complete authentication flow: register, login and protected routes, with a React + Tailwind client and an Express/MongoDB API.',
    problem: 'Most apps need the same auth flow done right: hashed passwords, tokens in cookies, and routes that check them.',
    built: [
      { title: 'JWT in HTTP-only cookies', text: 'Tokens are set by the server in cookies, so client scripts never read them.' },
      { title: 'bcrypt hashing', text: 'Passwords are hashed before they reach MongoDB.' },
      { title: 'Protected routes', text: 'React Router guards on the client, middleware checks on the API.' },
    ],
    stack: ['React', 'Tailwind CSS', 'Axios', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'bcrypt'],
    code: `router.post('/register', register);
router.post('/login', login);
router.get('/getallusers', auth, getAllUsers);

res.cookie('token', jwt.sign({ id }, SECRET), {
  httpOnly: true, sameSite: 'strict',
});`,
  },
  {
    slug: 'product-api',
    title: 'Product API',
    tagline: 'Search, filter, sort, paginate.',
    kind: 'Backend · Open source',
    categories: ['Open source'],
    year: '2024',
    role: 'Solo project',
    accent: '#8B7CFF',
    repo: 'https://github.com/Rahul-pall/productapi',
    gallery: [],
    summary: 'A RESTful product API with search, filtering, sorting, field selection and pagination in a clean MVC structure.',
    problem: 'List endpoints grow query flags one at a time until nobody can read them. This one builds every query from one pipeline.',
    built: [
      { title: 'Query pipeline', text: 'Search, filter, sort, select and paginate composed on one Mongoose query.' },
      { title: 'MVC structure', text: 'Routes, controllers and models kept apart.' },
    ],
    stack: ['Node.js', 'Express', 'MongoDB', 'Mongoose'],
    code: `GET /api/products?company=apple
  &sort=-price,name
  &select=name,price
  &page=2&limit=10`,
  },
  {
    slug: 'youtube-backend',
    title: 'YouTube-style Backend',
    tagline: 'Users, videos, comments.',
    kind: 'Backend · Open source',
    categories: ['Open source'],
    year: '2024',
    role: 'Solo project',
    accent: '#FFB547',
    repo: 'https://github.com/Rahul-pall/Youtube-bac',
    gallery: [],
    summary: 'Backend for a YouTube-style platform: users, videos and comments with JWT auth, bcrypt and email through Nodemailer.',
    problem: 'A video platform needs accounts, ownership checks and notifications before it needs anything else.',
    built: [
      { title: 'Auth and ownership', text: 'JWT sessions, bcrypt hashing and checks that only owners edit their videos.' },
      { title: 'Email', text: 'Nodemailer for account emails.' },
    ],
    stack: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Nodemailer'],
    code: `POST   /api/users/register
POST   /api/users/login
POST   /api/videos        (auth)
POST   /api/videos/:id/comments`,
  },
];

export const conversations = [
  {
    q: 'Rohini me kitna stock hai?',
    a: 'Rohini depot me abhi 1121 Sella ke 340 bags aur 1509 Steam ke 120 bags hain. 2 orders ke liye 60 bags hold par hain.',
    reads: ['stock(depot: Rohini) — 5 rows', 'holds(depot: Rohini) — 2 rows'],
  },
  {
    q: 'Which orders have no depot yet?',
    a: '3 orders are waiting for a depot: 2 from Panipat and 1 from Sonipat, 145 bags in total.',
    reads: ['orders(depot: none, status: open) — 3 rows'],
  },
  {
    q: 'Sharma Traders ka kitna baaki hai?',
    a: 'Sharma Traders ke 2 invoices pending hain. Kul baaki ₹1,84,500 hai, sabse purana 18 din ka.',
    reads: ['invoices(customer: Sharma Traders, unpaid) — 2 rows'],
  },
];

export const aiCards = [
  { tag: '01 · In product', title: 'AI that reads real data', text: 'The model writes the sentence; the numbers come from the database, and every reply lists what it read.' },
  { tag: '02 · Guardrails', title: 'AI that only suggests', text: 'The WhatsApp bot picks from real customers and SKUs, answers from the owner’s FAQ, and hands complaints to a person.' },
  { tag: '03 · In my workflow', title: 'AI-assisted development', text: 'AI coding assistants help me plan, test, refactor and debug faster. I review every change before it ships.' },
];

export const experience = [
  { when: 'Feb 2025 — Now', role: 'Full Stack Developer', org: 'SAIFCO (Amasia Multigrain Pvt. Ltd.)', text: 'Built the ERP / CRM suite and the D2C store, with an AI assistant, a WhatsApp order bot and CI/CD to production.' },
  { when: 'Dec 2023 — Feb 2025', role: 'Full Stack Developer', org: 'Airhomestays', text: 'Property rental platform with React, Node.js and GraphQL: search and filters, payment gateway, reviews and ratings.' },
  { when: 'Sep 2023', role: 'BCA', org: 'Kurukshetra University', text: 'Bachelor of Computer Applications.' },
];

export const skills = {
  Frontend: ['React', 'Next.js', 'Redux', 'Tailwind', 'TypeScript', 'Three.js', 'PWA'],
  Backend: ['Node.js', 'Express', 'GraphQL', 'Prisma', 'Socket.IO', 'JWT', 'Zod'],
  'Data & AI': ['PostgreSQL', 'MongoDB', 'OpenAI', 'WhatsApp API', 'Sheets API'],
  DevOps: ['GitHub Actions', 'Vitest', 'cPanel', 'Render', 'Git'],
};

export const marquee = ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'OpenAI', 'Three.js', 'Tailwind', 'Prisma', 'MongoDB', 'GitHub Actions', 'WhatsApp API', 'TypeScript'];
