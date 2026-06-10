export type ThemeId =
  | "blue"
  | "emerald"
  | "violet"
  | "amber"
  | "rose"
  | "cyan"
  | "indigo"
  | "lime"
  | "orange"
  | "slate"
  | "crimson"
  | "custom";

export type BackgroundId =
  | "midnight"
  | "graphite"
  | "navy"
  | "paper"
  | "forest"
  | "custom";

export type LanguageCode =
  | "zh-CN"
  | "en-US"
  | "ja-JP"
  | "ko-KR"
  | "es-ES"
  | "fr-FR"
  | "de-DE"
  | "pt-BR"
  | "ru-RU"
  | "it-IT"
  | "ar-SA"
  | "hi-IN"
  | "id-ID"
  | "th-TH"
  | "vi-VN"
  | "tr-TR";

export type AppPreferences = {
  theme: ThemeId;
  background: BackgroundId;
  language: LanguageCode;
  customAccent: string;
  customAccent2: string;
  customBackground: string;
  customPanel: string;
};

type ShellCopy = {
  brand: string;
  topbarTitle: string;
  topbarSubtitle: string;
  architectureLabel: string;
  navigationLabel: string;
  nav: Array<{ label: string; description: string }>;
};

type UiTranslation = Partial<Record<string, string>>;

export const preferenceStorageKey = "plan-execution-system.preferences";

export const defaultPreferences: AppPreferences = {
  theme: "blue",
  background: "midnight",
  language: "zh-CN",
  customAccent: "#4f7dff",
  customAccent2: "#55d6c2",
  customBackground: "#08090d",
  customPanel: "#141821",
};

export const themeOptions: Array<{
  id: ThemeId;
  name: string;
  description: string;
  colors: [string, string, string];
}> = [
  {
    id: "blue",
    name: "深空蓝",
    description: "冷静、清晰，适合日常执行看板。",
    colors: ["#4f7dff", "#55d6c2", "#7184ff"],
  },
  {
    id: "emerald",
    name: "推进绿",
    description: "强调进度、完成和长期稳定推进。",
    colors: ["#22c55e", "#52d6a4", "#14b8a6"],
  },
  {
    id: "violet",
    name: "智能紫",
    description: "更适合 AI 计划和创造性拆解。",
    colors: ["#8b5cf6", "#60a5fa", "#c084fc"],
  },
  {
    id: "amber",
    name: "琥珀黄",
    description: "突出优先级、风险提醒和复盘。",
    colors: ["#f59e0b", "#f97316", "#facc15"],
  },
  {
    id: "rose",
    name: "玫瑰红",
    description: "更醒目，适合高提醒密度场景。",
    colors: ["#f43f5e", "#fb7185", "#a78bfa"],
  },
  {
    id: "cyan",
    name: "电光青",
    description: "轻快、科技感强，适合高频查看。",
    colors: ["#06b6d4", "#67e8f9", "#38bdf8"],
  },
  {
    id: "indigo",
    name: "靛蓝",
    description: "稳重专注，适合长时间规划。",
    colors: ["#6366f1", "#38bdf8", "#818cf8"],
  },
  {
    id: "lime",
    name: "青柠",
    description: "明快醒目，突出完成反馈。",
    colors: ["#84cc16", "#bef264", "#22c55e"],
  },
  {
    id: "orange",
    name: "暖橙",
    description: "适合提醒、截止日期和行动导向。",
    colors: ["#fb923c", "#facc15", "#ef4444"],
  },
  {
    id: "slate",
    name: "石墨灰",
    description: "克制、专业，减少视觉干扰。",
    colors: ["#94a3b8", "#38bdf8", "#64748b"],
  },
  {
    id: "crimson",
    name: "深红",
    description: "强提醒风格，适合严肃任务追踪。",
    colors: ["#dc2626", "#fb7185", "#f97316"],
  },
  {
    id: "custom",
    name: "自定义",
    description: "使用下方颜色面板自由搭配。",
    colors: ["#4f7dff", "#55d6c2", "#141821"],
  },
];

export const backgroundOptions: Array<{
  id: BackgroundId;
  name: string;
  description: string;
  colors: {
    background: string;
    sidebar: string;
    panel: string;
    panelSoft: string;
    line: string;
  };
}> = [
  {
    id: "midnight",
    name: "午夜深色",
    description: "默认深色工作台，适合长时间使用。",
    colors: {
      background: "#08090d",
      sidebar: "#111318",
      panel: "#141821",
      panelSoft: "#10131a",
      line: "#242a36",
    },
  },
  {
    id: "graphite",
    name: "石墨黑",
    description: "更纯粹的低亮度背景，减少分心。",
    colors: {
      background: "#0f1115",
      sidebar: "#17191f",
      panel: "#1a1d24",
      panelSoft: "#12151b",
      line: "#30343d",
    },
  },
  {
    id: "navy",
    name: "夜航蓝",
    description: "带蓝灰层次的深色背景。",
    colors: {
      background: "#07111f",
      sidebar: "#0c1726",
      panel: "#101d2d",
      panelSoft: "#0b1421",
      line: "#26384f",
    },
  },
  {
    id: "paper",
    name: "文档浅色",
    description: "接近 Word 文档的浅色纸面感。",
    colors: {
      background: "#f3f0e8",
      sidebar: "#20232a",
      panel: "#fffdf7",
      panelSoft: "#f8f3ea",
      line: "#ded6c8",
    },
  },
  {
    id: "forest",
    name: "松林绿",
    description: "沉静自然，适合目标复盘和规划。",
    colors: {
      background: "#07130f",
      sidebar: "#0d1915",
      panel: "#13221d",
      panelSoft: "#0c1713",
      line: "#29443a",
    },
  },
  {
    id: "custom",
    name: "自定义背景",
    description: "使用自定义页面背景和面板颜色。",
    colors: {
      background: "#08090d",
      sidebar: "#111318",
      panel: "#141821",
      panelSoft: "#10131a",
      line: "#242a36",
    },
  },
];

