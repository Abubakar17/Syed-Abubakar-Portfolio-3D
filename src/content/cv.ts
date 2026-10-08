/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ALL portfolio content lives in this file.
 *  Edit text, add jobs/projects, reorder sections — no 3D code needs to change.
 *  Rack order in the aisle follows the `sections` array below.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const base = import.meta.env.BASE_URL

export const profile = {
  name: 'Syed Muhammad Abubakar',
  shortName: 'Syed M. Abubakar',
  title: 'ML Systems Engineer',
  pitch:
    'I build ML systems that measure the physical world from imperfect sensors — and ship them to production and the edge.',
  location: 'Genoa, Italy',
  email: 'syedabubakar03@yahoo.com',
  github: 'https://github.com/Abubakar17',
  linkedin: 'https://www.linkedin.com/in/s-m-abubakar/',
  cv: `${base}CV_SyedMuhammadAbubakar.pdf`,
  seeking: {
    headline: "Open to a master's thesis internship",
    role: 'ML / computer vision engineer',
    focus: 'perception · 3D vision · label-efficient learning',
  },
  /** Short credential strip shown under the hero. */
  proof: [
    { label: 'Google', text: 'Data Center Technician Intern · Belgium · 2026' },
    { label: '2 manuscripts', text: 'MICCAI 2025 (lead author) · ICES J. Marine Science' },
    { label: 'Erasmus Mundus', text: 'Fully funded scholar, EMSSE' },
    { label: 'METI Japan', text: 'Only Pakistani selected from 15,000 applicants' },
  ],
}

/** One entry per server rack, in aisle order. `id` is also the deep-link (#/<id>). */
export const sections = [
  { id: 'about', label: 'About', rack: 'RACK A01', host: 'about.svc', cmd: 'cat about.md' },
  { id: 'experience', label: 'Experience', rack: 'RACK A02', host: 'exp.svc', cmd: 'journalctl --career' },
  { id: 'projects', label: 'Projects', rack: 'RACK A03', host: 'proj.svc', cmd: 'ls ./projects --featured' },
  { id: 'education', label: 'Education', rack: 'RACK B01', host: 'edu.svc', cmd: 'cat education.yml' },
  { id: 'skills', label: 'Skills', rack: 'RACK B02', host: 'stack.svc', cmd: 'pip list --user' },
  { id: 'contact', label: 'Contact', rack: 'RACK B03', host: 'net.svc', cmd: 'ping abubakar' },
] as const

export type SectionId = (typeof sections)[number]['id']

export const about = {
  paragraphs: [
    'I trained as an electrical engineer at NUST, where signals, control and embedded systems taught me to think about the sensor before the model. My first ML work, at the TUKL-NUST R&D Center, was close to the signal: EEG anomalies and the structure of document images.',
    'My final-year project pulled that into computer vision: measuring fish from a single underwater camera, which became the DeepDive manuscript. At Dcube Technologies I learned the production side, shipping GANs for broadcast audio, LLM features and models behind Dockerised APIs. I also led my first paper there: using vision-language agents to decide which X-rays a dentist should label.',
    "The Erasmus Mundus master's took me to France, Albania and now Genoa, and toward robotics. In Compiègne our team turned a 2D LiDAR and a conveyor into a 6-DoF pose estimator running on a Jetson. A summer at Google's Belgian data center showed me the hardware all of this runs on.",
  ],
  research:
    'I work on measuring the physical world from imperfect sensors: getting reliable geometry and counts out of monocular video, sparse LiDAR and expensive-to-label medical images.',
  interests: [
    { title: 'Measurement under unconstrained imaging', text: 'Monocular depth, detection and tracking when the image is murky, blurred or camouflaged.' },
    { title: 'Fusing motion and appearance', text: "Combining temporal models (background statistics, tracks) with spatial detectors so each covers the other's failure modes." },
    { title: 'Label-efficient learning', text: "Active learning guided by vision-language agents, deciding which images are worth an expert's time." },
    { title: '3D perception on low-cost hardware', text: 'Point-cloud pose estimation and compact models deployed on edge devices.' },
  ],
}

export interface Job {
  company: string
  role: string
  period: string
  location: string
  summary: string
  bullets: string[]
  tags: string[]
}

