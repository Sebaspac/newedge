/**
 * Page: KI-Glossar  — Single Type
 * --------------------------------------------------------------
 * Inhalte der KI-Glossar-Seite (`pages/KiGlossar.tsx`): SEO, Hero,
 * Toolbar-Texte (Suche, Alphabet, Leerzustand), die Abschluss-CTA
 * sowie die vollständige Begriffsliste.
 *
 * Die Begriffe sind FESTER Inhalt eines einzelnen Typs (kein vom
 * Redakteur erweiterbarer Collection-Type): ein nach Anfangsbuchstaben
 * gruppiertes Verzeichnis von Term/Definition-Paaren.
 *
 * Hinweis: `{total}` in SEO-Beschreibung und Hero-Subline sowie
 * `{query}` im Leerzustands-Text sind Platzhalter, die in der
 * Komponente zur Laufzeit ersetzt werden. Keine Icons/Bilder — die
 * Glyphe ⌕ (Such-Symbol) ist ein dekoratives Schriftzeichen im Markup.
 * Strapi-Mapping: Single Type `ki-glossar`.
 * --------------------------------------------------------------
 */
/**
 * SEO-Kopfdaten dieser Seite. Wie `SEOContent` (→ `types.ts`), aber die
 * Beschreibung enthält den Laufzeit-Platzhalter `{total}`, daher
 * `descriptionTemplate` statt `description`.
 */
interface GlossarySEO {
  title: string;
  descriptionTemplate: string;
  canonical?: string;
  ogImage?: string;
}

/** Ein Glossar-Eintrag: Begriff + Definition. */
export interface GlossaryTerm {
  /** Der Begriff (Überschrift der Karte). */
  term: string;
  /** Die Definition / Erläuterung. */
  def: string;
}

/** Begriffe gruppiert nach Anfangsbuchstabe (A–Z). */
export type GlossaryByLetter = Record<string, GlossaryTerm[]>;