export const languageOptions: Array<{
  code: LanguageCode;
  nativeName: string;
  englishName: string;
}> = [
  { code: "zh-CN", nativeName: "简体中文", englishName: "Chinese" },
  { code: "en-US", nativeName: "English", englishName: "English" },
  { code: "ja-JP", nativeName: "日本語", englishName: "Japanese" },
  { code: "ko-KR", nativeName: "한국어", englishName: "Korean" },
  { code: "es-ES", nativeName: "Español", englishName: "Spanish" },
  { code: "fr-FR", nativeName: "Français", englishName: "French" },
  { code: "de-DE", nativeName: "Deutsch", englishName: "German" },
  { code: "pt-BR", nativeName: "Português", englishName: "Portuguese" },
  { code: "ru-RU", nativeName: "Русский", englishName: "Russian" },
  { code: "it-IT", nativeName: "Italiano", englishName: "Italian" },
  { code: "ar-SA", nativeName: "العربية", englishName: "Arabic" },
  { code: "hi-IN", nativeName: "हिन्दी", englishName: "Hindi" },
  { code: "id-ID", nativeName: "Bahasa Indonesia", englishName: "Indonesian" },
  { code: "th-TH", nativeName: "ไทย", englishName: "Thai" },
  { code: "vi-VN", nativeName: "Tiếng Việt", englishName: "Vietnamese" },
  { code: "tr-TR", nativeName: "Türkçe", englishName: "Turkish" },
];

const navByLanguage: Record<LanguageCode, ShellCopy["nav"]> = {
  "zh-CN": [
    { label: "工作台", description: "今日提醒与执行视图" },
    { label: "目标管理", description: "长期目标与阶段拆解" },
    { label: "任务总览", description: "跨目标任务状态" },
    { label: "AI 计划", description: "目标自动拆解" },
    { label: "复盘中心", description: "周复盘与项目复盘" },
    { label: "设置中心", description: "主题、背景与语言偏好" },
  ],
  "en-US": [
    { label: "Dashboard", description: "Today and execution views" },
    { label: "Goals", description: "Long-term goals and phases" },
    { label: "Tasks", description: "Cross-goal task status" },
    { label: "AI Plan", description: "Automatic goal breakdown" },
    { label: "Reviews", description: "Weekly and project reviews" },
    { label: "Settings", description: "Theme, background and language" },
  ],
  "ja-JP": [
    { label: "ダッシュボード", description: "今日の通知と実行ビュー" },
    { label: "目標管理", description: "長期目標とフェーズ" },
    { label: "タスク", description: "目標横断のタスク状態" },
    { label: "AI 計画", description: "目標の自動分解" },
    { label: "レビュー", description: "週次とプロジェクトレビュー" },
    { label: "設定", description: "テーマ、背景、言語" },
  ],
  "ko-KR": [
    { label: "대시보드", description: "오늘 알림과 실행 보기" },
    { label: "목표 관리", description: "장기 목표와 단계" },
    { label: "작업", description: "목표별 작업 상태" },
    { label: "AI 계획", description: "목표 자동 분해" },
    { label: "리뷰", description: "주간 및 프로젝트 리뷰" },
    { label: "설정", description: "테마, 배경, 언어" },
  ],
  "es-ES": [
    { label: "Panel", description: "Avisos y ejecución de hoy" },
    { label: "Objetivos", description: "Metas y fases" },
    { label: "Tareas", description: "Estado entre objetivos" },
    { label: "Plan IA", description: "Desglose automático" },
    { label: "Revisiones", description: "Semanal y proyecto" },
    { label: "Ajustes", description: "Tema, fondo e idioma" },
  ],
  "fr-FR": [
    { label: "Tableau", description: "Alertes et exécution du jour" },
    { label: "Objectifs", description: "Objectifs et phases" },
    { label: "Tâches", description: "État entre objectifs" },
    { label: "Plan IA", description: "Découpage automatique" },
    { label: "Revues", description: "Hebdo et projet" },
    { label: "Paramètres", description: "Thème, fond et langue" },
  ],
  "de-DE": [
    { label: "Dashboard", description: "Heute und Ausführung" },
    { label: "Ziele", description: "Langfristige Ziele" },
    { label: "Aufgaben", description: "Status über Ziele" },
    { label: "KI-Plan", description: "Automatische Zerlegung" },
    { label: "Reviews", description: "Woche und Projekt" },
    { label: "Einstellungen", description: "Theme, Hintergrund, Sprache" },
  ],
  "pt-BR": [
    { label: "Painel", description: "Alertas e execução de hoje" },
    { label: "Objetivos", description: "Metas e fases" },
    { label: "Tarefas", description: "Status entre objetivos" },
    { label: "Plano IA", description: "Divisão automática" },
    { label: "Revisões", description: "Semanal e projeto" },
    { label: "Configurações", description: "Tema, fundo e idioma" },
  ],
  "ru-RU": [
    { label: "Панель", description: "Сегодня и выполнение" },
    { label: "Цели", description: "Долгосрочные цели" },
    { label: "Задачи", description: "Статус по целям" },
    { label: "План ИИ", description: "Авторазбиение целей" },
    { label: "Обзоры", description: "Неделя и проект" },
    { label: "Настройки", description: "Тема, фон и язык" },
  ],
  "it-IT": [
    { label: "Dashboard", description: "Avvisi ed esecuzione di oggi" },
    { label: "Obiettivi", description: "Obiettivi e fasi" },
    { label: "Attività", description: "Stato tra obiettivi" },
    { label: "Piano IA", description: "Scomposizione automatica" },
    { label: "Revisioni", description: "Settimanale e progetto" },
    { label: "Impostazioni", description: "Tema, sfondo e lingua" },
  ],
  "ar-SA": [
    { label: "لوحة التحكم", description: "تنبيهات اليوم والتنفيذ" },
    { label: "الأهداف", description: "الأهداف والمراحل" },
    { label: "المهام", description: "حالة المهام" },
    { label: "خطة الذكاء", description: "تفكيك تلقائي للأهداف" },
    { label: "المراجعات", description: "أسبوعية ومشروعات" },
    { label: "الإعدادات", description: "السمة والخلفية واللغة" },
  ],
  "hi-IN": [
    { label: "डैशबोर्ड", description: "आज की सूचनाएं और कार्य" },
    { label: "लक्ष्य", description: "दीर्घकालिक लक्ष्य और चरण" },
    { label: "कार्य", description: "लक्ष्यों में कार्य स्थिति" },
    { label: "AI योजना", description: "स्वचालित लक्ष्य विभाजन" },
    { label: "समीक्षा", description: "साप्ताहिक और परियोजना" },
    { label: "सेटिंग", description: "थीम, पृष्ठभूमि और भाषा" },
  ],
  "id-ID": [
    { label: "Dasbor", description: "Pengingat dan eksekusi hari ini" },
    { label: "Sasaran", description: "Sasaran jangka panjang" },
    { label: "Tugas", description: "Status lintas sasaran" },
    { label: "Rencana AI", description: "Pemecahan sasaran otomatis" },
    { label: "Tinjauan", description: "Mingguan dan proyek" },
    { label: "Pengaturan", description: "Tema, latar, bahasa" },
  ],
  "th-TH": [
    { label: "แดชบอร์ด", description: "เตือนวันนี้และการดำเนินงาน" },
    { label: "เป้าหมาย", description: "เป้าหมายระยะยาวและช่วง" },
    { label: "งาน", description: "สถานะงานข้ามเป้าหมาย" },
    { label: "แผน AI", description: "แยกเป้าหมายอัตโนมัติ" },
    { label: "ทบทวน", description: "รายสัปดาห์และโครงการ" },
    { label: "ตั้งค่า", description: "ธีม พื้นหลัง ภาษา" },
  ],
  "vi-VN": [
    { label: "Bảng điều khiển", description: "Nhắc việc và thực thi hôm nay" },
    { label: "Mục tiêu", description: "Mục tiêu dài hạn và giai đoạn" },
    { label: "Nhiệm vụ", description: "Trạng thái qua mục tiêu" },
    { label: "Kế hoạch AI", description: "Tự động phân rã mục tiêu" },
    { label: "Đánh giá", description: "Tuần và dự án" },
    { label: "Cài đặt", description: "Chủ đề, nền, ngôn ngữ" },
  ],
  "tr-TR": [
    { label: "Pano", description: "Bugünün uyarıları ve yürütme" },
    { label: "Hedefler", description: "Uzun vadeli hedefler" },
    { label: "Görevler", description: "Hedefler arası durum" },
    { label: "AI Planı", description: "Otomatik hedef kırılımı" },
    { label: "İncelemeler", description: "Haftalık ve proje" },
    { label: "Ayarlar", description: "Tema, arka plan ve dil" },
  ],
};

