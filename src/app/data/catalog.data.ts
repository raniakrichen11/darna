import { CatalogCategory, CatalogItem } from '../models/catalog.model';

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    id: 'cuisine-ustensiles',
    nameFr: 'Cuisine et ustensiles',
    nameAr: 'المطبخ وأدواته',
    descriptionFr: 'Batterie de cuisine, casseroles, ustensiles et matériel de cuisson.',
    descriptionAr: 'أواني الطهي، القدور، أدوات التحضير ومستلزمات الطبخ اليومي والتقليدي.',
    icon: '🍳',
    image: 'assets/cat_kitchen.jpg',
    subcategories: [
      { id: 'cuisson-plats', nameFr: 'Cuisson et casseroles', nameAr: 'قدور وأواني الطهي' },
      { id: 'ustensiles-decoupe', nameFr: 'Ustensiles et découpe', nameAr: 'أدوات التحضير والتقطيع' },
      { id: 'patisserie-accessoires', nameFr: 'Pâtisserie et petits accessoires', nameAr: 'مستلزمات الحلويات والمطبخ' },
      { id: 'traditionnel-tunisien', nameFr: 'Matériel traditionnel', nameAr: 'أدوات المطبخ التونسي التقليدي' }
    ]
  },
  {
    id: 'vaisselle-service',
    nameFr: 'Vaisselle et service',
    nameAr: 'الأواني وأدوات التقديم',
    descriptionFr: 'Assiettes, couverts, verres, services à thé et plateaux de présentation.',
    descriptionAr: 'الصحون، الملاعق والسكاكين، الكؤوس، أطقم الشاي والقهوة وصواني التقديم.',
    icon: '🍽️',
    image: 'assets/cat_kitchen.jpg',
    subcategories: [
      { id: 'services-table', nameFr: 'Services de table et assiettes', nameAr: 'أطقم المائدة والصحون' },
      { id: 'couverts-verrerie', nameFr: 'Couverts et verres', nameAr: 'الملاعق وأطقم الكؤوس' },
      { id: 'the-cafe', nameFr: 'Service thé et café', nameAr: 'أطقم الشاي والقهوة التونسية' },
      { id: 'plateaux-plats', nameFr: 'Plateaux et plats de service', nameAr: 'الصواني وأواني الضيافة' }
    ]
  },
  {
    id: 'chambre-literie',
    nameFr: 'Chambre et literie',
    nameAr: 'غرفة النوم والمفروشات',
    descriptionFr: 'Draps, couettes, oreillers, couvre-lits et literie des mariés.',
    descriptionAr: 'الملاءات، الأغطية واللحاف، الوسائد، أغطية السرير الفاخرة ومفروشات العروس.',
    icon: '🛏️',
    image: 'assets/cat_bedroom.jpg',
    subcategories: [
      { id: 'parures-draps', nameFr: 'Parures de lit et draps', nameAr: 'أطقم الملاءات والشراشف' },
      { id: 'couettes-oreillers', nameFr: 'Couettes et oreillers', nameAr: 'اللحاف، البطانيات والوسائد' },
      { id: 'couvre-lits-mariee', nameFr: 'Couvre-lits de mariée', nameAr: 'أغطية السرير الخاصة بالعروس' },
      { id: 'protection-literie', nameFr: 'Protection et confort', nameAr: 'واقيات المراتب ومستلزمات النوم' }
    ]
  },
  {
    id: 'salle-de-bain',
    nameFr: 'Salle de bain',
    nameAr: 'الحمّام',
    descriptionFr: 'Serviettes, foutas, tapis de bain, accessoires et rituels hammam.',
    descriptionAr: 'المناشف، الفوطة التونسية، سجادات الحمام، الإكسسوارات ومستلزمات الحمام التقليدي.',
    icon: '🛁',
    image: 'assets/cat_bath.jpg',
    subcategories: [
      { id: 'serviettes-foutas', nameFr: 'Serviettes et Foutas', nameAr: 'المناشف وفوطة الحمام' },
      { id: 'peignoirs-tapis', nameFr: 'Peignoirs et tapis de bain', nameAr: 'البرانس وسجاد الحمام' },
      { id: 'accessoires-sdb', nameFr: 'Accessoires et distributeurs', nameAr: 'حوامل الصابون والإكسسوارات' },
      { id: 'rituel-hammam', nameFr: 'Rituel Hammam & soin', nameAr: 'طقم الحمام التقليدي والعناية' }
    ]
  },
  {
    id: 'salon-decoration',
    nameFr: 'Salon et décoration',
    nameAr: 'الصالون والديكور',
    descriptionFr: 'Rideaux, coussins, tapis, luminaires et touches d’ambiance chaleureuses.',
    descriptionAr: 'الستائر، الوسائد الديكورية، الزرابي، الإضاءة واللمسات الجمالية للمنزل.',
    icon: '🛋️',
    subcategories: [
      { id: 'rideaux-voilages', nameFr: 'Rideaux et voilages', nameAr: 'الستائر وأقمشة النوافذ' },
      { id: 'tapis-salons', nameFr: 'Tapis et carpettes', nameAr: 'الزرابي وسجاد الصالون' },
      { id: 'coussins-plaids', nameFr: 'Coussins et plaids', nameAr: 'الوسائد وأغطية الأريكة' },
      { id: 'luminaires-deco', nameFr: 'Vases, miroirs et déco', nameAr: 'المرايا، المزهريات والتحف' }
    ]
  },
  {
    id: 'electromenager',
    nameFr: 'Électroménager',
    nameAr: 'الأجهزة المنزلية',
    descriptionFr: 'Gros et petits appareils pour faciliter la vie quotidienne du foyer.',
    descriptionAr: 'الأجهزة الكهربائية الكبيرة والصغيرة لتجهيز بيت الزوجية العصري.',
    icon: '⚡',
    subcategories: [
      { id: 'petit-dej-cuisine', nameFr: 'Petit électroménager cuisine', nameAr: 'أجهزة المطبخ الصغيرة' },
      { id: 'entretien-linge-sol', nameFr: 'Entretien et nettoyage', nameAr: 'أجهزة الكي والتنظيف' },
      { id: 'gros-electromenager', nameFr: 'Gros électroménager (optionnel)', nameAr: 'الأجهزة الكبيرة (حسب الرغبة)' }
    ]
  },
  {
    id: 'vetements-accessoires',
    nameFr: 'Vêtements et accessoires',
    nameAr: 'الملابس والإكسسوارات',
    descriptionFr: 'Gardes-robes, tenues d’intérieur, pyjamas, babouches et sorties.',
    descriptionAr: 'الملابس اليومية، ملابس البيت، البيجامات، الأحذية والشباشب الأنيقة.',
    icon: '👗',
    subcategories: [
      { id: 'interieur-pyjamas', nameFr: 'Pyjamas et homewear', nameAr: 'البيجامات وملابس البيت' },
      { id: 'lingerie-nuit', nameFr: 'Lingerie et nuisettes', nameAr: 'ملابس النوم واللانجري' },
      { id: 'chaussures-pantoufles', nameFr: 'Chaussures et pantoufles', nameAr: 'الأحذية وشباشب البيت' },
      { id: 'tenues-sorties', nameFr: 'Tenues et sacs à main', nameAr: 'ملابس الخروج والحقائب' }
    ]
  },
  {
    id: 'trousseau-mariee',
    nameFr: 'Trousseau de la mariée',
    nameAr: 'جهاز العروس',
    descriptionFr: 'Pièces d’exception, coffrets, parfums, maquillage et rituels précieux.',
    descriptionAr: 'الجهاز الخاص، عطور العروس، حقائب السفر، مستحضرات التجميل والقطع المميزة.',
    icon: '💎',
    image: 'assets/cat_bridal.jpg',
    subcategories: [
      { id: 'parfums-beaute', nameFr: 'Parfums et coffrets beauté', nameAr: 'العطور ومجموعات العناية' },
      { id: 'maquillage-soins', nameFr: 'Maquillage et trousse', nameAr: 'المكياج وحقيبة التجميل' },
      { id: 'valises-voyage', nameFr: 'Valises et bagagerie', nameAr: 'حقائب السفر وجهاز العروس' },
      { id: 'accessoires-coiffure', nameFr: 'Bijoux fantaisie & coiffure', nameAr: 'إكسسوارات الشعر والزينة' }
    ]
  },
  {
    id: 'linge-maison',
    nameFr: 'Linge de maison',
    nameAr: 'مفروشات المنزل',
    descriptionFr: 'Nappes, chemins de table, torchons et linges de réception.',
    descriptionAr: 'المفارش، شراشف طاولة الطعام، مناشف المطبخ ومفروشات المناسبات.',
    icon: '🧵',
    subcategories: [
      { id: 'nappes-reception', nameFr: 'Nappes et chemins de table', nameAr: 'مفارش السفرة وطاولات الضيافة' },
      { id: 'torchons-essuie-mains', nameFr: 'Torchons et essuie-mains', nameAr: 'مناشف المطبخ والأيدي' },
      { id: 'housses-protections', nameFr: 'Housses et protections', nameAr: 'أغطية الحماية وحافظات الأقمشة' }
    ]
  },
  {
    id: 'nettoyage-entretien',
    nameFr: 'Nettoyage et entretien',
    nameAr: 'التنظيف والعناية بالمنزل',
    descriptionFr: 'Balais, seaux, séchoir, produits essentiels pour un foyer impeccable.',
    descriptionAr: 'المكانس، الدلاء، منشر الغسيل وأدوات النظافة اليومية لبيت مشرق.',
    icon: '🧹',
    subcategories: [
      { id: 'balais-seaux', nameFr: 'Balais, serpillières et seaux', nameAr: 'مكانس وأدوات مسح الأرضيات' },
      { id: 'sechage-repassage', nameFr: 'Séchoir et table à repasser', nameAr: 'منشر الغسيل وطاولة الكي' },
      { id: 'produits-essentiels', nameFr: 'Chiffons et kits de base', nameAr: 'الأقمشة المايكروفايبر واللوازم' }
    ]
  },
  {
    id: 'rangement-organisation',
    nameFr: 'Rangement et organisation',
    nameAr: 'التخزين والتنظيم',
    descriptionFr: 'Boîtes sous-lit, cintres, séparateurs de tiroirs et paniers.',
    descriptionAr: 'صناديق التخزين، علّاقات الملابس، منظمات الأدراج وسلال الترتيب.',
    icon: '📦',
    subcategories: [
      { id: 'cintres-dressing', nameFr: 'Cintres et housses dressing', nameAr: 'علّاقات الملابس وأكياس الحفظ' },
      { id: 'organisateurs-tiroirs', nameFr: 'Séparateurs et boîtes', nameAr: 'منظمات الأدراج والصناديق' },
      { id: 'paniers-bocaux', nameFr: 'Bocaux et boîtes hermétiques', nameAr: 'البرطمانات وعلب المطبخ المحكمة' }
    ]
  },
  {
    id: 'accueil-invites',
    nameFr: 'Accueil et invités',
    nameAr: 'الضيافة واستقبال الضيوف',
    descriptionFr: 'Linge pour les invités, matelas d’appoint, services d’honneur.',
    descriptionAr: 'مفروشات الضيوف، وسائد إضافية، أطقم الضيافة الفاخرة للزيارات العائلية.',
    icon: '☕',
    subcategories: [
      { id: 'couchage-invites', nameFr: 'Literie et coussins d’appoint', nameAr: 'أغطية ووسائد لضيوف البيت' },
      { id: 'service-honneur', nameFr: 'Services prestigieux', nameAr: 'أواني الشاي والحلويات الفاخرة' },
      { id: 'thermos-accueil', nameFr: 'Thermos et carafes d’accueil', nameAr: 'تيرموس القهوة والمشروبات' }
    ]
  },
  {
    id: 'essentiels-quotidien',
    nameFr: 'Essentiels du quotidien',
    nameAr: 'مستلزمات الحياة اليومية',
    descriptionFr: 'Trousse de secours, multiprises, outillage de base et sécurité.',
    descriptionAr: 'صندوق الإسعافات الأولية، التوصيلات الكهربائية، صندوق الأدوات البسيط.',
    icon: '🔧',
    subcategories: [
      { id: 'securite-sante', nameFr: 'Pharmacie et premiers soins', nameAr: 'الإسعافات الأولية والسلامة' },
      { id: 'bricolage-outils', nameFr: 'Petit outillage et quincaillerie', nameAr: 'مفكّات وأدوات الصيانة الخفيفة' },
      { id: 'electricite-piles', nameFr: 'Multiprises et ampoules', nameAr: 'التوصيلات والمصابيح الاحتياطية' }
    ]
  },
  {
    id: 'preparation-mariage',
    nameFr: 'Préparation du mariage',
    nameAr: 'التحضير للزفاف',
    descriptionFr: 'Accessoires du jour J, peignoir brodé, chaussures de mariée et trousse.',
    descriptionAr: 'مستلزمات يوم الزفاف، برنوس العروس المطرز، حذاء الزفاف وحقيبة الطوارئ.',
    icon: '👰',
    image: 'assets/darna_hero.jpg',
    subcategories: [
      { id: 'accessoires-jour-j', nameFr: 'Le grand jour', nameAr: 'مقتنيات يوم العرس' },
      { id: 'trousse-urgence', nameFr: 'Trousse de secours mariée', nameAr: 'حقيبة الطوارئ الصغيرة للعروس' },
      { id: 'souvenirs-rituels', nameFr: 'Détails et rituels', nameAr: 'تفاصيل الحناء والتقاليد' }
    ]
  }
];