export const experience: Job[] = [
  {
    company: 'Google',
    role: 'Data Center Technician Intern',
    period: 'Jun – Sep 2026',
    location: 'Belgium',
    summary: 'Hardware diagnosis and repair, fibre fault tracing and secure decommissioning across five data center domains.',
    bullets: [
      'Rotated through five operational domains: deployments, network delivery, interrupts, networking and data security.',
      'Diagnosed and repaired production server hardware (DIMMs, BIOS chips, QSFP optics) and traced backbone fibre faults with OTDR.',
      'Sanitised 300+ storage devices and verified live traffic before decommissioning, with zero customer impact.',
    ],
    tags: ['Server hardware', 'Fibre / OTDR', 'Data security'],
  },
  {
    company: 'Dcube Technologies',
    role: 'Machine Learning Engineer',
    period: 'Aug 2024 – Jul 2025',
    location: 'Islamabad',
    summary: 'Shipped GAN audio enhancement for NFL broadcasts (96% recall), LLM features and Dockerised model services; led the MICCAI paper.',
    bullets: [
      'Built a generative-AI audio enhancement system for NFL broadcast recordings: 96% recall on audio event detection, GAN-based augmentation, real-time controls for studio engineers. Demoed to FOX Sports.',
      'Built LLM modules for the Fabric e-commerce platform: natural-language querying and automated BI summaries, fine-tuned per client.',
      'Lead author of a MICCAI 2025 submission: vision-language agents guide active learning for dental X-ray disease detection, matching full-data performance with 20–30% less labelled data.',
      'Shipped models as Dockerised FastAPI services, including an attendance system used daily by 100+ students; set up MLflow, W&B and CI/CD.',
    ],
    tags: ['PyTorch', 'GANs', 'LLMs', 'Docker', 'FastAPI', 'MLflow'],
  },
  {
    company: 'ARS Corporation · METI AI/IT programme',
    role: 'AI/IT Intern',
    period: 'Nov – Dec 2024',
    location: 'Tokyo',
    summary: 'Serverless monitoring on AWS SAM and edge data pipelines on Raspberry Pi / Armadillo, with 99.9% remote uptime.',
    bullets: [
      'Built and deployed serverless remote-monitoring applications with AWS SAM.',
      'Set up secure remote networking with ZeroTier: 99.9% uptime for remote device access.',
      'Optimised real-time data pipelines on Raspberry Pi and Armadillo G3L edge devices, with Docker-containerised configurations.',
    ],
    tags: ['AWS SAM', 'Edge devices', 'Docker', 'ZeroTier'],
  },
  {
    company: 'OPTIMAL Lab, NUST',
    role: 'Undergraduate Research Assistant',
    period: 'Jun 2023 – Jun 2024',
    location: 'Islamabad',
    summary: "DeepDive fish biomass with UWA's Machine Vision Group; I worked on monocular depth.",
    bullets: [
      'DeepDive fish biomass estimation with the Machine Vision Group at UWA, funded by an Australian Government research grant.',
      'Worked on the monocular depth stage (Depth Anything); co-authored the ICES J. Marine Science manuscript (97.5% detection F1 on LifeCLEF 2015).',
    ],
    tags: ['YOLOv8', 'Depth estimation', 'Tracking'],
  },
  {
    company: 'TUKL-NUST R&D Center',
    role: 'Undergraduate Research Intern',
    period: 'Jun 2021 – Sep 2022',
    location: 'Islamabad',
    summary: 'Table-structure recognition (95.9% precision), EEG anomaly detection and a face-recognition entry system.',
    bullets: [
      'Selected through a competitive programming test.',
      'Implemented SPLERGE for table structure recognition (95.9% precision) and an AlexNet + MLP EEG anomaly detector (89% accuracy).',
      'Built a real-time face-recognition entry system used daily by ~30 lab members.',
    ],
    tags: ['PyTorch', 'TensorFlow', 'OpenCV'],
  },
]

export interface Link {
  label: string
  href: string
}

export interface CaseStudy {
  id: string
  kicker: string
  title: string
  meta: string
  metric: { value: string; label: string }
  summary: string
  role: string
  chain: string[]
  problem: string
  approach: string
  results: { value: string; label: string }[]
  contribution: string
  note?: string
  stack: string[]
  links: Link[]
}