export const shellCopy: Record<LanguageCode, ShellCopy> = {
  "zh-CN": {
    brand: "计划执行系统",
    topbarTitle: "Plan Workspace",
    topbarSubtitle: "左侧切换功能，右侧处理当前模块细节",
    architectureLabel: "当前架构",
    navigationLabel: "系统功能",
    nav: navByLanguage["zh-CN"],
  },
  "en-US": {
    brand: "Plan Execution",
    topbarTitle: "Plan Workspace",
    topbarSubtitle: "Switch modules on the left, work in detail on the right",
    architectureLabel: "Architecture",
    navigationLabel: "System navigation",
    nav: navByLanguage["en-US"],
  },
  "ja-JP": {
    brand: "計画実行システム",
    topbarTitle: "計画ワークスペース",
    topbarSubtitle: "左で機能を切り替え、右で詳細を操作します",
    architectureLabel: "現在の構成",
    navigationLabel: "システム機能",
    nav: navByLanguage["ja-JP"],
  },
  "ko-KR": {
    brand: "계획 실행 시스템",
    topbarTitle: "계획 작업공간",
    topbarSubtitle: "왼쪽에서 기능을 바꾸고 오른쪽에서 세부 작업을 합니다",
    architectureLabel: "현재 구조",
    navigationLabel: "시스템 기능",
    nav: navByLanguage["ko-KR"],
  },
  "es-ES": {
    brand: "Sistema de Planes",
    topbarTitle: "Espacio de planificación",
    topbarSubtitle: "Cambia módulos a la izquierda y trabaja detalles a la derecha",
    architectureLabel: "Arquitectura",
    navigationLabel: "Funciones del sistema",
    nav: navByLanguage["es-ES"],
  },
  "fr-FR": {
    brand: "Système de Plan",
    topbarTitle: "Espace de planification",
    topbarSubtitle: "Changez de module à gauche, travaillez les détails à droite",
    architectureLabel: "Architecture",
    navigationLabel: "Fonctions système",
    nav: navByLanguage["fr-FR"],
  },
  "de-DE": {
    brand: "Planungssystem",
    topbarTitle: "Planungsarbeitsbereich",
    topbarSubtitle: "Links Module wechseln, rechts Details bearbeiten",
    architectureLabel: "Architektur",
    navigationLabel: "Systemfunktionen",
    nav: navByLanguage["de-DE"],
  },
  "pt-BR": {
    brand: "Sistema de Planejamento",
    topbarTitle: "Área de planejamento",
    topbarSubtitle: "Troque módulos à esquerda e trabalhe detalhes à direita",
    architectureLabel: "Arquitetura",
    navigationLabel: "Funções do sistema",
    nav: navByLanguage["pt-BR"],
  },
  "ru-RU": {
    brand: "Система планов",
    topbarTitle: "Рабочая область планов",
    topbarSubtitle: "Переключайте модули слева, работайте с деталями справа",
    architectureLabel: "Архитектура",
    navigationLabel: "Функции системы",
    nav: navByLanguage["ru-RU"],
  },
  "it-IT": {
    brand: "Sistema di Pianificazione",
    topbarTitle: "Area di pianificazione",
    topbarSubtitle: "Cambia moduli a sinistra e lavora sui dettagli a destra",
    architectureLabel: "Architettura",
    navigationLabel: "Funzioni di sistema",
    nav: navByLanguage["it-IT"],
  },
  "ar-SA": {
    brand: "نظام تنفيذ الخطط",
    topbarTitle: "مساحة التخطيط",
    topbarSubtitle: "بدّل الوحدات من اليسار واعمل على التفاصيل في اليمين",
    architectureLabel: "البنية",
    navigationLabel: "وظائف النظام",
    nav: navByLanguage["ar-SA"],
  },
  "hi-IN": {
    brand: "योजना निष्पादन प्रणाली",
    topbarTitle: "योजना कार्यक्षेत्र",
    topbarSubtitle: "बाईं ओर मॉड्यूल बदलें, दाईं ओर विवरण पर काम करें",
    architectureLabel: "संरचना",
    navigationLabel: "सिस्टम कार्य",
    nav: navByLanguage["hi-IN"],
  },
  "id-ID": {
    brand: "Sistem Eksekusi Rencana",
    topbarTitle: "Ruang kerja rencana",
    topbarSubtitle: "Ganti modul di kiri, kerjakan detail di kanan",
    architectureLabel: "Arsitektur",
    navigationLabel: "Fungsi sistem",
    nav: navByLanguage["id-ID"],
  },
  "th-TH": {
    brand: "ระบบดำเนินแผน",
    topbarTitle: "พื้นที่วางแผน",
    topbarSubtitle: "สลับโมดูลด้านซ้ายและทำรายละเอียดด้านขวา",
    architectureLabel: "สถาปัตยกรรม",
    navigationLabel: "ฟังก์ชันระบบ",
    nav: navByLanguage["th-TH"],
  },
  "vi-VN": {
    brand: "Hệ thống thực thi kế hoạch",
    topbarTitle: "Không gian kế hoạch",
    topbarSubtitle: "Đổi mô-đun bên trái, xử lý chi tiết bên phải",
    architectureLabel: "Kiến trúc",
    navigationLabel: "Chức năng hệ thống",
    nav: navByLanguage["vi-VN"],
  },
  "tr-TR": {
    brand: "Plan Yürütme Sistemi",
    topbarTitle: "Plan çalışma alanı",
    topbarSubtitle: "Modülleri solda değiştirin, ayrıntıları sağda çalışın",
    architectureLabel: "Mimari",
    navigationLabel: "Sistem işlevleri",
    nav: navByLanguage["tr-TR"],
  },
};

