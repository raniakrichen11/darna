const fs = require('fs');
const path = require('path');

const categories = [
  {
    id: 'cuisine-ustensiles',
    nameFr: 'Cuisine et ustensiles',
    nameAr: 'المطبخ وأدواته',
    nameEn: 'Kitchen & Cookware',
    descriptionFr: 'Batterie de cuisine, casseroles, ustensiles et matériel de cuisson.',
    descriptionAr: 'أواني الطهي، القدور، أدوات التحضير ومستلزمات الطبخ اليومي والتقليدي.',
    descriptionEn: 'Cookware, pots, saucepans, prep utensils and cooking essentials.',
    icon: '🍳',
    image: 'assets/cat_kitchen.jpg',
    subcategories: [
      { id: 'cuisson-plats', nameFr: 'Cuisson et casseroles', nameAr: 'قدور وأواني الطهي', nameEn: 'Cookware & Pots' },
      { id: 'ustensiles-decoupe', nameFr: 'Ustensiles et découpe', nameAr: 'أدوات التحضير والتقطيع', nameEn: 'Utensils & Cutting' },
      { id: 'patisserie-accessoires', nameFr: 'Pâtisserie et petits accessoires', nameAr: 'مستلزمات الحلويات والمطبخ', nameEn: 'Baking & Accessories' },
      { id: 'traditionnel-tunisien', nameFr: 'Matériel traditionnel', nameAr: 'أدوات المطبخ التونسي التقليدي', nameEn: 'Traditional Cookware' }
    ]
  },
  {
    id: 'vaisselle-service',
    nameFr: 'Vaisselle et service',
    nameAr: 'الأواني وأدوات التقديم',
    nameEn: 'Tableware & Dining',
    descriptionFr: 'Assiettes, couverts, verres, services à thé et plateaux de présentation.',
    descriptionAr: 'الصحون، الملاعق والسكاكين، الكؤوس، أطقم الشاي والقهوة وصواني التقديم.',
    descriptionEn: 'Plates, flatware, glasses, tea sets, and formal serving platters.',
    icon: '🍽️',
    image: 'assets/cat_tableware.jpg',
    subcategories: [
      { id: 'services-table', nameFr: 'Services de table et assiettes', nameAr: 'أطقم المائدة والصحون', nameEn: 'Dinner Sets & Plates' },
      { id: 'couverts-verrerie', nameFr: 'Couverts et verres', nameAr: 'الملاعق وأطقم الكؤوس', nameEn: 'Flatware & Glassware' },
      { id: 'the-cafe', nameFr: 'Service thé et café', nameAr: 'أطقم الشاي والقهوة التونسية', nameEn: 'Tea & Coffee Service' },
      { id: 'plateaux-plats', nameFr: 'Plateaux et plats de service', nameAr: 'الصواني وأواني الضيافة', nameEn: 'Serving Platters & Trays' }
    ]
  },
  {
    id: 'chambre-literie',
    nameFr: 'Chambre et literie',
    nameAr: 'غرفة النوم والمفروشات',
    nameEn: 'Bedroom & Bedding',
    descriptionFr: 'Draps, couettes, oreillers, couvre-lits et literie des mariés.',
    descriptionAr: 'الملاءات، الأغطية واللحاف، الوسائد، أغطية السرير الفاخرة ومفروشات العروس.',
    descriptionEn: 'Bedsheets, duvets, pillows, bedspreads, and bridal bedding.',
    icon: '🛏️',
    image: 'assets/cat_bedroom.jpg',
    subcategories: [
      { id: 'parures-draps', nameFr: 'Parures de lit et draps', nameAr: 'أطقم الملاءات والشراشف', nameEn: 'Sheet Sets & Linens' },
      { id: 'couettes-oreillers', nameFr: 'Couettes et oreillers', nameAr: 'اللحاف، البطانيات والوسائد', nameEn: 'Duvets & Pillows' },
      { id: 'couvre-lits-mariee', nameFr: 'Couvre-lits de mariée', nameAr: 'أغطية السرير الخاصة بالعروس', nameEn: 'Bridal Bedspreads' },
      { id: 'protection-literie', nameFr: 'Protection et confort', nameAr: 'واقيات المراتب ومستلزمات النوم', nameEn: 'Mattress Protectors & Comfort' }
    ]
  },
  {
    id: 'salle-de-bain',
    nameFr: 'Salle de bain',
    nameAr: 'الحمّام',
    nameEn: 'Bathroom & Hammam',
    descriptionFr: 'Serviettes, foutas, tapis de bain, accessoires et rituels hammam.',
    descriptionAr: 'المناشف، الفوطة التونسية، سجادات الحمام، الإكسسوارات ومستلزمات الحمام التقليدي.',
    descriptionEn: 'Towels, Tunisian foutas, bath rugs, accessories, and hammam ritual.',
    icon: '🛁',
    image: 'assets/cat_bath.jpg',
    subcategories: [
      { id: 'serviettes-foutas', nameFr: 'Serviettes et Foutas', nameAr: 'المناشف وفوطة الحمام', nameEn: 'Towels & Foutas' },
      { id: 'peignoirs-tapis', nameFr: 'Peignoirs et tapis de bain', nameAr: 'البرانس وسجاد الحمام', nameEn: 'Bathrobes & Bath Rugs' },
      { id: 'accessoires-sdb', nameFr: 'Accessoires et distributeurs', nameAr: 'حوامل الصابون والإكسسوارات', nameEn: 'Dispensers & Accessories' },
      { id: 'rituel-hammam', nameFr: 'Rituel Hammam & soin', nameAr: 'طقم الحمام التقليدي والعناية', nameEn: 'Hammam Ritual & Care' }
    ]
  },
  {
    id: 'salon-decoration',
    nameFr: 'Salon et décoration',
    nameAr: 'الصالون والديكور',
    nameEn: 'Living Room & Decor',
    descriptionFr: 'Rideaux, coussins, tapis, luminaires et touches d’ambiance chaleureuses.',
    descriptionAr: 'الستائر، الوسائد الديكورية، الزرابي، الإضاءة واللمسات الجمالية للمنزل.',
    descriptionEn: 'Curtains, cushions, rugs, lighting, and warm aesthetic touches.',
    icon: '🛋️',
    image: 'assets/cat_living_room.jpg',
    subcategories: [
      { id: 'rideaux-voilages', nameFr: 'Rideaux et voilages', nameAr: 'الستائر وأقمشة النوافذ', nameEn: 'Curtains & Drapes' },
      { id: 'tapis-salons', nameFr: 'Tapis et carpettes', nameAr: 'الزرابي وسجاد الصالون', nameEn: 'Rugs & Carpets' },
      { id: 'coussins-plaids', nameFr: 'Coussins et plaids', nameAr: 'الوسائد وأغطية الأريكة', nameEn: 'Cushions & Throws' },
      { id: 'luminaires-deco', nameFr: 'Vases, miroirs et déco', nameAr: 'المرايا، المزهريات والتحف', nameEn: 'Vases, Mirrors & Accents' }
    ]
  },
  {
    id: 'electromenager',
    nameFr: 'Électroménager',
    nameAr: 'الأجهزة المنزلية',
    nameEn: 'Home Appliances',
    descriptionFr: 'Gros et petits appareils pour faciliter la vie quotidienne du foyer.',
    descriptionAr: 'الأجهزة الكهربائية الكبيرة والصغيرة لتجهيز بيت الزوجية العصري.',
    descriptionEn: 'Small and large appliances to equip your modern home.',
    icon: '⚡',
    image: 'assets/cat_appliances.jpg',
    subcategories: [
      { id: 'petit-dej-cuisine', nameFr: 'Petit électroménager cuisine', nameAr: 'أجهزة المطبخ الصغيرة', nameEn: 'Small Kitchen Appliances' },
      { id: 'entretien-linge-sol', nameFr: 'Entretien et nettoyage', nameAr: 'أجهزة الكي والتنظيف', nameEn: 'Garment & Floor Care' },
      { id: 'gros-electromenager', nameFr: 'Gros électroménager (optionnel)', nameAr: 'الأجهزة الكبيرة (حسب الرغبة)', nameEn: 'Major Appliances (Optional)' }
    ]
  },
  {
    id: 'vetements-accessoires',
    nameFr: 'Vêtements et accessoires',
    nameAr: 'الملابس والإكسسوارات',
    nameEn: 'Clothing & Loungewear',
    descriptionFr: 'Gardes-robes, tenues d’intérieur, pyjamas, babouches et sorties.',
    descriptionAr: 'الملابس اليومية، ملابس البيت، البيجامات، الأحذية والشباشب الأنيقة.',
    descriptionEn: 'Wardrobe essentials, homewear, pyjamas, slippers, and outings.',
    icon: '👗',
    image: 'assets/cat_apparel.jpg',
    subcategories: [
      { id: 'interieur-pyjamas', nameFr: 'Pyjamas et homewear', nameAr: 'البيجامات وملابس البيت', nameEn: 'Pyjamas & Homewear' },
      { id: 'lingerie-nuit', nameFr: 'Lingerie et nuisettes', nameAr: 'ملابس النوم واللانجري', nameEn: 'Lingerie & Sleepwear' },
      { id: 'chaussures-pantoufles', nameFr: 'Chaussures et pantoufles', nameAr: 'الأحذية وشباشب البيت', nameEn: 'Shoes & Slippers' },
      { id: 'tenues-sorties', nameFr: 'Tenues et sacs à main', nameAr: 'ملابس الخروج والحقائب', nameEn: 'Outfits & Handbags' }
    ]
  },
  {
    id: 'trousseau-mariee',
    nameFr: 'Trousseau de la mariée',
    nameAr: 'جهاز العروس',
    nameEn: 'Bridal Trousseau',
    descriptionFr: 'Pièces d’exception, coffrets, parfums, maquillage et rituels précieux.',
    descriptionAr: 'الجهاز الخاص، عطور العروس، حقائب السفر، مستحضرات التجميل والقطع المميزة.',
    descriptionEn: 'Exceptional bridal boxes, perfumes, makeup, and precious rituals.',
    icon: '💎',
    image: 'assets/cat_bridal.jpg',
    subcategories: [
      { id: 'parfums-beaute', nameFr: 'Parfums et coffrets beauté', nameAr: 'العطور ومجموعات العناية', nameEn: 'Perfumes & Beauty Sets' },
      { id: 'maquillage-soins', nameFr: 'Maquillage et trousse', nameAr: 'المكياج وحقيبة التجميل', nameEn: 'Makeup & Vanity' },
      { id: 'valises-voyage', nameFr: 'Valises et bagagerie', nameAr: 'حقائب السفر وجهاز العروس', nameEn: 'Luggage & Suitcases' },
      { id: 'accessoires-coiffure', nameFr: 'Bijoux fantaisie & coiffure', nameAr: 'إكسسوارات الشعر والزينة', nameEn: 'Hair Accessories & Jewelry' }
    ]
  },
  {
    id: 'linge-maison',
    nameFr: 'Linge de maison',
    nameAr: 'مفروشات المنزل',
    nameEn: 'Home Linens',
    descriptionFr: 'Nappes, chemins de table, torchons et linges de réception.',
    descriptionAr: 'المفارش، شراشف طاولة الطعام، مناشف المطبخ ومفروشات المناسبات.',
    descriptionEn: 'Tablecloths, table runners, kitchen towels, and reception linens.',
    icon: '🧵',
    image: 'assets/cat_linens.jpg',
    subcategories: [
      { id: 'nappes-reception', nameFr: 'Nappes et chemins de table', nameAr: 'مفارش السفرة وطاولات الضيافة', nameEn: 'Tablecloths & Runners' },
      { id: 'torchons-essuie-mains', nameFr: 'Torchons et essuie-mains', nameAr: 'مناشف المطبخ والأيدي', nameEn: 'Kitchen Towels' },
      { id: 'housses-protections', nameFr: 'Housses et protections', nameAr: 'أغطية الحماية وحافظات الأقمشة', nameEn: 'Protective Covers' }
    ]
  },
  {
    id: 'nettoyage-entretien',
    nameFr: 'Nettoyage et entretien',
    nameAr: 'التنظيف والعناية بالمنزل',
    nameEn: 'Cleaning & Maintenance',
    descriptionFr: 'Balais, seaux, séchoir, produits essentiels pour un foyer impeccable.',
    descriptionAr: 'المكانس، الدلاء، منشر الغسيل وأدوات النظافة اليومية لبيت مشرق.',
    descriptionEn: 'Brooms, mops, drying rack, and essentials for a pristine home.',
    icon: '🧹',
    image: 'assets/cat_cleaning.jpg',
    subcategories: [
      { id: 'balais-seaux', nameFr: 'Balais, serpillières et seaux', nameAr: 'مكانس وأدوات مسح الأرضيات', nameEn: 'Brooms & Mop Buckets' },
      { id: 'sechage-repassage', nameFr: 'Séchoir et table à repasser', nameAr: 'منشر الغسيل وطاولة الكي', nameEn: 'Drying Rack & Ironing Board' },
      { id: 'produits-essentiels', nameFr: 'Chiffons et kits de base', nameAr: 'الأقمشة المايكروفايبر واللوازم', nameEn: 'Microfiber Cloths & Basic Kits' }
    ]
  },
  {
    id: 'rangement-organisation',
    nameFr: 'Rangement et organisation',
    nameAr: 'التخزين والتنظيم',
    nameEn: 'Storage & Organization',
    descriptionFr: 'Boîtes sous-lit, cintres, séparateurs de tiroirs et paniers.',
    descriptionAr: 'صناديق التخزين، علّاقات الملابس، منظمات الأدراج وسلال الترتيب.',
    descriptionEn: 'Underbed boxes, hangers, drawer dividers, and organizers.',
    icon: '📦',
    image: 'assets/cat_organization.jpg',
    subcategories: [
      { id: 'cintres-dressing', nameFr: 'Cintres et housses dressing', nameAr: 'علّاقات الملابس وأكياس الحفظ', nameEn: 'Hangers & Garment Bags' },
      { id: 'organisateurs-tiroirs', nameFr: 'Séparateurs et boîtes', nameAr: 'منظمات الأدراج والصناديق', nameEn: 'Dividers & Storage Boxes' },
      { id: 'paniers-bocaux', nameFr: 'Bocaux et boîtes hermétiques', nameAr: 'البرطمانات وعلب المطبخ المحكمة', nameEn: 'Jars & Airtight Canisters' }
    ]
  },
  {
    id: 'accueil-invites',
    nameFr: 'Accueil et invités',
    nameAr: 'الضيافة واستقبال الضيوف',
    nameEn: 'Guest Hospitality',
    descriptionFr: 'Linge pour les invités, matelas d’appoint, services d’honneur.',
    descriptionAr: 'مفروشات الضيوف، وسائد إضافية، أطقم الضيافة الفاخرة للزيارات العائلية.',
    descriptionEn: 'Guest bedding, extra pillows, and prestigious reception sets.',
    icon: '☕',
    image: 'assets/cat_hospitality.jpg',
    subcategories: [
      { id: 'couchage-invites', nameFr: 'Literie et coussins d’appoint', nameAr: 'أغطية ووسائد لضيوف البيت', nameEn: 'Guest Bedding & Pillows' },
      { id: 'service-honneur', nameFr: 'Services prestigieux', nameAr: 'أواني الشاي والحلويات الفاخرة', nameEn: 'Honor Reception Services' },
      { id: 'thermos-accueil', nameFr: 'Thermos et carafes d’accueil', nameAr: 'تيرموس القهوة والمشروبات', nameEn: 'Vacuum Flasks & Beverage Carafes' }
    ]
  },
  {
    id: 'essentiels-quotidien',
    nameFr: 'Essentiels du quotidien',
    nameAr: 'مستلزمات الحياة اليومية',
    nameEn: 'Daily Essentials',
    descriptionFr: 'Trousse de secours, multiprises, outillage de base et sécurité.',
    descriptionAr: 'صندوق الإسعافات الأولية، التوصيلات الكهربائية، صندوق الأدوات البسيط.',
    descriptionEn: 'First-aid kit, power strips, basic tool set, and household safety.',
    icon: '🔧',
    image: 'assets/cat_daily_essentials.jpg',
    subcategories: [
      { id: 'securite-sante', nameFr: 'Pharmacie et premiers soins', nameAr: 'الإسعافات الأولية والسلامة', nameEn: 'First Aid & Health' },
      { id: 'bricolage-outils', nameFr: 'Petit outillage et quincaillerie', nameAr: 'مفكّات وأدوات الصيانة الخفيفة', nameEn: 'Hand Tools & Hardware' },
      { id: 'electricite-piles', nameFr: 'Multiprises et ampoules', nameAr: 'التوصيلات والمصابيح الاحتياطية', nameEn: 'Extension Cords & Lightbulbs' }
    ]
  },
  {
    id: 'preparation-mariage',
    nameFr: 'Préparation du mariage',
    nameAr: 'التحضير للزفاف',
    nameEn: 'Wedding Preparation',
    descriptionFr: 'Accessoires du jour J, peignoir brodé, chaussures de mariée et trousse.',
    descriptionAr: 'مستلزمات يوم الزفاف، برنوس العروس المطرز، حذاء الزفاف وحقيبة الطوارئ.',
    descriptionEn: 'Big day accessories, embroidered bridal robe, wedding shoes, and emergency kit.',
    icon: '👰',
    image: 'assets/darna_hero.jpg',
    subcategories: [
      { id: 'accessoires-jour-j', nameFr: 'Le grand jour', nameAr: 'مقتنيات يوم العرس', nameEn: 'The Big Day' },
      { id: 'trousse-urgence', nameFr: 'Trousse de secours mariée', nameAr: 'حقيبة الطوارئ الصغيرة للعروس', nameEn: 'Bridal Emergency Kit' },
      { id: 'souvenirs-rituels', nameFr: 'Détails et rituels', nameAr: 'تفاصيل الحناء والتقاليد', nameEn: 'Henna & Traditions' }
    ]
  }
];

// Read items from items data generator
console.log('Categories defined:', categories.length);