export const featuredProjects: CaseStudy[] = [
  {
    id: 'deepdive',
    kicker: 'Flagship · Computer vision research',
    title: 'DeepDive: fish biomass from one underwater camera',
    meta: 'OPTIMAL Lab, NUST × Machine Vision Group, UWA · 2023 – 2024 · Co-author, 2nd of 4',
    metric: { value: '97.5%', label: 'detection F1 on LifeCLEF 2015' },
    summary: 'Detect, track and measure fish in monocular reef video, then estimate biomass per species.',
    role: 'Depth stage · co-author',
    chain: ['video', 'FCE + YOLOv8', 'tracking', 'depth', 'length', 'mass'],
    problem:
      'Estimating fish biomass needs fish size, and size normally needs stereo cameras to recover depth. Most underwater footage in the world is monocular, low-resolution and hostile: murky water, moving coral, light beams and fish that blend into the reef.',
    approach:
      'A hierarchical pipeline that fuses a temporal motion model (per-pixel Gaussian mixtures) with a YOLOv8 detector, tracks every fish with a Hungarian tracker, and turns an attention U-Net depth map into a physical length and mass (W = a·Lᵇ).',
    results: [
      { value: '97.5%', label: 'detection F1 (P 96.5 · R 95.9)' },
      { value: '96.3%', label: 'species accuracy, 14 species' },
      { value: '5.69 cm', label: 'length RMSE vs. FishBase' },
    ],
    contribution:
      'I worked on the depth stage, the step that turns a single camera into distance-to-fish. My main focus was monocular depth with Depth Anything, a foundation model for depth estimation, tested on murky, low-resolution reef footage it was never trained on.',
    note: 'Beats GMM + optical flow + YOLOv3 (0.954) and Cascade R-CNN with enhancement (0.817) on LifeCLEF 2015.',
    stack: ['Python', 'PyTorch', 'YOLOv8', 'OpenCV', 'U-Net + attention', 'Hungarian tracking', 'GMM'],
    links: [
      { label: 'Manuscript (PDF)', href: 'https://github.com/Abubakar17/FYP-reports-Fish-Biomass-Estimation/blob/main/ICESJMS_2024a_compressed.pdf' },
      { label: 'Demo video', href: 'https://github.com/Abubakar17/FYP-reports-Fish-Biomass-Estimation/blob/main/fyp%20demo%20upload%20final.mp4' },
      { label: 'Poster', href: 'https://github.com/Abubakar17/FYP-reports-Fish-Biomass-Estimation/blob/main/FYP%20POSTER%20FINAL.pdf' },
      { label: 'Repository', href: 'https://github.com/Abubakar17/FYP-reports-Fish-Biomass-Estimation' },
    ],
  },
  {
    id: 'aal',
    kicker: 'Lead author · Medical imaging',
    title: 'Agentic Active Learning for dental X-rays',
    meta: 'MICCAI 2025 submission · 2025 · Lead author',
    metric: { value: '20–30%', label: 'less labelled data for full-data performance' },
    summary: 'A vision-language agent describes each X-ray; text and image features decide what a dentist labels next.',
    role: 'Lead author · MICCAI 2025 submission',
    chain: ['X-ray', 'Qwen2-VL text', 'YOLOv11 features', 'core-set', 'dentist'],
    problem:
      "Labelling dental X-rays needs a dentist's time. Standard active learning chooses what to label from low-level image features alone, which miss context a clinician would notice (crowns, fillings, missing teeth).",
    approach:
      'Ask a vision-language agent (Qwen2-VL) for generic descriptions it handles reliably — never the diagnosis itself. Embed the text with ClinicalBERT, fuse 50/50 with YOLOv11x image features, and pick the most diverse X-rays with a furthest-first core-set query.',
    results: [
      { value: '20–30%', label: 'less labelled data to match 100%' },
      { value: '9.18%', label: 'agent descriptions needing a fix' },
      { value: '50 / 50', label: 'text–image weighting won' },
    ],
    contribution:
      'Lead author. I led the work end to end under the supervision of university professors: agent prompting, text–image embedding fusion, the combined core-set query, and the 30-experiment evaluation.',
    note: 'Because selection is driven by text, you can read why each batch was chosen.',
    stack: ['Qwen2-VL', 'ClinicalBERT', 'YOLOv11', 'PyTorch', 'Core-set active learning'],
    links: [],
  },
  {
    id: 'lidar',
    kicker: 'Robotics perception',
    title: '6-DoF object pose from a single 2D LiDAR',
    meta: "Master's team project (5), UTC Compiègne · Sep 2025 – Jan 2026",
    metric: { value: '2.0 mm · 0.68°', label: 'mean position / angular error' },
    summary: 'A conveyor turns a 2D LiDAR into a 3D scanner; a 28 KB network regresses pose on a Jetson.',
    role: 'ML model + Jetson deployment',
    chain: ['2D LiDAR', '15 slices', '150 features', 'MLP', 'ONNX on Jetson'],
    problem:
      'Recover the full position and orientation (x, y, z, roll, pitch, yaw) of an object on a conveyor using one low-cost 2D LiDAR, with no camera.',
    approach:
      'The LiDAR is mounted vertically and the conveyor turns it into a 3D scanner: a servo advances the object 1 cm per slice, and a small MLP (256-128-64-32) regresses the pose from per-slice statistics. Everything runs as ROS 2 nodes on a Jetson Orin Nano.',
    results: [
      { value: '2.0 mm', label: 'mean position error' },
      { value: '0.68°', label: 'mean angular error' },
      { value: '28 KB', label: 'ONNX model on Jetson' },
    ],
    contribution:
      'I owned the ML side: the pose-regression network that maps 150 per-slice features to a 6-DoF pose, its training and evaluation, and its optimisation for embedded inference (ONNX Runtime inside the ROS 2 pipeline).',
    note: 'Held-out test MAE; 5-fold cross-validation stays within 2.1–2.5 mm. Yaw is the hardest axis (1.37°).',
    stack: ['ROS 2 Humble', 'PyTorch', 'ONNX Runtime', 'Jetson Orin Nano', 'Python'],
    links: [{ label: 'Repository', href: 'https://github.com/Abubakar17/lidar_pose_estimation' }],
  },
]