const commonEnglish: UiTranslation = {
  "计划执行系统": "Plan Execution System",
  "先处理提醒和逾期，再推进今日任务。首页只保留高频入口和可执行信息。":
    "Handle reminders and overdue work first, then move today's tasks forward. The home page keeps only frequent entries and actionable information.",
  "今日节奏": "Today Rhythm",
  "今日": "Today",
  "逾期": "Overdue",
  "提醒": "Reminders",
  "进行中": "In Progress",
  "本周任务": "This Week",
  "预计小时": "Estimated Hours",
  "目标数量": "Goals",
  "任务提醒": "Task Reminders",
  "按紧急程度排序，先处理逾期和今天必须收口的任务。":
    "Sorted by urgency. Handle overdue and must-finish tasks first.",
  "当前没有需要提醒的任务。": "No tasks currently need reminders.",
  "任务视图": "Task View",
  "恢复默认": "Reset Defaults",
  "今日到期": "Due Today",
  "把今天能收束的事项先推进。": "Move forward the work that can be closed today.",
  "逾期任务": "Overdue Tasks",
  "需要重新评估截止日期，或立刻处理。":
    "Reassess the due date or handle it immediately.",
  "进行中任务": "In-progress Tasks",
  "已经启动的任务优先保持推进。": "Keep already-started work moving first.",
  "检查本周计划是否与目标进度匹配。":
    "Check whether this week's plan matches goal progress.",
  "今天没有到期的未完成任务。": "No unfinished tasks are due today.",
  "目前没有逾期未完成任务。": "No unfinished tasks are overdue.",
  "目前没有标记为进行中的任务。": "No tasks are marked as in progress.",
  "本周还没有设置截止日期的任务。": "No tasks have due dates this week.",
  "目标进度": "Goal Progress",
  "还没有目标，先创建一个目标开始规划。":
    "No goals yet. Create one to start planning.",
  "常用入口": "Frequent Entries",
  "目标管理": "Goal Management",
  "目标、阶段和进度": "Goals, phases and progress",
  "任务总览": "Task Overview",
  "状态与截止日期": "Status and due dates",
  "AI 计划": "AI Plan",
  "拆解目标任务": "Break down goal tasks",
  "复盘中心": "Review Center",
  "周复盘与调整": "Weekly review and adjustment",
  "返回首页": "Back Home",
  "工作量": "Workload",
  "当前任务预计总耗时": "Total estimated task hours",
  "跨目标查看所有任务状态，快速发现正在推进、已经逾期和已经完成的事项。":
    "View all task states across goals and quickly find in-progress, overdue and completed items.",
  "完成": "Done",
  "编辑": "Edit",
  "删除": "Delete",
  "删除中...": "Deleting...",
  "删除目标": "Delete Goal",
  "已完成": "Completed",
  "未完成": "Incomplete",
  "仍有任务待推进": "Tasks still need progress",
  "目标任务已收束": "Goal tasks are closed",
  "已归档保存": "Archived",
  "目标状态": "Goal Status",
  "未开始": "Not Started",
  "延期": "Delayed",
  "已归档": "Archived",
  "已逾期": "Overdue",
  "今天到期": "Due Today",
  "三天内截止": "Due in 3 Days",
  "处理中...": "Processing...",
  "延后...": "Delay...",
  "明天": "Tomorrow",
  "三天后": "In 3 Days",
  "一周后": "In 1 Week",
  "状态：": "Status: ",
  "所属目标：": "Goal: ",
  "优先级：": "Priority: ",
  "预计：": "Estimate: ",
  "截止：": "Due: ",
  "创建于": "Created",
  "查看详情": "View Details",
  "高": "High",
  "中": "Medium",
  "低": "Low",
  "状态": "Status",
  "日期": "Date",
  "风险": "Risk",
  "周": "Week",
  "全部任务": "All Tasks",
  "按状态聚合，方便快速扫一遍执行情况。":
    "Grouped by status for a quick execution scan.",
  "还没有任务": "No Tasks Yet",
  "进入目标详情页创建任务后，这里会显示跨目标的任务概览。":
    "After creating tasks in goal details, a cross-goal overview will appear here.",
  "未设置日期": "No date set",
  "未设置": "Not set",
  "未估时": "Not estimated",
  "小时": "hours",
  "个任务已完成": "tasks completed",
  "任务已完成": "tasks completed",
  "设置中心": "Settings Center",
  "管理系统级视觉颜色、背景和语言偏好。偏好会保存在本机浏览器中，并立即应用到左侧导航、系统外框和常用功能页面。":
    "Manage system-level colors, backgrounds and language preferences. Preferences are stored in this browser and applied immediately to navigation, shell and common feature pages.",
  "主题色、背景和语言都会实时更新；用户自己输入的目标与任务内容保持原文。":
    "Theme, background and language update in real time; user-entered goals and tasks remain unchanged.",
  "全局视觉颜色": "Global Visual Colors",
  "选择系统强调色，或使用自定义颜色搭配导航、按钮、提示和关键数据。":
    "Choose a system accent color or customize navigation, buttons, hints and key data.",
  "页面背景": "Page Background",
  "背景不仅可以切换预设，也可以像文档配色一样单独设置页面底色和面板底色。":
    "Switch background presets or separately set page and panel colors like document styling.",
  "自定义调色板": "Custom Palette",
  "选择自定义主题或自定义背景后，下方颜色会直接驱动全局 CSS 变量。":
    "After choosing custom theme or background, the colors below drive global CSS variables directly.",
  "主强调色": "Primary Accent",
  "辅助强调色": "Secondary Accent",
  "页面底色": "Page Color",
  "面板底色": "Panel Color",
  "系统语言": "System Language",
  "选择语言后，左侧导航、系统外框、设置页以及常用功能页的系统文案会同步切换。":
    "After choosing a language, navigation, shell, settings and common feature page labels update together.",
  "语言覆盖范围": "Language Coverage",
  "系统静态文案会切换语言；你自己创建的目标、任务、复盘内容不会被自动翻译。":
    "Static system copy changes language; goals, tasks and reviews you create are not automatically translated.",
  "应用预览": "Live Preview",
  "当前选择会立即作用到系统外框和右侧功能页面。":
    "The current selection applies immediately to the shell and right-side feature pages.",
  "当前设置": "Current Settings",
  "主题": "Theme",
  "背景": "Background",
  "语言": "Language",
  "恢复默认偏好": "Restore Default Preferences",
  "快速选择": "Quick Select",
  "主题颜色": "Theme Color",
  "背景样式": "Background Style",
  "周期执行统计": "Period Execution Metrics",
  "请选择复盘周期": "Please choose a review period",
  "已加载已保存复盘": "Saved review loaded",
  "完成率": "Completion Rate",
  "完成任务": "Completed Tasks",
  "未完成任务": "Incomplete Tasks",
  "统计任务": "Tracked Tasks",
  "该周期没有完成任务。": "No completed tasks in this period.",
  "该周期没有未完成任务。": "No incomplete tasks in this period.",
  "该周期没有逾期任务。": "No overdue tasks in this period.",
  "这一周期整体发生了什么，执行节奏如何。":
    "What happened during this period and how execution flowed.",
  "完成得不错、值得保留的做法。":
    "What went well and should be kept.",
  "阻碍、风险、卡点和反复拖延的原因。":
    "Blockers, risks, stuck points and causes of repeated delay.",
  "下一周期要做的具体动作。":
    "Concrete actions for the next period.",
  "概括本周期的推进情况、节奏变化和关键结论。":
    "Summarize progress, rhythm changes and key conclusions.",
  "记录完成事项、有效策略、关键进展或正向反馈。":
    "Record completed work, effective strategies, key progress or positive feedback.",
  "写下阻碍来源、依赖问题、精力瓶颈或计划偏差。":
    "Write down blocker sources, dependency issues, energy bottlenecks or plan drift.",
  "列出下一步行动、负责人、截止时间或优先级。":
    "List next actions, owner, deadline or priority.",
  "周复盘操作": "Weekly Review Controls",
  "选择目标与复盘周期后，系统会自动统计该周期内的完成、未完成和逾期任务。":
    "After choosing a goal and period, the system automatically counts completed, incomplete and overdue tasks.",
  "开始日期": "Start Date",
  "结束日期": "End Date",
  "回到本周": "Back to This Week",
  "AI 生成 Summary": "Generate Summary with AI",
  "保存周复盘": "Save Weekly Review",
  "生成中...": "Generating...",
  "保存中...": "Saving...",
  "深空蓝": "Deep Space Blue",
  "推进绿": "Progress Green",
  "智能紫": "Intelligence Violet",
  "琥珀黄": "Amber",
  "玫瑰红": "Rose",
  "电光青": "Electric Cyan",
  "靛蓝": "Indigo",
  "青柠": "Lime",
  "暖橙": "Warm Orange",
  "石墨灰": "Graphite Gray",
  "深红": "Crimson",
  "自定义": "Custom",
  "冷静、清晰，适合日常执行看板。":
    "Calm and clear for everyday execution dashboards.",
  "强调进度、完成和长期稳定推进。":
    "Emphasizes progress, completion and steady movement.",
  "更适合 AI 计划和创造性拆解。":
    "Better for AI planning and creative breakdowns.",
  "突出优先级、风险提醒和复盘。":
    "Highlights priority, risk reminders and reviews.",
  "更醒目，适合高提醒密度场景。":
    "More visible for high-reminder workflows.",
  "轻快、科技感强，适合高频查看。":
    "Light, technical and good for frequent scanning.",
  "稳重专注，适合长时间规划。":
    "Focused and stable for long planning sessions.",
  "明快醒目，突出完成反馈。":
    "Bright and vivid for completion feedback.",
  "适合提醒、截止日期和行动导向。":
    "Good for reminders, due dates and action bias.",
  "克制、专业，减少视觉干扰。":
    "Restrained and professional with less visual noise.",
  "强提醒风格，适合严肃任务追踪。":
    "Strong reminder style for serious task tracking.",
  "使用下方颜色面板自由搭配。":
    "Use the custom color panel below.",
  "午夜深色": "Midnight Dark",
  "石墨黑": "Graphite Black",
  "夜航蓝": "Night Navy",
  "文档浅色": "Document Light",
  "松林绿": "Pine Forest",
  "自定义背景": "Custom Background",
  "默认深色工作台，适合长时间使用。":
    "Default dark workspace for long sessions.",
  "更纯粹的低亮度背景，减少分心。":
    "Lower-brightness background with fewer distractions.",
  "带蓝灰层次的深色背景。": "Dark background with blue-gray layers.",
  "接近 Word 文档的浅色纸面感。":
    "A light paper feel close to Word documents.",
  "沉静自然，适合目标复盘和规划。":
    "Quiet and natural for goal review and planning.",
  "使用自定义页面背景和面板颜色。":
    "Use custom page and panel colors.",
};

