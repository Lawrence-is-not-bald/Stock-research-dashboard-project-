const companies = [
  {
    name: "Apple",
    ticker: "AAPL",
    file: "data/AAPL.json",
    color: "#1768d1",
    accentClass: "accent-aapl",
    summary:
      "Apple designs consumer devices, software, and services, including iPhone, Mac, iPad, Apple Watch, iCloud, and the App Store.",
  },
  {
    name: "Nvidia",
    ticker: "NVDA",
    file: "data/NVDA.json",
    color: "#087d61",
    accentClass: "accent-nvda",
    summary:
      "Nvidia designs GPUs, AI accelerators, networking products, and software used in gaming, data centers, visualization, and autonomous systems.",
  },
  {
    name: "Costco Wholesale",
    ticker: "COST",
    file: "data/COST.json",
    color: "#a46a00",
    accentClass: "accent-cost",
    summary:
      "Costco operates membership warehouses that sell groceries, merchandise, fuel, and services with a focus on high volume and low prices.",
  },
];

const companyCards = document.querySelector("#companyCards");
const companySections = document.querySelector("#companySections");
const loadStatus = document.querySelector("#loadStatus");
const dailyTabs = document.querySelector("#dailyTabs");
const dailyPanel = document.querySelector("#dailyPanel");
const ideaModal = document.querySelector("#ideaModal");
const startIdeaCoach = document.querySelector("#startIdeaCoach");
const closeIdeaModal = document.querySelector("#closeIdeaModal");
const ideaTicker = document.querySelector("#ideaTicker");
const ideaAction = document.querySelector("#ideaAction");
const ideaText = document.querySelector("#ideaText");
const reviewIdeaButton = document.querySelector("#reviewIdeaButton");
const coachResponse = document.querySelector("#coachResponse");
const responseModal = document.querySelector("#responseModal");
const closeResponseModal = document.querySelector("#closeResponseModal");
const responseModalTitle = document.querySelector("#responseModalTitle");
const responseLoading = document.querySelector("#responseLoading");
const responseBody = document.querySelector("#responseBody");
const funModeSettings = document.querySelector("#funModeSettings");
const funModeModal = document.querySelector("#funModeModal");
const enableFunMode = document.querySelector("#enableFunMode");
const disableFunMode = document.querySelector("#disableFunMode");
const punToastArea = document.querySelector("#punToastArea");
const languageSelect = document.querySelector("#languageSelect");
const emojiModeToggle = document.querySelector("#emojiModeToggle");
let dailyViewMode = "clear";
let dailySlideIndex = 0;
let currentDataByTicker = {};
let funModeEnabled = localStorage.getItem("funModeEnabled") === "true";
let emojiModeEnabled = localStorage.getItem("emojiModeEnabled") === "true";
let currentLanguage = localStorage.getItem("dashboardLanguage") || "en";
let selectedRange = localStorage.getItem("chartRange") || "1Y";
let punsShownThisSession = 0;
let lastPunTime = 0;
let responseTimer = null;
const chartAnimationFrames = new WeakMap();

const chartRanges = [
  { key: "1D", label: "1D", rows: 1 },
  { key: "5D", label: "5D", rows: 5 },
  { key: "1W", label: "1W", days: 7 },
  { key: "1M", label: "1M", months: 1 },
  { key: "6M", label: "6M", months: 6 },
  { key: "1Y", label: "1Y", years: 1 },
  { key: "5Y", label: "5Y", years: 5 },
  { key: "MAX", label: "Max" },
];

const stockPuns = [
  "This chart is trying to make a good impression. Very bullish behavior.",
  "Nice click. Your research portfolio just gained one curiosity point.",
  "That tab opened faster than a market headline on earnings day.",
  "This dashboard keeps its gains in knowledge, which is the least taxable kind.",
  "A thoughtful note now can save a confused trade later.",
  "The data dressed up today. It brought metrics and everything.",
  "Tiny reminder: good research compounds too.",
  "That was a clean move. The interface approves calmly.",
];