export interface SmallProject {
  title: string
  year: string
  summary: string
  stack: string[]
  href?: string
}

export const moreProjects: SmallProject[] = [
  {
    title: 'JARVIS: voice-driven robot teammate',
    year: '2025',
    summary:
      'AMD Robotics Hackathon, team of 2. An SO-101 arm takes spoken tool requests, releases objects only when it sees an open hand, and switches between LeRobot ACT policies trained on an AMD MI300X cluster; Llama 3.2 runs locally for conversation.',
    stack: ['LeRobot (ACT)', 'SO-101 arm', 'Llama 3.2', 'AMD MI300X'],
    href: 'https://github.com/Abubakar17/AMD_Robotics_Hackathon_2025_Jarvis',
  },
  {
    title: 'GroupChat Karaoke',
    year: '2026',
    summary:
      "Aligns a group's separate voice notes to one song and mixes them in turns: Demucs vocal separation, chroma cross-correlation with a DTW fallback, phrase assignment and loudness-matched mixing.",
    stack: ['Demucs', 'librosa', 'DTW', 'FastAPI'],
    href: 'https://github.com/Abubakar17/karaoke',
  },
  {
    title: 'Finger Magic',
    year: '2026',
    summary:
      'Real-time AR in the browser: comic-book shader filters stretched between your two hands, driven by MediaPipe hand landmarks. Pinch to stamp a frame, swipe apart to clear.',
    stack: ['MediaPipe', 'WebGL2', 'JavaScript'],
    href: 'https://github.com/Abubakar17/spidey-cam',
  },
  {
    title: 'ChatWithPDFs',
    year: '2024',
    summary: 'RAG question answering over PDFs, comparing a QA chain, a chat-history variant and a retriever-based variant.',
    stack: ['LangChain', 'Gemini API', 'FAISS', 'Streamlit'],
    href: 'https://github.com/Abubakar17/Chat_With_PDFS',
  },
  {
    title: 'SPLERGE table structure recognition',
    year: '2021–22',
    summary: 'PyTorch implementation of the Split model, which predicts row and column separators in document images; 95.9% precision in table extraction.',
    stack: ['PyTorch', 'Document AI'],
    href: 'https://github.com/Abubakar17/splerge-abubakar',
  },
  {
    title: 'Serverless text-to-audio pipeline',
    year: '2024',
    summary: 'An asynchronous AWS pipeline that converts text posts to speech. Ingestion is decoupled from synthesis across Lambda functions, with IDs tracked in DynamoDB.',
    stack: ['AWS Lambda', 'Polly', 'DynamoDB', 'S3'],
  },
  {
    title: 'GPS tracker for the NUST shuttle',
    year: '2023',
    summary: 'Bare-metal ATmega32A firmware that parses NMEA from a GPS module, shows position on an LCD and streams it over Bluetooth to an Android map. Team of 3.',
    stack: ['C++ (AVR)', 'ATmega32A', 'NMEA', 'Bluetooth'],
    href: 'https://github.com/Abubakar17/GPS-INTEGRATION-FOR-SHUTTLE-SERVICE',
  },
]