export const kiGlossar = {
  seo: {
    title: "AI Glossary: Key AI Terms Explained Clearly | NEWEDGE",
    /** `{total}` → Gesamtzahl der Begriffe (Laufzeit). */
    descriptionTemplate:
      "AI terms explained clearly: {total} definitions from Agent and LLM to Zero-Shot Learning — concise and practical for decision-makers in mid-sized companies.",
    canonical: "/en/ki-glossar",
  } satisfies GlossarySEO,

  /** Hero-Bereich (Aurora). */
  hero: {
    headline: "AI Glossary.",
    /** `{total}` → Gesamtzahl der Begriffe (Laufzeit). */
    sublineTemplate:
      "The {total} most important terms around artificial intelligence — explained clearly for decision-makers.",
  },

  /** Sticky-Toolbar: Suche + Alphabet-Navigation. */
  toolbar: {
    searchPlaceholder: "Search for a term …",
    searchAriaLabel: "Search the glossary",
    /** Dekoratives Such-Symbol (Glyphe). */
    searchGlyph: "⌕",
    /** `{letter}` → Buchstabe (Laufzeit). */
    letterAriaTemplate: "Jump to letter {letter}",
  },

  /** Beschriftung der Begriffsanzahl je Buchstabe. */
  countLabel: {
    singular: "term",
    plural: "terms",
  },

  /** Leerzustand bei erfolgloser Suche. `{query}` → Suchbegriff. */
  emptyTemplate: "No terms found for “{query}”.",

  /** Abschluss-CTA. */
  cta: {
    heading: "From terms to an AI department.",
    body: "We translate these concepts into systems your company truly owns.",
    button: "Book a call",
  },

  /** Kontakt-Link (Hero/Nav-Kontakt + Abschluss-CTA). */
  calendlyUrl: "/kontakt",

  /**
   * Vollständiges Begriffsverzeichnis, gruppiert nach Anfangsbuchstabe.
   * KI-Glossar — die wichtigsten Begriffe rund um Künstliche Intelligenz.
   */
  glossary: {
    A: [
      { term: "Agent", def: "An autonomous system that makes decisions and carries out actions to achieve specific goals. Example: chatbots or self-driving vehicles." },
      { term: "Agentic Workflow", def: "A process in which agents carry out tasks sequentially or in parallel, often with their own decision logic." },
      { term: "Algorithm", def: "A set of instructions a computer follows to solve a problem." },
      { term: "Annotation", def: "The tagging of data with labels or metadata so that models can learn from it." },
      { term: "API", def: "An interface through which software systems communicate with one another — the foundation for embedding AI models into existing applications." },
      { term: "Artificial General Intelligence (AGI)", def: "A form of AI that mimics human-like reasoning across different contexts." },
      { term: "Artificial Narrow Intelligence (ANI)", def: "AI specialized in specific tasks, such as image recognition or speech processing." },
      { term: "Attention Mechanism", def: "A technique in neural networks that gives greater weight to important parts of an input — the heart of modern transformer models." },
      { term: "AutoML", def: "Automation of the model development process, from data preparation to model selection." },
    ],
    B: [
      { term: "Backpropagation", def: "An algorithm for training neural networks that propagates errors backwards through the network." },
      { term: "Benchmark", def: "A standardized test used to measure and compare the performance of AI models." },
      { term: "Bias", def: "Systematic errors in data or algorithms that can lead to unfair outcomes." },
      { term: "Big Data", def: "Large, complex data sets that are difficult to process with traditional methods." },
    ],
    C: [
      { term: "Chatbot", def: "An AI-powered program that simulates human conversation." },
      { term: "Clustering", def: "An unsupervised technique that automatically groups similar data points together." },
      { term: "Computer Vision", def: "A subfield of AI that teaches machines to understand and interpret visual information." },
      { term: "Context Window", def: "The maximum amount of text a language model can process at once." },
      { term: "Convolutional Neural Network (CNN)", def: "A neural network that is especially good at recognizing patterns in images — for example in object detection." },
      { term: "Corpus", def: "A collection of texts used to train AI models." },
    ],
    D: [
      { term: "Data Augmentation", def: "Artificially expanding a data set through variations to make models more robust." },
      { term: "Dataset", def: "A collection of data used to train and test AI models." },
      { term: "Deep Learning", def: "A subcategory of machine learning based on deep neural networks." },
      { term: "Diffusion Model", def: "A generative model that gradually creates images from noise — the basis of tools like Midjourney." },
      { term: "Domain Adaptation", def: "A model's ability to generalize from one domain (e.g. images) to another." },
    ],
    E: [
      { term: "Edge Computing", def: "Processing data at decentralized locations, close to where it originates." },
      { term: "Embedding", def: "A method for converting data such as words or images into vectors that machines can understand." },
      { term: "Ensemble Learning", def: "Combining multiple models to achieve more accurate and more stable predictions." },
      { term: "Epoch", def: "One complete pass through the entire training data set during training." },
      { term: "Explainable AI (XAI)", def: "Approaches that make the decisions of AI models understandable and transparent." },
    ],
    F: [
      { term: "F1-Score", def: "A metric that combines a model's precision and recall into a single value." },
      { term: "Feature Engineering", def: "The process of extracting relevant features from raw data." },
      { term: "Federated Learning", def: "Training across many decentralized devices without merging the raw data centrally." },
      { term: "Few-Shot Learning", def: "A learning paradigm in which models are trained with only a few examples." },
      { term: "Fine-Tuning", def: "The process of adapting a pre-trained model to a specific task." },
      { term: "Foundation Model", def: "A large, broadly pre-trained base model that can be adapted for many tasks, e.g. GPT." },
    ],
    G: [
      { term: "Generative AI", def: "AI that creates new content such as text, images or video — for instance via GANs or diffusion models." },
      { term: "Generative Adversarial Network (GAN)", def: "Two competing neural networks that together generate realistic content." },
      { term: "GPT", def: "Generative Pretrained Transformer — a family of large language models that generate and understand text." },
      { term: "Gradient Descent", def: "An optimization algorithm that adjusts a model's parameters step by step." },
      { term: "Graph Neural Networks (GNN)", def: "A neural network that works with graph structures." },
      { term: "Guardrails", def: "Safety mechanisms that constrain an AI's behavior to prevent errors and misuse." },
    ],
    H: [
      { term: "Hallucination", def: "When an AI model produces convincing-sounding but factually incorrect content." },
      { term: "Human-in-the-Loop (HITL)", def: "An approach in which human input is integrated into the AI process." },
      { term: "Hybrid AI", def: "A combination of different AI technologies such as symbolic AI and machine learning." },
      { term: "Hyperparameter", def: "Parameters that control a model's learning process and are not learned through training itself." },
    ],
    I: [
      { term: "Inference", def: "The process by which a trained AI model makes predictions or decisions." },
      { term: "Intelligent Agent", def: "A system that can act autonomously to achieve goals." },
      { term: "Interpretability", def: "The ability to explain a model and its predictions." },
    ],
    J: [
      { term: "Joint Embedding", def: "An approach in which different data modalities are embedded into the same space." },
    ],
    K: [
      { term: "Knowledge Distillation", def: "Transferring the knowledge of a large model to a smaller, more efficient one." },
      { term: "Knowledge Graph", def: "A data structure that represents knowledge through entities and their relationships." },
    ],
    L: [
      { term: "Language Model", def: "A model trained to generate or analyze text, e.g. GPT." },
      { term: "Large Language Model (LLM)", def: "A model trained on huge amounts of text that understands and generates language." },
      { term: "Latent Space", def: "A multidimensional space in which data is represented through abstractions." },
      { term: "LoRA (Low-Rank Adaptation)", def: "An efficient method for adapting large models to new tasks with little computational effort." },
      { term: "Loss Function", def: "A function that measures a model's errors." },
    ],
    M: [
      { term: "Machine Learning (ML)", def: "A subfield of AI that enables machines to learn from data." },
      { term: "Meta-Learning", def: "A learning approach in which models learn how to learn." },
      { term: "MLOps", def: "Practices and tools for reliably bringing AI models into production and operating them." },
      { term: "Model Drift", def: "When a model loses accuracy over time because the underlying data changes." },
      { term: "Multi-Agent System", def: "Multiple AI agents that collaborate or negotiate to solve complex tasks." },
      { term: "Multimodal AI", def: "AI that processes several types of data at once — e.g. text, image and audio." },
    ],
    N: [
      { term: "Named Entity Recognition (NER)", def: "A technique that automatically identifies names, places, organizations and other entities in text." },
      { term: "Natural Language Processing (NLP)", def: "The processing and analysis of natural language by machines." },
      { term: "Neural Network", def: "A model inspired by the structure of the human brain." },
    ],
    O: [
      { term: "Optimization", def: "The process of adjusting a model so that it performs better." },
      { term: "Overfitting", def: "When a model sticks too closely to the training data and generalizes poorly to new data." },
    ],
    P: [
      { term: "Parameter", def: "The internally learned values of a model — modern language models have billions of them." },
      { term: "Precision", def: "The share of correct hits among all positive predictions a model makes." },
      { term: "Pretraining", def: "The process of pre-training a model on general tasks using large amounts of data." },
      { term: "Probabilistic AI", def: "AI that factors uncertainty into its decisions." },
      { term: "Prompt", def: "An input that guides an AI such as GPT toward a specific action or response." },
      { term: "Prompt Engineering", def: "The deliberate design of inputs to get better results out of an AI model." },
    ],
    Q: [
      { term: "Quantization", def: "Shrinking a model through coarser number representation — saving memory and compute." },
      { term: "Quantum Computing", def: "An approach based on quantum physics with the potential to accelerate AI." },
    ],
    R: [
      { term: "RAG (Retrieval-Augmented Generation)", def: "A method in which external data sources are used to improve AI responses." },
      { term: "Recurrent Neural Network (RNN)", def: "A neural network for sequential data such as text or time series." },
      { term: "Reinforcement Learning", def: "A learning approach in which an agent is trained through rewards and penalties." },
      { term: "RLHF", def: "Training models based on human feedback to make responses more helpful and safer." },
      { term: "Robustness", def: "A model's ability to remain stable under a variety of conditions." },
    ],
    S: [
      { term: "Self-Supervised Learning", def: "A learning paradigm in which models are trained without explicit labels." },
      { term: "Semantic Search", def: "A search that understands the meaning of text rather than just matching keywords." },
      { term: "Sentiment Analysis", def: "Automatic detection of the mood or opinion in a text." },
      { term: "Speech Recognition", def: "Converting spoken language into text." },
      { term: "Supervised Learning", def: "A learning approach in which models are trained with labeled data." },
      { term: "Synthetic Data", def: "Artificially generated data that replaces or supplements real data — for example for privacy reasons." },
    ],
    T: [
      { term: "Temperature", def: "A setting that controls how creative or predictable a language model's outputs are." },
      { term: "Tokenization", def: "Breaking text down into smaller units (tokens) that a model can process." },
      { term: "Training Data", def: "The data a model learns from — its quality largely determines model quality." },
      { term: "Transfer Learning", def: "The process of transferring knowledge from one model to a new task." },
      { term: "Transformer", def: "A neural network architecture optimized for language processing that powers modern LLMs." },
    ],
    U: [
      { term: "Underfitting", def: "When a model is too simple and already captures the training data poorly." },
      { term: "Unsupervised Learning", def: "A learning approach in which models are trained without labeled data." },
      { term: "Utility Function", def: "A function that evaluates the success or benefit of a model." },
    ],
    V: [
      { term: "Vectorization", def: "The process of converting data into numerical vectors." },
      { term: "Vector Database", def: "A database that stores embeddings and finds similar content in an instant — the basis for RAG." },
      { term: "Vision-Language Models", def: "Models that process text and image data at the same time." },
    ],
    W: [
      { term: "Weight", def: "A parameter in a neural network that is adjusted during training." },
      { term: "Word Embedding", def: "Representing words as vectors so that similar meanings lie close together." },
    ],
    X: [
      { term: "XAI (Explainable AI)", def: "An umbrella term for methods that make AI decisions understandable to humans." },
    ],
    Y: [
      { term: "YOLO (You Only Look Once)", def: "A fast method for real-time object detection in images and videos." },
    ],
    Z: [
      { term: "Zero-Shot Learning", def: "An approach in which a model solves tasks it was never explicitly trained on." },
    ],
  } satisfies GlossaryByLetter,
} as const;
