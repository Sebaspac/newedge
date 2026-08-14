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
    title: "KI-Glossar: KI-Begriffe verständlich erklärt | NEWEDGE",
    /** `{total}` → Gesamtzahl der Begriffe (Laufzeit). */
    descriptionTemplate:
      "KI-Begriffe verständlich erklärt: {total} Definitionen von Agent über LLM bis Zero-Shot Learning — kompakt und praxisnah für Entscheider im Mittelstand.",
    canonical: "/ki-glossar",
  } satisfies GlossarySEO,

  /** Hero-Bereich (Aurora). */
  hero: {
    headline: "KI Glossar.",
    /** `{total}` → Gesamtzahl der Begriffe (Laufzeit). */
    sublineTemplate:
      "Die {total} wichtigsten Begriffe rund um Künstliche Intelligenz — verständlich erklärt für Entscheider.",
  },

  /** Sticky-Toolbar: Suche + Alphabet-Navigation. */
  toolbar: {
    searchPlaceholder: "Begriff suchen …",
    searchAriaLabel: "Glossar durchsuchen",
    /** Dekoratives Such-Symbol (Glyphe). */
    searchGlyph: "⌕",
    /** `{letter}` → Buchstabe (Laufzeit). */
    letterAriaTemplate: "Zu Buchstabe {letter} springen",
  },

  /** Beschriftung der Begriffsanzahl je Buchstabe. */
  countLabel: {
    singular: "Begriff",
    plural: "Begriffe",
  },

  /** Leerzustand bei erfolgloser Suche. `{query}` → Suchbegriff. */
  emptyTemplate: "Keine Begriffe gefunden für „{query}“.",

  /** Abschluss-CTA. */
  cta: {
    heading: "Von Begriffen zur KI-Abteilung.",
    body: "Wir übersetzen diese Begriffe in Systeme, die Ihr Unternehmen wirklich besitzt.",
    button: "Gespräch buchen",
  },

  /** Kontakt-Link (Hero/Nav-Kontakt + Abschluss-CTA). */
  calendlyUrl: "/kontakt",

  /**
   * Vollständiges Begriffsverzeichnis, gruppiert nach Anfangsbuchstabe.
   * KI-Glossar — die wichtigsten Begriffe rund um Künstliche Intelligenz.
   */
  glossary: {
    A: [
      { term: "Agent", def: "Ein autonomes System, das Entscheidungen trifft und Aktionen ausführt, um bestimmte Ziele zu erreichen. Beispiel: Chatbots oder autonome Fahrzeuge." },
      { term: "Agentic Workflow", def: "Ein Prozess, bei dem Agenten Aufgaben sequenziell oder parallel ausführen, oft mit eigenen Entscheidungslogiken." },
      { term: "Algorithmus", def: "Eine Reihe von Anweisungen, die ein Computer ausführt, um ein Problem zu lösen." },
      { term: "Annotation", def: "Das Versehen von Daten mit Labels oder Metadaten, damit Modelle daraus lernen können." },
      { term: "API", def: "Programmierschnittstelle, über die Software-Systeme miteinander kommunizieren — die Basis, um KI-Modelle in bestehende Anwendungen einzubinden." },
      { term: "Artificial General Intelligence (AGI)", def: "Eine Form von KI, die menschenähnliches Denken über unterschiedliche Kontexte hinweg nachahmt." },
      { term: "Artificial Narrow Intelligence (ANI)", def: "KI, die auf spezifische Aufgaben spezialisiert ist, wie Bilderkennung oder Sprachverarbeitung." },
      { term: "Attention-Mechanismus", def: "Verfahren in neuronalen Netzen, das wichtige Teile einer Eingabe stärker gewichtet — das Herzstück moderner Transformer-Modelle." },
      { term: "AutoML", def: "Automatisierung des Modell-Entwicklungsprozesses, von der Datenaufbereitung bis zur Modellauswahl." },
    ],
    B: [
      { term: "Backpropagation", def: "Ein Algorithmus zum Trainieren neuronaler Netze, der Fehler rückwärts durch das Netzwerk propagiert." },
      { term: "Benchmark", def: "Standardisierter Test, mit dem die Leistung von KI-Modellen vergleichbar gemessen wird." },
      { term: "Bias (Verzerrung)", def: "Systematische Fehler in Daten oder Algorithmen, die zu unfairen Ergebnissen führen können." },
      { term: "Big Data", def: "Große, komplexe Datensätze, die mit traditionellen Methoden schwer zu verarbeiten sind." },
    ],
    C: [
      { term: "Chatbot", def: "Ein KI-gestütztes Programm, das menschliche Konversation simuliert." },
      { term: "Clustering", def: "Unüberwachtes Verfahren, das ähnliche Datenpunkte automatisch in Gruppen einteilt." },
      { term: "Computer Vision", def: "Ein Teilgebiet der KI, das Maschinen beibringt, visuelle Informationen zu verstehen und zu interpretieren." },
      { term: "Context Window (Kontextfenster)", def: "Die maximale Menge an Text, die ein Sprachmodell gleichzeitig verarbeiten kann." },
      { term: "Convolutional Neural Network (CNN)", def: "Neuronales Netz, das besonders gut Muster in Bildern erkennt — etwa zur Objekterkennung." },
      { term: "Corpus", def: "Eine Sammlung von Texten, die für das Training von KI-Modellen verwendet wird." },
    ],
    D: [
      { term: "Data Augmentation", def: "Künstliches Erweitern eines Datensatzes durch Variationen, um Modelle robuster zu machen." },
      { term: "Dataset (Datensatz)", def: "Eine Sammlung von Daten für Training und Test von KI-Modellen." },
      { term: "Deep Learning", def: "Eine Unterkategorie des maschinellen Lernens, die auf tiefen neuronalen Netzwerken basiert." },
      { term: "Diffusion Model", def: "Generatives Modell, das aus Rauschen schrittweise Bilder erzeugt — Grundlage von Tools wie Midjourney." },
      { term: "Domain Adaptation", def: "Die Fähigkeit eines Modells, von einer Domäne (z. B. Bildern) auf eine andere zu generalisieren." },
    ],
    E: [
      { term: "Edge Computing", def: "Verarbeitung von Daten an dezentralen Standorten, nahe am Ort ihrer Entstehung." },
      { term: "Embedding", def: "Wandelt Daten wie Wörter oder Bilder in Vektoren um, mit denen Maschinen rechnen können." },
      { term: "Ensemble Learning", def: "Kombination mehrerer Modelle, um genauere und stabilere Vorhersagen zu erzielen." },
      { term: "Epoch (Epoche)", def: "Ein vollständiger Durchlauf des gesamten Trainingsdatensatzes während des Trainings." },
      { term: "Explainable AI (XAI)", def: "Ansätze, um die Entscheidungen von KI-Modellen nachvollziehbar und transparent zu machen." },
    ],
    F: [
      { term: "F1-Score", def: "Kennzahl, die Präzision und Trefferquote eines Modells in einem Wert zusammenfasst." },
      { term: "Feature Engineering", def: "Der Prozess, relevante Merkmale aus Rohdaten zu extrahieren." },
      { term: "Federated Learning", def: "Training über viele dezentrale Geräte hinweg, ohne dass die Rohdaten zentral zusammengeführt werden." },
      { term: "Few-Shot Learning", def: "Ein Lernparadigma, bei dem Modelle mit nur wenigen Beispielen trainiert werden." },
      { term: "Fine-Tuning", def: "Der Prozess, ein vortrainiertes Modell an eine spezifische Aufgabe anzupassen." },
      { term: "Foundation Model", def: "Großes, breit vortrainiertes Basismodell, das für viele Aufgaben angepasst werden kann, z. B. GPT." },
    ],
    G: [
      { term: "Generative AI", def: "KI, die neue Inhalte wie Texte, Bilder oder Videos erstellt — etwa durch GANs oder Diffusionsmodelle." },
      { term: "Generative Adversarial Network (GAN)", def: "Zwei konkurrierende neuronale Netze, die gemeinsam realistische Inhalte erzeugen." },
      { term: "GPT", def: "Generative Pretrained Transformer — eine Familie großer Sprachmodelle, die Texte erzeugen und verstehen." },
      { term: "Gradient Descent", def: "Ein Optimierungsalgorithmus, der die Parameter eines Modells schrittweise anpasst." },
      { term: "Graph Neural Networks (GNN)", def: "Ein neuronales Netz, das mit Graphenstrukturen arbeitet." },
      { term: "Guardrails", def: "Schutzmechanismen, die das Verhalten einer KI begrenzen, um Fehler und Missbrauch zu verhindern." },
    ],
    H: [
      { term: "Halluzination", def: "Wenn ein KI-Modell überzeugend klingende, aber faktisch falsche Inhalte erzeugt." },
      { term: "Human-in-the-Loop (HITL)", def: "Ein Ansatz, bei dem menschliche Eingaben in den KI-Prozess integriert werden." },
      { term: "Hybrid AI", def: "Kombination verschiedener KI-Technologien wie symbolischer KI und maschinellem Lernen." },
      { term: "Hyperparameter", def: "Parameter, die den Lernprozess eines Modells steuern und nicht durch das Training selbst gelernt werden." },
    ],
    I: [
      { term: "Inference (Schlussfolgerung)", def: "Der Prozess, bei dem ein trainiertes KI-Modell Vorhersagen oder Entscheidungen trifft." },
      { term: "Intelligent Agent", def: "Ein System, das autonom agieren kann, um Ziele zu erreichen." },
      { term: "Interpretability", def: "Die Fähigkeit, ein Modell und seine Vorhersagen zu erklären." },
    ],
    J: [
      { term: "Joint Embedding", def: "Ein Ansatz, bei dem verschiedene Datenmodalitäten in denselben Raum eingebettet werden." },
    ],
    K: [
      { term: "Knowledge Distillation", def: "Übertragung des Wissens eines großen Modells auf ein kleineres, effizienteres Modell." },
      { term: "Knowledge Graph", def: "Eine Datenstruktur, die Wissen durch Entitäten und deren Beziehungen darstellt." },
    ],
    L: [
      { term: "Language Model", def: "Ein Modell, das darauf trainiert ist, Texte zu generieren oder zu analysieren, z. B. GPT." },
      { term: "Large Language Model (LLM)", def: "Ein auf riesigen Textmengen trainiertes Modell, das Sprache versteht und erzeugt." },
      { term: "Latent Space", def: "Ein multidimensionaler Raum, in dem Daten durch Abstraktionen dargestellt werden." },
      { term: "LoRA (Low-Rank Adaptation)", def: "Effiziente Methode, große Modelle mit wenig Rechenaufwand an neue Aufgaben anzupassen." },
      { term: "Loss Function", def: "Eine Funktion, die die Fehler eines Modells misst." },
    ],
    M: [
      { term: "Machine Learning (ML)", def: "Ein Teilgebiet der KI, das es Maschinen ermöglicht, aus Daten zu lernen." },
      { term: "Meta-Learning", def: "Ein Lernansatz, bei dem Modelle lernen, wie sie lernen können." },
      { term: "MLOps", def: "Praktiken und Werkzeuge, um KI-Modelle zuverlässig in Produktion zu bringen und zu betreiben." },
      { term: "Model Drift", def: "Wenn ein Modell mit der Zeit an Genauigkeit verliert, weil sich die zugrunde liegenden Daten ändern." },
      { term: "Multi-Agent System", def: "Mehrere KI-Agenten, die zusammenarbeiten oder verhandeln, um komplexe Aufgaben zu lösen." },
      { term: "Multimodal AI", def: "KI, die mehrere Datenarten gleichzeitig verarbeitet — z. B. Text, Bild und Audio." },
    ],
    N: [
      { term: "Named Entity Recognition (NER)", def: "Verfahren, das in Texten automatisch Namen, Orte, Organisationen und andere Entitäten erkennt." },
      { term: "Natural Language Processing (NLP)", def: "Die Verarbeitung und Analyse natürlicher Sprache durch Maschinen." },
      { term: "Neural Network (Neuronales Netz)", def: "Ein Modell, das von der Struktur des menschlichen Gehirns inspiriert ist." },
    ],
    O: [
      { term: "Optimization (Optimierung)", def: "Der Prozess, ein Modell so anzupassen, dass es besser wird." },
      { term: "Overfitting", def: "Wenn ein Modell zu sehr an den Trainingsdaten hängt und schlecht auf neue Daten generalisiert." },
    ],
    P: [
      { term: "Parameter", def: "Die intern gelernten Werte eines Modells — moderne Sprachmodelle haben Milliarden davon." },
      { term: "Precision (Präzision)", def: "Anteil der korrekten Treffer unter allen positiven Vorhersagen eines Modells." },
      { term: "Pretraining", def: "Der Prozess, ein Modell mit großen Datenmengen auf allgemeinen Aufgaben vorzutrainieren." },
      { term: "Probabilistic AI", def: "KI, die Unsicherheiten in ihre Entscheidungen einbezieht." },
      { term: "Prompt", def: "Ein Input, der eine KI wie GPT zu einer bestimmten Aktion oder Antwort anleitet." },
      { term: "Prompt Engineering", def: "Die gezielte Gestaltung von Eingaben, um aus einem KI-Modell bessere Ergebnisse zu holen." },
    ],
    Q: [
      { term: "Quantization (Quantisierung)", def: "Verkleinerung eines Modells durch gröbere Zahlendarstellung — spart Speicher und Rechenleistung." },
      { term: "Quantum Computing", def: "Ein auf Quantenphysik basierender Ansatz, der das Potenzial hat, KI zu beschleunigen." },
    ],
    R: [
      { term: "RAG (Retrieval-Augmented Generation)", def: "Eine Methode, bei der externe Datenquellen genutzt werden, um KI-Antworten zu verbessern." },
      { term: "Recurrent Neural Network (RNN)", def: "Neuronales Netz für sequenzielle Daten wie Text oder Zeitreihen." },
      { term: "Reinforcement Learning", def: "Ein Lernansatz, bei dem ein Agent durch Belohnungen und Strafen trainiert wird." },
      { term: "RLHF", def: "Training von Modellen anhand menschlicher Bewertungen, um Antworten hilfreicher und sicherer zu machen." },
      { term: "Robustness", def: "Die Fähigkeit eines Modells, unter verschiedenen Bedingungen stabil zu bleiben." },
    ],
    S: [
      { term: "Self-Supervised Learning", def: "Ein Lernparadigma, bei dem Modelle ohne explizite Labels trainiert werden." },
      { term: "Semantic Search", def: "Eine Suche, die den Bedeutungsgehalt von Texten versteht statt nur Stichwörter abzugleichen." },
      { term: "Sentiment Analysis", def: "Automatische Erkennung der Stimmung oder Meinung in einem Text." },
      { term: "Speech Recognition", def: "Umwandlung gesprochener Sprache in Text." },
      { term: "Supervised Learning", def: "Ein Lernansatz, bei dem Modelle mit gelabelten Daten trainiert werden." },
      { term: "Synthetic Data", def: "Künstlich erzeugte Daten, die echte Daten ersetzen oder ergänzen — etwa aus Datenschutzgründen." },
    ],
    T: [
      { term: "Temperature", def: "Einstellung, die steuert, wie kreativ oder vorhersehbar die Ausgaben eines Sprachmodells sind." },
      { term: "Tokenization (Tokenisierung)", def: "Zerlegung von Text in kleinere Einheiten (Tokens), die ein Modell verarbeiten kann." },
      { term: "Training Data (Trainingsdaten)", def: "Die Daten, aus denen ein Modell lernt — ihre Qualität bestimmt maßgeblich die Modellgüte." },
      { term: "Transfer Learning", def: "Der Prozess, Wissen von einem Modell auf eine neue Aufgabe zu übertragen." },
      { term: "Transformer", def: "Eine neuronale Netzarchitektur, die für Sprachverarbeitung optimiert ist und moderne LLMs antreibt." },
    ],
    U: [
      { term: "Underfitting", def: "Wenn ein Modell zu einfach ist und schon die Trainingsdaten schlecht abbildet." },
      { term: "Unsupervised Learning", def: "Ein Lernansatz, bei dem Modelle ohne gelabelte Daten trainiert werden." },
      { term: "Utility Function", def: "Eine Funktion, die den Erfolg oder Nutzen eines Modells bewertet." },
    ],
    V: [
      { term: "Vectorization", def: "Der Prozess, Daten in numerische Vektoren umzuwandeln." },
      { term: "Vector Database (Vektordatenbank)", def: "Datenbank, die Embeddings speichert und blitzschnell ähnliche Inhalte findet — Basis für RAG." },
      { term: "Vision-Language Models", def: "Modelle, die Text- und Bilddaten gleichzeitig verarbeiten." },
    ],
    W: [
      { term: "Weight (Gewicht)", def: "Ein Parameter in einem neuronalen Netz, der während des Trainings angepasst wird." },
      { term: "Word Embedding", def: "Darstellung von Wörtern als Vektoren, sodass ähnliche Bedeutungen nah beieinanderliegen." },
    ],
    X: [
      { term: "XAI (Explainable AI)", def: "Sammelbegriff für Methoden, die KI-Entscheidungen für Menschen nachvollziehbar machen." },
    ],
    Y: [
      { term: "YOLO (You Only Look Once)", def: "Ein schnelles Verfahren zur Echtzeit-Objekterkennung in Bildern und Videos." },
    ],
    Z: [
      { term: "Zero-Shot Learning", def: "Ein Ansatz, bei dem ein Modell Aufgaben löst, die es nie explizit trainiert hat." },
    ],
  } satisfies GlossaryByLetter,
} as const;
