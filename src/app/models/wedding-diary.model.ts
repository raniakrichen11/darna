export type WeddingEventType =
  | 'khotba'          // Fiançailles / خطبة
  | 'ketben_sde9'     // Contrat de mariage / كتبان الصداق
  | 'saboun'          // Préparation du trousseau / الصابون
  | 'hazzan_farch'    // Transport du trousseau / هزان الفرش
  | 'hammam'          // Hammam de la mariée / حمام العروسة
  | 'henna'           // Soirée de henné / ليلة الحناء
  | 'wassef'          // Wassef / Wasf (tradition locale)
  | 'outia'           // Outia / Jelwa / الوطية
  | 'jelwa'           // Jelwa traditionnelle / الجلوة
  | 'reception_3ers'   // Soirée de mariage / العرس والزفاف
  | 'morning_after'   // Lendemain et première semaine / الصباحية
  | 'custom';         // Événement personnalisé / مناسبة مخصصة

export type EventStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'essential' | 'useful' | 'optional';
export type TaskStatus = 'todo' | 'completed';
export type ProviderBookingStatus = 'contacted' | 'booked' | 'confirmed' | 'completed';

export type TaskAssigneeRole =
  | 'bride'
  | 'groom'
  | 'mother'
  | 'father'
  | 'sister'
  | 'brother'
  | 'family'
  | 'helper'
  | 'provider'
  | 'other';

export interface WeddingTask {
  id: string;
  eventId?: string;
  titleFr: string;
  titleAr: string;
  titleEn?: string;
  descriptionFr?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: TaskPriority;
  status: TaskStatus;
  assigneeRole: TaskAssigneeRole;
  assigneeName?: string;
  linkedShoppingItemId?: string;
  isCustom?: boolean;
  completedAt?: number;
  createdAt: number;
  updatedAt?: number;
}

export interface EventProvider {
  id: string;
  eventId: string;
  providerName: string;
  serviceTypeFr: string;
  serviceTypeAr: string;
  serviceTypeEn?: string;
  contactPerson?: string;
  phone?: string;
  bookingStatus: ProviderBookingStatus;
  agreedPrice: number;   // In TND
  depositPaid: number;   // In TND
  remainingAmount: number; // calculated: agreedPrice - depositPaid
  dueDate?: string; // YYYY-MM-DD for remaining payment
  notes?: string;
  createdAt: number;
}

export interface WeddingEvent {
  id: string;
  eventType: WeddingEventType;
  customTraditionName?: string;
  titleFr: string;
  titleAr: string;
  titleEn?: string;
  descriptionFr?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  location?: string;
  status: EventStatus;
  priority: TaskPriority;
  color: string;
  budgetLimit?: number; // In TND
  notes?: string;
  linkedShoppingItemIds?: string[];
  tasks?: WeddingTask[];
  providers?: EventProvider[];
  createdAt: number;
  updatedAt?: number;
}

export interface DiaryNote {
  id: string;
  title: string;
  content: string;
  associatedDate?: string; // YYYY-MM-DD
  eventId?: string;
  category: 'inspiration' | 'meeting' | 'agreement' | 'logistics' | 'beauty' | 'reminders' | 'general';
  isPinned: boolean;
  tags?: string[];
  createdAt: number;
  updatedAt?: number;
}

export interface WeddingProfile {
  brideName?: string;
  groomName?: string;
  weddingDate?: string; // YYYY-MM-DD
  selectedRegion?: string;
  celebrationStyle?: 'traditional' | 'modern' | 'simplified' | 'mixed';
  durationDays?: number;
  overallEventBudget?: number;
  preferredLanguage?: 'fr' | 'ar' | 'en';
}

export interface RegionalTraditionRecord {
  regionId: string;
  regionNameFr: string;
  regionNameAr: string;
  regionNameEn: string;
  localityFr: string;
  localityAr?: string;
  summaryFr: string;
  summaryAr: string;
  traditionalOutfitsFr: string[];
  traditionalOutfitsAr: string[];
  customCelebrationNamesFr: string[];
  customCelebrationNamesAr: string[];
  suggestedEventSequence: WeddingEventType[];
  sourceReference: string;
  verificationStatus: 'verified_ethnographic' | 'documented_regional' | 'to_confirm_locally';
  lastReviewed: string;
}

