export type TimelineStage = 'phase_12m' | 'phase_6m' | 'phase_3m' | 'phase_1m' | 'phase_post';

export interface TimelineTask {
  id: string;
  stage: TimelineStage;
  titleFr: string;
  titleAr: string;
  titleEn?: string;
  descriptionFr: string;
  descriptionAr: string;
  descriptionEn?: string;
  categoryIcon: string;
  isCompleted: boolean;
  dueDate?: string;     // YYYY-MM-DD
  isCustom?: boolean;
  notes?: string;
}

export interface TimelineMilestone {
  stage: TimelineStage;
  titleFr: string;
  titleAr: string;
  titleEn?: string;
  timeframeFr: string;
  timeframeAr: string;
  timeframeEn?: string;
  icon: string;
}

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    stage: 'phase_12m',
    titleFr: 'Fondations & Gros Électroménager',
    titleAr: 'الأساسيات والأجهزة الكبرى',
    titleEn: 'Foundations & Major Appliances',
    timeframeFr: '9 à 12 mois avant',
    timeframeAr: '9 إلى 12 شهراً قبل الموعد',
    timeframeEn: '9 to 12 months before',
    icon: '⚡'
  },
  {
    stage: 'phase_6m',
    titleFr: 'Chambre, Literie & Cuisine Principale',
    titleAr: 'غرفة النوم وأساسيات المطبخ',
    titleEn: 'Bedroom, Bedding & Kitchen Essentials',
    timeframeFr: '6 à 9 mois avant',
    timeframeAr: '6 إلى 9 أشهر قبل الموعد',
    timeframeEn: '6 to 9 months before',
    icon: '🛏️'
  },
  {
    stage: 'phase_3m',
    titleFr: 'Vaisselle de Réception, Linge & Rideaux',
    titleAr: 'أواني الضيافة، المفروشات والستائر',
    titleEn: 'Hospitality Dinnerware, Linens & Curtains',
    timeframeFr: '3 à 6 mois avant',
    timeframeAr: '3 إلى 6 أشهر قبل الموعد',
    timeframeEn: '3 to 6 months before',
    icon: '🍽️'
  },
  {
    stage: 'phase_1m',
    titleFr: 'Trousseau Précieux, Hammam & Valises',
    titleAr: 'جهاز العروس الخاص، الحمام وحقائب السفر',
    titleEn: 'Bridal Vanity, Hammam & Luggage',
    timeframeFr: '1 à 3 mois avant',
    timeframeAr: 'شهر إلى 3 أشهر قبل الموعد',
    timeframeEn: '1 to 3 months before',
    icon: '💎'
  },
  {
    stage: 'phase_post',
    titleFr: 'Installation, Rangement & Touches Finales',
    titleAr: 'الترتيب والتنظيم واللمسات الأخيرة',
    titleEn: 'Settling In, Storage & Final Touches',
    timeframeFr: 'Dernier mois & Embonpoint',
    timeframeAr: 'الشهر الأخير وتجهيز البيت',
    timeframeEn: 'Final month & Settling in',
    icon: '✨'
  }
];