const translations = {
  en: {},
  zh: {
    "Local JSON stock project": "本地 JSON 股票项目",
    "Stock Research Dashboard": "股票研究仪表板",
    "A beginner-friendly webpage that reads local EODHD price files for Apple, Nvidia, and Costco, then turns daily close prices into research cards, charts, metric boxes, and personal notes.": "一个适合初学者的网页，会读取 Apple、Nvidia 和 Costco 的本地 EODHD 价格文件，并把每日收盘价变成研究卡片、图表、指标框和个人笔记。",
    "Language": "语言",
    "Chart Range": "图表范围",
    "Choose how much price history the charts should show.": "选择图表要显示多少价格历史。",
    "Explore stocks": "浏览股票",
    "End-of-day review": "收盘后回顾",
    "Open idea coach": "打开想法助手",
    "Fun mode": "趣味模式",
    "Emoji hints": "表情提示",
    "Emoji hints on": "表情提示：开",
    "Emoji hints off": "表情提示：关",
    "Stock Navigator": "股票导航",
    "Choose a company, jump to its research section, or open its daily review.": "选择一家公司，跳到研究区，或打开每日回顾。",
    "Company Cards": "公司卡片",
    "Loading local price data...": "正在加载本地价格数据...",
    "Company Research Sections": "公司研究区",
    "Each section uses the same local JSON file as its chart and table source.": "每个区块都使用同一个本地 JSON 文件作为图表和表格来源。",
    "End-of-Day Market Review": "收盘后市场回顾",
    "Use the tabs to see the exact latest trading-day move for one stock.": "使用标签查看某只股票最新交易日的具体变化。",
    "Idea coach": "想法助手",
    "Review my stock idea": "审查我的股票想法",
    "Stock": "股票",
    "My idea": "我的想法",
    "I am thinking about holding": "我在考虑持有",
    "I am thinking about buying": "我在考虑买入",
    "I am thinking about selling": "我在考虑卖出",
    "Explain your thinking": "说明你的想法",
    "Example: I think Nvidia is dropping today, but I still like its long-term AI business. Should I wait?": "例子：我觉得 Nvidia 今天下跌，但我仍看好它的长期 AI 业务。我应该等待吗？",
    "Review idea": "审查想法",
    "Ready when you are.": "准备好了就开始。",
    "Write your idea, choose the stock, then press Review idea.": "写下你的想法，选择股票，然后点击审查想法。",
    "Tiny dashboard personality": "一点点仪表板个性",
    "Turn on stock puns?": "开启股票双关笑话？",
    "Add a controlled amount of small popups, light jokes, and investing puns while you click around.": "点击浏览时加入少量可控的小弹窗、轻松笑话和投资双关语。",
    "Sample:": "示例：",
    "This chart is trying to make a good impression. Very bullish behavior.": "这张图表想留下好印象。非常看涨的行为。",
    "Keep it serious": "保持严肃",
    "Add a little fun": "加一点趣味",
    "Latest close": "最新收盘价",
    "Day move": "当日变化",
    "Market cap": "市值",
    "P/E ratio": "市盈率",
    "Research section": "研究区",
    "Daily review": "每日回顾",
    "Revenue": "收入",
    "Net income": "净利润",
    "Quick summary": "快速总结",
    "AI explanation": "AI 解释",
    "AI buy/sell check": "AI 买/卖检查",
    "Educational signal, not personal financial advice.": "教育性信号，不是个人财务建议。",
    "User ideas": "用户想法",
    "Verify with ChatGPT": "用 ChatGPT 验证",
    "Write your ideas here.": "在这里写下你的想法。",
    "One question I still have": "我还有一个问题",
    "Write one question here.": "在这里写一个问题。",
    "Range high close": "范围最高收盘价",
    "Range low close": "范围最低收盘价",
    "Clear View": "清晰视图",
    "Slideshow Review": "幻灯片回顾",
    "Previous close": "前一收盘价",
    "Daily change": "每日变化",
    "Volume": "成交量",
    "ChatGPT-style buy/sell review": "ChatGPT 风格买/卖回顾",
    "Back": "返回",
    "Next": "下一步",
    "Fun mode is on. Small puns, controlled dosage.": "趣味模式已开启。少量笑话，剂量可控。",
    "Loaded AAPL, NVDA, and COST from local JSON files.": "已从本地 JSON 文件加载 AAPL、NVDA 和 COST。",
    "Loaded AAPL, NVDA, and COST. Last refreshed:": "已加载 AAPL、NVDA 和 COST。最后刷新：",
    "Slide": "幻灯片",
    "of": "共",
  },
  la: {
    "Local JSON stock project": "Proiectum locale JSON de mercatu",
    "Stock Research Dashboard": "Tabula Investigationis Actionum",
    "Language": "Lingua",
    "Chart Range": "Spatium chartae",
    "Choose how much price history the charts should show.": "Elige quantum historiae pretiorum charta ostendat.",
    "Explore stocks": "Actiones explorare",
    "End-of-day review": "Recensio finis diei",
    "Open idea coach": "Consiliarium idearum aperire",
    "Fun mode": "Modus iocosus",
    "Emoji hints": "Signa emoji",
    "Emoji hints on": "Emoji adsunt",
    "Emoji hints off": "Emoji absunt",
    "Stock Navigator": "Navigator actionum",
    "Company Cards": "Chartae societatum",
    "Loading local price data...": "Pretia localia onerantur...",
    "Company Research Sections": "Sectiones investigationis",
    "End-of-Day Market Review": "Recensio mercatus in fine diei",
    "Idea coach": "Consiliarius idearum",
    "Review my stock idea": "Recense ideam meam",
    "Stock": "Actio",
    "My idea": "Idea mea",
    "I am thinking about holding": "Cogito tenere",
    "I am thinking about buying": "Cogito emere",
    "I am thinking about selling": "Cogito vendere",
    "Explain your thinking": "Explica consilium tuum",
    "Review idea": "Recense ideam",
    "Ready when you are.": "Paratus sum.",
    "Tiny dashboard personality": "Parva persona tabulae",
    "Turn on stock puns?": "Iocos mercatus accendere?",
    "Sample:": "Exemplum:",
    "Keep it serious": "Serium serva",
    "Add a little fun": "Adde paulum ioci",
    "Latest close": "Clausura novissima",
    "Day move": "Motus diei",
    "Market cap": "Valor mercatus",
    "P/E ratio": "Ratio P/E",
    "Research section": "Sectio investigationis",
    "Daily review": "Recensio cotidiana",
    "Revenue": "Reditus",
    "Net income": "Lucrum netum",
    "Quick summary": "Summarium breve",
    "AI explanation": "Explicatio AI",
    "AI buy/sell check": "Probatio emendi/vendendi AI",
    "Educational signal, not personal financial advice.": "Signum scholasticum, non consilium pecuniarium personale.",
    "User ideas": "Ideae usoris",
    "Verify with ChatGPT": "Verifica cum ChatGPT",
    "One question I still have": "Una quaestio restat",
    "Range high close": "Clausura maxima spatii",
    "Range low close": "Clausura minima spatii",
    "Clear View": "Visus clarus",
    "Slideshow Review": "Recensio per imagines",
    "Previous close": "Clausura prior",
    "Daily change": "Mutatio diei",
    "Volume": "Volumen",
    "ChatGPT-style buy/sell review": "Recensio emendi/vendendi more ChatGPT",
    "Back": "Retro",
    "Next": "Proximum",
    "Loaded AAPL, NVDA, and COST from local JSON files.": "AAPL, NVDA, COST ex fasciculis localibus JSON onerata sunt.",
    "Loaded AAPL, NVDA, and COST. Last refreshed:": "AAPL, NVDA, COST onerata sunt. Novissime renovatum:",
    "Slide": "Imago",
    "of": "ex",
  },
  ar: {
    "Local JSON stock project": "مشروع أسهم JSON محلي",
    "Stock Research Dashboard": "لوحة أبحاث الأسهم",
    "Language": "اللغة",
    "Chart Range": "نطاق الرسم",
    "Choose how much price history the charts should show.": "اختر مقدار تاريخ الأسعار الذي تعرضه الرسوم.",
    "Explore stocks": "استكشف الأسهم",
    "End-of-day review": "مراجعة نهاية اليوم",
    "Open idea coach": "افتح مساعد الأفكار",
    "Fun mode": "وضع المرح",
    "Emoji hints": "تلميحات الرموز",
    "Emoji hints on": "الرموز مفعلة",
    "Emoji hints off": "الرموز متوقفة",
    "Stock Navigator": "متصفح الأسهم",
    "Choose a company, jump to its research section, or open its daily review.": "اختر شركة، وانتقل إلى قسم البحث أو افتح مراجعتها اليومية.",
    "Company Cards": "بطاقات الشركات",
    "Loading local price data...": "جار تحميل بيانات الأسعار المحلية...",
    "Company Research Sections": "أقسام بحث الشركات",
    "Each section uses the same local JSON file as its chart and table source.": "يستخدم كل قسم ملف JSON المحلي نفسه كمصدر للرسم والجدول.",
    "End-of-Day Market Review": "مراجعة السوق في نهاية اليوم",
    "Use the tabs to see the exact latest trading-day move for one stock.": "استخدم التبويبات لرؤية حركة آخر يوم تداول لسهم واحد.",
    "Idea coach": "مساعد الأفكار",
    "Review my stock idea": "راجع فكرتي عن السهم",
    "Stock": "السهم",
    "My idea": "فكرتي",
    "I am thinking about holding": "أفكر في الاحتفاظ",
    "I am thinking about buying": "أفكر في الشراء",
    "I am thinking about selling": "أفكر في البيع",
    "Explain your thinking": "اشرح تفكيرك",
    "Review idea": "راجع الفكرة",
    "Ready when you are.": "جاهز عندما تكون جاهزاً.",
    "Write your idea, choose the stock, then press Review idea.": "اكتب فكرتك، اختر السهم، ثم اضغط مراجعة الفكرة.",
    "Tiny dashboard personality": "لمسة شخصية صغيرة",
    "Turn on stock puns?": "تشغيل نكات الأسهم؟",
    "Add a controlled amount of small popups, light jokes, and investing puns while you click around.": "أضف كمية محدودة من النوافذ الصغيرة والنكات الخفيفة أثناء التصفح.",
    "Sample:": "مثال:",
    "Keep it serious": "ابقه جاداً",
    "Add a little fun": "أضف بعض المرح",
    "Latest close": "آخر إغلاق",
    "Day move": "حركة اليوم",
    "Market cap": "القيمة السوقية",
    "P/E ratio": "نسبة السعر إلى الربح",
    "Research section": "قسم البحث",
    "Daily review": "المراجعة اليومية",
    "Revenue": "الإيرادات",
    "Net income": "صافي الدخل",
    "Quick summary": "ملخص سريع",
    "AI explanation": "شرح الذكاء الاصطناعي",
    "AI buy/sell check": "فحص شراء/بيع بالذكاء الاصطناعي",
    "Educational signal, not personal financial advice.": "إشارة تعليمية وليست نصيحة مالية شخصية.",
    "User ideas": "أفكار المستخدم",
    "Verify with ChatGPT": "تحقق باستخدام ChatGPT",
    "Write your ideas here.": "اكتب أفكارك هنا.",
    "One question I still have": "سؤال ما زال لدي",
    "Write one question here.": "اكتب سؤالاً هنا.",
    "Range high close": "أعلى إغلاق في النطاق",
    "Range low close": "أدنى إغلاق في النطاق",
    "Clear View": "عرض واضح",
    "Slideshow Review": "مراجعة بالشرائح",
    "Previous close": "الإغلاق السابق",
    "Daily change": "التغير اليومي",
    "Volume": "الحجم",
    "ChatGPT-style buy/sell review": "مراجعة شراء/بيع بأسلوب ChatGPT",
    "Back": "السابق",
    "Next": "التالي",
    "Fun mode is on. Small puns, controlled dosage.": "تم تشغيل وضع المرح. نكات قليلة وبجرعة مضبوطة.",
    "Loaded AAPL, NVDA, and COST from local JSON files.": "تم تحميل AAPL و NVDA و COST من ملفات JSON المحلية.",
    "Loaded AAPL, NVDA, and COST. Last refreshed:": "تم تحميل AAPL و NVDA و COST. آخر تحديث:",
    "Slide": "شريحة",
    "of": "من",
  },
  es: {
    "Local JSON stock project": "Proyecto local de acciones con JSON",
    "Stock Research Dashboard": "Panel de investigación de acciones",
    "Language": "Idioma",
    "Chart Range": "Rango del gráfico",
    "Choose how much price history the charts should show.": "Elige cuánta historia de precios deben mostrar los gráficos.",
    "Explore stocks": "Explorar acciones",
    "End-of-day review": "Revisión de cierre",
    "Open idea coach": "Abrir asesor de ideas",
    "Fun mode": "Modo divertido",
    "Emoji hints": "Pistas emoji",
    "Emoji hints on": "Emojis activados",
    "Emoji hints off": "Emojis desactivados",
    "Stock Navigator": "Navegador de acciones",
    "Choose a company, jump to its research section, or open its daily review.": "Elige una empresa, salta a su sección de investigación o abre su revisión diaria.",
    "Company Cards": "Tarjetas de empresas",
    "Loading local price data...": "Cargando datos locales de precios...",
    "Company Research Sections": "Secciones de investigación",
    "Each section uses the same local JSON file as its chart and table source.": "Cada sección usa el mismo archivo JSON local como fuente del gráfico y la tabla.",
    "End-of-Day Market Review": "Revisión del mercado al cierre",
    "Use the tabs to see the exact latest trading-day move for one stock.": "Usa las pestañas para ver el movimiento exacto del último día de una acción.",
    "Idea coach": "Asesor de ideas",
    "Review my stock idea": "Revisar mi idea de acción",
    "Stock": "Acción",
    "My idea": "Mi idea",
    "I am thinking about holding": "Estoy pensando en mantener",
    "I am thinking about buying": "Estoy pensando en comprar",
    "I am thinking about selling": "Estoy pensando en vender",
    "Explain your thinking": "Explica tu razonamiento",
    "Review idea": "Revisar idea",
    "Ready when you are.": "Listo cuando tú lo estés.",
    "Write your idea, choose the stock, then press Review idea.": "Escribe tu idea, elige la acción y pulsa Revisar idea.",
    "Tiny dashboard personality": "Un poco de personalidad",
    "Turn on stock puns?": "¿Activar chistes de acciones?",
    "Add a controlled amount of small popups, light jokes, and investing puns while you click around.": "Añade una cantidad controlada de ventanas pequeñas, bromas ligeras y juegos de palabras mientras navegas.",
    "Sample:": "Ejemplo:",
    "Keep it serious": "Mantenerlo serio",
    "Add a little fun": "Añadir diversión",
    "Latest close": "Último cierre",
    "Day move": "Movimiento diario",
    "Market cap": "Capitalización",
    "P/E ratio": "Ratio P/E",
    "Research section": "Sección de investigación",
    "Daily review": "Revisión diaria",
    "Revenue": "Ingresos",
    "Net income": "Beneficio neto",
    "Quick summary": "Resumen rápido",
    "AI explanation": "Explicación de IA",
    "AI buy/sell check": "Chequeo comprar/vender de IA",
    "Educational signal, not personal financial advice.": "Señal educativa, no consejo financiero personal.",
    "User ideas": "Ideas del usuario",
    "Verify with ChatGPT": "Verificar con ChatGPT",
    "Write your ideas here.": "Escribe tus ideas aquí.",
    "One question I still have": "Una pregunta que aún tengo",
    "Write one question here.": "Escribe una pregunta aquí.",
    "Range high close": "Máximo cierre del rango",
    "Range low close": "Mínimo cierre del rango",
    "Clear View": "Vista clara",
    "Slideshow Review": "Revisión en diapositivas",
    "Previous close": "Cierre anterior",
    "Daily change": "Cambio diario",
    "Volume": "Volumen",
    "ChatGPT-style buy/sell review": "Revisión comprar/vender estilo ChatGPT",
    "Back": "Atrás",
    "Next": "Siguiente",
    "Fun mode is on. Small puns, controlled dosage.": "Modo divertido activado. Bromas pequeñas, dosis controlada.",
    "Loaded AAPL, NVDA, and COST from local JSON files.": "AAPL, NVDA y COST cargados desde archivos JSON locales.",
    "Loaded AAPL, NVDA, and COST. Last refreshed:": "AAPL, NVDA y COST cargados. Última actualización:",
    "Slide": "Diapositiva",
    "of": "de",
  },
  fr: {
    "Local JSON stock project": "Projet boursier JSON local",
    "Stock Research Dashboard": "Tableau de recherche boursière",
    "Language": "Langue",
    "Chart Range": "Période du graphique",
    "Choose how much price history the charts should show.": "Choisissez la quantité d'historique de prix à afficher.",
    "Explore stocks": "Explorer les actions",
    "End-of-day review": "Revue de fin de journée",
    "Open idea coach": "Ouvrir le coach d'idées",
    "Fun mode": "Mode amusant",
    "Emoji hints": "Indices emoji",
    "Emoji hints on": "Emojis activés",
    "Emoji hints off": "Emojis désactivés",
    "Stock Navigator": "Navigateur d'actions",
    "Company Cards": "Cartes des entreprises",
    "Loading local price data...": "Chargement des données locales...",
    "Company Research Sections": "Sections de recherche",
    "End-of-Day Market Review": "Revue du marché en fin de journée",
    "Idea coach": "Coach d'idées",
    "Review my stock idea": "Analyser mon idée d'action",
    "Stock": "Action",
    "My idea": "Mon idée",
    "I am thinking about holding": "Je pense conserver",
    "I am thinking about buying": "Je pense acheter",
    "I am thinking about selling": "Je pense vendre",
    "Explain your thinking": "Explique ton raisonnement",
    "Review idea": "Analyser l'idée",
    "Ready when you are.": "Prêt quand tu l'es.",
    "Tiny dashboard personality": "Petite touche de personnalité",
    "Turn on stock puns?": "Activer les jeux de mots boursiers ?",
    "Sample:": "Exemple :",
    "Keep it serious": "Rester sérieux",
    "Add a little fun": "Ajouter un peu d'humour",
    "Latest close": "Dernière clôture",
    "Day move": "Mouvement du jour",
    "Market cap": "Capitalisation",
    "P/E ratio": "Ratio cours/bénéfice",
    "Research section": "Section recherche",
    "Daily review": "Revue quotidienne",
    "Revenue": "Chiffre d'affaires",
    "Net income": "Résultat net",
    "Quick summary": "Résumé rapide",
    "AI explanation": "Explication IA",
    "AI buy/sell check": "Vérification achat/vente IA",
    "Educational signal, not personal financial advice.": "Signal éducatif, pas un conseil financier personnel.",
    "User ideas": "Idées utilisateur",
    "Verify with ChatGPT": "Vérifier avec ChatGPT",
    "One question I still have": "Une question restante",
    "Clear View": "Vue claire",
    "Slideshow Review": "Revue en diapositives",
    "Previous close": "Clôture précédente",
    "Daily change": "Variation du jour",
    "Volume": "Volume",
    "ChatGPT-style buy/sell review": "Revue achat/vente style ChatGPT",
    "Back": "Retour",
    "Next": "Suivant",
    "Loaded AAPL, NVDA, and COST from local JSON files.": "AAPL, NVDA et COST chargés depuis les fichiers JSON locaux.",
    "Loaded AAPL, NVDA, and COST. Last refreshed:": "AAPL, NVDA et COST chargés. Dernière mise à jour :",
    "Slide": "Diapositive",
    "of": "sur",
  },
  hi: {
    "Local JSON stock project": "स्थानीय JSON स्टॉक प्रोजेक्ट",
    "Stock Research Dashboard": "स्टॉक रिसर्च डैशबोर्ड",
    "Language": "भाषा",
    "Chart Range": "चार्ट सीमा",
    "Choose how much price history the charts should show.": "चुनें कि चार्ट कितना मूल्य इतिहास दिखाएं।",
    "Explore stocks": "स्टॉक देखें",
    "End-of-day review": "दिन के अंत की समीक्षा",
    "Open idea coach": "आइडिया कोच खोलें",
    "Fun mode": "मज़ेदार मोड",
    "Emoji hints": "इमोजी संकेत",
    "Emoji hints on": "इमोजी चालू",
    "Emoji hints off": "इमोजी बंद",
    "Stock Navigator": "स्टॉक नेविगेटर",
    "Company Cards": "कंपनी कार्ड",
    "Loading local price data...": "स्थानीय मूल्य डेटा लोड हो रहा है...",
    "Company Research Sections": "कंपनी रिसर्च सेक्शन",
    "End-of-Day Market Review": "दिन के अंत की मार्केट समीक्षा",
    "Idea coach": "आइडिया कोच",
    "Review my stock idea": "मेरे स्टॉक विचार की समीक्षा करें",
    "Stock": "स्टॉक",
    "My idea": "मेरा विचार",
    "I am thinking about holding": "मैं होल्ड करने के बारे में सोच रहा हूँ",
    "I am thinking about buying": "मैं खरीदने के बारे में सोच रहा हूँ",
    "I am thinking about selling": "मैं बेचने के बारे में सोच रहा हूँ",
    "Explain your thinking": "अपनी सोच समझाएँ",
    "Review idea": "विचार की समीक्षा करें",
    "Ready when you are.": "जब आप तैयार हों, मैं तैयार हूँ।",
    "Keep it serious": "गंभीर रखें",
    "Add a little fun": "थोड़ा मज़ा जोड़ें",
    "Latest close": "नवीनतम बंद भाव",
    "Day move": "दिन की चाल",
    "Market cap": "मार्केट कैप",
    "P/E ratio": "P/E अनुपात",
    "Research section": "रिसर्च सेक्शन",
    "Daily review": "दैनिक समीक्षा",
    "Revenue": "राजस्व",
    "Net income": "शुद्ध आय",
    "Quick summary": "त्वरित सारांश",
    "AI explanation": "AI व्याख्या",
    "User ideas": "उपयोगकर्ता विचार",
    "Verify with ChatGPT": "ChatGPT से जांचें",
    "One question I still have": "मेरा एक सवाल अभी बाकी है",
    "Clear View": "स्पष्ट दृश्य",
    "Slideshow Review": "स्लाइडशो समीक्षा",
    "Previous close": "पिछला बंद भाव",
    "Daily change": "दैनिक बदलाव",
    "Volume": "वॉल्यूम",
    "Back": "पीछे",
    "Next": "आगे",
    "Loaded AAPL, NVDA, and COST from local JSON files.": "AAPL, NVDA और COST स्थानीय JSON फ़ाइलों से लोड हो गए।",
    "Loaded AAPL, NVDA, and COST. Last refreshed:": "AAPL, NVDA और COST लोड हो गए। अंतिम अपडेट:",
    "Slide": "स्लाइड",
    "of": "में से",
  },
};