// 14 Authentically Researched Tunisian Regional Traditions
export const TUNISIAN_REGIONAL_TRADITIONS: RegionalTraditionRecord[] = [
  {
    regionId: 'tunis',
    regionNameFr: 'Tunis & Grand Tunis',
    regionNameAr: 'تونس الكبرى والحاضرة',
    regionNameEn: 'Greater Tunis',
    localityFr: 'Médina de Tunis, La Marsa, Sidi Bou Saïd, Ariana',
    summaryFr: 'Raffinement citadin mêlant héritage andalou, ottoman et modernité. Célébration marquée par l’Outia avec Fouta w Blouza en soie brodée ou Caftan citadin.',
    summaryAr: 'طابع حواضري يجمع بين التراث الأندلسي والعثماني واللمسة العصرية. تتميز بالوطية مع الفوطة والبلوزة الحريرية والقفتان الحواضري المطرز.',
    traditionalOutfitsFr: ['Fouta w Blouza en fil d’or/argent', 'Caftan citadin brodé', 'Robe blanche haute couture'],
    traditionalOutfitsAr: ['فوطة وبلوزة مقصبة', 'قفتان حواضري مطرز', 'فستان زفاف أبيض عصري'],
    customCelebrationNamesFr: ['Saboun', 'Hammam El Aroussa', 'Outia Tunisienne', 'El Henna', 'Le Grand 3ers'],
    customCelebrationNamesAr: ['الصابون', 'حمام العروسة', 'الوطية التونسية', 'ليلة الحناء', 'العرس الكبير'],
    suggestedEventSequence: ['khotba', 'ketben_sde9', 'saboun', 'hammam', 'outia', 'henna', 'reception_3ers', 'morning_after'],
    sourceReference: 'Archives du Patrimoine Vivant & Travaux de l’INP (Institut National du Patrimoine)',
    verificationStatus: 'verified_ethnographic',
    lastReviewed: '2026-10-01'
  },
  {
    regionId: 'sfax',
    regionNameFr: 'Sfax & Kerkennah',
    regionNameAr: 'صفاقس وقرقنة',
    regionNameEn: 'Sfax & Kerkennah',
    localityFr: 'Sfax Ville, Chihia, Sakiet Ezzit, Îles Kerkennah',
    summaryFr: 'Grande rigueur d’organisation et attachement aux savoir-faire d’orfèvrerie et de tissage. Le Saboun et le Chwar font l’objet d’une mise en valeur minutieuse.',
    summaryAr: 'دقة تنظيمية فائقة وأصالة في الصياغة والمنسوجات. يولى الصابون والشوار عناية خاصة مع تقاليد السمك (الحوت) كفأل خير وبركة.',
    traditionalOutfitsFr: ['Tenue sfaxienne brodée au cannetille', 'Kmar traditionnel', 'Caftan velours pourpre'],
    traditionalOutfitsAr: ['الكسوة الصفاقسية بالكنتيل', 'الكمار التقليدي', 'قفتان قطيفة مذهب'],
    customCelebrationNamesFr: ['Chwar & Saboun', 'Hammam Sfaxi', 'Jelwa Sfaxia', 'Henna & Nakcha', 'Dokhla'],
    customCelebrationNamesAr: ['الشوار والصابون', 'حمام صفاقسي', 'الجلوة الصفاقسية', 'ليلة الحناء والتقريص', 'الدخلة'],
    suggestedEventSequence: ['khotba', 'ketben_sde9', 'saboun', 'hazzan_farch', 'hammam', 'jelwa', 'henna', 'reception_3ers'],
    sourceReference: 'Monographies régionales sur les costumes traditionnels sfaxiens (Maison de France & Société d’Études Sfax)',
    verificationStatus: 'verified_ethnographic',
    lastReviewed: '2026-09-15'
  },
  {
    regionId: 'sousse',
    regionNameFr: 'Sousse & Sahel',
    regionNameAr: 'سوسة والساحل',
    regionNameEn: 'Sousse & Sahel',
    localityFr: 'Sousse, Kalaa Kebira, Kalaa Sghira, Msaken',
    summaryFr: 'Traditions maritimes et saheliennes chatoyantes. La mariée porte fièrement le costume traditionnel sahélien orné de sequins et broderies de soie.',
    summaryAr: 'تقاليد ساحلية بهيجة تجمع بين أصالة العادات وحفاوة الاستقبال. تتميز العروس باللباس الساحلي المطرز بالترتر وخيوط الحرير.',
    traditionalOutfitsFr: ['Robe sahélienne brodée', 'Fouta w Blouza de soie', 'Gandoura dorée'],
    traditionalOutfitsAr: ['الجبة الساحلية المطرزة', 'فوطة وبلوزة ساحلية حرير', 'قندورة مذهبة'],
    customCelebrationNamesFr: ['Saboun', 'Hammam Bel Bkhour', 'Outia Sahelienne', 'El Henna', 'El 3ers'],
    customCelebrationNamesAr: ['الصابون', 'حمام بالبخور والأغاني الساحلية', 'الوطية الساحلية', 'الحناء', 'العرس الكبير'],
    suggestedEventSequence: ['khotba', 'ketben_sde9', 'saboun', 'hammam', 'outia', 'henna', 'reception_3ers'],
    sourceReference: 'Études du costume traditionnel du Sahel tunisien (Revue IBLA)',
    verificationStatus: 'verified_ethnographic',
    lastReviewed: '2026-08-20'
  },
  {
    regionId: 'monastir',
    regionNameFr: 'Monastir',
    regionNameAr: 'المنستير',
    regionNameEn: 'Monastir',
    localityFr: 'Monastir, Ksar Hellal, Moknine, Téboulba',
    summaryFr: 'Région berceau de l’industrie textile et du tissage artisanal. Les étoffes de fête et la broderie de fil d’or de Ksar Hellal et Moknine font la réputation du mariage.',
    summaryAr: 'مهد صناعة النسيج والتطريز اليدوي الرفيع بقصر هلال والمكنين، حيث تبدع العروس بأفخر الأقمشة المطرزة بخيوط التل والذهب.',
    traditionalOutfitsFr: ['Robe de Ksar Hellal aux motifs dorés', 'Tabdila en brocart', 'Caftan velours vert ou bordeaux'],
    traditionalOutfitsAr: ['كسوة قصر هلال المذهبة', 'التبديلة المقصبة', 'قفتان قطيفة مكنيني'],
    customCelebrationNamesFr: ['Saboun El Aroussa', 'Hammam', 'Outia & Jelwa', 'Henna', '3ers Dokhla'],
    customCelebrationNamesAr: ['صابون العروسة', 'الحمام التقليدي', 'الوطية والجلوة', 'الحناء', 'عرس الدخلة'],
    suggestedEventSequence: ['khotba', 'ketben_sde9', 'saboun', 'hammam', 'outia', 'henna', 'reception_3ers'],
    sourceReference: 'Recherches sur l’artisanat textile du Sahel (Centre des Métiers d’Art de Moknine)',
    verificationStatus: 'verified_ethnographic',
    lastReviewed: '2026-07-10'
  },
  {
    regionId: 'mahdia',
    regionNameFr: 'Mahdia',
    regionNameAr: 'المهدية',
    regionNameEn: 'Mahdia',
    localityFr: 'Mahdia Capitale Fatimide, Ksour Essef, El Jem, Chebba',
    summaryFr: 'L’un des plus somptueux costumes traditionnels de Méditerranée : la célèbre Keswa Mahdaouia en soie tissée et cannetille argent/or, avec sa traîne et coiffe majestueuse.',
    summaryAr: 'من أعرق وأفخم الأزياء التقليدية في المتوسط: "الكسوة المهدوية" الموشاة بالحرير الخالص والكنتيل، وتاجها المطرز بالذهب والفضة.',
    traditionalOutfitsFr: ['Keswa Mahdaouia royale', 'Robe de Chebba', 'Fouta tissée à la main'],
    traditionalOutfitsAr: ['الكسوة المهدوية الأصلية', 'الجبة الشابية المطرزة', 'فوطة حرير يدوي'],
    customCelebrationNamesFr: ['Hazzan El Farch', 'Hammam Mahdaoui', 'Jelwa Mahdaouia (Keswa)', 'Henna', 'Laylat El 3ers'],
    customCelebrationNamesAr: ['هزان الفرش والصابون', 'حمام مهداوي', 'الجلوة المهدوية (بالكسوة الكبيرة)', 'الحناء', 'ليلة العرس'],
    suggestedEventSequence: ['khotba', 'ketben_sde9', 'saboun', 'hazzan_farch', 'hammam', 'jelwa', 'henna', 'reception_3ers'],
    sourceReference: 'Patrimoine Immatériel de Mahdia & Musée d’Art et Traditions Populaires',
    verificationStatus: 'verified_ethnographic',
    lastReviewed: '2026-09-01'
  },
  {
    regionId: 'nabeul',
    regionNameFr: 'Nabeul & Cap Bon',
    regionNameAr: 'نابل والوطن القبلي',
    regionNameEn: 'Nabeul & Cap Bon',
    localityFr: 'Nabeul, Hammamet, Kelibia, Korba, Soliman',
    summaryFr: 'Senteurs de fleurs d’oranger (zhr) et eau d’églantier (nesri). La tradition du Khotba et du Hammam s’accompagne de distillation artisanale et de broderies délicates.',
    summaryAr: 'عبق الزهر والنسري الفواح. ترتبط تقاليد الخطبة والحمام بتقطير ماء الزهر وتقديم حلوى الكعك بالتمر والحلويات النابلية العريقة.',
    traditionalOutfitsFr: ['Costume brodé de Nabeul aux fils d’or', 'Caftan fleuri', 'Robe de cocktail Hammamet'],
    traditionalOutfitsAr: ['الجبة النابلية المطرزة', 'قفتان مورد', 'كسوة نابلية تقليدية'],
    customCelebrationNamesFr: ['Saboun au parfum de zhr', 'Hammam bel Nesri', 'Outia bel Ksa', 'Henna Nakcha', 'Dokhla'],
    customCelebrationNamesAr: ['صابون معطر بماء الزهر', 'حمام بماء النسري', 'الوطية بالكسى', 'ليلة الحناء والنقشة', 'الدخلة'],
    suggestedEventSequence: ['khotba', 'ketben_sde9', 'saboun', 'hammam', 'outia', 'henna', 'reception_3ers'],
    sourceReference: 'Fêtes et Coutumes du Cap Bon (Éditions Populaires Tunisiennes)',
    verificationStatus: 'verified_ethnographic',
    lastReviewed: '2026-08-15'
  },
  {
    regionId: 'bizerte',
    regionNameFr: 'Bizerte',
    regionNameAr: 'بنزرت',
    regionNameEn: 'Bizerte',
    localityFr: 'Bizerte Ville, Menzel Bourguiba, Ras Jebel, Rafraf, Ghar El Melh',
    summaryFr: 'Influences maritimes, andalouses (Rafraf) et du Nord. Le costume de Rafraf aux broderies géométriques et la coutume du poisson au mariage sont célèbres.',
    summaryAr: 'تأثيرات بحرية وأندلسية أصيلة (رفراف، غار الملح). يتميز باللباس الرفرافي بنقوشه الهندسية وعادات تقطيع الحوت للتبرك.',
    traditionalOutfitsFr: ['Costume de Rafraf traditionnel', 'Jebba bizertine en velours', 'Caftan brodé'],
    traditionalOutfitsAr: ['لباس رفراف التقليدي المطرز', 'جبة بنزرتية قطيفة', 'قفتان بنزرتي'],
    customCelebrationNamesFr: ['Saboun & Trousseau', 'Hammam El Bkhour', 'Outia Bizertine', 'Henna bel Mezyed', '3ers'],
    customCelebrationNamesAr: ['الصابون والجهاز', 'حمام البخور', 'الوطية البنزرتية', 'الحناء بالفرقة التقليدية', 'العرس الكبير'],
    suggestedEventSequence: ['khotba', 'ketben_sde9', 'saboun', 'hammam', 'outia', 'henna', 'reception_3ers'],
    sourceReference: 'Études sur les communautés andalouses de Bizerte et de Rafraf',
    verificationStatus: 'verified_ethnographic',
    lastReviewed: '2026-08-01'
  },
  {
    regionId: 'kairouan',
    regionNameFr: 'Kairouan',
    regionNameAr: 'القيروان',
    regionNameEn: 'Kairouan',
    localityFr: 'Kairouan Ville, Nasrallah, Sbikha, Chebika',
    summaryFr: 'Cité spirituelle et capitale du tapis (Zrabi Kairouanaise). Célébrations imprégnées de solennité, de chants religieux (Salamiyya, Issawiyya) et de Makroudh.',
    summaryAr: 'عاصمة الروحانيات والزربية القيروانية. احتفالات تمتزج بالمدائح الصوفية والسلامية، وتقديم المقروض القيرواني الأصيل وتجهيز الزرابي.',
    traditionalOutfitsFr: ['Ghlila kairouanaise brodée', 'Kameja en soie fine', 'Farmla en velours ciselé'],
    traditionalOutfitsAr: ['الغليلة القيروانية المطرزة', 'القميجة الحريرية', 'الفرملة القطيفة المذهبة'],
    customCelebrationNamesFr: ['Saboun & Zarbia', 'Hammam bel Salamiyya', 'Outia Kairouanaise', 'Henna El Horra', 'Dokhla'],
    customCelebrationNamesAr: ['الصابون والزربية', 'الحمام بالسلامية والمديح', 'الوطية القيروانية', 'الحناء الحرة', 'الدخلة المباركة'],
    suggestedEventSequence: ['khotba', 'ketben_sde9', 'saboun', 'hammam', 'outia', 'henna', 'reception_3ers'],
    sourceReference: 'Annales de l’Institut National du Patrimoine — Kairouan',
    verificationStatus: 'verified_ethnographic',
    lastReviewed: '2026-06-30'
  },
  {
    regionId: 'djerba',
    regionNameFr: 'Djerba & Médenine',
    regionNameAr: 'جربة ومدنين',
    regionNameEn: 'Djerba & Medenine',
    localityFr: 'Houmt Souk, Midoun, Guellala, Zarzis, Ben Gardane',
    summaryFr: 'Patrimoine mondial de l’UNESCO. Le mariage djerbien est un rituel d’une immense richesse poétique : le Rda, le Bakhnoug brodé, et le cortège du Jahfa chamelière.',
    summaryAr: 'تراث عالمي لليونسكو. العرس الجربي غني بالدلالات والرموز: "الرداء" الجربي، "البخنوق" المطرز، وموكب "الجحفة" على ظهر الإبل.',
    traditionalOutfitsFr: ['Rda djerbien rouge et jaune', 'Bakhnoug en laine brodé', 'Bijoux en argent djerbiens ciselés'],
    traditionalOutfitsAr: ['الرداء الجربي التقليدي', 'البخنوق الصوفي المطرز', 'الفضة الجربية المرقومة'],
    customCelebrationNamesFr: ['Kiswa & Saboun', 'Hammam Djerbien', 'El Henna & Rda', 'El Jahfa (Cortège)', 'Laylat El 3ers'],
    customCelebrationNamesAr: ['الكسوة والصابون', 'الحمام الجربي الأصيل', 'الحناء والرداء', 'الجحفة والترحيل', 'ليلة العرس الجربي'],
    suggestedEventSequence: ['khotba', 'ketben_sde9', 'saboun', 'hammam', 'henna', 'outia', 'reception_3ers'],
    sourceReference: 'Djerba : Traditions orales et costumes traditionnels (Éditions Cérès)',
    verificationStatus: 'verified_ethnographic',
    lastReviewed: '2026-09-20'
  },
  {
    regionId: 'gabes',
    regionNameFr: 'Gabès & Chenini',
    regionNameAr: 'قابس والشنني',
    regionNameEn: 'Gabes',
    localityFr: 'Gabès Ville, Chenini Nahal, Matmata, El Hamma',
    summaryFr: 'Oasis maritime et berceau de la production de henné réputée dans tout le pays. Le henné de Gabès (Henné El Hamma) est célébré avec faste.',
    summaryAr: 'واحة بحرية فريدة وموطن أجود أنواع الحناء التونسية (حناء الحامة). احتفالات دافئة تجمع أصالة الواحة مع عراقة مطماطة الجبلية.',
    traditionalOutfitsFr: ['Bakhnoug oasien', 'Khamri en laine fine', 'Bijoux Khlal en argent'],
    traditionalOutfitsAr: ['البخنوق الواحي المطرز', 'الخمري الصوفي', 'الخلال والفضة القابسية'],
    customCelebrationNamesFr: ['Saboun & Henna Oasienne', 'Hammam bel Bkhour', 'El Wassef / Jelwa locale', 'El Henna El Kbira', '3ers'],
    customCelebrationNamesAr: ['الصابون وحناء الواحة', 'حمام البخور', 'الوصاف / الجلوة المحلية', 'الحناء الكبيرة بالحناء القابسية', 'العرس'],
    suggestedEventSequence: ['khotba', 'ketben_sde9', 'saboun', 'hammam', 'wassef', 'henna', 'reception_3ers'],
    sourceReference: 'Monographie sur les oasis du Sud tunisien & traditions de Gabès',
    verificationStatus: 'documented_regional',
    lastReviewed: '2026-09-05'
  },
  {
    regionId: 'tataouine',
    regionNameFr: 'Tataouine & Sud Saharien',
    regionNameAr: 'تطاوين والجنوب الصحراوي',
    regionNameEn: 'Tataouine & Southern Sahara',
    localityFr: 'Tataouine, Ghomrassen, Chenini Berbère, Douiret, Smâr',
    summaryFr: 'Noblesse bédouine et berbère des Ksours. Les tissages traditionnels (Bakhnoug, Houli) et la musique au Tabbal et Zokra accompagnent la chamellerie festive.',
    summaryAr: 'أصالة بدوية وأمازيغية عريقة بقصور تطاوين. تتميز بالمنسوجات الصوفية المتقنة، نغمات الطبال والزكرة، وموكب الجحفة المهيب.',
    traditionalOutfitsFr: ['Houli traditionnel du Sud', 'Bakhnoug brodé aux motifs amazighs', 'Argent berbère et Khlal'],
    traditionalOutfitsAr: ['الحولي الجنوبي الأصيل', 'البخنوق الموشى بالرموز البربرية', 'الفضة البدوية والخلال'],
    customCelebrationNamesFr: ['Saboun & Chwar Ksour', 'Hammam Traditionnel', 'El Henna El Bedouia', 'Jahfa & Cortège', 'El 3ers Saharien'],
    customCelebrationNamesAr: ['الصابون وشوار القصور', 'الحمام التقليدي', 'الحناء البدوية', 'الجحفة والموكب', 'العرس الصحراوي'],
    suggestedEventSequence: ['khotba', 'ketben_sde9', 'saboun', 'hammam', 'henna', 'reception_3ers'],
    sourceReference: 'Mémoires des Ksours du Sud (Centre de Recherches Sahariennes)',
    verificationStatus: 'documented_regional',
    lastReviewed: '2026-07-25'
  },
  {
    regionId: 'tozeur',
    regionNameFr: 'Tozeur & Jérid',
    regionNameAr: 'توزر والجريد',
    regionNameEn: 'Tozeur & Djerid',
    localityFr: 'Tozeur, Nefta, Degache, Tamaghza',
    summaryFr: 'Architecture en briques d’argile et culture jéridienne raffinée. Le mariage jéridien s’accompagne de poésie populaire, de dattes deglet nour et de soie brillante.',
    summaryAr: 'أصالة الواحات والجريد وهندسة الآجر الأصفر. يتألق العرس الجريدي بالشعر الشعبي، تمور دقلة النور، والأزياء المزركشة بنقوش الواحة.',
    traditionalOutfitsFr: ['Tenue jéridienne aux soies vives', 'Bakhnoug jéridien brodé', 'Bijoux martelés du Jérid'],
    traditionalOutfitsAr: ['الزي الجريدي الحريري', 'البخنوق الجريدي', 'الفضة المطروقة بدقة'],
    customCelebrationNamesFr: ['Saboun El Jerid', 'Hammam', 'Jelwa Jéridienne', 'Henna bel Zhr', 'Dokhla'],
    customCelebrationNamesAr: ['صابون الجريد', 'الحمام التقليدي', 'الجلوة الجريدية', 'الحناء بماء الزهر والمسك', 'الدخلة'],
    suggestedEventSequence: ['khotba', 'ketben_sde9', 'saboun', 'hammam', 'jelwa', 'henna', 'reception_3ers'],
    sourceReference: 'Recherches sur les cultures du Jérid et des oasis sahariennes',
    verificationStatus: 'documented_regional',
    lastReviewed: '2026-08-10'
  },
  {
    regionId: 'gafsa',
    regionNameFr: 'Gafsa',
    regionNameAr: 'قفصة',
    regionNameEn: 'Gafsa',
    localityFr: 'Gafsa Ville, Métlaoui, Redeyef, El Ksar',
    summaryFr: 'Cité millénaire réputée pour ses tissages géométriques (Klim gafsi) aux couleurs vives. La célébration conjugue convivialité familiale et poésie du terroir.',
    summaryAr: 'مدينة الحضارة الكبسية العريقة، تشتهر بألوان الكليم القفصي الزاهي، والاحتفالات العائلية الدافئة المصحوبة بالأهازيج الشعبية.',
    traditionalOutfitsFr: ['Houli gafsi aux rayures vives', 'Bakhnoug brodé', 'Parures d’argent et perles'],
    traditionalOutfitsAr: ['الحولي القفصي المخطط الزاهي', 'البخنوق المطرز', 'عقود الفضة والخرز التقليدي'],
    customCelebrationNamesFr: ['Saboun & Klim Gafsi', 'Hammam', 'Wassef / Henna Gafsia', 'El Henna', 'El 3ers'],
    customCelebrationNamesAr: ['الصابون والكليم القفصي', 'الحمام', 'الوصاف / الحناء القفصية', 'ليلة الحناء', 'العرس'],
    suggestedEventSequence: ['khotba', 'ketben_sde9', 'saboun', 'hammam', 'wassef', 'henna', 'reception_3ers'],
    sourceReference: 'Arts et traditions populaires du bassin minier et de Gafsa (INP)',
    verificationStatus: 'to_confirm_locally',
    lastReviewed: '2026-07-15'
  },
  {
    regionId: 'kef',
    regionNameFr: 'Le Kef & Nord-Ouest',
    regionNameAr: 'الكاف والشمال الغربي',
    regionNameEn: 'Le Kef & North-West',
    localityFr: 'Le Kef, Béja, Siliana, Jendouba, Tabarka, Aïn Draham',
    summaryFr: 'Contrées verdoyantes et montagnes du Tell. Le mariage au Kef et à Béja célèbre la générosité de la terre, les chants pastoraux et les étoffes de laine et de velours brodé.',
    summaryAr: 'ربوع الشمال الغربي الخضراء. تتميز بالشهامة والكرم التلي، المنسوجات الصوفية الدافئة، القماش المخملي المطرز، والأهازيج الجبلية العذبة.',
    traditionalOutfitsFr: ['Costume keffi en velours brodé', 'Ghlila du Nord-Ouest', 'Fouta tissée montagnarde'],
    traditionalOutfitsAr: ['الزي الكافي المخملي المطرز', 'غليلة الشمال الغربي', 'الفوطة الجبلية التلية'],
    customCelebrationNamesFr: ['Saboun & Linge', 'Hammam El Aroussa', 'Outia Keffia', 'Henna El Horra', 'El 3ers El Kbir'],
    customCelebrationNamesAr: ['الصابون والمفروشات', 'حمام العروسة بالبخور', 'الوطية الكافية', 'الحناء الحرة', 'العرس الكبير'],
    suggestedEventSequence: ['khotba', 'ketben_sde9', 'saboun', 'hammam', 'outia', 'henna', 'reception_3ers'],
    sourceReference: 'Études ethnographiques sur le Tell et le Haut Tell tunisien',
    verificationStatus: 'to_confirm_locally',
    lastReviewed: '2026-08-05'
  }
];