export const INITIAL_TIMELINE_TASKS: TimelineTask[] = [
  {
    id: 't-01',
    stage: 'phase_12m',
    titleFr: 'Définir le budget global et la liste de priorités',
    titleAr: 'تحديد الميزانية الإجمالية وقائمة الأولويات',
    titleEn: 'Define overall budget and priority checklist',
    descriptionFr: 'Fixer la limite budgétaire et convenir des gros postes de dépenses avec sérénité.',
    descriptionAr: 'تحديد سقف المصاريف المتوقعة والاتفاق على المقتنيات الأساسية براحة وهدوء.',
    categoryIcon: '🎯',
    isCompleted: false
  },
  {
    id: 't-02',
    stage: 'phase_12m',
    titleFr: 'Repérer le gros électroménager (Réfrigérateur, Lave-linge)',
    titleAr: 'اختيار الأجهزة الكهرومنزلية الكبيرة (ثلاجة، غسالة)',
    titleEn: 'Shortlist major appliances (Fridge, Washing machine)',
    descriptionFr: 'Comparer les dimensions et garanties des grandes marques disponibles en Tunisie.',
    descriptionAr: 'مقارنة الأحجام وعروض الضمان في المتاجر التونسية المعتمدة.',
    categoryIcon: '⚡',
    isCompleted: false
  },
  {
    id: 't-03',
    stage: 'phase_6m',
    titleFr: 'Choisir la literie principale et le couvre-lit des mariés',
    titleAr: 'اختيار مفارش السرير وغطاء العروس الفاخر',
    titleEn: 'Select master bedding and bridal bedspread',
    descriptionFr: 'Commander le couvre-lit brodé traditionnel ou moderne et les parures en satin/coton.',
    descriptionAr: 'حجز غطاء السرير المطرز ومجموعات الملاءات القطنية عالية الجودة.',
    categoryIcon: '🛏️',
    isCompleted: false
  },
  {
    id: 't-04',
    stage: 'phase_6m',
    titleFr: 'Acquérir la batterie de cuisine & le couscoussier traditionnel',
    titleAr: 'اقتناء أواني الطهي اليومية والمقفول والكسكاس التونسي',
    titleEn: 'Acquire cookware set & authentic Tunisian couscoussier',
    descriptionFr: 'Investir dans de l’inox 18/10 durable pour toutes les recettes tunisiennes.',
    descriptionAr: 'اختيار إينوكس عالي الجودة للطبخ التونسي الأصيل والتحضير اليومي.',
    categoryIcon: '🍳',
    isCompleted: false
  },
  {
    id: 't-05',
    stage: 'phase_3m',
    titleFr: 'Compléter le service de table des invités et la ménagère',
    titleAr: 'استكمال طقم مائدة الضيوف والملاعق الفاخرة',
    titleEn: 'Complete guest dinnerware and flatware set',
    descriptionFr: 'Prévoir un service pour 12 personnes avec verres et couverts assortis.',
    descriptionAr: 'تجهيز طقم ضيافة لـ 12 شخصاً مع أطقم الكؤوس والملاعق المناسبة.',
    categoryIcon: '🍽️',
    isCompleted: false
  },
  {
    id: 't-06',
    stage: 'phase_3m',
    titleFr: 'Prendre les mesures des fenêtres pour les rideaux et voilages',
    titleAr: 'أخذ مقاسات النوافذ وتفصيل الستائر',
    titleEn: 'Measure windows for custom curtains and drapes',
    descriptionFr: 'Commander les tissus et voilages pour le salon et la chambre.',
    descriptionAr: 'اختيار وتفصيل أقمشة الستائر للصالون وغرفة النوم.',
    categoryIcon: '🛋️',
    isCompleted: false
  },
  {
    id: 't-07',
    stage: 'phase_1m',
    titleFr: 'Préparer le trousseau intime, peignoirs et coffret Hammam',
    titleAr: 'تحضير ملابس العروس الخاصة وطقم برانس الحمام والتطريز',
    titleEn: 'Prepare bridal vanity, bathrobes and traditional Hammam set',
    descriptionFr: 'Rassembler les foutas d’exception, peignoirs brodés et produits de soin.',
    descriptionAr: 'تجميع الفوطة التونسية الرفيعة والبرانس المطرزة ولوازم العناية.',
    categoryIcon: '🛁',
    isCompleted: false
  },
  {
    id: 't-08',
    stage: 'phase_1m',
    titleFr: 'Acheter le set de valises de voyage pour le trousseau',
    titleAr: 'شراء حقائب السفر الخاصة بنقل جهاز العروس',
    titleEn: 'Purchase luggage set for bridal trousseau transfer',
    descriptionFr: 'Un set de 3 à 4 valises robustes et élégantes pour le transport du Jhez.',
    descriptionAr: 'طقم حقائب متين وأنيق لنقل جهاز العروس إلى بيت الزوجية.',
    categoryIcon: '💎',
    isCompleted: false
  },
  {
    id: 't-09',
    stage: 'phase_post',
    titleFr: 'Organisation des placards avec housses et séparateurs',
    titleAr: 'ترتيب الخزائن وتنظيم الملابس والمفروشات',
    titleEn: 'Closet organization with covers and organizers',
    descriptionFr: 'Placer les cintres coordonnés et les boîtes hermétiques de rangement.',
    descriptionAr: 'وضع العالقات المتناسقة والمنظمات لبيت أنيق وسهل الصيانة.',
    categoryIcon: '📦',
    isCompleted: false
  },
  {
    id: 't-10',
    stage: 'phase_post',
    titleFr: 'Imprimer la checklist finale certifiée Darna',
    titleAr: 'طباعة القائمة النهائية للمراجعة والتأكد',
    titleEn: 'Print final Darna trousseau checklist',
    descriptionFr: 'Télécharger le livret PDF A4 pour un dernier pointage en famille.',
    descriptionAr: 'استخراج الملف بصيغة PDF لمراجعته بكل ثقة مع العائلة.',
    categoryIcon: '✨',
    isCompleted: false
  }
];