function fromEnglish(overrides: UiTranslation) {
  return Object.fromEntries(
    Object.entries(commonEnglish).map(([key, value]) => [
      key,
      overrides[key] ?? value,
    ]),
  );
}

export const uiTranslations: Partial<Record<LanguageCode, UiTranslation>> = {
  "en-US": commonEnglish,
  "ja-JP": fromEnglish({
    "计划执行系统": "計画実行システム",
    "今日": "今日",
    "逾期": "期限超過",
    "提醒": "通知",
    "进行中": "進行中",
    "本周任务": "今週のタスク",
    "目标数量": "目標数",
    "任务提醒": "タスク通知",
    "任务视图": "タスクビュー",
    "恢复默认": "既定に戻す",
    "今日到期": "今日が期限",
    "逾期任务": "期限超過タスク",
    "进行中任务": "進行中タスク",
    "目标进度": "目標進捗",
    "常用入口": "よく使う入口",
    "目标管理": "目標管理",
    "任务总览": "タスク概要",
    "复盘中心": "レビューセンター",
    "返回首页": "ホームへ戻る",
    "设置中心": "設定センター",
    "全局视觉颜色": "全体の視覚カラー",
    "页面背景": "ページ背景",
    "自定义调色板": "カスタムパレット",
    "系统语言": "システム言語",
    "应用预览": "ライブプレビュー",
    "当前设置": "現在の設定",
    "主题": "テーマ",
    "背景": "背景",
    "语言": "言語",
  }),
  "ko-KR": fromEnglish({
    "计划执行系统": "계획 실행 시스템",
    "今日": "오늘",
    "逾期": "기한 초과",
    "提醒": "알림",
    "进行中": "진행 중",
    "本周任务": "이번 주 작업",
    "目标数量": "목표 수",
    "任务提醒": "작업 알림",
    "任务视图": "작업 보기",
    "恢复默认": "기본값 복원",
    "今日到期": "오늘 마감",
    "逾期任务": "기한 초과 작업",
    "进行中任务": "진행 중 작업",
    "目标进度": "목표 진행률",
    "常用入口": "자주 쓰는 항목",
    "目标管理": "목표 관리",
    "任务总览": "작업 개요",
    "复盘中心": "리뷰 센터",
    "返回首页": "홈으로 돌아가기",
    "设置中心": "설정 센터",
    "全局视觉颜色": "전역 시각 색상",
    "页面背景": "페이지 배경",
    "自定义调色板": "사용자 팔레트",
    "系统语言": "시스템 언어",
    "应用预览": "실시간 미리보기",
    "当前设置": "현재 설정",
    "主题": "테마",
    "背景": "배경",
    "语言": "언어",
  }),
  "es-ES": fromEnglish({
    "计划执行系统": "Sistema de ejecución de planes",
    "今日": "Hoy",
    "逾期": "Vencido",
    "提醒": "Avisos",
    "进行中": "En curso",
    "本周任务": "Tareas de esta semana",
    "目标数量": "Objetivos",
    "任务提醒": "Avisos de tareas",
    "任务视图": "Vista de tareas",
    "恢复默认": "Restaurar",
    "今日到期": "Vence hoy",
    "逾期任务": "Tareas vencidas",
    "目标进度": "Progreso de objetivos",
    "设置中心": "Centro de ajustes",
    "系统语言": "Idioma del sistema",
    "主题": "Tema",
    "背景": "Fondo",
    "语言": "Idioma",
  }),
  "fr-FR": fromEnglish({
    "计划执行系统": "Système d'exécution des plans",
    "今日": "Aujourd'hui",
    "逾期": "En retard",
    "提醒": "Alertes",
    "进行中": "En cours",
    "本周任务": "Tâches de la semaine",
    "目标数量": "Objectifs",
    "任务提醒": "Alertes de tâches",
    "设置中心": "Centre de paramètres",
    "系统语言": "Langue du système",
    "主题": "Thème",
    "背景": "Fond",
    "语言": "Langue",
  }),
  "de-DE": fromEnglish({
    "计划执行系统": "Plan-Ausführungssystem",
    "今日": "Heute",
    "逾期": "Überfällig",
    "提醒": "Hinweise",
    "进行中": "In Arbeit",
    "本周任务": "Aufgaben dieser Woche",
    "目标数量": "Ziele",
    "任务提醒": "Aufgabenerinnerungen",
    "设置中心": "Einstellungszentrum",
    "系统语言": "Systemsprache",
    "主题": "Theme",
    "背景": "Hintergrund",
    "语言": "Sprache",
  }),
  "pt-BR": fromEnglish({
    "计划执行系统": "Sistema de execução de planos",
    "今日": "Hoje",
    "逾期": "Atrasado",
    "提醒": "Alertas",
    "进行中": "Em andamento",
    "本周任务": "Tarefas da semana",
    "目标数量": "Objetivos",
    "设置中心": "Central de configurações",
    "系统语言": "Idioma do sistema",
    "主题": "Tema",
    "背景": "Fundo",
    "语言": "Idioma",
  }),
  "ru-RU": fromEnglish({
    "计划执行系统": "Система выполнения планов",
    "今日": "Сегодня",
    "逾期": "Просрочено",
    "提醒": "Напоминания",
    "进行中": "В работе",
    "本周任务": "Задачи недели",
    "目标数量": "Цели",
    "设置中心": "Центр настроек",
    "系统语言": "Язык системы",
    "主题": "Тема",
    "背景": "Фон",
    "语言": "Язык",
  }),
  "it-IT": fromEnglish({
    "计划执行系统": "Sistema di esecuzione piani",
    "今日": "Oggi",
    "逾期": "Scaduto",
    "提醒": "Promemoria",
    "进行中": "In corso",
    "本周任务": "Attività della settimana",
    "目标数量": "Obiettivi",
    "设置中心": "Centro impostazioni",
    "系统语言": "Lingua di sistema",
    "主题": "Tema",
    "背景": "Sfondo",
    "语言": "Lingua",
  }),
  "ar-SA": fromEnglish({
    "计划执行系统": "نظام تنفيذ الخطط",
    "今日": "اليوم",
    "逾期": "متأخر",
    "提醒": "تذكيرات",
    "进行中": "قيد التنفيذ",
    "本周任务": "مهام هذا الأسبوع",
    "目标数量": "الأهداف",
    "设置中心": "مركز الإعدادات",
    "系统语言": "لغة النظام",
    "主题": "السمة",
    "背景": "الخلفية",
    "语言": "اللغة",
  }),
  "hi-IN": fromEnglish({
    "计划执行系统": "योजना निष्पादन प्रणाली",
    "今日": "आज",
    "逾期": "अतिदेय",
    "提醒": "रिमाइंडर",
    "进行中": "प्रगति में",
    "本周任务": "इस सप्ताह के कार्य",
    "目标数量": "लक्ष्य",
    "设置中心": "सेटिंग केंद्र",
    "系统语言": "सिस्टम भाषा",
    "主题": "थीम",
    "背景": "पृष्ठभूमि",
    "语言": "भाषा",
  }),
  "id-ID": fromEnglish({
    "计划执行系统": "Sistem eksekusi rencana",
    "今日": "Hari ini",
    "逾期": "Terlambat",
    "提醒": "Pengingat",
    "进行中": "Berjalan",
    "本周任务": "Tugas minggu ini",
    "目标数量": "Sasaran",
    "设置中心": "Pusat pengaturan",
    "系统语言": "Bahasa sistem",
    "主题": "Tema",
    "背景": "Latar",
    "语言": "Bahasa",
  }),
  "th-TH": fromEnglish({
    "计划执行系统": "ระบบดำเนินแผน",
    "今日": "วันนี้",
    "逾期": "เกินกำหนด",
    "提醒": "การเตือน",
    "进行中": "กำลังดำเนินการ",
    "本周任务": "งานสัปดาห์นี้",
    "目标数量": "เป้าหมาย",
    "设置中心": "ศูนย์ตั้งค่า",
    "系统语言": "ภาษาระบบ",
    "主题": "ธีม",
    "背景": "พื้นหลัง",
    "语言": "ภาษา",
  }),
  "vi-VN": fromEnglish({
    "计划执行系统": "Hệ thống thực thi kế hoạch",
    "今日": "Hôm nay",
    "逾期": "Quá hạn",
    "提醒": "Nhắc nhở",
    "进行中": "Đang làm",
    "本周任务": "Nhiệm vụ tuần này",
    "目标数量": "Mục tiêu",
    "设置中心": "Trung tâm cài đặt",
    "系统语言": "Ngôn ngữ hệ thống",
    "主题": "Chủ đề",
    "背景": "Nền",
    "语言": "Ngôn ngữ",
  }),
  "tr-TR": fromEnglish({
    "计划执行系统": "Plan yürütme sistemi",
    "今日": "Bugün",
    "逾期": "Gecikmiş",
    "提醒": "Hatırlatmalar",
    "进行中": "Devam ediyor",
    "本周任务": "Bu haftanın görevleri",
    "目标数量": "Hedefler",
    "设置中心": "Ayar merkezi",
    "系统语言": "Sistem dili",
    "主题": "Tema",
    "背景": "Arka plan",
    "语言": "Dil",
  }),
};

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