export const papers = [
  {
    authors: 'S. M. Abubakar, et al.',
    title: 'Agentic Active Learning: Agent Assisted Active Learning for Disease Detection in Panoramic Dental X-Rays',
    venue: 'MICCAI 2025',
    status: 'Submitted · lead author',
    year: '2025',
    links: [] as Link[],
  },
  {
    authors: 'U. Jalil, S. M. Abubakar, M. Saad, A. Salman',
    title: 'DeepDive: On Estimating Fish Biomass Using Monocular Unconstrained Underwater Videos',
    venue: 'ICES Journal of Marine Science',
    status: 'Manuscript submitted · ICESJMS-2024-271',
    year: '2024',
    links: [{ label: 'PDF', href: 'https://github.com/Abubakar17/FYP-reports-Fish-Biomass-Estimation/blob/main/ICESJMS_2024a_compressed.pdf' }],
  },
]

export const education = [
  {
    degree: 'European Master in Sustainable Systems Engineering',
    badge: 'Erasmus Mundus scholar',
    school: 'UTC Compiègne (France) → Albania → University of Genoa (Computer Engineering)',
    period: '2025 – 2027 (expected)',
    detail: 'GPA 3.70/4.00 (France) · 9.41/10 (Albania) · Scientific ML, MBSE (SysML), Industrial Automation',
  },
  {
    degree: 'BSc Electrical Engineering',
    badge: 'Distinction · CGPA 3.62/4.00',
    school: 'National University of Sciences and Technology (NUST), Islamabad',
    period: '2020 – 2024',
    detail: 'Thesis: fish biomass estimation in unconstrained underwater environments (DeepDive)',
  },
]

export const honors = [
  { year: '2026', title: 'Data Center Technician internship', org: 'Google, Belgium', text: 'Selected for a summer infrastructure internship.' },
  { year: '2025', title: "Erasmus Mundus Joint Master's Scholarship", org: 'European Commission', text: 'Fully funded scholarship for the European Master in Sustainable Systems Engineering (EMSSE).' },
  { year: '2024', title: 'METI AI/IT Japan Internship', org: 'Ministry of Economy, Trade and Industry, Japan', text: 'Fully funded; the only Pakistani selected from a global pool of 15,000 candidates.' },
  { year: '2024', title: 'FAST Sustainability Award', org: 'FAST Cables Ltd', text: 'PKR 200,000 for the most sustainable undergraduate final-year project.' },
  { year: '2023', title: 'Australian Government Research Grant', org: 'OPTIMAL Lab × Machine Vision Group, UWA', text: 'Grant support for real-time fish biomass estimation.' },
  { year: '2020', title: 'High Achievers Award, Gold Medal', org: '', text: '' },
  { year: '2019', title: '24th National Physics Talent Contest', org: 'STEM Careers Programme, HEC Pakistan', text: 'Qualified for the national contest.' },
  { year: '2018', title: 'Distinction in O-Level Computer Science', org: '', text: 'Among the top performers in Northern Pakistan.' },
]

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Python', 'C/C++', 'MATLAB', 'SQL', 'Bash'] },
  { group: 'ML / deep learning', items: ['PyTorch', 'TensorFlow / Keras', 'scikit-learn', 'Hugging Face Transformers', 'OpenCV'] },
  { group: 'Computer vision', items: ['Detection (YOLOv8, YOLOv11)', 'Multi-object tracking', 'Monocular depth', 'Segmentation', 'Point clouds', 'Active learning', 'MediaPipe'] },
  { group: 'LLMs & VLMs', items: ['Vision-language models (Qwen2-VL)', 'ClinicalBERT', 'LangChain', 'RAG', 'FAISS', 'LoRA / PEFT fine-tuning', 'Gemini / OpenAI APIs'] },
  { group: 'Robotics & edge', items: ['ROS 2', 'LeRobot (ACT)', 'Jetson Orin Nano', 'ONNX Runtime', 'Raspberry Pi', 'LiDAR'] },
  { group: 'MLOps & cloud', items: ['Docker', 'FastAPI', 'MLflow', 'Weights & Biases', 'CI/CD', 'AWS (Lambda, S3, DynamoDB, SAM)'] },
  { group: 'Systems', items: ['Linux / Ubuntu', 'Git', 'Data center hardware'] },
]