function t(key) {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

function withEmoji(type, text) {
  if (!emojiModeEnabled) {
    return text;
  }

  const emojis = {
    summary: "📌",
    chart: "📈",
    ai: "🧠",
    question: "❓",
    daily: "🌙",
    idea: "💡",
    fun: "✨",
  };

  return `<span class="context-emoji" aria-hidden="true">${emojis[type] || "•"}</span>${text}`;
}

function updateEmojiButtonText() {
  emojiModeToggle.textContent = emojiModeEnabled
    ? t("Emoji hints on")
    : t("Emoji hints off");
  emojiModeToggle.classList.toggle("active", emojiModeEnabled);
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
  languageSelect.value = currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  updateEmojiButtonText();
}

function setupLanguagePicker() {
  applyLanguage();

  languageSelect.addEventListener("change", () => {
    localStorage.setItem("dashboardLanguage", languageSelect.value);
    window.location.reload();
  });
}

function getSelectedRangeOption() {
  return chartRanges.find((range) => range.key === selectedRange) || chartRanges[5];
}

function subtractRangeFromDate(date, range) {
  const cutoff = new Date(date);

  if (range.days) {
    cutoff.setDate(cutoff.getDate() - range.days);
  }

  if (range.months) {
    cutoff.setMonth(cutoff.getMonth() - range.months);
  }

  if (range.years) {
    cutoff.setFullYear(cutoff.getFullYear() - range.years);
  }

  return cutoff;
}

function getRangePrices(prices, rangeKey = selectedRange) {
  if (!prices.length) {
    return prices;
  }

  const range = chartRanges.find((item) => item.key === rangeKey) || getSelectedRangeOption();

  if (range.key === "MAX") {
    return prices;
  }

  if (range.rows) {
    return prices.slice(-range.rows);
  }

  const latestDate = new Date(prices[prices.length - 1].date);
  const cutoff = subtractRangeFromDate(latestDate, range);
  const filtered = prices.filter((row) => new Date(row.date) >= cutoff);

  return filtered.length ? filtered : prices.slice(-1);
}

function getRangedData(dataByTicker) {
  const rangedData = {};

  companies.forEach((company) => {
    rangedData[company.ticker] = getRangePrices(dataByTicker[company.ticker] || []);
  });

  return rangedData;
}

function createRangeControlsHtml() {
  return `
    <div class="range-controls" aria-label="Chart range">
      ${chartRanges
        .map(
          (range) => `
            <button class="${range.key === selectedRange ? "active" : ""}" type="button" data-chart-range="${range.key}">
              ${range.label}
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function setupRangeControls() {
  document.querySelectorAll("[data-chart-range]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRange = button.dataset.chartRange;
      localStorage.setItem("chartRange", selectedRange);

      if (Object.keys(currentDataByTicker).length) {
        renderDashboard(currentDataByTicker);
      }

      maybeShowPun();
    });
  });
}