function hexToRgb(value: string) {
  const normalized = value.replace("#", "");

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function rgba(value: string, alpha: number) {
  const { r, g, b } = hexToRgb(value);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function isLightColor(value: string) {
  const { r, g, b } = hexToRgb(value);

  return (r * 299 + g * 587 + b * 114) / 1000 > 170;
}

function getThemeColors(preferences: AppPreferences) {
  if (preferences.theme === "custom") {
    return {
      accent: preferences.customAccent,
      accent2: preferences.customAccent2,
    };
  }

  const theme =
    themeOptions.find((option) => option.id === preferences.theme) ??
    themeOptions[0];

  return {
    accent: theme.colors[0],
    accent2: theme.colors[1],
  };
}

function getBackgroundColors(preferences: AppPreferences) {
  if (preferences.background === "custom") {
    return {
      background: preferences.customBackground,
      sidebar: preferences.customPanel,
      panel: preferences.customPanel,
      panelSoft: preferences.customBackground,
      line: rgba(preferences.customAccent, 0.28),
    };
  }

  const background =
    backgroundOptions.find((option) => option.id === preferences.background) ??
    backgroundOptions[0];

  return background.colors;
}

export function readStoredPreferences() {
  if (typeof window === "undefined") {
    return defaultPreferences;
  }

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(preferenceStorageKey) ?? "null",
    ) as Partial<AppPreferences> | null;

    const parsedTheme = parsed?.theme;
    const parsedBackground = parsed?.background;
    const parsedLanguage = parsed?.language;

    return {
      theme: themeOptions.some((option) => option.id === parsedTheme)
        ? (parsedTheme as ThemeId)
        : defaultPreferences.theme,
      background: backgroundOptions.some(
        (option) => option.id === parsedBackground,
      )
        ? (parsedBackground as BackgroundId)
        : defaultPreferences.background,
      language: languageOptions.some((option) => option.code === parsedLanguage)
        ? (parsedLanguage as LanguageCode)
        : defaultPreferences.language,
      customAccent: isHexColor(parsed?.customAccent)
        ? parsed.customAccent
        : defaultPreferences.customAccent,
      customAccent2: isHexColor(parsed?.customAccent2)
        ? parsed.customAccent2
        : defaultPreferences.customAccent2,
      customBackground: isHexColor(parsed?.customBackground)
        ? parsed.customBackground
        : defaultPreferences.customBackground,
      customPanel: isHexColor(parsed?.customPanel)
        ? parsed.customPanel
        : defaultPreferences.customPanel,
    };
  } catch {
    return defaultPreferences;
  }
}