export const CATALOG_ITEMS: CatalogItem[] = [
  // 1. CUISINE ET USTENSILES
  {
    id: 'cui-001',
    categoryId: 'cuisine-ustensiles',
    subcategoryId: 'traditionnel-tunisien',
    nameFr: 'Couscoussier inox traditionnel (Makfoul & Keskas)',
    nameAr: 'مقفول وكسكاس من الإينوكس للكسكسي التونسي',
    descriptionFr: 'Indispensable pour le couscous tunisien, les pâtes et légumes vapeur.',
    descriptionAr: 'أساسي في كل بيت تونسي لتحضير الكسكسي ومختلف الأطباق المفورة.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 130,
    icon: '🍲',
    isTraditional: true
  },
  {
    id: 'cui-002',
    categoryId: 'cuisine-ustensiles',
    subcategoryId: 'traditionnel-tunisien',
    nameFr: 'Tajine en fonte ou terre cuite',
    nameAr: 'طاجين فخار تقليدي أو حديد زهر',
    descriptionFr: 'Idéal pour mijoter les plats traditionnels avec saveur authentique.',
    descriptionAr: 'لطهي الأطباق التونسية على نار هادئة بطعم أصيل.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 65,
    icon: '🥘',
    isTraditional: true
  },
  {
    id: 'cui-003',
    categoryId: 'cuisine-ustensiles',
    subcategoryId: 'cuisson-plats',
    nameFr: 'Cocotte-minute (Autocuiseur inox 6L-8L)',
    nameAr: 'طنجرة ضغط (كوكوت إينوكس 6 أو 8 لتر)',
    descriptionFr: 'Pour cuire rapidement les viandes, soupes et ragoûts tunisiens.',
    descriptionAr: 'لطهي اللحوم والشوربة والمرق بسرعة مع الحفاظ على القيمة الغذائية.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 220,
    icon: '⏱️'
  },
  {
    id: 'cui-004',
    categoryId: 'cuisine-ustensiles',
    subcategoryId: 'cuisson-plats',
    nameFr: 'Batterie de casseroles antiadhésives (3 pièces)',
    nameAr: 'طقم كسرونات تيفال أو غرانيت (3 قطع)',
    descriptionFr: 'Tailles petite, moyenne et grande avec couvercles en verre.',
    descriptionAr: 'أحجام صغيرة ومتوسطة وكبيرة مع أغطية زجاجية.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 140,
    icon: '🍳'
  },
  {
    id: 'cui-005',
    categoryId: 'cuisine-ustensiles',
    subcategoryId: 'cuisson-plats',
    nameFr: 'Poêles antiadhésives (Set de 2 ou 3)',
    nameAr: 'طقم مقالي تيفال أو غرانيت (قطعتان أو ثلاث)',
    descriptionFr: 'Pour les omelettes, ojja, sauces et cuissons légères.',
    descriptionAr: 'مثالية للعجة، والبيض، والقلي الخفيف.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 95,
    icon: '🍳'
  },
  {
    id: 'cui-006',
    categoryId: 'cuisine-ustensiles',
    subcategoryId: 'cuisson-plats',
    nameFr: 'Faitout grande taille pour réceptions familiales',
    nameAr: 'قدر طهي كبير للعزومات والمناسبات',
    descriptionFr: 'Capacité 10-12 litres pour recevoir famille et amis.',
    descriptionAr: 'سعة 10 إلى 12 لتر لاستقبال العائلة في المناسبات.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 110,
    icon: '🍲'
  },
  {
    id: 'cui-007',
    categoryId: 'cuisine-ustensiles',
    subcategoryId: 'ustensiles-decoupe',
    nameFr: 'Bloc de couteaux de cuisine professionnels',
    nameAr: 'طقم سكاكين مطبخ احترافية مع حامل',
    descriptionFr: 'Couteau de chef, couteau à pain, découpe légumes et ciseaux.',
    descriptionAr: 'سكين الشيف، سكين الخبز، سكاكين الخضار ومقص المطبخ.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 85,
    icon: '🔪'
  },
  {
    id: 'cui-008',
    categoryId: 'cuisine-ustensiles',
    subcategoryId: 'ustensiles-decoupe',
    nameFr: 'Planches à découper (Set bois et bambou)',
    nameAr: 'طقم ألواح تقطيع خشبية وبامبو',
    descriptionFr: 'Une planche pour la viande et une pour les fruits/légumes.',
    descriptionAr: 'لوح مخصص للحوم ولوح مخصص للخضروات والفواكه.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 35,
    icon: '🪵'
  },
  {
    id: 'cui-009',
    categoryId: 'cuisine-ustensiles',
    subcategoryId: 'ustensiles-decoupe',
    nameFr: 'Set d’ustensiles en silicone et bois (louche, spatule, écumoire)',
    nameAr: 'طقم أدوات مطبخ سيليكون وخشب (مغرفة، ملاس، ملعقة)',
    descriptionFr: 'Ne raye pas les revêtements et résiste à la chaleur.',
    descriptionAr: 'أدوات آمنة على الأواني غير اللاصقة ومقاومة للحرارة.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 45,
    icon: '🥄'
  },
  {
    id: 'cui-010',
    categoryId: 'cuisine-ustensiles',
    subcategoryId: 'ustensiles-decoupe',
    nameFr: 'Passoire inox & essoreuse à salade',
    nameAr: 'مصفاة إينوكس ونشافة خضار وسلطة',
    descriptionFr: 'Pour égoutter les pâtes, le riz et laver les herbes fraîches.',
    descriptionAr: 'لتصفية المعكرونة والخضروات وتجفيف أوراق السلطة والمعدنوس.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 38,
    icon: '🥗'
  },
  {
    id: 'cui-011',
    categoryId: 'cuisine-ustensiles',
    subcategoryId: 'patisserie-accessoires',
    nameFr: 'Plats à four pyrex ou céramique (Set rectangulaire et rond)',
    nameAr: 'طقم أطباق فرن بايركس أو سيراميك (مستطيل ودائري)',
    descriptionFr: 'Idéal pour gratins, tajine tunisien au four et rôtis.',
    descriptionAr: 'مثالي لطاجين الفرن والغرانتان وصواني الدجاج والخضار.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 75,
    icon: '🥧'
  },
  {
    id: 'cui-012',
    categoryId: 'cuisine-ustensiles',
    subcategoryId: 'patisserie-accessoires',
    nameFr: 'Moules à gâteaux et cake antiadhésifs',
    nameAr: 'قوالب كيك وحلويات غير لاصقة',
    descriptionFr: 'Moule rond à charnière et moule à cake classique.',
    descriptionAr: 'قالب كيك دائري قابل للفتح وقالب مستطيل.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 40,
    icon: '🍰'
  },
  {
    id: 'cui-013',
    categoryId: 'cuisine-ustensiles',
    subcategoryId: 'patisserie-accessoires',
    nameFr: 'Bols à mélanger en inox (Saladiers cul-de-poule)',
    nameAr: 'طقم أوعية خلط من الإينوكس بأحجام مختلفة',
    descriptionFr: 'Pratiques et durables pour mélanger pâtes et salades.',
    descriptionAr: 'أوعية عميقة لخلط العجين وتتبيل اللحوم وإعداد الصلصات.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 45,
    icon: '🥣'
  },
  {
    id: 'cui-014',
    categoryId: 'cuisine-ustensiles',
    subcategoryId: 'patisserie-accessoires',
    nameFr: 'Balance de cuisine électronique de précision',
    nameAr: 'ميزان مطبخ إلكتروني دقيق',
    descriptionFr: 'Pour peser avec précision les ingrédients culinaires.',
    descriptionAr: 'لقياس دقيق لمقادير الطبخ والحلويات.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 30,
    icon: '⚖️'
  },
  {
    id: 'cui-015',
    categoryId: 'cuisine-ustensiles',
    subcategoryId: 'patisserie-accessoires',
    nameFr: 'Gants de four, maniques et repose-plats',
    nameAr: 'قفازات فرن عازلة وقواعد للأواني الساخنة',
    descriptionFr: 'Protection thermique élégante pour la cuisine.',
    descriptionAr: 'لحماية اليدين والطاولات من حرارة الأواني والأفران.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 25,
    icon: '🧤'
  },

  // 2. VAISSELLE ET SERVICE
  {
    id: 'vai-001',
    categoryId: 'vaisselle-service',
    subcategoryId: 'services-table',
    nameFr: 'Service de table complet pour invités (Porcelaine 12 personnes)',
    nameAr: 'طقم مائدة فاخر للضيوف (بورسلان 12 شخص)',
    descriptionFr: 'Assiettes plates, creuses, à dessert, soupière et plats de service.',
    descriptionAr: 'صحون مسطحة، غائرة، للحلوى، وعاء شوربة وصحون تقديم كبيرة للمناسبات.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 480,
    icon: '🍽️'
  },
  {
    id: 'vai-002',
    categoryId: 'vaisselle-service',
    subcategoryId: 'services-table',
    nameFr: 'Service d’assiettes du quotidien (6 personnes)',
    nameAr: 'طقم صحون الاستعمال اليومي (6 أشخاص)',
    descriptionFr: 'Durable, passe au micro-ondes et lave-vaisselle.',
    descriptionAr: 'طقم عملي للاستعمال اليومي مقاوم ومناسب لغسالة الصحون.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 120,
    icon: '🥣'
  },
  {
    id: 'vai-003',
    categoryId: 'vaisselle-service',
    subcategoryId: 'services-table',
    nameFr: 'Bols à soupe tunisienne (Bol à chorba)',
    nameAr: 'طقم زبادي الشوربة التونسية (بول شربة)',
    descriptionFr: 'Assortis pour la chorba frik et les soupes du Ramadan.',
    descriptionAr: 'زبادي أنيقة للشوربة التونسية وشوربة لسان عصفور.',
    suggestedQuantity: 6,
    estimatedUnitPrice: 45,
    icon: '🍜',
    isTraditional: true
  },
  {
    id: 'vai-004',
    categoryId: 'vaisselle-service',
    subcategoryId: 'couverts-verrerie',
    nameFr: 'Ménagère de couverts inox pour invités (Coffret complet)',
    nameAr: 'صندوق ملاعق وسكاكين وشوكات فاخر للضيوف (إينوكس)',
    descriptionFr: 'Cuillères, fourchettes, couteaux et petites cuillères présentés en coffret.',
    descriptionAr: 'طقم ملاعق وشوك وسكاكين كامل في علبة راقية للضيوف.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 240,
    icon: '🍴'
  },
  {
    id: 'vai-005',
    categoryId: 'vaisselle-service',
    subcategoryId: 'couverts-verrerie',
    nameFr: 'Set de couverts pour le quotidien (24 pièces)',
    nameAr: 'طقم ملاعق وشوكات للاستعمال اليومي (24 قطعة)',
    descriptionFr: 'Robuste en acier inoxydable pour les repas de tous les jours.',
    descriptionAr: 'طقم متين وعملي للوجبات اليومية.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 65,
    icon: '🥄'
  },
  {
    id: 'vai-006',
    categoryId: 'vaisselle-service',
    subcategoryId: 'couverts-verrerie',
    nameFr: 'Service de verres à eau et jus en cristal ou verre fin',
    nameAr: 'طقم كؤوس ماء وعصير فاخر للضيوف',
    descriptionFr: 'Élégant pour dresser une belle table de réception.',
    descriptionAr: 'كؤوس كريستال أو زجاج رفيع للمناسبات والزيارات.',
    suggestedQuantity: 12,
    estimatedUnitPrice: 90,
    icon: '🍷'
  },
  {
    id: 'vai-007',
    categoryId: 'vaisselle-service',
    subcategoryId: 'couverts-verrerie',
    nameFr: 'Verres à eau du quotidien (Lot de 6 ou 12)',
    nameAr: 'كؤوس ماء وعصير للاستعمال اليومي (12 كأس)',
    descriptionFr: 'Verres solides et stables pour tous les jours.',
    descriptionAr: 'كؤوس زجاجية متينة للاستعمال العائلي اليومي.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 30,
    icon: '🥛'
  },
  {
    id: 'vai-008',
    categoryId: 'vaisselle-service',
    subcategoryId: 'the-cafe',
    nameFr: 'Service à thé tunisien complet (Plateau, théière & verres dorés)',
    nameAr: 'طقم شاي تونسي فاخر (برّاد شاي، صينية، وكؤوس مزخرفة)',
    descriptionFr: 'Indispensable pour le thé à la menthe et aux pignons.',
    descriptionAr: 'أساسي لتقديم الشاي التونسي بالنعناع والبندق في المناسبات.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 160,
    icon: '🫖',
    isTraditional: true
  },
  {
    id: 'vai-009',
    categoryId: 'vaisselle-service',
    subcategoryId: 'the-cafe',
    nameFr: 'Tasses à café turc / café noir tunisien avec sous-tasses',
    nameAr: 'فناجين قهوة عربي / تركي مع صحونها',
    descriptionFr: 'Pour savourer le café parfumé à l’eau de fleur d’oranger.',
    descriptionAr: 'فناجين راقية لتقديم القهوة العربي المعطرة بماء الزهر.',
    suggestedQuantity: 6,
    estimatedUnitPrice: 55,
    icon: '☕',
    isTraditional: true
  },
  {
    id: 'vai-010',
    categoryId: 'vaisselle-service',
    subcategoryId: 'the-cafe',
    nameFr: 'Mugs élégants pour café au lait et chocolat chaud',
    nameAr: 'أكواب مج (Mugs) لقهوة الصباح والمشروبات الدافئة',
    descriptionFr: 'Pour les petits déjeuners douillets à la maison.',
    descriptionAr: 'أكواب أنيقة ومريحة لإفطار الصباح.',
    suggestedQuantity: 4,
    estimatedUnitPrice: 35,
    icon: '☕'
  },
  {
    id: 'vai-011',
    categoryId: 'vaisselle-service',
    subcategoryId: 'plateaux-plats',
    nameFr: 'Grand plateau de présentation argenté ou inox gravé',
    nameAr: 'صينية تقديم كبيرة فضية أو إينوكس منقوشة',
    descriptionFr: 'Pour servir les gâteaux tunisiens (Baklawa, Kaak warka) et boissons.',
    descriptionAr: 'لتقديم الحلويات التونسية الراقية والمشروبات لضيوفك.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 110,
    icon: '✨',
    isTraditional: true
  },
  {
    id: 'vai-012',
    categoryId: 'vaisselle-service',
    subcategoryId: 'plateaux-plats',
    nameFr: 'Plats de service ovales et ronds pour couscous et viandes',
    nameAr: 'أطباق تقديم بيضاوية ودائرية للكسكسي والمشاوي',
    descriptionFr: 'En porcelaine blanche ou inox pour les repas de fête.',
    descriptionAr: 'أطباق كبيرة وعميقة لتقديم الوجبات العائلية الكبرى.',
    suggestedQuantity: 3,
    estimatedUnitPrice: 90,
    icon: '🍲'
  },
  {
    id: 'vai-013',
    categoryId: 'vaisselle-service',
    subcategoryId: 'plateaux-plats',
    nameFr: 'Saladiers et coupelles apéritives (Kemia tunisienne)',
    nameAr: 'أوعية سلطة وصحون صغيرة للمقبلات (الكمية التونسية)',
    descriptionFr: 'Pour présenter olives, slata méchouia, variantes et sauces.',
    descriptionAr: 'لتقديم السلاطة المشوية، الزيتون والمقبلات التونسية.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 45,
    icon: '🫒'
  },

  // 3. CHAMBRE ET LITERIE
  {
    id: 'cha-001',
    categoryId: 'chambre-literie',
    subcategoryId: 'couvre-lits-mariee',
    nameFr: 'Couvre-lit de mariée brodé de luxe (Trousseau)',
    nameAr: 'غطاء سرير العروس الفاخر والمطرز (الفرشوة الملكية)',
    descriptionFr: 'Pièce maîtresse de la chambre nuptiale avec taies assorties.',
    descriptionAr: 'القطعة المركزية لغرفة النوم ليلة الدخلة والأيام الأولى مع وسائدها.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 380,
    icon: '👑',
    isTraditional: true
  },
  {
    id: 'cha-002',
    categoryId: 'chambre-literie',
    subcategoryId: 'parures-draps',
    nameFr: 'Parures de lit 100% coton satiné grand lit (160x200 ou 180x200)',
    nameAr: 'أطقم ملاءات وشراشف قطن ساتان فاخرة لسرير مزدوج',
    descriptionFr: 'Drap-housse, drap plat et 2 à 4 taies d’oreiller très douces.',
    descriptionAr: 'أطقم سرير قطنية ناعمة عالية الجودة ومريحة مع وسائدها.',
    suggestedQuantity: 4,
    estimatedUnitPrice: 120,
    icon: '🛏️'
  },
  {
    id: 'cha-003',
    categoryId: 'chambre-literie',
    subcategoryId: 'couettes-oreillers',
    nameFr: 'Couette chaude 4 saisons grand format (240x220)',
    nameAr: 'لحاف شتوي دافئ كبير ومضاد للحساسية (240×220)',
    descriptionFr: 'Garnissage gonflant et respirant pour des nuits bien au chaud.',
    descriptionAr: 'لحاف مريح وخفيف يمنح الدفء في ليالي الشتاء الباردة.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 180,
    icon: '❄️'
  },
  {
    id: 'cha-004',
    categoryId: 'chambre-literie',
    subcategoryId: 'couettes-oreillers',
    nameFr: 'Couvertures d’hiver épaisses (Couverture douce)',
    nameAr: 'بطانيات شتوية ناعمة وسميكة للسرير المزدوج',
    descriptionFr: 'Couverture chaude en velours doux pour l’hiver tunisien.',
    descriptionAr: 'بطانيات مخملية دافئة تدوم طويلاً لليالي الشتاء.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 130,
    icon: '🛌'
  },
  {
    id: 'cha-005',
    categoryId: 'chambre-literie',
    subcategoryId: 'couettes-oreillers',
    nameFr: 'Oreillers ergonomiques à mémoire de forme / duvet',
    nameAr: 'وسائد طبية ومريحة لنوم هادئ',
    descriptionFr: 'Soutien cervical optimal pour le couple.',
    descriptionAr: 'وسائد ناعمة تدعم الرقبة وتضمن نوماً صحياً ومريحاً.',
    suggestedQuantity: 4,
    estimatedUnitPrice: 45,
    icon: '💤'
  },
  {
    id: 'cha-006',
    categoryId: 'chambre-literie',
    subcategoryId: 'protection-literie',
    nameFr: 'Protège-matelas imperméable et respirant (Alèse grand lit)',
    nameAr: 'واقي مرتبة ضد السوائل وقابل للغسل',
    descriptionFr: 'Protège durablement votre matelas neuf des taches.',
    descriptionAr: 'يحافظ على نظافة المرتبة الجديدة ويحميها من التلف.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 50,
    icon: '🛡️'
  },
  {
    id: 'cha-007',
    categoryId: 'chambre-literie',
    subcategoryId: 'protection-literie',
    nameFr: 'Sous-taies d’oreillers zippées de protection',
    nameAr: 'أغطية حماية داخلية للوسائد بسحاب',
    descriptionFr: 'Hygiène parfaite pour prolonger la durée de vie des oreillers.',
    descriptionAr: 'تحافظ على بياض ونظافة الوسائد من الداخل.',
    suggestedQuantity: 4,
    estimatedUnitPrice: 15,
    icon: '🤍'
  },

  // 4. SALLE DE BAIN
  {
    id: 'sdb-001',
    categoryId: 'salle-de-bain',
    subcategoryId: 'peignoirs-tapis',
    nameFr: 'Coffret peignoirs pour les mariés (Duo Elle & Lui brodé)',
    nameAr: 'طقم برانس العرسان الفاخر (برنوس العروس وبرنوس العريس مطرز)',
    descriptionFr: 'En éponge 100% coton avec chaussons et serviettes assorties.',
    descriptionAr: 'طقم فاخر ومطرز من القطن الخالص يضم برنوسين ومناشف وشنبر.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 260,
    icon: '🧖‍♀️',
    isTraditional: true
  },
  {
    id: 'sdb-002',
    categoryId: 'salle-de-bain',
    subcategoryId: 'serviettes-foutas',
    nameFr: 'Foutas traditionnelles tunisiennes tissées (Coton & Lurex)',
    nameAr: 'فوطات تونسية تقليدية منسوجة بخيوط ناعمة',
    descriptionFr: 'Pour la plage, le hammam et la salle de bain élégante.',
    descriptionAr: 'فوطة أصيلة للحمام التونسي، الشاطئ، والاسترخاء في البيت.',
    suggestedQuantity: 6,
    estimatedUnitPrice: 18,
    icon: '🩱',
    isTraditional: true
  },
  {
    id: 'sdb-003',
    categoryId: 'salle-de-bain',
    subcategoryId: 'serviettes-foutas',
    nameFr: 'Draps de bain grande taille (100x150cm éponge épaisse)',
    nameAr: 'مناشف استحمام كبيرة الحجم من القطن السميك',
    descriptionFr: 'Absorption maximale et douceur après la douche.',
    descriptionAr: 'مناشف قطنية فاخرة ناعمة وسريعة الامتصاص للماء.',
    suggestedQuantity: 4,
    estimatedUnitPrice: 42,
    icon: '🛁'
  },
  {
    id: 'sdb-004',
    categoryId: 'salle-de-bain',
    subcategoryId: 'serviettes-foutas',
    nameFr: 'Serviettes pour le visage et les mains',
    nameAr: 'مناشف يومية للوجه واليدين',
    descriptionFr: 'À disposer près du lavabo pour le quotidien et les invités.',
    descriptionAr: 'مناشف ناعمة ومطابقة لديكور الحمام لغسل اليدين والوجه.',
    suggestedQuantity: 6,
    estimatedUnitPrice: 16,
    icon: '🧼'
  },
  {
    id: 'sdb-005',
    categoryId: 'salle-de-bain',
    subcategoryId: 'peignoirs-tapis',
    nameFr: 'Tapis de bain antidérapants et absorbants (Set de 2)',
    nameAr: 'طقم سجاد حمام مانع للانزلاق وسريع الجفاف',
    descriptionFr: 'Sortie de douche confortable et sécurisée.',
    descriptionAr: 'سجادات ناعمة لأرضية الحمام أمام الدوش والمغسلة.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 38,
    icon: '🦶'
  },
  {
    id: 'sdb-006',
    categoryId: 'salle-de-bain',
    subcategoryId: 'accessoires-sdb',
    nameFr: 'Ensemble accessoires de salle de bain (Distributeur savon, porte-brosse, gobelet)',
    nameAr: 'طقم إكسسوارات الحمام (موزع صابون، حامل فرش أسنان، وصحن صابون)',
    descriptionFr: 'En céramique ou résine moderne pour un look soigné.',
    descriptionAr: 'طقم متناسق يعطي لمسة جمالية ونظافة لحوض المغسلة.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 55,
    icon: '🧴'
  },
  {
    id: 'sdb-007',
    categoryId: 'salle-de-bain',
    subcategoryId: 'accessoires-sdb',
    nameFr: 'Panier à linge sale moderne et aéré',
    nameAr: 'سلة غسيل للملابس أنيقة وعملية',
    descriptionFr: 'En bambou ou tissu pliable avec séparateur.',
    descriptionAr: 'سلة كبيرة وجميلة لجمع الملابس قبل الغسيل.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 60,
    icon: '🧺'
  },
  {
    id: 'sdb-008',
    categoryId: 'salle-de-bain',
    subcategoryId: 'rituel-hammam',
    nameFr: 'Kit Hammam traditionnel (Kessa, savon noir, tfal et coupelle en cuivre)',
    nameAr: 'طقم حمام تونسي تقليدي (كيس، صابون أسود، طفل، وطاسة نحاس)',
    descriptionFr: 'Pour les rituels de hammam de la mariée et le gommage naturel.',
    descriptionAr: 'لجلسة الحمام التونسي التقليدي والتقشير والنعومة الطبيعية.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 75,
    icon: '🌿',
    isTraditional: true
  },

  // 5. SALON ET DECORATION
  {
    id: 'sal-001',
    categoryId: 'salon-decoration',
    subcategoryId: 'rideaux-voilages',
    nameFr: 'Rideaux occultants et voilages sur mesure pour le salon',
    nameAr: 'ستائر فاخرة وأقمشة دانتيل شفافة لنوافذ الصالون',
    descriptionFr: 'Habillage raffiné pour filtrer la lumière et préserver l’intimité.',
    descriptionAr: 'ستائر راقية تضفي الفخامة والخصوصية على قاعة الجلوس.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 220,
    icon: '🪟'
  },
  {
    id: 'sal-002',
    categoryId: 'salon-decoration',
    subcategoryId: 'tapis-salons',
    nameFr: 'Grand tapis de salon moderne ou artisanal (Kilim / Mergoum / Berbère)',
    nameAr: 'زربية صالون كبيرة عصرية أو مرقوم تقليدي أصيل',
    descriptionFr: 'Donne de la chaleur et structure l’espace de vie.',
    descriptionAr: 'تمنح الدفء والأناقة للصالون وتناسب ألوان الأثاث.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 350,
    icon: '🧶',
    isTraditional: true
  },
  {
    id: 'sal-003',
    categoryId: 'salon-decoration',
    subcategoryId: 'coussins-plaids',
    nameFr: 'Coussins décoratifs et plaids moelleux pour canapé',
    nameAr: 'وسائد ديكور أنيقة وأغطية أريكة ناعمة (Plaid)',
    descriptionFr: 'Nuances terracotta, crème ou sauge pour un effet chaleureux.',
    descriptionAr: 'تنسيق ألوان دافئة يمنح الجلسة طابعاً مريحاً وجذاباً.',
    suggestedQuantity: 4,
    estimatedUnitPrice: 30,
    icon: '🛋️'
  },
  {
    id: 'sal-004',
    categoryId: 'salon-decoration',
    subcategoryId: 'luminaires-deco',
    nameFr: 'Miroir décoratif mural pour entrée ou salon',
    nameAr: 'مرآة حائط ديكورية عصرية لمدخل البيت أو الصالون',
    descriptionFr: 'Agrandit l’espace et apporte de la luminosité.',
    descriptionAr: 'تعطي إشراقة واتساعاً للمدخل وتزيد من جمالية الديكور.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 140,
    icon: '🪞'
  },
  {
    id: 'sal-005',
    categoryId: 'salon-decoration',
    subcategoryId: 'luminaires-deco',
    nameFr: 'Vases décoratifs et soliflores en céramique artisanale',
    nameAr: 'مزهريات وتحف من السيراميك الفني التونسي',
    descriptionFr: 'Artisanat d’art tunisien (Nabeul ou Sejnane) pour une touche unique.',
    descriptionAr: 'لمسة تراثية تونسية أنيقة من فخار نابل أو سجنان.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 45,
    icon: '🏺',
    isTraditional: true
  },
  {
    id: 'sal-006',
    categoryId: 'salon-decoration',
    subcategoryId: 'luminaires-deco',
    nameFr: 'Brûleur d’encens traditionnel (Bakhour) et senteurs',
    nameAr: 'مبخرة عصرية أو تقليدية وبخور تونسي معطر للبيت',
    descriptionFr: 'Pour parfumer agréablement la maison lors des vendredis et réceptions.',
    descriptionAr: 'لتعطير البيت بروائح البخور الزكية في المناسبات والأعياد.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 35,
    icon: '💨',
    isTraditional: true
  },

  // 6. ÉLECTROMÉNAGER
  {
    id: 'ele-001',
    categoryId: 'electromenager',
    subcategoryId: 'petit-dej-cuisine',
    nameFr: 'Robot multifonction / Mixeur plongeant 4-en-1',
    nameAr: 'روبوت مطبخ متعدد الوظائف وخلاط يدوي',
    descriptionFr: 'Indispensable pour hacher l’ail, persil, faire soupes et pâtes.',
    descriptionAr: 'ضروري لفرم البصل والمعدنوس وتحضير الشوربة والصلصات.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 160,
    icon: '🥣'
  },
  {
    id: 'ele-002',
    categoryId: 'electromenager',
    subcategoryId: 'petit-dej-cuisine',
    nameFr: 'Bouilloire électrique rapide en inox (1.7L)',
    nameAr: 'غلاية ماء كهربائية سريعة من الإينوكس (1.7 لتر)',
    descriptionFr: 'Pour le thé, tisanes et faire bouillir l’eau de cuisine.',
    descriptionAr: 'لإعداد الشاي وتسريع غلي ماء الطهي.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 65,
    icon: '🫖'
  },
  {
    id: 'ele-003',
    categoryId: 'electromenager',
    subcategoryId: 'petit-dej-cuisine',
    nameFr: 'Machine à café expresso ou cafetière italienne',
    nameAr: 'آلة قهوة إسبريسو أو عصارة قهوة إيطالية',
    descriptionFr: 'Pour commencer la journée avec un bon café crémeux.',
    descriptionAr: 'لبدء الصباح بفنجان قهوة غني ومميز.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 190,
    icon: '☕'
  },
  {
    id: 'ele-004',
    categoryId: 'electromenager',
    subcategoryId: 'entretien-linge-sol',
    nameFr: 'Fer à repasser vapeur performant ou centrale vapeur',
    nameAr: 'مكواة بخار عالية الجودة أو محطة بخار للملابس',
    descriptionFr: 'Pour des vêtements et draps impeccables sans plis.',
    descriptionAr: 'لكي سريع وسهل لملابس البيت وأطقم النوم والخروج.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 110,
    icon: '👔'
  },
  {
    id: 'ele-005',
    categoryId: 'electromenager',
    subcategoryId: 'entretien-linge-sol',
    nameFr: 'Aspirateur puissant sans sac ou balai électrique sans fil',
    nameAr: 'مكنسة كهربائية قوية بدون كيس أو مكنسة لاسلكية',
    descriptionFr: 'Pour un nettoyage rapide des tapis, carrelages et rideaux.',
    descriptionAr: 'لتنظيف السجاد والأرضيات بسهولة وسرعة دون عناء.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 240,
    icon: '🔌'
  },
  {
    id: 'ele-006',
    categoryId: 'electromenager',
    subcategoryId: 'petit-dej-cuisine',
    nameFr: 'Appareil à panini et gaufrier grill',
    nameAr: 'شواية سندويشات وبانيني كهربائية',
    descriptionFr: 'Pour des sandwichs croustillants et repas rapides.',
    descriptionAr: 'لوجبات خفيفة وسريعة وسندويشات ساخنة ومقرمشة.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 85,
    icon: '🥪'
  },
  {
    id: 'ele-007',
    categoryId: 'electromenager',
    subcategoryId: 'gros-electromenager',
    nameFr: 'Four encastrable ou mini-four électrique de cuisson',
    nameAr: 'فرن كهربائي مدمج أو فرن صغير عالي الكفاءة',
    descriptionFr: 'Appareil majeur pour gratins, gâteaux et tajines.',
    descriptionAr: 'أساسي لخبز الحلويات والخبز والوجبات المشوية في الفرن.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 450,
    icon: '🍳'
  },

  // 7. VÊTEMENTS ET ACCESSOIRES
  {
    id: 'vet-001',
    categoryId: 'vetements-accessoires',
    subcategoryId: 'interieur-pyjamas',
    nameFr: 'Ensembles pyjamas en satin et coton doux (Lot de 4 à 6)',
    nameAr: 'أطقم بيجامات حريرية وقطنية أنيقة للعروس',
    descriptionFr: 'Différents styles confortables et féminins pour la maison.',
    descriptionAr: 'بيجامات مريحة وفاتنة بألوان هادئة للبيت.',
    suggestedQuantity: 6,
    estimatedUnitPrice: 65,
    icon: '👚'
  },
  {
    id: 'vet-002',
    categoryId: 'vetements-accessoires',
    subcategoryId: 'lingerie-nuit',
    nameFr: 'Nuisettes délicates et peignoir d’intérieur en dentelle',
    nameAr: 'قمصان نوم فاخرة وروب دانتيل ناعم للعروس',
    descriptionFr: 'Pièces raffinées pour les premières semaines du mariage.',
    descriptionAr: 'ملابس نوم أنيقة من الحرير والدانتيل لجهاز العروس.',
    suggestedQuantity: 4,
    estimatedUnitPrice: 75,
    icon: '👗'
  },
  {
    id: 'vet-003',
    categoryId: 'vetements-accessoires',
    subcategoryId: 'interieur-pyjamas',
    nameFr: 'Jebba d’intérieur tunisienne moderne et brodée',
    nameAr: 'جبّة تونسية عصرية ومطرزة للبيت والاستقبال',
    descriptionFr: 'Tenue traditionnelle élégante et légère pour recevoir la belle-famille.',
    descriptionAr: 'جبة مريحة وأنيقة لاستقبال الأهل والضيوف في الأيام الأولى.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 110,
    icon: '👘',
    isTraditional: true
  },
  {
    id: 'vet-004',
    categoryId: 'vetements-accessoires',
    subcategoryId: 'chaussures-pantoufles',
    nameFr: 'Pantoufles d’intérieur douces et mules élégantes',
    nameAr: 'شباشب بيت ناعمة ومريحة وأحذية خفيفة أنيقة',
    descriptionFr: 'Chaussons douillets pour l’hiver et mules satinées pour l’été.',
    descriptionAr: 'أحذية خفيفة للبيت تجمع بين الأناقة والراحة للقدمين.',
    suggestedQuantity: 3,
    estimatedUnitPrice: 35,
    icon: '🥿'
  },
  {
    id: 'vet-005',
    categoryId: 'vetements-accessoires',
    subcategoryId: 'chaussures-pantoufles',
    nameFr: 'Babouches brodées artisanales pour mariée (Belgha)',
    nameAr: 'بلغة تونسية تقليدية مطرزة للعروس',
    descriptionFr: 'S’accorde parfaitement avec les tenues traditionnelles.',
    descriptionAr: 'بلغة أصيلة مطرزة تليق بالجلسات التونسية واللباس التقليدي.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 55,
    icon: '👡',
    isTraditional: true
  },
  {
    id: 'vet-006',
    categoryId: 'vetements-accessoires',
    subcategoryId: 'tenues-sorties',
    nameFr: 'Sacs à main élégants (Sac de ville et pochette de soirée)',
    nameAr: 'حقائب يد راقية (حقيبة خروج يومية وحقيبة سهرة)',
    descriptionFr: 'Pour compléter harmonieusement vos tenues après le mariage.',
    descriptionAr: 'حقائب مميزة للمناسبات والزيارات الرسمية.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 95,
    icon: '👜'
  },

  // 8. TROUSSEAU DE LA MARIÉE
  {
    id: 'tro-001',
    categoryId: 'trousseau-mariee',
    subcategoryId: 'valises-voyage',
    nameFr: 'Set de valises rigides de voyage pour le trousseau (3 tailles)',
    nameAr: 'طقم حقائب سفر قوية لجهاز العروس (3 أحجام مع عجلات)',
    descriptionFr: 'Pour transporter le trousseau chez vous et pour la lune de miel.',
    descriptionAr: 'لنقل جهاز العروس بأمان وترتيب، ومناسب لرحلة شهر العسل.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 320,
    icon: '🧳'
  },
  {
    id: 'tro-002',
    categoryId: 'trousseau-mariee',
    subcategoryId: 'parfums-beaute',
    nameFr: 'Parfum de mariage signature et brumes corporelles',
    nameAr: 'عطر الزفاف المميز وبخاخات معطرة للجسم',
    descriptionFr: 'Une fragrance inoubliable pour immortaliser votre journée.',
    descriptionAr: 'عطر ساحر يخلد ذكريات اليوم الكبير مع معطرات منعشة.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 260,
    icon: '🌸'
  },
  {
    id: 'tro-003',
    categoryId: 'trousseau-mariee',
    subcategoryId: 'parfums-beaute',
    nameFr: 'Coffrets de soins corps et crèmes hydratantes',
    nameAr: 'مجموعة كريمات ترطيب وعناية فاخرة بالبشرة والجسم',
    descriptionFr: 'Pour une peau douce, nourrie et lumineuse.',
    descriptionAr: 'روتين عناية كامل للجسم بالزيوت الطبيعية والزبدة المرطبة.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 130,
    icon: '🧴'
  },
  {
    id: 'tro-004',
    categoryId: 'trousseau-mariee',
    subcategoryId: 'maquillage-soins',
    nameFr: 'Trousse et vanity maquillage complète pour la mariée',
    nameAr: 'حقيبة مكياج فاخرة مع مستحضرات التجميل الأساسية',
    descriptionFr: 'Fond de teint, rouges à lèvres, fards, mascara et pinceaux de qualité.',
    descriptionAr: 'أدوات التجميل والفرش الاحترافية ومستحضرات الميك آب اليومي والمناسبات.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 210,
    icon: '💄'
  },
  {
    id: 'tro-005',
    categoryId: 'trousseau-mariee',
    subcategoryId: 'accessoires-coiffure',
    nameFr: 'Sèche-cheveux professionnel et fer à lisser / boucler',
    nameAr: 'مجفف شعر احترافي ومكواة تمليس أو تجعيد الشعر',
    descriptionFr: 'Pour un coiffage impeccable et rapide à la maison.',
    descriptionAr: 'لتسريح وتصفيف الشعر بسهولة في البيت كالمحترفين.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 180,
    icon: '💇‍♀️'
  },
  {
    id: 'tro-006',
    categoryId: 'trousseau-mariee',
    subcategoryId: 'accessoires-coiffure',
    nameFr: 'Boîte à bijoux compartimentée avec miroir',
    nameAr: 'صندوق مجوهرات أنيق ومقسم لحفظ الحلي والذهب',
    descriptionFr: 'Pour ranger en sécurité bagues, colliers, bracelets et boucles.',
    descriptionAr: 'لحفظ الذهب والمجوهرات والإكسسوارات الثمينة في مكان آمن.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 70,
    icon: '💍'
  },

  // 9. LINGE DE MAISON
  {
    id: 'lin-001',
    categoryId: 'linge-maison',
    subcategoryId: 'nappes-reception',
    nameFr: 'Grande nappe de réception brodée avec serviettes assorties (12 pers)',
    nameAr: 'مفرش طاولة طعام كبير مطرز مع مناديله للضيوف (12 شخص)',
    descriptionFr: 'Pour habiller majestueusement la table des grands repas de fête.',
    descriptionAr: 'مفرش مائدة فخم للمناسبات الكبيرة والولائم العائلية.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 150,
    icon: '🧵',
    isTraditional: true
  },
  {
    id: 'lin-002',
    categoryId: 'linge-maison',
    subcategoryId: 'nappes-reception',
    nameFr: 'Nappes imperméables anti-taches pour le quotidien',
    nameAr: 'مفارش طاولة عملية مضادة للبقع وسهلة التنظيف',
    descriptionFr: 'Pratiques et faciles à nettoyer d’un simple coup d’éponge.',
    descriptionAr: 'مفارش أنيقة للاستعمال اليومي تحمي الطاولة من البقع.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 40,
    icon: '🍽️'
  },
  {
    id: 'lin-003',
    categoryId: 'linge-maison',
    subcategoryId: 'torchons-essuie-mains',
    nameFr: 'Torchons de cuisine en coton pur (Lot de 10)',
    nameAr: 'طقم مناشف مطبخ قطنية نقية عالية الامتصاص (10 قطع)',
    descriptionFr: 'Pour essuyer la vaisselle sans laisser de peluches.',
    descriptionAr: 'مناشف قطنية لتجفيف الأواني وتنظيف أسطح العمل.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 30,
    icon: '🧻'
  },
  {
    id: 'lin-004',
    categoryId: 'linge-maison',
    subcategoryId: 'torchons-essuie-mains',
    nameFr: 'Essuie-mains invités avec accroche brodée',
    nameAr: 'فوط يدين صغيرة وأنيقة ومطرزة لضيوف البيت',
    descriptionFr: 'Disposées dans un petit panier dans la salle d’eau.',
    descriptionAr: 'توضع في سلة صغيرة قرب المغسلة لراحة الضيوف.',
    suggestedQuantity: 6,
    estimatedUnitPrice: 20,
    icon: '🧺'
  },
  {
    id: 'lin-005',
    categoryId: 'linge-maison',
    subcategoryId: 'housses-protections',
    nameFr: 'Housses de protection sous-vide pour couvertures et couettes',
    nameAr: 'أكياس تخزين وحفظ المفروشات والبطانيات بتقنية شفط الهواء',
    descriptionFr: 'Gain de place immense dans les armoires et placards.',
    descriptionAr: 'توفر مساحة كبيرة في الخزانة وتحمي الأغطية من الغبار والرطوبة.',
    suggestedQuantity: 4,
    estimatedUnitPrice: 25,
    icon: '📦'
  },

  // 10. NETTOYAGE ET ENTRETIEN
  {
    id: 'net-001',
    categoryId: 'nettoyage-entretien',
    subcategoryId: 'balais-seaux',
    nameFr: 'Seau essoreur avec balai à franges microfibre rotatif',
    nameAr: 'سطل مسح أرضيات مع ممسحة مايكروفايبر دوارة وعصارة',
    descriptionFr: 'Pour laver facilement les sols sans se mouiller les mains.',
    descriptionAr: 'لمسح الأرضيات السيراميك والرخام بدون انحناء أو عناء.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 65,
    icon: '🪣'
  },
  {
    id: 'net-002',
    categoryId: 'nettoyage-entretien',
    subcategoryId: 'balais-seaux',
    nameFr: 'Ensemble balai d’intérieur doux et pelle à manche long',
    nameAr: 'مكنسة ناعمة مع جاروف طويل اليد للغبار',
    descriptionFr: 'Pour balayer debout sans mal de dos.',
    descriptionAr: 'مكنسة مريحة لجمع الأتربة بسرعة وبسهولة.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 28,
    icon: '🧹'
  },
  {
    id: 'net-003',
    categoryId: 'nettoyage-entretien',
    subcategoryId: 'sechage-repassage',
    nameFr: 'Séchoir à linge étendoir pliable en métal renforcé',
    nameAr: 'منشر غسيل معدني قوي وقابل للطي',
    descriptionFr: 'Grande surface d’étendage pour draps et vêtements.',
    descriptionAr: 'منشر عملي يتسع لغسلة كاملة من الملابس والملاءات.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 75,
    icon: '👕'
  },
  {
    id: 'net-004',
    categoryId: 'nettoyage-entretien',
    subcategoryId: 'sechage-repassage',
    nameFr: 'Table à repasser stable avec housse molletonnée thermique',
    nameAr: 'طاولة كي ملابس ثابتة مع غطاء حراري مبطن',
    descriptionFr: 'Hauteur réglable et repose-fer sécurisé.',
    descriptionAr: 'طاولة مريحة قابلة لتعديل الارتفاع تجعل الكي سهلاً وسريعاً.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 95,
    icon: '👔'
  },
  {
    id: 'net-005',
    categoryId: 'nettoyage-entretien',
    subcategoryId: 'sechage-repassage',
    nameFr: 'Pinces à linge solides et panier suspendu',
    nameAr: 'ملاقط غسيل قوية مع سلة تعليق عملية',
    descriptionFr: 'Pour fixer solidement le linge au balcon ou à l’étendoir.',
    descriptionAr: 'ملاقط متينة لا تترك أثراً على الملابس عند النشر.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 15,
    icon: '📎'
  },
  {
    id: 'net-006',
    categoryId: 'nettoyage-entretien',
    subcategoryId: 'produits-essentiels',
    nameFr: 'Lot de lavettes en microfibre spécial vitres et inox',
    nameAr: 'مجموعة أقمشة مايكروفايبر للمرايا والأسطح الزجاجية والإينوكس',
    descriptionFr: 'Fait briller sans traces et sans rayures.',
    descriptionAr: 'لتلميع الزجاج والأسطح دون ترك خطوط أو وبر.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 20,
    icon: '🧽'
  },
  {
    id: 'net-007',
    categoryId: 'nettoyage-entretien',
    subcategoryId: 'produits-essentiels',
    nameFr: 'Poubelle à pédale inox pour la cuisine (30L) et salle de bain',
    nameAr: 'سلة مهملات بدواسة من الإينوكس للمطبخ والحمام',
    descriptionFr: 'Fermeture silencieuse et hygiène maximale.',
    descriptionAr: 'سلة نظيفة تفتح بالقدم وعازلة للروائح.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 80,
    icon: '🗑️'
  },

  // 11. RANGEMENT ET ORGANISATION
  {
    id: 'ran-001',
    categoryId: 'rangement-organisation',
    subcategoryId: 'cintres-dressing',
    nameFr: 'Lot de cintres velours antidérapants gain de place (50 pièces)',
    nameAr: 'طقم علّاقات ملابس مخملية مانعة للانزلاق (50 علّاقة)',
    descriptionFr: 'Maintient vos robes, chemises et abayas impeccables sans glisser.',
    descriptionAr: 'علّاقات رفيعة تنظم الدولاب وتوفر مساحة وتحمي الملابس الحريرية من السقوط.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 65,
    icon: '🧥'
  },
  {
    id: 'ran-002',
    categoryId: 'rangement-organisation',
    subcategoryId: 'organisateurs-tiroirs',
    nameFr: 'Organisateurs de tiroirs en tissu pour lingerie et foulards',
    nameAr: 'منظمات أدراج قماشية للملابس الداخلية والشالات والإكسسوارات',
    descriptionFr: 'Permet de retrouver chaque article en un clin d’œil.',
    descriptionAr: 'تقسم الأدراج بدقة وتسهل الوصول السريع إلى كل قطعة.',
    suggestedQuantity: 3,
    estimatedUnitPrice: 35,
    icon: '🗄️'
  },
  {
    id: 'ran-003',
    categoryId: 'rangement-organisation',
    subcategoryId: 'organisateurs-tiroirs',
    nameFr: 'Boîtes de rangement sous-lit transparentes à roulettes',
    nameAr: 'صناديق تخزين شفافة بعجلات تحت السرير',
    descriptionFr: 'Pour stocker couvertures d’appoint et vêtements hors-saison.',
    descriptionAr: 'استغلال ذكي للمساحة تحت السرير لحفظ المفروشات والملابس الموسمية.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 48,
    icon: '📦'
  },
  {
    id: 'ran-004',
    categoryId: 'rangement-organisation',
    subcategoryId: 'paniers-bocaux',
    nameFr: 'Bocaux en verre hermétiques pour épices tunisiennes (Tabel, Karwiya, Harissa)',
    nameAr: 'برطمانات زجاجية محكمة للبهارات التونسية (تابل وكروية وفلفل زينة)',
    descriptionFr: 'Conserve la fraîcheur des arômes et décore l’étagère.',
    descriptionAr: 'تحافظ على نكهة التوابل التونسية من الرطوبة وتمنح المطبخ رونقاً.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 40,
    icon: '🫙',
    isTraditional: true
  },
  {
    id: 'ran-005',
    categoryId: 'rangement-organisation',
    subcategoryId: 'paniers-bocaux',
    nameFr: 'Boîtes hermétiques alimentaires en verre pour frigo et garde-manger',
    nameAr: 'علب طعام زجاجية محكمة الإغلاق للثلاجة والمؤونة',
    descriptionFr: 'Sans BPA, passe au four et au micro-ondes pour conserver les restes.',
    descriptionAr: 'لحفظ بقايا الأكل والسلطات بأمان دون تغير الطعم أو الرائحة.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 55,
    icon: '🍱'
  },
  {
    id: 'ran-006',
    categoryId: 'rangement-organisation',
    subcategoryId: 'cintres-dressing',
    nameFr: 'Étagère ou meuble range-chaussures pour l’entrée',
    nameAr: 'خزانة أو رف أنيق لتنظيم الأحذية عند مدخل البيت',
    descriptionFr: 'Garde l’entrée de la maison accueillante et ordonnée.',
    descriptionAr: 'يحافظ على نظافة وترتيب المدخل ويجمع الأحذية في مكان واحد.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 85,
    icon: '👞'
  },

  // 12. ACCUEIL ET INVITÉS
  {
    id: 'acc-001',
    categoryId: 'accueil-invites',
    subcategoryId: 'couchage-invites',
    nameFr: 'Matelas d’appoint ou surmatelas confortable pour invités',
    nameAr: 'مرتبة إضافية مريحة لضيوف العائلة',
    descriptionFr: 'Pour héberger confortablement famille et proches.',
    descriptionAr: 'لاستقبال الأهل والأقارب عند المبيت في بيتكم بكل كرم.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 110,
    icon: '🛌'
  },
  {
    id: 'acc-002',
    categoryId: 'accueil-invites',
    subcategoryId: 'couchage-invites',
    nameFr: 'Parures de lit et oreillers dédiés aux invités',
    nameAr: 'أطقم شراشف وملاءات مخصصة لغرفة الضيوف',
    descriptionFr: 'Propres et soignées, toujours prêtes pour les visites.',
    descriptionAr: 'أطقم سرير نظيفة وجاهزة دائماً لاستقبال الزوار.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 75,
    icon: '🛏️'
  },
  {
    id: 'acc-003',
    categoryId: 'accueil-invites',
    subcategoryId: 'service-honneur',
    nameFr: 'Bonbonnière en cristal ou présentoir à étages pour gâteaux tunisiens',
    nameAr: 'صحن تقديم حلويات بطوابق أو بونبونييرة كريستال راقية',
    descriptionFr: 'Pour sublimer le mlabbes, la baklawa et les cornes de gazelle.',
    descriptionAr: 'لعرض الحلويات التونسية الفاخرة مثل البقلاوة والملبس وكعك الورقة.',
    suggestedQuantity: 2,
    estimatedUnitPrice: 60,
    icon: '🧁',
    isTraditional: true
  },
  {
    id: 'acc-004',
    categoryId: 'accueil-invites',
    subcategoryId: 'thermos-accueil',
    nameFr: 'Duo Thermos à café et thé de réception (Design luxe doré/argenté)',
    nameAr: 'طقم تيرموس مزدوج فاخر للشاي والقهوة (تصميم مذهب/فضي)',
    descriptionFr: 'Maintient les boissons bien chaudes pendant toute la visite.',
    descriptionAr: 'يحافظ على حرارة القهوة والشاي لساعات طويلة أثناء جلسات الضيافة.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 95,
    icon: '🫖'
  },
  {
    id: 'acc-005',
    categoryId: 'accueil-invites',
    subcategoryId: 'thermos-accueil',
    nameFr: 'Fontaine à jus ou carafe en verre avec robinet pour réceptions',
    nameAr: 'موزع مشروبات وعصائر زجاجي مع حنفية أنيقة للحفلات',
    descriptionFr: 'Pour servir citronnade fraîche tunisienne et jus frais.',
    descriptionAr: 'لتقديم السيتروناد التونسية والعصائر الطازجة في اللقاءات العائلية.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 55,
    icon: '🍹',
    isTraditional: true
  },

  // 13. ESSENTIELS DU QUOTIDIEN
  {
    id: 'ess-001',
    categoryId: 'essentiels-quotidien',
    subcategoryId: 'securite-sante',
    nameFr: 'Trousse de premiers secours complète pour la maison',
    nameAr: 'صندوق إسعافات أولية متكامل للمنزل',
    descriptionFr: 'Pansements, désinfectant, compresses, thermomètre et ciseaux.',
    descriptionAr: 'ضمادات، معقم، شاش طبي، ميزان حرارة ومسكنات للطوارئ.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 45,
    icon: '🩹'
  },
  {
    id: 'ess-002',
    categoryId: 'essentiels-quotidien',
    subcategoryId: 'bricolage-outils',
    nameFr: 'Boîte à outils de base pour le foyer (Tournevis, marteau, pince, mètre)',
    nameAr: 'حقيبة أدوات صيانة منزلية خفيفة (مفكّات، مطرقة، كماشة، ومتر قياس)',
    descriptionFr: 'Pour monter les petits meubles et fixer les cadres.',
    descriptionAr: 'لتركيب الأثاث الخفيف، تثبيت اللوحات وإصلاح الأعطال البسيطة.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 50,
    icon: '🔨'
  },
  {
    id: 'ess-003',
    categoryId: 'essentiels-quotidien',
    subcategoryId: 'electricite-piles',
    nameFr: 'Rallonges multiprises sécurisées avec parafoudre',
    nameAr: 'مشتركات كهربائية آمنة مع حماية من ارتفاع الجهد',
    descriptionFr: 'Pour brancher TV, lampes et chargeurs sans danger.',
    descriptionAr: 'لتوصيل الأجهزة والشاشات وشواحن الهواتف بأمان.',
    suggestedQuantity: 3,
    estimatedUnitPrice: 25,
    icon: '🔌'
  },
  {
    id: 'ess-004',
    categoryId: 'essentiels-quotidien',
    subcategoryId: 'electricite-piles',
    nameFr: 'Lot d’ampoules LED économiques (Lumière chaude et blanche)',
    nameAr: 'طقم مصابيح ليد اقتصادية احتياطية (إضاءة دافئة وبيضاء)',
    descriptionFr: 'Toujours en avoir d’avance en cas d’ampoule grillée.',
    descriptionAr: 'مصابيح احتياطية موفرة للطاقة لتفادي انقطاع الإضاءة المفاجئ.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 28,
    icon: '💡'
  },
  {
    id: 'ess-005',
    categoryId: 'essentiels-quotidien',
    subcategoryId: 'bricolage-outils',
    nameFr: 'Escabeau pliant de sécurité 3 ou 4 marches',
    nameAr: 'سلم منزلي خفيف وقابل للطي (3 أو 4 درجات)',
    descriptionFr: 'Pour accrocher les rideaux et atteindre les hauts de placards.',
    descriptionAr: 'لتغيير الستائر والوصول للرفوف العالية في المطبخ والخزائن بأمان.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 65,
    icon: '🪜'
  },
  {
    id: 'ess-006',
    categoryId: 'essentiels-quotidien',
    subcategoryId: 'securite-sante',
    nameFr: 'Paillasson d’accueil chaleureux pour la porte d’entrée',
    nameAr: 'سجادة ترحيبية أنيقة أمام باب مدخل البيت',
    descriptionFr: 'Retient la poussière et souhaite la bienvenue à vos invités.',
    descriptionAr: 'تحافظ على نظافة مدخل البيت وتمنح انطباعاً دافئاً للقادمين.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 25,
    icon: '🚪'
  },

  // 14. PRÉPARATION DU MARIAGE
  {
    id: 'mar-001',
    categoryId: 'preparation-mariage',
    subcategoryId: 'accessoires-jour-j',
    nameFr: 'Peignoir de mariée en satin blanc brodé « Bride » ou « عروسة »',
    nameAr: 'روب العروس الأبيض من الساتان لجلسة التجهيز والمكياج',
    descriptionFr: 'Pour les photos de préparation et la séance coiffure-maquillage.',
    descriptionAr: 'لجلسة التصوير الصباحية وتحضير تسريحة ومكياج العرس.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 85,
    icon: '👰',
    isTraditional: true
  },
  {
    id: 'mar-002',
    categoryId: 'preparation-mariage',
    subcategoryId: 'accessoires-jour-j',
    nameFr: 'Chaussures de mariée confortables et escarpins pour la robe blanche',
    nameAr: 'حذاء العروس الأنيق والمريح للثوب الأبيض وسهرة الزفاف',
    descriptionFr: 'Élégance et confort pour pouvoir danser et profiter de sa soirée.',
    descriptionAr: 'حذاء راقٍ ومريح يتيح للعروس الاستمتاع بالرقص والحركة دون تعب.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 160,
    icon: '👠'
  },
  {
    id: 'mar-003',
    categoryId: 'preparation-mariage',
    subcategoryId: 'accessoires-jour-j',
    nameFr: 'Basket de mariée pailletée pour la fin de soirée (Option détente)',
    nameAr: 'حذاء رياضي مخصص للعروس مطرز للراحة في ختام الحفل',
    descriptionFr: 'La tendance moderne pour remplacer les talons en fin de fête.',
    descriptionAr: 'خيار عصري ومريح لتبديل الكعب العالي في آخر السهرة والرقص بحرية.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 75,
    icon: '👟'
  },
  {
    id: 'mar-004',
    categoryId: 'preparation-mariage',
    subcategoryId: 'trousse-urgence',
    nameFr: 'Kit SOS mariée pour le jour J (Épingles, retouche maquillage, fil, lingettes)',
    nameAr: 'حقيبة الطوارئ ليوم الزفاف (دبابيس، خيط وإبرة، مناديل ومثبت مكياج)',
    descriptionFr: 'À confier à votre témoin ou sœur pour parer à tout imprévu.',
    descriptionAr: 'حقيبة صغيرة تسلم لأخت العروس أو رفيقتها لأي طارئ في تسريحة أو فستان العروس.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 30,
    icon: '🧷'
  },
  {
    id: 'mar-005',
    categoryId: 'preparation-mariage',
    subcategoryId: 'souvenirs-rituels',
    nameFr: 'Accessoires de la cérémonie du Henné et Outia tunisienne',
    nameAr: 'مستلزمات ليلة الحنة والوطية التونسية الأصيلة',
    descriptionFr: 'Plateau fleuri, bougies décorées et gants brodés traditionnels.',
    descriptionAr: 'صينية الحناء المزينة، الشموع والقفازات المطرزة لأجمل ليلة تقليدية.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 95,
    icon: '🕯️',
    isTraditional: true
  },
  {
    id: 'mar-006',
    categoryId: 'preparation-mariage',
    subcategoryId: 'souvenirs-rituels',
    nameFr: 'Livre d’or des mariés personnalisé et stylo plume',
    nameAr: 'سجل تهاني العرسان التذكاري (Livre d\'or) مع قلم فاخر',
    descriptionFr: 'Pour recueillir les doux vœux de tous vos invités et proches.',
    descriptionAr: 'لتسجيل كلمات المحبة وتهاني العائلة والأصدقاء في يوم العمر.',
    suggestedQuantity: 1,
    estimatedUnitPrice: 50,
    icon: '📖'
  }
];