function openResponseModal(title, buildHtml, delay = 250) {
  if (responseTimer) {
    clearTimeout(responseTimer);
  }

  responseModalTitle.textContent = title;
  responseBody.innerHTML = "";
  responseBody.classList.remove("ready");
  responseLoading.style.display = "grid";
  responseModal.classList.add("open");
  responseModal.setAttribute("aria-hidden", "false");

  responseTimer = setTimeout(() => {
    responseLoading.style.display = "none";
    responseBody.innerHTML = buildHtml();
    responseBody.classList.add("ready");
    responseTimer = null;
  }, delay);
}

function closeResponse() {
  if (responseTimer) {
    clearTimeout(responseTimer);
    responseTimer = null;
  }

  responseModal.classList.remove("open");
  responseModal.setAttribute("aria-hidden", "true");
}

function setupResponseModal() {
  closeResponseModal.addEventListener("click", closeResponse);

  responseModal.addEventListener("click", (event) => {
    if (event.target === responseModal) {
      closeResponse();
    }
  });
}

function renderDashboard(dataByTicker) {
  const rangedDataByTicker = getRangedData(dataByTicker);

  companyCards.innerHTML = companies
    .map((company) =>
      createCompanyCard(
        company,
        rangedDataByTicker[company.ticker],
        getFundamentals(company.ticker),
        getAiExplanation(company.ticker),
        getAiAction(company.ticker),
      ),
    )
    .join("");

  companySections.innerHTML = companies
    .map((company) =>
      createCompanySection(
        company,
        rangedDataByTicker[company.ticker],
        getFundamentals(company.ticker),
        getAiExplanation(company.ticker),
        getAiAction(company.ticker),
      ),
    )
    .join("");

  setupRangeControls();
  const activeTab = document.querySelector(".daily-tab.active");
  const activeTicker = activeTab ? activeTab.dataset.ticker : companies[0].ticker;
  showDailyStock(activeTicker, dataByTicker);
  setupPrivateFields();
  setupIdeaButtons();
  drawAllCharts(dataByTicker);
}

function setupEmojiMode() {
  updateEmojiButtonText();

  emojiModeToggle.addEventListener("click", () => {
    emojiModeEnabled = !emojiModeEnabled;
    localStorage.setItem("emojiModeEnabled", String(emojiModeEnabled));
    updateEmojiButtonText();

    if (Object.keys(currentDataByTicker).length) {
      renderDashboard(currentDataByTicker);
    }
  });
}

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function formatNumber(value) {
  return value.toLocaleString("en-US");
}

