// data/portfolioData.js
export const initialPortfolioData = {
  personal: {
    name: "BHARATH RASALAPU",
    title: "FREELANCE AI ENGINEER & FULL STACK ARCHITECT",
    location: "INDIA • AVAILABLE WORLDWIDE",
    tagline: "Freelance AI Solutions • Agentic Workflows • Open to Work",
    subtagline: "Freelance AI Engineer & Architect open for freelance contracts, custom LLM systems, autonomous agent workflows, production backends, and full-stack applications.",
    email: "rasalapubharath@gmail.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    specRole: "Freelance AI Engineer",
    specFocus: "Open to Work & Freelance Contracts",
    specFrontend: "Next.js / React / Three.js",
    specBackend: "Python / FastAPI / LangGraph",
  },
  about: {
    bioHeader: "FREELANCE AI ENGINEER // OPEN FOR CONTRACTS",
    bioLead: "I am a Freelance AI Engineer and Full Stack Developer available for contract roles, custom LLM agent systems, high-throughput vector retrieval pipelines, and responsive web applications.",
    bioPara1: "My freelance work bridges theoretical machine learning with practical production engineering. From architecting multi-agent decision graphs using LangGraph to engineering high-frequency REST APIs with FastAPI and crafting interactive UI interfaces in Next.js.",
    bioPara2: "I help founders, businesses, and engineering teams build software that is intelligent by design — enabling applications to reason, retrieve context, execute complex actions, and communicate seamlessly.",
  },
  projects: [
    {
      id: "01",
      name: "Autonomous DevOps Agent",
      blurb: "Self-healing multi-agent SRE system orchestrating Docker container recovery: detects crashes (exit codes 1/125/127/137), diagnoses via Gemini CoT, leverages ChromaDB RAG long-term memory, applies surgical code fixes, validates builds, and opens GitHub PRs with Human-in-the-Loop (HITL) approval.",
      tags: ["LangGraph", "Gemini 1.5 Pro", "Docker SDK", "FastAPI", "ChromaDB", "PyGithub", "React + Vite"],
      span: "lg:col-span-7",
      highlight: "LANGGRAPH MULTI-AGENT // HITL WORKFLOW",
      useCorner: true,
      metric: "Self-Healing Docker Containers",
      accuracy: "Deterministic Gemini (Temp=0.0)",
      latency: "Real-time SSE Log Streaming",
      github: "https://github.com",
      demo: "#",
      details: {
        problem: "Automating cloud infrastructure incident diagnosis and recovery when Docker containers crash unexpectedly in production.",
        achievement: "End-to-end reflexive StateGraph loop with RAG incident recall, surgical container patching, automated build validation, and Human-in-the-Loop PR authorization.",
        nodes: [
          { role: "Observe (Watcher)", desc: "Docker SDK monitoring, exit code triggers (1, 125, 127, 137), last 100 log lines capture." },
          { role: "Preprocess", desc: "Regex classification and error categorizing (missing_dependency, port_conflict, OOM, config_error)." },
          { role: "Retrieve (ChromaDB RAG)", desc: "Top-3 historical incident vector lookup for long-term cross-session memory." },
          { role: "Reason (Analyst CoT)", desc: "Deterministic Gemini 1.5 Pro root cause analysis with anti-loop hypothesis filtering." },
          { role: "Fix Apply", desc: "Structured JSON fix planning & surgical patching of requirements.txt, Dockerfiles, and configs." },
          { role: "Validate (Quality Gate)", desc: "docker-compose build execution with automatic file rollback on test failures." },
          { role: "Submit PR / HITL", desc: "Interrupt-before-submit Human-in-the-Loop approval gate before pushing GitHub PR branches." }
        ],
        stack: [
          "LangGraph (StateGraph Orchestrator)",
          "Google Gemini 1.5 Pro (temp=0.0)",
          "ChromaDB Vector Store (Sentence-Transformers)",
          "Docker SDK (7.1.0)",
          "FastAPI + SSE (Server-Sent Events)",
          "PyGithub PR Automation",
          "React + Vite Real-Time Dashboard"
        ]
      }
    },
    {
      id: "02",
      name: "AI Legal Due Diligence RAG",
      blurb: "Two-stage RAG chatbot analyzing complex legal contracts (NDAs, lease & employment agreements). Combines all-mpnet-base-v2 vector retrieval in ChromaDB with ms-marco CrossEncoder reranking and Gemini 2.0 Flash for zero-hallucination risk assessments.",
      tags: ["ChromaDB", "CrossEncoder", "Gemini 2.0 Flash", "FastAPI", "Streamlit", "Sentence Transformers"],
      span: "lg:col-span-5",
      highlight: "TWO-STAGE RAG // CROSS-ENCODER",
      useCorner: false,
      metric: "Two-Stage Vector + CrossEncoder Reranking",
      accuracy: "Clause-Level Grounded Verification",
      latency: "Top-3 Reranked Context Precision",
      github: "https://github.com",
      demo: "#",
      details: {
        problem: "Automated analysis of legal contracts (NDAs, employment contracts, lease & service agreements) to detect liability risks without manual review.",
        achievement: "Engineered a high-precision two-stage retrieval pipeline (Bi-Encoder candidate retrieval + CrossEncoder reranker) with cosine context relevance scoring and zero-hallucination Gemini 2.0 Flash generation.",
        pipeline: [
          "1. Ingestion: PyPDFLoader text extraction + RecursiveCharacterTextSplitter (1000 chunk size, 200 overlap)",
          "2. Embeddings & Storage: all-mpnet-base-v2 dense vectors stored with document metadata in ChromaDB",
          "3. Candidate Retrieval: Top-10 fast semantic vector search over vector space",
          "4. Neural Reranking: ms-marco-MiniLM-L-6-v2 CrossEncoder reranks candidates down to top-3 highest precision chunks",
          "5. Relevance Scoring: Cosine similarity computation between user query and retrieved context",
          "6. Grounded Generation: Gemini 2.0 Flash structured risk assessment (Low, Medium, High, Unknown) with citations"
        ],
        stack: [
          "FastAPI Backend & Streamlit Interactive UI",
          "ChromaDB Vector Database",
          "Sentence Transformers (all-mpnet-base-v2)",
          "CrossEncoder (ms-marco-MiniLM-L-6-v2)",
          "Google Gemini 2.0 Flash LLM",
          "LangChain Document Loaders & Splitters"
        ]
      }
    },
    {
      id: "03",
      name: "Crop Stress Detection System",
      blurb: "End-to-end ML pipeline with 100% Severe Stress recall and 98.9% accuracy via XGBoost. Engineered 5 custom agronomic indices (+15% boost) & deployed via high-performance FastAPI REST server.",
      tags: ["XGBoost", "FastAPI", "Feature Engineering", "Python", "Pydantic", "Scikit-Learn"],
      span: "lg:col-span-5",
      highlight: "98.9% ACCURACY // 100% RECALL",
      useCorner: false,
      metric: "100% Recall for Severe Stress",
      accuracy: "98.9%",
      latency: "<10ms API Latency",
      github: "https://github.com",
      demo: "#",
      details: {
        problem: "Early detection of field crop stress (No Stress, Mild, Severe) from environmental telemetry (Temperature, Humidity, Soil Moisture, NDVI, Rainfall).",
        achievement: "100% Recall for Severe Stress (zero missed critical cases) and 98.9% overall accuracy using XGBoost.",
        features: [
          "Heat Stress Index (Temp × Humidity)",
          "Soil Moisture Deficit (90 - Soil Moisture)",
          "Temperature Anomaly from dataset mean",
          "7-Day Rainfall Intensity Proxy",
          "NDVI Vegetation Change Rate"
        ],
        models: [
          { name: "XGBoost (Winner)", accuracy: "98.9%", recall: "100% Severe Recall" },
          { name: "Random Forest", accuracy: "97.0%", recall: "High" },
          { name: "Logistic Regression", accuracy: "85.0%", recall: "Baseline" }
        ],
        api: "FastAPI REST server with Pydantic contract validation (/health, /predict) & single-lifespan artifact caching."
      }
    },
    {
      id: "04",
      name: "Neural Trace Visualizer",
      blurb: "Real-time web graph engine for inspecting step-by-step LLM multi-agent reasoning paths, token usage, and tool execution trees.",
      tags: ["React", "Three.js", "WebSockets", "TailwindCSS"],
      span: "lg:col-span-7",
      highlight: "INTERACTIVE UI",
      useCorner: false,
      github: "https://github.com",
      demo: "#",
    },
  ],
  skills: [
    {
      num: "01",
      title: "ARTIFICIAL INTELLIGENCE & AGENTS",
      subtitle: "Autonomous planning, tool calling, multi-agent graphs, and custom model workflows.",
      skills: ["LangGraph", "LangChain", "PyTorch", "FastAPI", "OpenAI / Anthropic APIs", "LlamaIndex", "HuggingFace"],
      meter: "94%",
      meterVisual: "████████████████░░",
      color: "text-signal",
    },
    {
      num: "02",
      title: "SOFTWARE & FULL-STACK ENGINEERING",
      subtitle: "Modern responsive web applications, high-concurrency API servers, and system architecture.",
      skills: ["React", "Next.js", "TypeScript", "Python", "Node.js", "TailwindCSS", "REST & WebSockets"],
      meter: "96%",
      meterVisual: "█████████████████░",
      color: "text-wire",
    },
    {
      num: "03",
      title: "DATA & VECTOR RETRIEVAL",
      subtitle: "Semantic search, high-dimensional vector embeddings, and resilient storage engines.",
      skills: ["PostgreSQL", "pgvector", "Pinecone", "Redis", "Pandas", "NumPy", "SQL Analytics"],
      meter: "90%",
      meterVisual: "███████████████░░░",
      color: "text-signal",
    },
    {
      num: "04",
      title: "INFRASTRUCTURE & DEPLOYMENT",
      subtitle: "Containerized environments, cloud hosting, CI/CD automation, and developer tooling.",
      skills: ["Git & GitHub Actions", "Docker", "AWS", "Linux", "Vercel", "Unit & Integration Testing"],
      meter: "88%",
      meterVisual: "██████████████░░░░",
      color: "text-wire",
    },
  ],
  experience: [
    {
      year: "2025 — PRESENT",
      role: "AI Software Engineer / Researcher",
      organization: "Independent & Open Source",
      description:
        "Building autonomous multi-agent systems, automated code refactoring agents, and enterprise-grade RAG evaluation microservices. Focused on production resilience and LLM safety.",
      metric: "⚡ 12+ Agentic DAG Workflows Deployed",
      highlights: ["LangGraph Multi-Agent Workflows", "FastAPI Microservices", "Custom RAG Benchmark Suites"],
      useCorner: true,
    },
    {
      year: "2024 — 2025",
      role: "Full Stack AI Developer",
      organization: "Engineering Projects & Collaborations",
      description:
        "Engineered end-to-end web applications integrating custom computer vision pipelines with interactive frontends. Standardized API query optimization and vector index searches.",
      metric: "🚀 40% Query Latency Optimization",
      highlights: ["Next.js & React Applications", "PyTorch Imagery Models", "PostgreSQL & pgvector Integration"],
      useCorner: false,
    },
    {
      year: "2021 — 2025",
      role: "B.Tech in Computer Science (AI & ML)",
      organization: "Undergraduate Degree",
      description:
        "Specialized in Artificial Intelligence, Machine Learning, Data Structures, Algorithms, and Distributed Systems. Built foundational knowledge across neural network architectures.",
      metric: "🎓 AI & Machine Learning Specialization",
      highlights: ["AI & ML Specialization", "Algorithm Design", "Software Engineering Principles"],
      useCorner: false,
    },
  ],
};