export function applyPreferences(preferences: AppPreferences) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const themeColors = getThemeColors(preferences);
  const backgroundColors = getBackgroundColors(preferences);

  root.dataset.theme = preferences.theme;
  root.dataset.background = preferences.background;
  root.dataset.language = preferences.language;
  root.dir = preferences.language === "ar-SA" ? "rtl" : "ltr";
  root.lang = preferences.language;
  root.style.setProperty("--accent", themeColors.accent);
  root.style.setProperty("--accent-2", themeColors.accent2);
  root.style.setProperty("--accent-soft", rgba(themeColors.accent, 0.16));
  root.style.setProperty("--mint", themeColors.accent2);
  root.style.setProperty("--mint-deep", themeColors.accent);
  root.style.setProperty("--background", backgroundColors.background);
  root.style.setProperty("--app-bg", backgroundColors.background);
  root.style.setProperty("--sidebar-bg", backgroundColors.sidebar);
  root.style.setProperty("--panel-bg", backgroundColors.panel);
  root.style.setProperty("--panel-soft", backgroundColors.panelSoft);
  root.style.setProperty("--line", backgroundColors.line);
  root.style.setProperty("--line-strong", rgba(themeColors.accent, 0.42));

  if (isLightColor(backgroundColors.panel)) {
    root.style.setProperty("--foreground", "#1f2523");
    root.style.setProperty("--ink", "#1f2523");
    root.style.setProperty("--muted", "#626a73");
  } else {
    root.style.setProperty("--foreground", "#f5f7fb");
    root.style.setProperty("--ink", "#f5f7fb");
    root.style.setProperty("--muted", "#c3cad8");
  }
}

export function persistPreferences(preferences: AppPreferences) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(preferenceStorageKey, JSON.stringify(preferences));
  applyPreferences(preferences);
  window.dispatchEvent(
    new CustomEvent("plan-preferences-change", { detail: preferences }),
  );
}