function formatLargeMoney(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "Not available";
  }

  const number = Number(value);

  if (Math.abs(number) >= 1_000_000_000_000) {
    return `$${(number / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (Math.abs(number) >= 1_000_000_000) {
    return `$${(number / 1_000_000_000).toFixed(2)}B`;
  }

  if (Math.abs(number) >= 1_000_000) {
    return `$${(number / 1_000_000).toFixed(2)}M`;
  }

  return formatMoney(number);
}

function formatRatio(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "Not available";
  }

  return Number(value).toFixed(2);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getFundamentals(ticker) {
  if (window.FUNDAMENTALS_DATA && window.FUNDAMENTALS_DATA[ticker]) {
    return window.FUNDAMENTALS_DATA[ticker];
  }

  return {
    revenue: null,
    netIncome: null,
    marketCap: null,
    peRatio: null,
  };
}

function getAiExplanation(ticker) {
  if (window.AI_EXPLANATIONS && window.AI_EXPLANATIONS[ticker]) {
    return window.AI_EXPLANATIONS[ticker];
  }

  return "AI explanation will appear after the refresh script runs.";
}

function getAiAction(ticker) {
  if (window.AI_ACTIONS && window.AI_ACTIONS[ticker]) {
    return window.AI_ACTIONS[ticker];
  }

  return {
    action: "Research first",
    className: "action-neutral",
    reason: "AI buy/sell check will appear after the refresh script runs.",
  };
}

function getAiQuickSummary(ticker, aiAction) {
  const snapshot = getStockSnapshot(ticker);
  const moveDirection = snapshot.rangeChange >= 0 ? "up" : "down";
  const valuation = getValuationLabel(snapshot.peRatio);
  const signal = aiAction.action || "Research first";

  return `${ticker} is ${moveDirection} ${Math.abs(snapshot.rangeChange).toFixed(1)}% over the selected chart range, with ${valuation}. Quick read: ${signal}; use this as a starting point, not a final decision.`;
}

function getDailyAnalysis(ticker) {
  if (window.DAILY_ANALYSIS && window.DAILY_ANALYSIS[ticker]) {
    return window.DAILY_ANALYSIS[ticker];
  }

  return {
    className: "daily-flat",
    headline: "End-of-day analysis will appear after the refresh script runs.",
    explanation:
      "Run python3 scripts/download_aapl.py after the market closes to create the daily analysis file.",
  };
}

function getRefreshText() {
  if (!window.DASHBOARD_REFRESHED_AT) {
    return t("Loaded AAPL, NVDA, and COST from local JSON files.");
  }

  const date = new Date(window.DASHBOARD_REFRESHED_AT);

  if (Number.isNaN(date.getTime())) {
    return t("Loaded AAPL, NVDA, and COST from local JSON files.");
  }

  return `${t("Loaded AAPL, NVDA, and COST. Last refreshed:")} ${date.toLocaleString()}.`;
}

function openFunModeChoice() {
  funModeModal.classList.add("open");
  funModeModal.setAttribute("aria-hidden", "false");
}

function closeFunModeChoice() {
  funModeModal.classList.remove("open");
  funModeModal.setAttribute("aria-hidden", "true");
}

function setFunMode(enabled) {
  funModeEnabled = enabled;
  localStorage.setItem("funModeEnabled", String(enabled));
  localStorage.setItem("funModeChoiceMade", "true");
  closeFunModeChoice();

  if (enabled) {
    showPunToast(t("Fun mode is on. Small puns, controlled dosage."));
  }
}

function showPunToast(customText = "") {
  const now = Date.now();

  if (!funModeEnabled && !customText) {
    return;
  }

  if (!customText && punsShownThisSession >= 4) {
    return;
  }

  if (!customText && now - lastPunTime < 9000) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = "pun-toast";
  toast.textContent =
    customText || stockPuns[Math.floor(Math.random() * stockPuns.length)];

  punToastArea.appendChild(toast);
  punsShownThisSession += customText ? 0 : 1;
  lastPunTime = now;

  setTimeout(() => {
    toast.classList.add("leaving");
  }, 4200);

  setTimeout(() => {
    toast.remove();
  }, 4800);
}

function maybeShowPun() {
  if (!funModeEnabled) {
    return;
  }

  if (Math.random() < 0.45) {
    showPunToast();
  }
}

async function loadJson(file) {
  const ticker = file.split("/").pop().replace(".json", "");

  if (window.PRICE_DATA && window.PRICE_DATA[ticker]) {
    return window.PRICE_DATA[ticker];
  }

  const response = await fetch(file);

  if (!response.ok) {
    throw new Error(`Could not load ${file}`);
  }

  return response.json();
}

function cleanPrices(rows) {
  return rows
    .filter((row) => row.date && typeof row.close === "number")
    .map((row) => ({
      date: row.date,
      open: row.open,
      high: row.high,
      low: row.low,
      close: row.close,
      volume: row.volume,
    }));
}

function createMetric(label, value) {
  return `
    <div class="metric">
      <span>${t(label)}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function createValueEffect(change) {
  if (change.className === "change-up") {
    return `
      <span class="value-effect gain-effect" aria-hidden="true">
        <span>$</span>
        <span>$</span>
        <span>$</span>
      </span>
    `;
  }

  if (change.className === "change-down") {
    return `
      <span class="value-effect drop-effect" aria-hidden="true">
        <span>↓</span>
        <span>↓</span>
        <span>↓</span>
      </span>
    `;
  }

  return "";
}

function createChangeMetric(label, change) {
  return `
    <div class="metric metric-effect ${change.className}">
      <span>${t(label)}</span>
      <strong>${change.arrow} ${change.text}</strong>
      ${createValueEffect(change)}
    </div>
  `;
}

function getPriceChange(prices) {
  const startPrice = prices[0].close;
  const endPrice = prices[prices.length - 1].close;
  const percent = ((endPrice - startPrice) / startPrice) * 100;

  if (percent > 0) {
    return {
      className: "change-up",
      arrow: "↑",
      text: `${percent.toFixed(1)}%`,
    };
  }

  if (percent < 0) {
    return {
      className: "change-down",
      arrow: "↓",
      text: `${Math.abs(percent).toFixed(1)}%`,
    };
  }

  return {
    className: "change-flat",
    arrow: "→",
    text: "0.0%",
  };
}

function getStockSnapshot(ticker) {
  const company = getCompany(ticker);
  const prices = getRangePrices(currentDataByTicker[ticker] || []);
  const fundamentals = getFundamentals(ticker);
  const dailyAnalysis = getDailyAnalysis(ticker);
  const latestDay = prices[prices.length - 1] || {};
  const firstDay = prices[0] || latestDay;
  const closes = prices.map((row) => Number(row.close)).filter((value) => !Number.isNaN(value));
  const latestClose = Number(latestDay.close || dailyAnalysis.close || 0);
  const rangeStart = Number(firstDay.close || latestClose || 0);
  const rangeChange = rangeStart
    ? ((latestClose - rangeStart) / rangeStart) * 100
    : 0;
  const highClose = closes.length ? Math.max(...closes) : latestClose;
  const lowClose = closes.length ? Math.min(...closes) : latestClose;
  const distanceFromHigh = highClose
    ? ((latestClose - highClose) / highClose) * 100
    : 0;
  const distanceFromLow = lowClose
    ? ((latestClose - lowClose) / lowClose) * 100
    : 0;
  const peRatio = Number(fundamentals.peRatio);

  return {
    company,
    prices,
    fundamentals,
    dailyAnalysis,
    aiAction: getAiAction(ticker),
    latestClose,
    latestVolume: Number(latestDay.volume || 0),
    rangeChange,
    highClose,
    lowClose,
    distanceFromHigh,
    distanceFromLow,
    peRatio: Number.isNaN(peRatio) ? null : peRatio,
  };
}

function getValuationLabel(peRatio) {
  if (peRatio === null) {
    return "valuation data is not available";
  }

  if (peRatio >= 45) {
    return "valuation looks expensive, so growth needs to justify the price";
  }

  if (peRatio >= 25) {
    return "valuation is moderate-to-high, so compare it with growth and competitors";
  }

  if (peRatio > 0) {
    return "valuation looks lower than many growth stocks, but still needs business-quality checks";
  }

  return "P/E is not useful here, so use other fundamentals instead";
}

function createChangeBadge(prices) {
  const change = getPriceChange(prices);

  return `
    <div class="change-badge ${change.className}">
      <span>${change.arrow}</span>
      <strong>${change.text}</strong>
      <small>1Y</small>
      ${createValueEffect(change)}
    </div>
  `;
}

function getDailyChange(dailyAnalysis) {
  const percent = Number(dailyAnalysis.percentChange || 0);

  if (percent > 0) {
    return {
      className: "change-up",
      arrow: "↑",
      text: `${percent.toFixed(2)}%`,
    };
  }

  if (percent < 0) {
    return {
      className: "change-down",
      arrow: "↓",
      text: `${Math.abs(percent).toFixed(2)}%`,
    };
  }

  return {
    className: "change-flat",
    arrow: "→",
    text: "0.00%",
  };
}

function createDailyChangeBadge(dailyAnalysis) {
  const change = getDailyChange(dailyAnalysis);

  return `
    <div class="change-badge ${change.className}">
      <span>${change.arrow}</span>
      <strong>${change.text}</strong>
      <small>DAY</small>
      ${createValueEffect(change)}
    </div>
  `;
}

function createEducationalReview(company, dailyAnalysis, aiAction) {
  const percent = Number(dailyAnalysis.percentChange || 0);
  const absPercent = Math.abs(percent);
  const actionText = aiAction.action.toLowerCase();

  if (actionText.includes("buy")) {
    return {
      stance: "Buy-watch review",
      className: "review-buy",
      allocation: "Sample range: 1% to 3% of a practice portfolio",
      explanation:
        `${company.ticker} has a positive research signal, but the daily move should still be checked against valuation and risk. A beginner-friendly approach would be to study a small starter-size example instead of jumping in all at once.`,
      caution:
        "This is not personal financial advice. Use it as a research example and decide your own risk limit.",
    };
  }

  if (actionText.includes("sell") || actionText.includes("avoid")) {
    return {
      stance: "Reduce / avoid review",
      className: "review-sell",
      allocation: "Sample trim range: 10% to 25% of an existing practice position",
      explanation:
        `${company.ticker} has a cautious signal. If this were a practice portfolio, the review would focus on protecting risk, checking why the stock moved, and avoiding a rushed buy after a weak day.`,
      caution:
        "This is not a command to sell. It is an educational risk-management example.",
    };
  }

  if (absPercent >= 3) {
    return {
      stance: "Wait for confirmation",
      className: "review-hold",
      allocation: "Sample range: 0% new buy until the next review",
      explanation:
        `${company.ticker} had a large daily move, so the safer research habit is to wait for another day of price action before deciding whether the move is meaningful or just short-term volatility.`,
      caution:
        "Large one-day moves can reverse quickly. Review news, volume, and valuation before acting.",
    };
  }

  return {
    stance: "Hold / research more",
    className: "review-hold",
    allocation: "Sample range: 0% to 1% watchlist-only practice position",
    explanation:
      `${company.ticker} does not show a strong enough daily setup by itself. The review points toward watching the stock, comparing it with fundamentals, and waiting for a clearer reason.`,
    caution:
      "This is educational only and should not replace your own research.",
  };
}

function createReviewSlides(company, dailyAnalysis, review, latestDay, previousDay) {
  return [
    {
      title: "Daily move",
      body: dailyAnalysis.explanation,
    },
    {
      title: "Price check",
      body: `${company.ticker} moved from ${formatMoney(previousDay.close)} to ${formatMoney(latestDay.close)}. Volume was ${formatNumber(latestDay.volume)} shares.`,
    },
    {
      title: "ChatGPT-style review",
      body: review.explanation,
    },
    {
      title: "Educational position idea",
      body: `${review.allocation}. ${review.caution}`,
    },
  ];
}

function buildDailyFullResponse(company, prices) {
  const snapshot = getStockSnapshot(company.ticker);
  const dailyAnalysis = getDailyAnalysis(company.ticker);
  const aiAction = getAiAction(company.ticker);
  const review = createEducationalReview(company, dailyAnalysis, aiAction);
  const latestDay = prices[prices.length - 1];
  const previousDay = prices[prices.length - 2] || latestDay;

  return `
    <div class="daily-analysis ${dailyAnalysis.className}">
      <strong>${dailyAnalysis.headline}</strong>
      <p>${withEmoji("daily", dailyAnalysis.explanation)}</p>
    </div>

    <div class="review-card ${review.className}">
      <label>${t("ChatGPT-style buy/sell review")}</label>
      <strong>${review.stance}</strong>
      <p>${withEmoji("idea", review.explanation)}</p>
      <div class="allocation-box">${review.allocation}</div>
      <small>${review.caution}</small>
    </div>

    <div class="metric-grid">
      ${createMetric("Previous close", formatMoney(previousDay.close))}
      ${createMetric("Latest close", formatMoney(latestDay.close))}
      ${createChangeMetric("Daily change", getDailyChange(dailyAnalysis))}
      ${createMetric("Range move", `${snapshot.rangeChange.toFixed(1)}%`)}
      ${createMetric("P/E ratio", formatRatio(snapshot.fundamentals.peRatio))}
      ${createMetric("Volume", formatNumber(latestDay.volume))}
    </div>

    <small>Educational review only, not personal financial advice. This faster response is generated locally from saved dashboard data including price trend, valuation, and fundamentals.</small>
  `;
}

function createAiBlock(ticker, aiExplanation, aiAction) {
  const quickSummary = getAiQuickSummary(ticker, aiAction);

  return `
    <div class="ai-row">
      <div class="ai-summary-grid">
        <div>
          <label>${t("Quick summary")}</label>
          <p class="ai-quick-summary">${withEmoji("ai", quickSummary)}</p>
        </div>

        <div>
          <label>${t("AI explanation")}</label>
          <p class="ai-explanation">${withEmoji("ai", aiExplanation)}</p>
        </div>
      </div>

      <div>
        <label>${t("AI buy/sell check")}</label>
        <div class="ai-action ${aiAction.className}">
          <strong>${aiAction.action}</strong>
          <p>${aiAction.reason}</p>
          <small>${t("Educational signal, not personal financial advice.")}</small>
        </div>
      </div>
    </div>
  `;
}

function createExplanationHeader(ticker, targetId) {
  return `
    <div class="label-row">
      <label for="${targetId}">${t("User ideas")}</label>
      <button class="idea-button" type="button" data-verify-idea="${ticker}" data-idea-source="${targetId}">
        ${t("Verify with ChatGPT")}
      </button>
    </div>
  `;
}

function createCompanyCard(
  company,
  prices,
  fundamentals,
  aiExplanation,
  aiAction,
) {
  const latestPrice = prices[prices.length - 1].close;

  return `
    <article class="company-card ${company.accentClass}">
      <div class="card-top">
        <h3>${company.name}</h3>
        <span class="ticker-pill">${company.ticker}</span>
      </div>

      <p class="summary">${withEmoji("summary", company.summary)}</p>

      <div class="metric-grid">
        ${createMetric("Latest close", formatMoney(latestPrice))}
        ${createMetric("Revenue", formatLargeMoney(fundamentals.revenue))}
        ${createMetric("Net income", formatLargeMoney(fundamentals.netIncome))}
        ${createMetric("Market cap", formatLargeMoney(fundamentals.marketCap))}
        ${createMetric("P/E ratio", formatRatio(fundamentals.peRatio))}
      </div>

      <div class="chart-block">
        ${createRangeControlsHtml()}
        <div class="chart-row">
          <canvas class="mini-chart" id="miniChart-${company.ticker}"></canvas>
          ${createChangeBadge(prices)}
        </div>
      </div>

      <div class="note-group">
        <div>
          ${createExplanationHeader(company.ticker, `cardExplanation-${company.ticker}`)}
          <textarea class="user-ideas-box" id="cardExplanation-${company.ticker}" data-storage-key="explanation-${company.ticker}" placeholder="${t("Write your ideas here.")}"></textarea>
        </div>

        ${createAiBlock(company.ticker, aiExplanation, aiAction)}

        <div>
          <label for="cardQuestion-${company.ticker}">${t("One question I still have")}</label>
          <input id="cardQuestion-${company.ticker}" data-storage-key="question-${company.ticker}" placeholder="${t("Write one question here.")}">
        </div>
      </div>
    </article>
  `;
}

function createCompanySection(
  company,
  prices,
  fundamentals,
  aiExplanation,
  aiAction,
) {
  const latestRows = prices.slice(-5).reverse();
  const latestPrice = prices[prices.length - 1].close;
  const closes = prices.map((row) => row.close);
  const highClose = Math.max(...closes);
  const lowClose = Math.min(...closes);

  const tableRows = latestRows
    .map(
      (row) => `
        <tr>
          <td>${row.date}</td>
          <td>${formatMoney(row.open)}</td>
          <td>${formatMoney(row.high)}</td>
          <td>${formatMoney(row.low)}</td>
          <td>${formatMoney(row.close)}</td>
          <td>${formatNumber(row.volume)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <article class="research-panel ${company.accentClass}" id="${company.ticker}">
      <div class="panel-top">
        <div>
          <h3>${company.name}</h3>
          <p class="summary">${withEmoji("summary", company.summary)}</p>
        </div>
        <span class="ticker-pill">${company.ticker}</span>
      </div>

      <div class="panel-layout">
        <div>
          <div class="chart-block">
            ${createRangeControlsHtml()}
            <div class="chart-row chart-row-large">
              <canvas class="large-chart" id="largeChart-${company.ticker}"></canvas>
              ${createChangeBadge(prices)}
            </div>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Open</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>Close</th>
                  <th>Volume</th>
                </tr>
              </thead>
              <tbody>${tableRows}</tbody>
            </table>
          </div>
        </div>

        <div class="panel-side">
          <div class="metric-grid">
            ${createMetric("Latest close", formatMoney(latestPrice))}
            ${createMetric("Range high close", formatMoney(highClose))}
            ${createMetric("Range low close", formatMoney(lowClose))}
            ${createMetric("Revenue", formatLargeMoney(fundamentals.revenue))}
            ${createMetric("Net income", formatLargeMoney(fundamentals.netIncome))}
            ${createMetric("Market cap", formatLargeMoney(fundamentals.marketCap))}
            ${createMetric("P/E ratio", formatRatio(fundamentals.peRatio))}
          </div>

          <div>
            ${createExplanationHeader(company.ticker, `sectionExplanation-${company.ticker}`)}
            <textarea class="user-ideas-box" id="sectionExplanation-${company.ticker}" data-storage-key="section-explanation-${company.ticker}" placeholder="${t("Write your ideas here.")}"></textarea>
          </div>

          ${createAiBlock(company.ticker, aiExplanation, aiAction)}

          <div>
            <label for="sectionQuestion-${company.ticker}">${t("One question I still have")}</label>
            <input id="sectionQuestion-${company.ticker}" data-storage-key="section-question-${company.ticker}" placeholder="${t("Write one question here.")}">
          </div>
        </div>
      </div>
    </article>
  `;
}

function createDailyTabs(activeTicker) {
  return companies
    .map(
      (company) => `
        <button class="daily-tab ${company.ticker === activeTicker ? "active" : ""}" data-ticker="${company.ticker}">
          <span>${company.name}</span>
          <strong>${company.ticker}</strong>
        </button>
      `,
    )
    .join("");
}

function createDailyPanel(company, prices) {
  const dailyAnalysis = getDailyAnalysis(company.ticker);
  const aiAction = getAiAction(company.ticker);
  const review = createEducationalReview(company, dailyAnalysis, aiAction);
  const latestRows = prices.slice(-2);
  const latestDay = latestRows[latestRows.length - 1];
  const previousDay = latestRows[0];
  const slides = createReviewSlides(company, dailyAnalysis, review, latestDay, previousDay);
  const activeSlide = slides[dailySlideIndex % slides.length];

  return `
    <article class="daily-detail ${company.accentClass}">
      <div class="daily-detail-top">
        <div>
          <span class="ticker-pill">${company.ticker}</span>
          <h3>${company.name} daily move</h3>
          <p>${dailyAnalysis.date || latestDay.date}</p>
        </div>

        <div class="review-mode">
          <button class="${dailyViewMode === "clear" ? "active" : ""}" data-review-mode="clear">${t("Clear View")}</button>
          <button class="${dailyViewMode === "slides" ? "active" : ""}" data-review-mode="slides">${t("Slideshow Review")}</button>
        </div>
      </div>

      <div class="daily-detail-grid">
        <div>
          <div class="chart-row chart-row-large">
            <canvas class="large-chart" id="dailyChart-${company.ticker}"></canvas>
            ${createDailyChangeBadge(dailyAnalysis)}
          </div>
        </div>

        <div class="daily-side">
          ${
            dailyViewMode === "clear"
              ? `
                <div class="metric-grid">
                  ${createMetric("Previous close", formatMoney(previousDay.close))}
                  ${createMetric("Latest close", formatMoney(latestDay.close))}
                  ${createChangeMetric("Daily change", getDailyChange(dailyAnalysis))}
                  ${createMetric("Volume", formatNumber(latestDay.volume))}
                </div>

                <div class="daily-analysis ${dailyAnalysis.className}">
                  <strong>${dailyAnalysis.headline}</strong>
                  <p>${withEmoji("daily", dailyAnalysis.explanation)}</p>
                </div>

                <div class="review-card ${review.className}">
                  <label>${t("ChatGPT-style buy/sell review")}</label>
                  <strong>${review.stance}</strong>
                  <p>${withEmoji("idea", review.explanation)}</p>
                  <div class="allocation-box">${review.allocation}</div>
                  <small>${review.caution}</small>
                  <div class="response-actions">
                    <button type="button" data-open-daily-response="${company.ticker}">${t("Open full response")}</button>
                  </div>
                </div>
              `
              : `
                <div class="slide-card ${review.className}">
                  <div class="slide-count">${t("Slide")} ${dailySlideIndex + 1} ${t("of")} ${slides.length}</div>
                  <h4>${activeSlide.title}</h4>
                  <p>${withEmoji("daily", activeSlide.body)}</p>
                  <div class="slide-controls">
                    <button data-slide-direction="previous">${t("Back")}</button>
                    <button data-slide-direction="next">${t("Next")}</button>
                  </div>
                </div>
              `
          }
        </div>
      </div>
    </article>
  `;
}

function drawDailyChart(company, prices) {
  const canvas = document.querySelector(`#dailyChart-${company.ticker}`);

  if (!canvas) {
    return;
  }

  drawLineChart(canvas, prices.slice(-2), company.color);
}

function showDailyStock(ticker, dataByTicker) {
  const company = companies.find((item) => item.ticker === ticker) || companies[0];

  dailyTabs.innerHTML = createDailyTabs(company.ticker);
  dailyPanel.innerHTML = createDailyPanel(company, dataByTicker[company.ticker]);
  drawDailyChart(company, dataByTicker[company.ticker]);

  document.querySelectorAll(".daily-tab").forEach((button) => {
    button.addEventListener("click", () => {
      dailySlideIndex = 0;
      showDailyStock(button.dataset.ticker, dataByTicker);
      maybeShowPun();
    });
  });

  document.querySelectorAll("[data-review-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      dailyViewMode = button.dataset.reviewMode;
      dailySlideIndex = 0;
      showDailyStock(company.ticker, dataByTicker);
      maybeShowPun();
    });
  });

  document.querySelectorAll("[data-slide-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.slideDirection;
      const slideCount = 4;

      if (direction === "previous") {
        dailySlideIndex = (dailySlideIndex + slideCount - 1) % slideCount;
      } else {
        dailySlideIndex = (dailySlideIndex + 1) % slideCount;
      }

      showDailyStock(company.ticker, dataByTicker);
      maybeShowPun();
    });
  });

  document.querySelectorAll("[data-open-daily-response]").forEach((button) => {
    button.addEventListener("click", () => {
      openResponseModal(`${company.name} full review`, () =>
        buildDailyFullResponse(company, dataByTicker[company.ticker]),
      );
      maybeShowPun();
    });
  });
}