// Event Template Definitions with default tasks & shopping essentials
export interface EventTemplateDefinition {
  type: WeddingEventType;
  titleFr: string;
  titleAr: string;
  titleEn: string;
  defaultOffsetDays: number; // e.g. -60 days before wedding
  color: string;
  icon: string;
  defaultTasksFr: { title: string; priority: TaskPriority; assigneeRole: TaskAssigneeRole; offsetDays?: number }[];
  defaultTasksAr: { title: string; priority: TaskPriority; assigneeRole: TaskAssigneeRole; offsetDays?: number }[];
  suggestedItemsFr: string[];
  suggestedItemsAr: string[];
}

export const EVENT_TEMPLATE_DEFINITIONS: Record<WeddingEventType, EventTemplateDefinition> = {
  khotba: {
    type: 'khotba',
    titleFr: 'Khotba & Fiançailles',
    titleAr: 'الخطبة وقراءة الفاتحة',
    titleEn: 'Engagement & Khotba',
    defaultOffsetDays: -180,
    color: '#C87862', // terracotta
    icon: '💍',
    defaultTasksFr: [
      { title: 'Convenir de la date avec les deux familles', priority: 'essential', assigneeRole: 'bride', offsetDays: -14 },
      { title: 'Commander les pâtisseries traditionnelles (Baklawa, Kaak warka)', priority: 'essential', assigneeRole: 'mother', offsetDays: -7 },
      { title: 'Choisir la tenue de fiançailles et accessoires', priority: 'essential', assigneeRole: 'bride', offsetDays: -10 },
      { title: 'Préparer les rafraîchissements et plateau de thé à la menthe', priority: 'useful', assigneeRole: 'sister', offsetDays: -2 },
      { title: 'Noter les accords et grandes lignes budgétaires', priority: 'useful', assigneeRole: 'bride', offsetDays: 0 }
    ],
    defaultTasksAr: [
      { title: 'الاتفاق على موعد الخطبة بالتنسيق بين العائلتين', priority: 'essential', assigneeRole: 'bride', offsetDays: -14 },
      { title: 'حجز الحلويات التقليدية (بقلاوة، كعك ورقة، ملبس)', priority: 'essential', assigneeRole: 'mother', offsetDays: -7 },
      { title: 'اختيار فستان أو طقم الخطوبة والإكسسوارات', priority: 'essential', assigneeRole: 'bride', offsetDays: -10 },
      { title: 'تجهيز صينية الشاي بالبندق والمرطبات', priority: 'useful', assigneeRole: 'sister', offsetDays: -2 },
      { title: 'تدوين الاتفاقات والميزانية المقدرة في المذكرات', priority: 'useful', assigneeRole: 'bride', offsetDays: 0 }
    ],
    suggestedItemsFr: ['Plateau de dragées & gâteaux', 'Bouquet de fleurs', 'Bague de fiançailles'],
    suggestedItemsAr: ['صينية حلويات وملبس', 'باقة ورد أنيقة', 'خاتم الخطوبة']
  },
  ketben_sde9: {
    type: 'ketben_sde9',
    titleFr: 'Ketben Sde9 / Contrat de mariage',
    titleAr: 'كتبان الصداق / عقد القران',
    titleEn: 'Marriage Contract (Ketben Sde9)',
    defaultOffsetDays: -30,
    color: '#713848', // burgundy
    icon: '📜',
    defaultTasksFr: [
      { title: 'Confirmer le rendez-vous chez l’officier d’état civil ou notaire (Adoul)', priority: 'essential', assigneeRole: 'groom', offsetDays: -20 },
      { title: 'Rassembler les pièces d’état civil obligatoires et certificat médical prénuptial', priority: 'essential', assigneeRole: 'bride', offsetDays: -15 },
      { title: 'Confirmer les deux témoins d’honneur', priority: 'essential', assigneeRole: 'groom', offsetDays: -10 },
      { title: 'Choisir la tenue élégante (Caftan ou robe raffinée)', priority: 'essential', assigneeRole: 'bride', offsetDays: -7 },
      { title: 'Réserver le photographe pour immortaliser la signature', priority: 'useful', assigneeRole: 'bride', offsetDays: -10 }
    ],
    defaultTasksAr: [
      { title: 'تأكيد الموعد لدى ضابط الحالة المدنية أو عدلي الإشهاد', priority: 'essential', assigneeRole: 'groom', offsetDays: -20 },
      { title: 'استخراج الوثائق الإدارية والشهادة الطبية للزواج', priority: 'essential', assigneeRole: 'bride', offsetDays: -15 },
      { title: 'تأكيد الشاهدين على عقد القران', priority: 'essential', assigneeRole: 'groom', offsetDays: -10 },
      { title: 'اختيار قفتان أو فستان العقد الراقي', priority: 'essential', assigneeRole: 'bride', offsetDays: -7 },
      { title: 'الاتفاق مع مصور فوتوغرافي لتوثيق اللحظة', priority: 'useful', assigneeRole: 'bride', offsetDays: -10 }
    ],
    suggestedItemsFr: ['Tenue de contrat (Caftan)', 'Alliances', 'Dossier administratif'],
    suggestedItemsAr: ['قفتان أو فستان العقد', 'خواتم الزواج (الصياغة)', 'الملف الإداري الرسمي']
  },
  saboun: {
    type: 'saboun',
    titleFr: 'Saboun / Préparation du Trousseau',
    titleAr: 'يوم الصابون / تحضير الشوار',
    titleEn: 'Trousseau Preparation (Saboun)',
    defaultOffsetDays: -21,
    color: '#718875', // sage
    icon: '🧺',
    defaultTasksFr: [
      { title: 'Faire l’inventaire final du linge de maison et de lit', priority: 'essential', assigneeRole: 'bride', offsetDays: -10 },
      { title: 'Laver, parfumer et repasser méticuleusement les parures et draps', priority: 'essential', assigneeRole: 'mother', offsetDays: -5 },
      { title: 'Organiser la vaisselle de réception dans des cartons protégés', priority: 'essential', assigneeRole: 'sister', offsetDays: -3 },
      { title: 'Vérifier la liste Darna pour s’assurer qu’aucun achat ne manque', priority: 'essential', assigneeRole: 'bride', offsetDays: -2 }
    ],
    defaultTasksAr: [
      { title: 'الجرد الشامل لمفروشات البيت وأغطية السرير', priority: 'essential', assigneeRole: 'bride', offsetDays: -10 },
      { title: 'غسل وكي وتعطير أطقم السرير والمناشف بعطر الزهر', priority: 'essential', assigneeRole: 'mother', offsetDays: -5 },
      { title: 'توضيب أواني الضيافة وأطقم الكريستال في صناديق آمنة', priority: 'essential', assigneeRole: 'sister', offsetDays: -3 },
      { title: 'مراجعة قائمة دارنا للتأكد من عدم نسيان أي مستلزم', priority: 'essential', assigneeRole: 'bride', offsetDays: -2 }
    ],
    suggestedItemsFr: ['Sachets de lavande & musc pour armoires', 'Rubans de satin', 'Cartons de protection'],
    suggestedItemsAr: ['أكياس الخزامى والمسك المعطرة للخزائن', 'شرائط حريرية للتزيين', 'صناديق كرتونية متينة']
  },
  hazzan_farch: {
    type: 'hazzan_farch',
    titleFr: 'Hazzan El Farch / Transport du Trousseau',
    titleAr: 'هزان الفرش / ترحيل الجهاز',
    titleEn: 'Trousseau Delivery (Hazzan El Farch)',
    defaultOffsetDays: -14,
    color: '#C87862', // terracotta
    icon: '🚚',
    defaultTasksFr: [
      { title: 'Réserver le véhicule de transport sécurisé', priority: 'essential', assigneeRole: 'father', offsetDays: -7 },
      { title: 'Coordonner l’équipe familiale pour le chargement et déchargement', priority: 'essential', assigneeRole: 'brother', offsetDays: -3 },
      { title: 'Disposer le mobilier et faire le premier lit de la nouvelle maison', priority: 'essential', assigneeRole: 'mother', offsetDays: 0 },
      { title: 'Ranger la cuisine et vérifier les branchements du gros électroménager', priority: 'useful', assigneeRole: 'bride', offsetDays: 0 }
    ],
    defaultTasksAr: [
      { title: 'حجز سيارة أو شاحنة نقل مخصصة ومغطاة', priority: 'essential', assigneeRole: 'father', offsetDays: -7 },
      { title: 'تنسيق أفراد العائلة للمساعدة في الشحن والتفريغ', priority: 'essential', assigneeRole: 'brother', offsetDays: -3 },
      { title: 'فرش غرفة النوم وإعداد السرير الأول في البيت الجديد', priority: 'essential', assigneeRole: 'mother', offsetDays: 0 },
      { title: 'ترتيب أواني المطبخ والتأكد من توصيل الثلاجة والغسالة', priority: 'useful', assigneeRole: 'bride', offsetDays: 0 }
    ],
    suggestedItemsFr: ['Film étirable de protection', 'Cadenas valises', 'Matériel de nettoyage rapide'],
    suggestedItemsAr: ['أغلفة حماية بلاستيكية', 'أقفال حقائب السفر', 'مستلزمات تنظيف سريعة للمنزل']
  },
  hammam: {
    type: 'hammam',
    titleFr: 'Hammam El Aroussa',
    titleAr: 'حمام العروسة بالبخور والزغاريد',
    titleEn: 'Bridal Hammam Ritual',
    defaultOffsetDays: -5,
    color: '#718875', // sage
    icon: '🛁',
    defaultTasksFr: [
      { title: 'Réserver le hammam traditionnel (créneau privatisé)', priority: 'essential', assigneeRole: 'mother', offsetDays: -14 },
      { title: 'Préparer le panier du hammam (Duo peignoirs, Foutas, Tfal, Savon noir, Kessa)', priority: 'essential', assigneeRole: 'bride', offsetDays: -3 },
      { title: 'Préparer le bkhour tunisien (encens) et les bougies', priority: 'useful', assigneeRole: 'sister', offsetDays: -2 },
      { title: 'Préparer les rafraîchissements (Citronnade tunisienne, dattes farcies)', priority: 'useful', assigneeRole: 'mother', offsetDays: -1 }
    ],
    defaultTasksAr: [
      { title: 'حجز الحمام التقليدي أو قسم مخصص للعروس', priority: 'essential', assigneeRole: 'mother', offsetDays: -14 },
      { title: 'تجهيز سلة الحمام (قفة الحمام، طقم الفوط، صابون أخضر، طفال، كاسة)', priority: 'essential', assigneeRole: 'bride', offsetDays: -3 },
      { title: 'تجهيز البخور التونسي الفاخر والشموع المضيئة', priority: 'useful', assigneeRole: 'sister', offsetDays: -2 },
      { title: 'إعداد مشروب الليموناضة المنعش والتمر المحشو بالمكسرات', priority: 'useful', assigneeRole: 'mother', offsetDays: -1 }
    ],
    suggestedItemsFr: ['Foutas brodées', 'Panier en osier traditionnel', 'Soins naturels (Tfal, Savon noir)'],
    suggestedItemsAr: ['فوط حريرية مطرزة', 'قفة الحمام التقليدية', 'مستحضرات طبيعية (طفال، صابون كحل، ماء زهر)']
  },
  henna: {
    type: 'henna',
    titleFr: 'Soirée de Henna / Nakcha',
    titleAr: 'ليلة الحناء والنقشة',
    titleEn: 'Henna Night & Nakcha',
    defaultOffsetDays: -3,
    color: '#713848', // burgundy
    icon: '🌿',
    defaultTasksFr: [
      { title: 'Confirmer la Henneya / Naqqacha professionnelle', priority: 'essential', assigneeRole: 'bride', offsetDays: -20 },
      { title: 'Choisir et essayer la tenue traditionnelle de henné', priority: 'essential', assigneeRole: 'bride', offsetDays: -7 },
      { title: 'Préparer la coupe de henné avec œufs décorés et bougies', priority: 'essential', assigneeRole: 'mother', offsetDays: -1 },
      { title: 'Installer le coin salon et la décoration traditionnelle', priority: 'useful', assigneeRole: 'family', offsetDays: -1 },
      { title: 'Préparer la musique traditionnelle (Chants de Henna)', priority: 'useful', assigneeRole: 'sister', offsetDays: -1 }
    ],
    defaultTasksAr: [
      { title: 'تأكيد الحنانة أو النقاشة المحترفة والموعد', priority: 'essential', assigneeRole: 'bride', offsetDays: -20 },
      { title: 'تجربة واختيار كسوة ليلة الحناء والإكسسوارات', priority: 'essential', assigneeRole: 'bride', offsetDays: -7 },
      { title: 'إعداد صحفة الحناء بالبيض المزين والشموع والقرنفل', priority: 'essential', assigneeRole: 'mother', offsetDays: -1 },
      { title: 'تزيين الركن التقليدي لجلوس العروس مع الحنانة', priority: 'useful', assigneeRole: 'family', offsetDays: -1 },
      { title: 'إعداد قائمة الأغاني التونسية الخاصة بليلة الحناء', priority: 'useful', assigneeRole: 'sister', offsetDays: -1 }
    ],
    suggestedItemsFr: ['Poudre de henné naturel de qualité', 'Bougies de henné', 'Tenue de henné brodée'],
    suggestedItemsAr: ['حناء طبيعية ممتازة من قابس', 'شموع الحناء الملونة', 'كسوة الحناء التقليدية']
  },
  wassef: {
    type: 'wassef',
    titleFr: 'Soirée Wassef / Tradition Locale',
    titleAr: 'ليلة الوصاف / احتفال محلي',
    titleEn: 'Wassef Local Celebration',
    defaultOffsetDays: -4,
    color: '#E8D4D0', // clay rose
    icon: '✨',
    defaultTasksFr: [
      { title: 'Définir le déroulement selon la coutume de la famille', priority: 'essential', assigneeRole: 'mother', offsetDays: -10 },
      { title: 'Choisir la tenue d’apparat correspondante', priority: 'essential', assigneeRole: 'bride', offsetDays: -5 },
      { title: 'Organiser le buffet sucré-salé et les boissons', priority: 'useful', assigneeRole: 'sister', offsetDays: -2 }
    ],
    defaultTasksAr: [
      { title: 'تحديد برنامج السهرة حسب عادات العائلة والجهة', priority: 'essential', assigneeRole: 'mother', offsetDays: -10 },
      { title: 'اختيار اللباس المخصص للسهرة ومستلزماته', priority: 'essential', assigneeRole: 'bride', offsetDays: -5 },
      { title: 'إعداد بوفيه الحلويات والمملحات للضيوف', priority: 'useful', assigneeRole: 'sister', offsetDays: -2 }
    ],
    suggestedItemsFr: ['Tenue traditionnelle locale', 'Buffet de réception', 'Musique traditionnelle'],
    suggestedItemsAr: ['لباس تقليدي خاص بالجهة', 'حلويات ومملحات ضيافة', 'فرقة موسيقية محلية']
  },
  outia: {
    type: 'outia',
    titleFr: 'Soirée de l’Outia',
    titleAr: 'ليلة الوطية الكبرى',
    titleEn: 'Outia Celebration',
    defaultOffsetDays: -2,
    color: '#C87862', // terracotta
    icon: '👑',
    defaultTasksFr: [
      { title: 'Confirmer la Machta / Habiba pour l’habillage traditionnel', priority: 'essential', assigneeRole: 'bride', offsetDays: -25 },
      { title: 'Faire les essayages des tenues d’Outia (Keswa, Fouta w Blouza, etc.)', priority: 'essential', assigneeRole: 'bride', offsetDays: -10 },
      { title: 'Réserver la maquilleuse et coiffeuse pour l’Outia', priority: 'essential', assigneeRole: 'bride', offsetDays: -20 },
      { title: 'Confirmer la troupe musicale féminine ou DJ', priority: 'essential', assigneeRole: 'bride', offsetDays: -15 },
      { title: 'Préparer la trousse d’urgence (épingles, retouche maquillage)', priority: 'useful', assigneeRole: 'sister', offsetDays: -1 }
    ],
    defaultTasksAr: [
      { title: 'تأكيد الماشطة أو الزيانة للإشراف على التلبيس التقليدي', priority: 'essential', assigneeRole: 'bride', offsetDays: -25 },
      { title: 'إجراء بروفات أزياء الوطية (الكسوة الكبيرة، الفوطة والبلوزة)', priority: 'essential', assigneeRole: 'bride', offsetDays: -10 },
      { title: 'حجز موعد خبيرة التجميل ومصففة الشعر للوطية', priority: 'essential', assigneeRole: 'bride', offsetDays: -20 },
      { title: 'تأكيد الفرقة الموسيقية النسائية أو الدي جي', priority: 'essential', assigneeRole: 'bride', offsetDays: -15 },
      { title: 'تجهيز حقيبة الطوارئ (دبابيس، مناديل، أدوات تثبيت المكياج)', priority: 'useful', assigneeRole: 'sister', offsetDays: -1 }
    ],
    suggestedItemsFr: ['Tenues d’Outia (Keswa, Fouta & Blouza)', 'Parures de bijoux traditionnels', 'Accessoires de coiffure'],
    suggestedItemsAr: ['أزياء الوطية الفاخرة', 'أطقم المجوهرات التقليدية التونسية', 'إكسسوارات الشعر والتاج']
  },
  jelwa: {
    type: 'jelwa',
    titleFr: 'Cérémonie de la Jelwa',
    titleAr: 'مراسم الجلوة التقليدية',
    titleEn: 'Jelwa Ceremony',
    defaultOffsetDays: -2,
    color: '#713848', // burgundy
    icon: '🪞',
    defaultTasksFr: [
      { title: 'Préparer la tenue solennelle de la Jelwa (Keswa Kbira ou Mahdaouia)', priority: 'essential', assigneeRole: 'bride', offsetDays: -7 },
      { title: 'Coordonner avec la Machta pour le rituel des pas et de la rotation', priority: 'essential', assigneeRole: 'mother', offsetDays: -3 },
      { title: 'Préparer les cierges traditionnels décorés', priority: 'useful', assigneeRole: 'sister', offsetDays: -2 }
    ],
    defaultTasksAr: [
      { title: 'تجهيز اللباس المهيب للجلوة (الكسوة الكبيرة المذهبة)', priority: 'essential', assigneeRole: 'bride', offsetDays: -7 },
      { title: 'التنسيق مع الماشطة لمرافقة العروس في خطوات الجلوة', priority: 'essential', assigneeRole: 'mother', offsetDays: -3 },
      { title: 'إعداد الشموع الكبيرة المزينة بشرائط الذهب', priority: 'useful', assigneeRole: 'sister', offsetDays: -2 }
    ],
    suggestedItemsFr: ['Keswa de Jelwa', 'Grands cierges décorés', 'Voile brodé'],
    suggestedItemsAr: ['كسوة الجلوة الفاخرة', 'شموع الجلوة المزينة', 'المحرمة المطرزة بالحرير']
  },
  reception_3ers: {
    type: 'reception_3ers',
    titleFr: 'Soirée de Mariage / Grand 3ers',
    titleAr: 'ليلة الزفاف الكبرى / العرس',
    titleEn: 'Grand Wedding Reception',
    defaultOffsetDays: 0,
    color: '#713848', // primary burgundy
    icon: '🎉',
    defaultTasksFr: [
      { title: 'Confirmer la salle de réception, la disposition des tables et la loge', priority: 'essential', assigneeRole: 'groom', offsetDays: -30 },
      { title: 'Essayer la robe de mariée avec retouches finales et chaussures', priority: 'essential', assigneeRole: 'bride', offsetDays: -7 },
      { title: 'Confirmer le planning horaire avec le photographe/vidéaste', priority: 'essential', assigneeRole: 'bride', offsetDays: -5 },
      { title: 'Reconfirmer la troupe musicale / orchestre et la chanson d’entrée', priority: 'essential', assigneeRole: 'groom', offsetDays: -5 },
      { title: 'Valider les horaires de livraison du gâteau nuptial et des pièces montées', priority: 'essential', assigneeRole: 'mother', offsetDays: -2 },
      { title: 'Préparer le planning minute par minute du jour J', priority: 'essential', assigneeRole: 'bride', offsetDays: -1 },
      { title: 'Régler les soldes restants des prestataires dans des enveloppes dédiées', priority: 'essential', assigneeRole: 'father', offsetDays: 0 }
    ],
    defaultTasksAr: [
      { title: 'تأكيد قاعة الأفراح، مخطط الطاولات وجناح العروس', priority: 'essential', assigneeRole: 'groom', offsetDays: -30 },
      { title: 'القياس النهائي لفستان الزفاف الأبيض مع الحذاء المريح', priority: 'essential', assigneeRole: 'bride', offsetDays: -7 },
      { title: 'تأكيد المواعيد وساعة الحضور مع مصور الفيديو والفوتوغراف', priority: 'essential', assigneeRole: 'bride', offsetDays: -5 },
      { title: 'تنسيق دخول العروسين مع الفرقة الموسيقية والأغاني المختارة', priority: 'essential', assigneeRole: 'groom', offsetDays: -5 },
      { title: 'مراجعة موعد استلام قالب الحلوى الكبير (القطو) وعصائر الاستقبال', priority: 'essential', assigneeRole: 'mother', offsetDays: -2 },
      { title: 'إعداد الجدول الزمني الدقيق ليوم العرس (ساعة بساعة)', priority: 'essential', assigneeRole: 'bride', offsetDays: -1 },
      { title: 'تجهيز المبالغ المتبقية للمزودين في أظرفة مسماة ومغلقة', priority: 'essential', assigneeRole: 'father', offsetDays: 0 }
    ],
    suggestedItemsFr: ['Robe de mariée blanche', 'Costume du marié', 'Gâteau de mariage', 'Bouquet de la mariée'],
    suggestedItemsAr: ['فستان الزفاف الأبيض الملكي', 'بدلة العريس الأنيقة', 'كعكة الزفاف الكبيرة', 'باقة ورد العروس (البوكيه)']
  },
  morning_after: {
    type: 'morning_after',
    titleFr: 'Sabahiya / Premier Matin',
    titleAr: 'الصباحية وأول الأيام',
    titleEn: 'Sabahiya & First Days',
    defaultOffsetDays: 1,
    color: '#718875', // sage
    icon: '☀️',
    defaultTasksFr: [
      { title: 'Préparer une tenue décontractée mais élégante pour le lendemain', priority: 'essential', assigneeRole: 'bride', offsetDays: -1 },
      { title: 'Organiser le petit-déjeuner traditionnel livré par la famille (Bambalouni, Asida, Jus frais)', priority: 'useful', assigneeRole: 'mother', offsetDays: 0 },
      { title: 'Préparer les bagages pour le voyage de noces si prévu', priority: 'useful', assigneeRole: 'bride', offsetDays: 1 }
    ],
    defaultTasksAr: [
      { title: 'تجهيز لباس مريح وأنيق لاستقبال أول يوم بالبيت', priority: 'essential', assigneeRole: 'bride', offsetDays: -1 },
      { title: 'تنسيق فطور الصباحية المهدي من أهل العروس (فطور الصباح التونسي)', priority: 'useful', assigneeRole: 'mother', offsetDays: 0 },
      { title: 'مراجعة حقائب السفر وتذاكر شهر العسل في حال وجود سفر', priority: 'useful', assigneeRole: 'bride', offsetDays: 1 }
    ],
    suggestedItemsFr: ['Tenue de détente soyeuse', 'Valises préparées', 'Documents de voyage'],
    suggestedItemsAr: ['بيجاما أو روب ساتان أنيق', 'حقائب السفر الجاهزة', 'أوراق وتذاكر السفر']
  },
  custom: {
    type: 'custom',
    titleFr: 'Événement Personnalisé',
    titleAr: 'مناسبة خاصة مخصصة',
    titleEn: 'Custom Wedding Event',
    defaultOffsetDays: -10,
    color: '#C87862',
    icon: '📌',
    defaultTasksFr: [
      { title: 'Définir les détails et préparatifs nécessaires', priority: 'essential', assigneeRole: 'bride', offsetDays: -3 }
    ],
    defaultTasksAr: [
      { title: 'تحديد التفاصيل والتحضيرات المطلوبة للمناسبة', priority: 'essential', assigneeRole: 'bride', offsetDays: -3 }
    ],
    suggestedItemsFr: ['Notes de préparation'],
    suggestedItemsAr: ['ملاحظات ومستلزمات خاصة']
  }
};