function getCompany(ticker) {
  return companies.find((company) => company.ticker === ticker) || companies[0];
}

function openIdeaCoach(ticker = "AAPL", sourceId = "") {
  const sourceField = sourceId ? document.querySelector(`#${sourceId}`) : null;

  ideaTicker.value = ticker;

  if (sourceField && sourceField.value.trim()) {
    ideaText.value = sourceField.value.trim();
  }

  coachResponse.innerHTML = `
    <strong>Ready to review ${ticker}.</strong>
    <p>${withEmoji("idea", "Add your buy, hold, or sell thinking, then press Review idea.")}</p>
  `;

  ideaModal.classList.add("open");
  ideaModal.setAttribute("aria-hidden", "false");
  ideaText.focus();
}

function closeIdeaCoach() {
  ideaModal.classList.remove("open");
  ideaModal.setAttribute("aria-hidden", "true");
}

function buildCoachResponse(ticker, action, idea) {
  const snapshot = getStockSnapshot(ticker);
  const { company, fundamentals, dailyAnalysis, aiAction } = snapshot;
  const dailyPercent = Number(dailyAnalysis.percentChange || 0);
  const ideaLower = idea.toLowerCase();
  const mentionsRisk = ideaLower.includes("risk") || ideaLower.includes("lose") || ideaLower.includes("drop");
  const mentionsLongTerm = ideaLower.includes("long") || ideaLower.includes("future") || ideaLower.includes("growth");

  let qualityNote = "Your idea is a starting point. Make it stronger by naming your time frame, risk limit, and what would prove you wrong.";

  if (mentionsRisk && mentionsLongTerm) {
    qualityNote = "Good start: you mentioned both risk and the bigger business view. Now add a specific price level or event that would change your mind.";
  } else if (mentionsRisk) {
    qualityNote = "Good risk awareness. Add what would make you comfortable buying or holding after the drop.";
  } else if (mentionsLongTerm) {
    qualityNote = "Good long-term thinking. Add a risk check so the idea does not depend only on optimism.";
  }

  const actionGuides = {
    buy: "For a buy idea, the review should ask: is the valuation reasonable, is the business still improving, and would I be okay if the stock falls more first?",
    hold: "For a hold idea, the review should ask: has the original reason for owning it changed, or is the daily move just noise?",
    sell: "For a sell idea, the review should ask: am I selling because the facts changed, or only because the price moved against me today?",
  };

  return `
    <strong>${company.name} (${ticker}) idea review</strong>
    <p>${withEmoji("idea", actionGuides[action])}</p>
    <ul>
      <li>Latest close: ${snapshot.latestClose ? formatMoney(snapshot.latestClose) : "Not available"}.</li>
      <li>Latest daily move: ${dailyPercent.toFixed(2)}%.</li>
      <li>Selected range move: ${snapshot.rangeChange.toFixed(1)}%.</li>
      <li>Distance from range high: ${snapshot.distanceFromHigh.toFixed(1)}%.</li>
      <li>P/E ratio: ${formatRatio(fundamentals.peRatio)}.</li>
      <li>Dashboard signal: ${aiAction.action}.</li>
    </ul>
    <p>${withEmoji("chart", qualityNote)}</p>
    <p>${withEmoji("idea", `<strong>Faster, more grounded response:</strong> ${getValuationLabel(snapshot.peRatio)}. Your idea is worth researching, but do not treat this as an automatic ${action}. Compare the daily move, selected chart range, and your risk rule before deciding what to do.`)}</p>
    <small>Educational review only, not personal financial advice. This runs locally in the webpage, not through a private ChatGPT API.</small>
  `;
}

function buildUserIdeaVerification(ticker, idea) {
  const snapshot = getStockSnapshot(ticker);
  const { company, fundamentals, dailyAnalysis, aiAction } = snapshot;
  const dailyPercent = Number(dailyAnalysis.percentChange || 0);
  const ideaLower = idea.toLowerCase();
  const mentionsPrice = /\$|\d/.test(idea);
  const mentionsRisk = ideaLower.includes("risk") || ideaLower.includes("drop") || ideaLower.includes("lose") || ideaLower.includes("sell");
  const mentionsLongTerm = ideaLower.includes("long") || ideaLower.includes("future") || ideaLower.includes("growth") || ideaLower.includes("years");
  const mentionsTimeFrame = mentionsLongTerm || ideaLower.includes("day") || ideaLower.includes("week") || ideaLower.includes("month");
  const hasRevenue = fundamentals.revenue !== null && fundamentals.revenue !== undefined;
  const hasNetIncome = fundamentals.netIncome !== null && fundamentals.netIncome !== undefined;

  const pros = [
    `${company.name} has real business data in the dashboard, so your idea can be compared against price, valuation, and fundamentals instead of only a headline.`,
    `The latest close is ${snapshot.latestClose ? formatMoney(snapshot.latestClose) : "not available"}, giving you a concrete current price to judge your idea against.`,
    `The selected chart range move is ${snapshot.rangeChange.toFixed(1)}%, so the idea can be checked against the range you chose instead of only today's move.`,
  ];

  if (mentionsLongTerm) {
    pros.push("You mentioned a longer-term angle, which is useful because one trading day usually does not explain the whole business.");
  }

  if (mentionsRisk) {
    pros.push("You included risk thinking, which makes the idea more balanced and easier to test.");
  }

  if (hasRevenue && hasNetIncome) {
    pros.push(`Revenue is ${formatLargeMoney(fundamentals.revenue)} and net income is ${formatLargeMoney(fundamentals.netIncome)}, so the idea can be checked against actual business scale.`);
  }

  const cons = [
    `The latest daily move is ${dailyPercent.toFixed(2)}%, so short-term price movement could still be noise.`,
    `The P/E ratio is ${formatRatio(fundamentals.peRatio)}; ${getValuationLabel(snapshot.peRatio)}.`,
    `The latest close is ${Math.abs(snapshot.distanceFromHigh).toFixed(1)}% below the selected-range high and ${snapshot.distanceFromLow.toFixed(1)}% above the selected-range low, so entry timing still matters.`,
  ];

  if (!mentionsPrice) {
    cons.push("Your idea does not include a target price, stop point, or buy range yet, so it is hard to know when the idea is proven right or wrong.");
  }

  if (!mentionsRisk) {
    cons.push("Your idea does not clearly say what could go wrong yet. Add one risk that would make you wait or change your mind.");
  }

  if (!mentionsTimeFrame) {
    cons.push("Your idea does not say whether it is a short-term trade or long-term investment, so the review cannot judge it against the right time frame.");
  }

  const nextStep = mentionsPrice
    ? "Next step: write one rule for what would make you wait, buy smaller, or stop following the idea."
    : "Next step: add a price level, valuation reason, or event that would make the idea easier to verify.";

  return `
    <div class="coach-response">
      <strong>${company.name} (${ticker}) user idea check</strong>
      <p>${withEmoji("idea", `<strong>Your idea:</strong> ${escapeHtml(idea)}`)}</p>
      <ul>
        <li>Latest close: ${snapshot.latestClose ? formatMoney(snapshot.latestClose) : "Not available"}.</li>
        <li>Latest daily move: ${dailyPercent.toFixed(2)}%.</li>
        <li>Selected range move: ${snapshot.rangeChange.toFixed(1)}%.</li>
        <li>Selected range: ${formatMoney(snapshot.lowClose)} to ${formatMoney(snapshot.highClose)}.</li>
        <li>P/E ratio: ${formatRatio(fundamentals.peRatio)}.</li>
        <li>Revenue / net income: ${formatLargeMoney(fundamentals.revenue)} / ${formatLargeMoney(fundamentals.netIncome)}.</li>
        <li>Dashboard signal: ${aiAction.action}.</li>
      </ul>
    </div>

    <div class="review-card review-buy">
      <strong>Pros</strong>
      <ul>${pros.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>

    <div class="review-card review-sell">
      <strong>Cons / risks</strong>
      <ul>${cons.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>

    <div class="review-card review-hold">
      <strong>Beginner-friendly verdict</strong>
      <p>${withEmoji("chart", `${nextStep} Treat this as a research check, not a final buy or sell command.`)}</p>
      <small>Educational review only, not personal financial advice. This runs locally from the dashboard data.</small>
    </div>
  `;
}

function setupIdeaCoach() {
  startIdeaCoach.addEventListener("click", () => {
    openIdeaCoach("AAPL");
    maybeShowPun();
  });

  closeIdeaModal.addEventListener("click", closeIdeaCoach);

  ideaModal.addEventListener("click", (event) => {
    if (event.target === ideaModal) {
      closeIdeaCoach();
    }
  });

  reviewIdeaButton.addEventListener("click", () => {
    const idea = ideaText.value.trim();

    if (!idea) {
      coachResponse.innerHTML = `
        <strong>Add your idea first.</strong>
        <p>${withEmoji("idea", "Write what you are thinking about buying, holding, or selling, then I can review it.")}</p>
      `;
      return;
    }

    coachResponse.innerHTML = `
      <strong>Review opened.</strong>
      <p>${withEmoji("idea", "A full ChatGPT-style response is opening in its own popup so it has more room.")}</p>
    `;

    openResponseModal(`${ideaTicker.value} idea review`, () =>
      `<div class="coach-response">${buildCoachResponse(
        ideaTicker.value,
        ideaAction.value,
        idea,
      )}</div>`,
    );
    maybeShowPun();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && responseModal.classList.contains("open")) {
      closeResponse();
    } else if (event.key === "Escape" && ideaModal.classList.contains("open")) {
      closeIdeaCoach();
    }
  });
}

function setupIdeaButtons() {
  document.querySelectorAll("[data-idea-button]").forEach((button) => {
    button.addEventListener("click", () => {
      openIdeaCoach(button.dataset.ideaButton, button.dataset.ideaSource);
      maybeShowPun();
    });
  });

  document.querySelectorAll("[data-verify-idea]").forEach((button) => {
    button.addEventListener("click", () => {
      const ticker = button.dataset.verifyIdea;
      const sourceField = document.querySelector(`#${button.dataset.ideaSource}`);
      const idea = sourceField ? sourceField.value.trim() : "";

      if (!idea) {
        openResponseModal(`${ticker} user idea check`, () => `
          <div class="coach-response">
            <strong>Add your idea first.</strong>
            <p>${withEmoji("idea", "Write your stock idea in the User ideas box, then press Verify with ChatGPT again.")}</p>
          </div>
        `, 350);
        return;
      }

      openResponseModal(`${ticker} user idea check`, () =>
        buildUserIdeaVerification(ticker, idea),
      );
      maybeShowPun();
    });
  });
}

function setupFunMode() {
  funModeSettings.addEventListener("click", openFunModeChoice);
  enableFunMode.addEventListener("click", () => setFunMode(true));
  disableFunMode.addEventListener("click", () => setFunMode(false));

  funModeModal.addEventListener("click", (event) => {
    if (event.target === funModeModal) {
      closeFunModeChoice();
    }
  });

  if (!localStorage.getItem("funModeChoiceMade")) {
    setTimeout(openFunModeChoice, 650);
  }
}

function setupPrivateFields() {
  const fields = document.querySelectorAll("[data-storage-key]");

  fields.forEach((field) => {
    const key = field.dataset.storageKey;
    const savedValue = localStorage.getItem(key);

    if (savedValue) {
      field.value = savedValue;
    }

    field.addEventListener("input", () => {
      localStorage.setItem(key, field.value);
    });
  });
}

function resizeCanvas(canvas) {
  const pixelRatio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);

  const ctx = canvas.getContext("2d");
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  return { ctx, width, height };
}

function getChartColorForMove(prices, fallbackColor) {
  if (prices.length < 2) {
    return fallbackColor;
  }

  const startClose = Number(prices[0].close);
  const endClose = Number(prices[prices.length - 1].close);

  if (endClose > startClose) {
    return "#087d61";
  }

  if (endClose < startClose) {
    return "#bf4b39";
  }

  return fallbackColor;
}

function drawMovingArrow(ctx, points, progress, isUp, compact) {
  if (!points.length) {
    return;
  }

  const lastPointIndex = Math.max(points.length - 1, 1);
  const exactIndex = progress * lastPointIndex;
  const lowerIndex = Math.min(Math.floor(exactIndex), Math.max(points.length - 2, 0));
  const upperIndex = Math.min(points.length - 1, lowerIndex + 1);
  const localProgress = Math.min(Math.max(exactIndex - lowerIndex, 0), 1);
  const fromPoint = points[lowerIndex];
  const toPoint = points[upperIndex];
  const x = fromPoint.x + (toPoint.x - fromPoint.x) * localProgress;
  const y = fromPoint.y + (toPoint.y - fromPoint.y) * localProgress;
  const angle = Math.atan2(toPoint.y - fromPoint.y, toPoint.x - fromPoint.x);
  const size = compact ? 8 : 13;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = isUp ? "#087d61" : "#bf4b39";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = compact ? 2 : 3;
  ctx.shadowColor = "rgba(23, 32, 51, 0.28)";
  ctx.shadowBlur = compact ? 4 : 8;
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(-size * 0.72, -size * 0.62);
  ctx.lineTo(-size * 0.42, 0);
  ctx.lineTo(-size * 0.72, size * 0.62);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

function drawLineChart(canvas, prices, color, compact = false, animate = true) {
  if (!canvas || !prices.length) {
    return;
  }

  const existingFrame = chartAnimationFrames.get(canvas);

  if (existingFrame) {
    cancelAnimationFrame(existingFrame);
  }

  const { ctx, width, height } = resizeCanvas(canvas);
  const padding = compact
    ? { top: 14, right: 10, bottom: 18, left: 10 }
    : { top: 24, right: 24, bottom: 42, left: 62 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const closes = prices.map((row) => row.close);
  const minClose = Math.min(...closes);
  const maxClose = Math.max(...closes);
  const pricePadding = (maxClose - minClose) * 0.08 || 1;
  const chartMin = minClose - pricePadding;
  const chartMax = maxClose + pricePadding;
  const moveColor = getChartColorForMove(prices, color);

  function xForIndex(index) {
    if (prices.length === 1) {
      return padding.left + chartWidth / 2;
    }

    return padding.left + (index / (prices.length - 1)) * chartWidth;
  }

  function yForClose(close) {
    const percent = (close - chartMin) / (chartMax - chartMin);
    return padding.top + chartHeight - percent * chartHeight;
  }

  const points = prices.map((row, index) => ({
    x: xForIndex(index),
    y: yForClose(row.close),
  }));
  const isUp = Number(prices[prices.length - 1].close) >= Number(prices[0].close);
  const duration = compact ? 820 : 1050;
  const startTime = performance.now();

  function drawFrame(progress) {
    const visibleCount = Math.max(1, Math.ceil(points.length * progress));
    const visiblePoints = points.slice(0, visibleCount);

    ctx.clearRect(0, 0, width, height);

    if (!compact) {
      ctx.font = "12px Arial";
      ctx.textBaseline = "middle";

      for (let i = 0; i <= 4; i += 1) {
        const percent = i / 4;
        const y = padding.top + percent * chartHeight;
        const price = chartMax - percent * (chartMax - chartMin);

        ctx.strokeStyle = "#e5eaf1";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        ctx.fillStyle = "#647084";
        ctx.textAlign = "right";
        ctx.fillText(formatMoney(price), padding.left - 10, y);
      }

      ctx.fillStyle = "#647084";
      ctx.textAlign = "left";
      ctx.fillText(prices[0].date, padding.left, height - 18);
      ctx.textAlign = "right";
      ctx.fillText(prices[prices.length - 1].date, width - padding.right, height - 18);
    }

    ctx.strokeStyle = moveColor;
    ctx.lineWidth = compact ? 2 : 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();

    visiblePoints.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });

    ctx.stroke();

    if (prices.length === 1) {
      ctx.fillStyle = moveColor;
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, compact ? 4 : 5, 0, Math.PI * 2);
      ctx.fill();
      drawMovingArrow(ctx, points, 1, true, compact);
      return;
    }

    drawMovingArrow(ctx, points, progress, isUp, compact);
  }

  function animateFrame(now) {
    const elapsed = now - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - (1 - rawProgress) ** 3;

    drawFrame(easedProgress);

    if (rawProgress < 1) {
      const frameId = requestAnimationFrame(animateFrame);
      chartAnimationFrames.set(canvas, frameId);
    } else {
      chartAnimationFrames.delete(canvas);
    }
  }

  if (animate) {
    drawFrame(0.01);
    const frameId = requestAnimationFrame(animateFrame);
    chartAnimationFrames.set(canvas, frameId);
  } else {
    drawFrame(1);
  }
}

function drawAllCharts(dataByTicker) {
  companies.forEach((company) => {
    const prices = getRangePrices(dataByTicker[company.ticker] || []);
    const miniCanvas = document.querySelector(`#miniChart-${company.ticker}`);
    const largeCanvas = document.querySelector(`#largeChart-${company.ticker}`);

    drawLineChart(miniCanvas, prices, company.color, true);
    drawLineChart(largeCanvas, prices, company.color);
  });
}

async function startDashboard() {
  try {
    const dataByTicker = {};

    for (const company of companies) {
      const rawRows = await loadJson(company.file);
      dataByTicker[company.ticker] = cleanPrices(rawRows);
    }

    currentDataByTicker = dataByTicker;

    renderDashboard(dataByTicker);

    window.addEventListener("resize", () => {
      drawAllCharts(dataByTicker);
      const activeTab = document.querySelector(".daily-tab.active");
      const activeTicker = activeTab ? activeTab.dataset.ticker : companies[0].ticker;
      const activeCompany =
        companies.find((company) => company.ticker === activeTicker) || companies[0];
      drawDailyChart(activeCompany, dataByTicker[activeCompany.ticker]);
    });

    loadStatus.textContent = getRefreshText();
  } catch (error) {
    loadStatus.textContent = error.message;
    console.error(error);
  }
}

setupLanguagePicker();
setupEmojiMode();
setupIdeaCoach();
setupResponseModal();
setupFunMode();
startDashboard();
