import { Injectable, signal, effect, computed } from '@angular/core';
import { AppLanguage } from '../models/user-preferences.model';

export type TranslationKey = keyof typeof TRANSLATIONS_FR;

export const TRANSLATIONS_FR = {
  // Brand & Slogans
  'app.name': 'Darna | دارنا',
  'app.title': 'Darna — Trousseau & Maison de la Mariée',
  'app.tagline': 'Tout pour votre nouveau chez-vous.',
  'app.headline': 'Votre nouveau chez-vous, à votre rythme.',
  'app.subtitle': 'Retrouvez tout ce dont vous avez besoin pour préparer votre trousseau, organiser vos achats et avancer sereinement.',
  'app.culture_badge': 'Traditions & Modernité Tunisienne',

  // Navigation
  'nav.home': 'Accueil',
  'nav.catalog': 'Catalogue',
  'nav.my_list': 'Mon Trousseau',
  'nav.budget': 'Budget & Suivi',
  'nav.settings': 'Paramètres',

  // Actions
  'action.add': 'Ajouter',
  'action.added': 'Ajouté',
  'action.add_to_list': 'Ajouter à ma liste',
  'action.create_custom': 'Créer un article personnalisé',
  'action.edit': 'Modifier',
  'action.save': 'Enregistrer',
  'action.cancel': 'Annuler',
  'action.delete': 'Supprimer',
  'action.delete_confirm': 'Êtes-vous sûre de vouloir supprimer cet article ?',
  'action.clear_all': 'Vider la liste',
  'action.clear_confirm': 'Voulez-vous vraiment effacer tous les articles de votre liste ?',
  'action.reset_catalog': 'Charger la sélection recommandée',
  'action.explore_catalog': 'Explorer le catalogue',
  'action.continue_list': 'Ouvrir mon trousseau',
  'action.export_pdf': 'Télécharger le PDF (A4)',
  'action.print': 'Imprimer la liste',
  'action.search_placeholder': 'Rechercher un article, tajine, fouta...',
  'action.filter_all': 'Tous',
  'action.filter_remaining': 'À acheter',
  'action.filter_purchased': 'Achetés',
  'action.mark_purchased': 'Marquer comme acheté',
  'action.mark_unpurchased': 'Marquer à acheter',
  'action.close': 'Fermer',
  'action.install_app': 'Installer l’application',
  'action.switch_lang': 'Changer de langue',

  // Dashboard
  'home.welcome': 'Marhaban bikoum 🕊️',
  'home.progress_title': 'Avancement du trousseau',
  'home.items_purchased': 'articles achetés',
  'home.items_remaining': 'articles restants',
  'home.total_planned': 'Total planifié',
  'home.budget_estimate': 'Coût estimé',
  'home.budget_spent': 'Dépenses réelles',
  'home.budget_balance': 'Solde restant',
  'home.budget_undefined': 'Budget non défini',
  'home.categories_heading': 'Parcourir par univers',
  'home.recent_items': 'Articles récemment ajoutés',
  'home.start_organizing': 'Commencer l’organisation',
  'home.empty_recent': 'Votre liste est encore vide. Ajoutez vos premiers essentiels depuis le catalogue !',

  // Catalog
  'catalog.title': 'Catalogue du Trousseau Tunisien',
  'catalog.subtitle': 'Suggestions d’essentiels traditionnels et modernes pour votre nouveau foyer.',
  'catalog.all_categories': 'Toutes les catégories',
  'catalog.items_count': 'articles disponibles',
  'catalog.suggested_qty': 'Quantité conseillée :',
  'catalog.estimated_price': 'Prix estimatif :',
  'catalog.traditional_label': 'Traditionnel',
  'catalog.no_results': 'Aucun article ne correspond à votre recherche.',
  'catalog.search_empty_hint': 'Essayez avec un autre mot-clé (ex: couscous, draps, service...)',
  'catalog.back_to_categories': 'Toutes les catégories',

  // Shopping List
  'list.title': 'Ma Liste de Trousseau',
  'list.subtitle': 'Votre liste d’achats personnalisée, organisée par catégorie.',
  'list.empty_title': 'Votre liste de trousseau est vide',
  'list.empty_desc': 'Explorez les suggestions du catalogue tunisien ou ajoutez directement vos propres articles.',
  'list.btn_explore': 'Découvrir les suggestions',
  'list.btn_add_custom': 'Ajouter un article sur mesure',
  'list.item_name': 'Nom de l’article',
  'list.quantity': 'Quantité',
  'list.est_unit_price': 'Prix unitaire estimé (DT)',
  'list.act_unit_price': 'Prix unitaire réel payé (DT)',
  'list.category': 'Catégorie',
  'list.notes': 'Remarques (couleur, marque, magasin...)',
  'list.notes_placeholder': 'Ex: Couleur écru, acheté chez Souk El Jomaa ou Monoprix...',
  'list.price_unknown': 'Non estimé',
  'list.total_estimated': 'Total estimé :',
  'list.total_actual': 'Total payé :',
  'list.filter_status': 'Filtrer par statut :',
  'list.filter_category': 'Filtrer par catégorie :',
  'list.collapse_all': 'Tout réduire',
  'list.expand_all': 'Tout développer',

  // Custom Item Modal
  'modal.custom_title': 'Ajouter un article personnalisé',
  'modal.edit_title': 'Modifier l’article',
  'modal.name_label': 'Nom de l’article (obligatoire)',
  'modal.name_placeholder': 'Ex: Service à jus en verre ciselé...',
  'modal.category_label': 'Catégorie',
  'modal.qty_label': 'Quantité',
  'modal.est_price_label': 'Prix unitaire estimé (DT)',
  'modal.act_price_label': 'Prix unitaire réel payé (DT)',
  'modal.notes_label': 'Notes & détails',

  // Budget Screen
  'budget.title': 'Budget & Finances',
  'budget.subtitle': 'Suivez vos prévisions de dépenses et vos achats réels en Dinars Tunisiens (DT).',
  'budget.target_label': 'Votre budget global prévu (DT) :',
  'budget.target_placeholder': 'Ex: 12000',
  'budget.target_save': 'Mettre à jour le budget',
  'budget.summary_title': 'Synthèse financière',
  'budget.est_total': 'Total des estimations',
  'budget.act_spent': 'Dépenses réelles effectuées',
  'budget.remaining_allowed': 'Budget disponible restant',
  'budget.budget_exceeded': 'Attention : Budget dépassé de',
  'budget.spending_by_category': 'Répartition par catégorie',
  'budget.unknown_prices_note': 'Note : Les articles sans prix renseigné ne sont pas comptabilisés comme coût nul. Leurs montants restent à préciser lors de vos achats.',
  'budget.purchased_stat': 'Taux d’achats complétés',

  // Settings
  'settings.title': 'Paramètres & Préférences',
  'settings.subtitle': 'Personnalisez votre expérience, la langue et la gestion de vos données.',
  'settings.language_section': 'Langue de l’interface',
  'settings.french': 'Français (LTR)',
  'settings.arabic': 'العربية (RTL)',
  'settings.english': 'English (LTR)',
  'settings.personal_section': 'Informations de la mariée',
  'settings.bride_name': 'Nom ou prénom de la mariée :',
  'settings.groom_name': 'Nom ou prénom du marié (optionnel) :',
  'settings.wedding_date': 'Date prévue du mariage :',
  'settings.data_section': 'Gestion des données locales',
  'settings.data_desc': 'Toutes vos données sont stockées de façon sécurisée directement sur votre appareil.',
  'settings.export_backup': 'Exporter une sauvegarde (JSON)',
  'settings.import_backup': 'Restaurer une sauvegarde (JSON)',
  'settings.reset_starter': 'Rétablir la sélection tunisienne recommandée',
  'settings.pwa_section': 'Application mobile (PWA)',
  'settings.pwa_installed': 'Application installée sur cet appareil.',
  'settings.pwa_install_btn': 'Installer l’application sur mon téléphone',
  'settings.about_title': 'À propos de Darna | دارنا',
  'settings.about_text': 'Darna est un planificateur de trousseau pensé avec amour pour les futures mariées de Tunisie, alliant fidélité aux belles traditions et efficacité moderne.',

  // PDF Export
  'pdf.title': 'Liste de Trousseau de Mariage',
  'pdf.date': 'Date d’export :',
  'pdf.bride': 'Future mariée :',
  'pdf.summary': 'Résumé global',
  'pdf.total_items': 'Articles au total',
  'pdf.purchased': 'Achetés',
  'pdf.remaining': 'Restants',
  'pdf.est_cost': 'Coût estimé total',
  'pdf.act_cost': 'Total payé à ce jour',
  'pdf.th_status': 'Statut',
  'pdf.th_item': 'Désignation',
  'pdf.th_qty': 'Qté',
  'pdf.th_est': 'Prix Est.',
  'pdf.th_act': 'Prix Réel',
  'pdf.th_notes': 'Notes',
  'pdf.status_done': 'Acheté',
  'pdf.status_todo': 'À acheter',
  'pdf.currency': 'DT',
  'pdf.footer': 'Document généré par Darna | دارنا — Tout pour votre nouveau chez-vous.',

  // Footer
  'footer.brand_sub': 'Le planificateur d’exception pour préparer votre trousseau de mariage et équiper votre nouveau foyer en Tunisie.',
  'footer.nav_title': 'Navigation',
  'footer.categories_title': 'Univers Trousseau',
  'footer.promises_title': 'Engagements',
  'footer.promise_offline': '100% Hors-ligne & PWA',
  'footer.promise_offline_desc': 'Toutes vos données restent sur votre appareil',
  'footer.promise_privacy': 'Confidentialité totale',
  'footer.promise_privacy_desc': 'Sans compte obligatoire, ni revente de données',
  'footer.promise_tunisia': 'Patrimoine & Traditions',
  'footer.promise_tunisia_desc': 'Conçu spécialement pour la mariée tunisienne',
  'footer.copyright': 'Darna | دارنا — Tout pour votre nouveau chez-vous. Tous droits réservés.',
  'footer.quick_cat_kitchen': 'Cuisine & Vaisselle',
  'footer.quick_cat_bedroom': 'Chambre à coucher & Linge',
  'footer.quick_cat_bath': 'Salle de bain & Hammam',
  'footer.quick_cat_bridal': 'Trousseau & Beauté'
};

export const TRANSLATIONS_AR: { [K in TranslationKey]: string } = {
  // Brand & Slogans
  'app.name': 'دارنا | Darna',
  'app.title': 'دارنا — مخطط جهاز العروس وتأثيث البيت',
  'app.tagline': 'كل ما تحتاجينه لبيتك الجديد.',
  'app.headline': 'جهّزي بيتك الجديد، خطوة بخطوة.',
  'app.subtitle': 'اكتشفي كل ما تحتاجينه لإعداد جهازك، تنظيم مشترياتك وتأثيث بيتك الجديد بكل ثقة وهدوء.',
  'app.culture_badge': 'أصالة تونسية ولمسة عصرية',

  // Navigation
  'nav.home': 'الرئيسية',
  'nav.catalog': 'الدليل والتصنيفات',
  'nav.my_list': 'قائمة جهازي',
  'nav.budget': 'الميزانية والمصاريف',
  'nav.settings': 'الإعدادات',

  // Actions
  'action.add': 'إضافة',
  'action.added': 'تمت الإضافة',
  'action.add_to_list': 'إضافة إلى قائمتي',
  'action.create_custom': 'إضافة عنصر مخصص',
  'action.edit': 'تعديل',
  'action.save': 'حفظ',
  'action.cancel': 'إلغاء',
  'action.delete': 'حذف',
  'action.delete_confirm': 'هل أنتِ متأكدة من رغبتك في حذف هذا العنصر؟',
  'action.clear_all': 'إفراغ القائمة كاملة',
  'action.clear_confirm': 'هل تريدين حقاً مسح جميع عناصر قائمة جهازك؟',
  'action.reset_catalog': 'تحميل القائمة التونسية المقترحة',
  'action.explore_catalog': 'تصفح الدليل والتصنيفات',
  'action.continue_list': 'متابعة قائمة التجهيز',
  'action.export_pdf': 'تحميل القائمة PDF (A4)',
  'action.print': 'طباعة القائمة',
  'action.search_placeholder': 'ابحثي عن عنصر، كسكاس، فوطة، طقم...',
  'action.filter_all': 'الكل',
  'action.filter_remaining': 'المتبقي للشراء',
  'action.filter_purchased': 'تم شراؤه',
  'action.mark_purchased': 'تم شراؤه',
  'action.mark_unpurchased': 'في الانتظار',
  'action.close': 'إغلاق',
  'action.install_app': 'تثبيت التطبيق على الهاتف',
  'action.switch_lang': 'تغيير اللغة',

  // Dashboard
  'home.welcome': 'مرحباً بكِ يا عروسة 🕊️',
  'home.progress_title': 'نسبة إنجاز جهازك',
  'home.items_purchased': 'مشتريات تمت',
  'home.items_remaining': 'مستلزمات متبقية',
  'home.total_planned': 'إجمالي المخطط',
  'home.budget_estimate': 'التكلفة التقديرية',
  'home.budget_spent': 'المصروف الفعلي',
  'home.budget_balance': 'المبلغ المتبقي',
  'home.budget_undefined': 'الميزانية غير محددة',
  'home.categories_heading': 'تصفح حسب أركان البيت',
  'home.recent_items': 'آخر ما أضفتِ إلى القائمة',
  'home.start_organizing': 'ابدئي ترتيب جهازك الآن',
  'home.empty_recent': 'قائمتك لا تزال فارغة. اختاري أولى مستلزماتك من الدليل المقترح!',

  // Catalog
  'catalog.title': 'دليل جهاز العروس التونسية',
  'catalog.subtitle': 'اقتراحات شاملة ومدروسة تجمع بين التقاليد التونسية والاحتياجات المنزلية العصرية.',
  'catalog.all_categories': 'جميع الأقسام',
  'catalog.items_count': 'عنصراً متوفراً',
  'catalog.suggested_qty': 'الكمية المقترحة:',
  'catalog.estimated_price': 'السعر التقديري:',
  'catalog.traditional_label': 'تقليدي أصيل',
  'catalog.no_results': 'لم نجد أي عنصر يطابق كلمة البحث.',
  'catalog.search_empty_hint': 'جربي كلمة أخرى (مثل: كسكاس، شراشف، طقم، مبخرة...)',
  'catalog.back_to_categories': 'كل التصنيفات',

  // Shopping List
  'list.title': 'قائمة مشتريات جهازي',
  'list.subtitle': 'قائمتك الشخصية المنظمة حسب كل غرفة وركن في بيتك الجديد.',
  'list.empty_title': 'قائمة جهازك فارغة حالياً',
  'list.empty_desc': 'تصفحي مستلزمات الدليل التونسي واختاري ما يناسبك بنقرة واحدة، أو أضيفي حاجياتك الخاصة.',
  'list.btn_explore': 'تصفح مقترحات الدليل',
  'list.btn_add_custom': 'إضافة مستلزم مخصص',
  'list.item_name': 'اسم الغرض / المستلزم',
  'list.quantity': 'الكمية',
  'list.est_unit_price': 'السعر التقديري للقطعة (د.ت)',
  'list.act_unit_price': 'السعر الفعلي المدفوع (د.ت)',
  'list.category': 'القسم',
  'list.notes': 'ملاحظات (اللون، المحل، الماركة...)',
  'list.notes_placeholder': 'مثال: اللون بيج، من سوق الجمعة أو مغازة معينة...',
  'list.price_unknown': 'غير مقدر',
  'list.total_estimated': 'الإجمالي المقدر:',
  'list.total_actual': 'الإجمالي الفعلي:',
  'list.filter_status': 'حسب الحالة:',
  'list.filter_category': 'حسب القسم:',
  'list.collapse_all': 'طي الكل',
  'list.expand_all': 'فتح الكل',

  // Custom Item Modal
  'modal.custom_title': 'إضافة عنصر جديد إلى القائمة',
  'modal.edit_title': 'تعديل بيانات العنصر',
  'modal.name_label': 'اسم العنصر (إجباري)',
  'modal.name_placeholder': 'مثال: طقم كؤوس شاي مذهب فاخر...',
  'modal.category_label': 'القسم التابع له',
  'modal.qty_label': 'الكمية',
  'modal.est_price_label': 'السعر التقديري الفردي (د.ت)',
  'modal.act_price_label': 'السعر الفعلي المدفوع (د.ت)',
  'modal.notes_label': 'ملاحظات وتفاصيل',

  // Budget Screen
  'budget.title': 'الميزانية والمصاريف',
  'budget.subtitle': 'تابعي ميزانيتك المقدرة ومصاريفك الفعلية بالدينار التونسي بكل شفافية وسهولة.',
  'budget.target_label': 'ميزانيتك الإجمالية المخصصة (د.ت):',
  'budget.target_placeholder': 'مثال: 15000',
  'budget.target_save': 'تحديث الميزانية',
  'budget.summary_title': 'ملخص الميزانية والإنفاق',
  'budget.est_total': 'إجمالي التقديرات المحددة',
  'budget.act_spent': 'إجمالي ما تم دفعه فعلياً',
  'budget.remaining_allowed': 'المبلغ المتبقي من الميزانية',
  'budget.budget_exceeded': 'تنبيه: تم تجاوز الميزانية بمقدار',
  'budget.spending_by_category': 'توزيع المصاريف حسب الأقسام',
  'budget.unknown_prices_note': 'تنبيه: العناصر التي لا تحتوي على سعر محدد لا تُعتبر مجانية. سيتم احتسابها عند تحديدك لسعرها عند الشراء.',
  'budget.purchased_stat': 'نسبة المشتريات المنجزة',

  // Settings
  'settings.title': 'الإعدادات والتفضيلات',
  'settings.subtitle': 'تحكمي في لغة التطبيق، البيانات الشخصية، والنسخ الاحتياطي.',
  'settings.language_section': 'لغة واجهة التطبيق',
  'settings.french': 'الفرنسية — Français',
  'settings.arabic': 'العربية — Tunisian RTL',
  'settings.english': 'الإنجليزية — English (LTR)',
  'settings.personal_section': 'معلومات العروسين',
  'settings.bride_name': 'اسم العروس :',
  'settings.groom_name': 'اسم العريس (اختياري) :',
  'settings.wedding_date': 'تاريخ موعد الزفاف المقترح :',
  'settings.data_section': 'إدارة البيانات المحلية',
  'settings.data_desc': 'جميع معلوماتك وقوائمك محفوظة بأمان على جهازك الحالي دون الحاجة إلى الإنترنت.',
  'settings.export_backup': 'تصدير نسخة احتياطية (JSON)',
  'settings.import_backup': 'استيراد نسخة احتياطية (JSON)',
  'settings.reset_starter': 'استعادة مقترحات التجهيز التونسية',
  'settings.pwa_section': 'تطبيق الهاتف (PWA)',
  'settings.pwa_installed': 'التطبيق مثبت بنجاح على هذا الجهاز.',
  'settings.pwa_install_btn': 'تثبيت تطبيق دارنا على هاتفك',
  'settings.about_title': 'حول تطبيق دارنا | Darna',
  'settings.about_text': 'دارنا هو رفيق كل عروس تونسية في إعداد شورتها وتأثيث بيتها الجديد، بكل يسر وأناقة مع الحفاظ على أصالة عاداتنا وتقاليدنا.',

  // PDF Export
  'pdf.title': 'قائمة جهاز العروس وتأثيث البيت',
  'pdf.date': 'تاريخ الطباعة :',
  'pdf.bride': 'العروس :',
  'pdf.summary': 'الملخص العام',
  'pdf.total_items': 'مجموع المستلزمات',
  'pdf.purchased': 'تم شراؤه',
  'pdf.remaining': 'متبقي للشراء',
  'pdf.est_cost': 'التكلفة التقديرية الإجمالية',
  'pdf.act_cost': 'إجمالي المدفوع حتى الآن',
  'pdf.th_status': 'الحالة',
  'pdf.th_item': 'المستلزم / الغرض',
  'pdf.th_qty': 'العدد',
  'pdf.th_est': 'السعر التقديري',
  'pdf.th_act': 'المدفوع',
  'pdf.th_notes': 'ملاحظات',
  'pdf.status_done': 'تم الشراء',
  'pdf.status_todo': 'في الانتظار',
  'pdf.currency': 'د.ت',
  'pdf.footer': 'تم إعداد هذه القائمة بواسطة تطبيق دارنا | Darna — كل ما تحتاجينه لبيتك الجديد.',

  // Footer
  'footer.brand_sub': 'المساعد الرقمي المفضل لإعداد جهاز العروس التونسية وتأثيث بيتها الجديد بكل هدوء وثقة.',
  'footer.nav_title': 'أقسام التطبيق',
  'footer.categories_title': 'أقسام الجهاز',
  'footer.promises_title': 'ضمانات التطبيق',
  'footer.promise_offline': 'يعمل بدون إنترنت وتطبيق خفيف',
  'footer.promise_offline_desc': 'بياناتك محفوظة بأمان على هاتفك فقط',
  'footer.promise_privacy': 'خصوصية تامة',
  'footer.promise_privacy_desc': 'دون الحاجة لحساب أو جمع أية بيانات خاصة',
  'footer.promise_tunisia': 'أصالة وتقاليد تونسية',
  'footer.promise_tunisia_desc': 'مصمم خصيصاً ليناسب العادات والأفراح التونسية',
  'footer.copyright': 'دارنا | Darna — كل ما تحتاجينه لبيتك الجديد. جميع الحقوق محفوظة.',
  'footer.quick_cat_kitchen': 'المطبخ والأواني',
  'footer.quick_cat_bedroom': 'غرفة النوم والمفروشات',
  'footer.quick_cat_bath': 'الحمام وجهاز الحمام',
  'footer.quick_cat_bridal': 'جهاز العروس ومستلزماتها'
};

export const TRANSLATIONS_EN: { [K in TranslationKey]: string } = {
  // Brand & Slogans
  'app.name': 'Darna | دارنا',
  'app.title': 'Darna — Bridal Trousseau & Home Planner',
  'app.tagline': 'Everything for your new home.',
  'app.headline': 'Your new home, step by step.',
  'app.subtitle': 'Discover everything you need to prepare your wedding trousseau, organize your purchases, and furnish your new home with complete peace of mind.',
  'app.culture_badge': 'Tunisian Traditions & Modern Living',

  // Navigation
  'nav.home': 'Home',
  'nav.catalog': 'Catalog',
  'nav.my_list': 'My Trousseau',
  'nav.budget': 'Budget & Tracking',
  'nav.settings': 'Settings',

  // Actions
  'action.add': 'Add',
  'action.added': 'Added',
  'action.add_to_list': 'Add to my list',
  'action.create_custom': 'Create custom item',
  'action.edit': 'Edit',
  'action.save': 'Save',
  'action.cancel': 'Cancel',
  'action.delete': 'Delete',
  'action.delete_confirm': 'Are you sure you want to remove this item?',
  'action.clear_all': 'Clear list',
  'action.clear_confirm': 'Are you sure you want to delete all items from your list?',
  'action.reset_catalog': 'Load recommended selection',
  'action.explore_catalog': 'Explore catalog',
  'action.continue_list': 'Open my trousseau',
  'action.export_pdf': 'Download PDF (A4)',
  'action.print': 'Print list',
  'action.search_placeholder': 'Search an item, tajine, fouta, linens...',
  'action.filter_all': 'All',
  'action.filter_remaining': 'To buy',
  'action.filter_purchased': 'Purchased',
  'action.mark_purchased': 'Mark as purchased',
  'action.mark_unpurchased': 'Mark to buy',
  'action.close': 'Close',
  'action.install_app': 'Install App',
  'action.switch_lang': 'Switch language',

  // Dashboard
  'home.welcome': 'Marhaban bikoum 🕊️',
  'home.progress_title': 'Trousseau progress',
  'home.items_purchased': 'items purchased',
  'home.items_remaining': 'items remaining',
  'home.total_planned': 'Total planned',
  'home.budget_estimate': 'Estimated cost',
  'home.budget_spent': 'Actual spent',
  'home.budget_balance': 'Remaining balance',
  'home.budget_undefined': 'Budget not set',
  'home.categories_heading': 'Browse by world',
  'home.recent_items': 'Recently added items',
  'home.start_organizing': 'Start organizing',
  'home.empty_recent': 'Your list is still empty. Add your first essentials from the catalog!',

  // Catalog
  'catalog.title': 'Tunisian Bridal Catalog',
  'catalog.subtitle': 'Curated traditional and modern essentials for your new home.',
  'catalog.all_categories': 'All categories',
  'catalog.items_count': 'items available',
  'catalog.suggested_qty': 'Suggested quantity:',
  'catalog.estimated_price': 'Estimated price:',
  'catalog.traditional_label': 'Traditional',
  'catalog.no_results': 'No items match your search.',
  'catalog.search_empty_hint': 'Try another keyword (e.g. couscous, sheets, tableware...)',
  'catalog.back_to_categories': 'All categories',

  // Shopping List
  'list.title': 'My Bridal Trousseau List',
  'list.subtitle': 'Your personalized shopping list, organized by category.',
  'list.empty_title': 'Your trousseau list is empty',
  'list.empty_desc': 'Explore suggestions from the Tunisian catalog or add your own custom items directly.',
  'list.btn_explore': 'Discover suggestions',
  'list.btn_add_custom': 'Add custom item',
  'list.item_name': 'Item name',
  'list.quantity': 'Quantity',
  'list.est_unit_price': 'Est. unit price (DT)',
  'list.act_unit_price': 'Actual price paid (DT)',
  'list.category': 'Category',
  'list.notes': 'Notes (color, brand, store...)',
  'list.notes_placeholder': 'E.g.: Cream white, bought from Souk or store...',
  'list.price_unknown': 'Not estimated',
  'list.total_estimated': 'Estimated total:',
  'list.total_actual': 'Total paid:',
  'list.filter_status': 'Filter by status:',
  'list.filter_category': 'Filter by category:',
  'list.collapse_all': 'Collapse all',
  'list.expand_all': 'Expand all',

  // Custom Item Modal
  'modal.custom_title': 'Add custom item',
  'modal.edit_title': 'Edit item',
  'modal.name_label': 'Item name (required)',
  'modal.name_placeholder': 'E.g.: Carved crystal beverage service...',
  'modal.category_label': 'Category',
  'modal.qty_label': 'Quantity',
  'modal.est_price_label': 'Estimated unit price (DT)',
  'modal.act_price_label': 'Actual unit price paid (DT)',
  'modal.notes_label': 'Notes & details',

  // Budget Screen
  'budget.title': 'Budget & Expenses',
  'budget.subtitle': 'Track your estimated projections and actual purchases in Tunisian Dinars (DT).',
  'budget.target_label': 'Your target overall budget (DT):',
  'budget.target_placeholder': 'E.g.: 12000',
  'budget.target_save': 'Update budget',
  'budget.summary_title': 'Financial overview',
  'budget.est_total': 'Total estimated',
  'budget.act_spent': 'Actual expenses made',
  'budget.remaining_allowed': 'Remaining budget allowance',
  'budget.budget_exceeded': 'Warning: Budget exceeded by',
  'budget.spending_by_category': 'Breakdown by category',
  'budget.unknown_prices_note': 'Note: Items without prices are not counted as free. Their amounts can be filled during your shopping trips.',
  'budget.purchased_stat': 'Completion rate',

  // Settings
  'settings.title': 'Settings & Preferences',
  'settings.subtitle': 'Customize your experience, language, and local data management.',
  'settings.language_section': 'Interface language',
  'settings.french': 'Français (LTR)',
  'settings.arabic': 'العربية (RTL)',
  'settings.english': 'English (LTR)',
  'settings.personal_section': 'Bride information',
  'settings.bride_name': 'Bride name or nickname:',
  'settings.groom_name': 'Groom name or nickname (optional):',
  'settings.wedding_date': 'Expected wedding date:',
  'settings.data_section': 'Local data management',
  'settings.data_desc': 'All your data is securely stored directly on your personal device.',
  'settings.export_backup': 'Export backup (JSON)',
  'settings.import_backup': 'Restore backup (JSON)',
  'settings.reset_starter': 'Restore recommended Tunisian selection',
  'settings.pwa_section': 'Mobile Application (PWA)',
  'settings.pwa_installed': 'Application installed on this device.',
  'settings.pwa_install_btn': 'Install app on my phone',
  'settings.about_title': 'About Darna | دارنا',
  'settings.about_text': 'Darna is a bridal trousseau planner lovingly crafted for Tunisian brides, uniting heritage traditions with modern elegance.',

  // PDF Export
  'pdf.title': 'Wedding Trousseau Checklist',
  'pdf.date': 'Export date:',
  'pdf.bride': 'Bride-to-be:',
  'pdf.summary': 'Overview Summary',
  'pdf.total_items': 'Total items',
  'pdf.purchased': 'Purchased',
  'pdf.remaining': 'Remaining',
  'pdf.est_cost': 'Total estimated cost',
  'pdf.act_cost': 'Total paid to date',
  'pdf.th_status': 'Status',
  'pdf.th_item': 'Item Description',
  'pdf.th_qty': 'Qty',
  'pdf.th_est': 'Est. Price',
  'pdf.th_act': 'Actual Price',
  'pdf.th_notes': 'Notes',
  'pdf.status_done': 'Purchased',
  'pdf.status_todo': 'To buy',
  'pdf.currency': 'DT',
  'pdf.footer': 'Document generated by Darna | دارنا — Everything for your new home.',

  // Footer
  'footer.brand_sub': 'The premier planner to prepare your bridal trousseau and furnish your new home in Tunisia.',
  'footer.nav_title': 'Navigation',
  'footer.categories_title': 'Trousseau Worlds',
  'footer.promises_title': 'Our Commitments',
  'footer.promise_offline': '100% Offline & PWA',
  'footer.promise_offline_desc': 'All your data stays private on your device',
  'footer.promise_privacy': 'Complete Privacy',
  'footer.promise_privacy_desc': 'No required account, no data tracking',
  'footer.promise_tunisia': 'Heritage & Traditions',
  'footer.promise_tunisia_desc': 'Specially designed for the Tunisian bride',
  'footer.copyright': 'Darna | دارنا — Everything for your new home. All rights reserved.',
  'footer.quick_cat_kitchen': 'Kitchen & Tableware',
  'footer.quick_cat_bedroom': 'Bedroom & Linens',
  'footer.quick_cat_bath': 'Bathroom & Hammam',
  'footer.quick_cat_bridal': 'Trousseau & Beauty'
};

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly STORAGE_KEY = 'darna_lang_pref';

  // Signals
  readonly currentLang = signal<AppLanguage>(this.getInitialLang());
  readonly isRtl = computed(() => this.currentLang() === 'ar');
  readonly dir = computed(() => (this.currentLang() === 'ar' ? 'rtl' : 'ltr'));
  readonly currency = computed(() => (this.currentLang() === 'ar' ? 'د.ت' : 'DT'));

  constructor() {
    // Apply direction and lang attribute to HTML root whenever language changes
    effect(() => {
      const lang = this.currentLang();
      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', dir);
        document.body.classList.remove('lang-fr', 'lang-ar', 'lang-en');
        document.body.classList.add(`lang-${lang}`);
      }
      
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, lang);
      }
    });
  }

  private getInitialLang(): AppLanguage {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY) as AppLanguage | null;
      if (saved === 'fr' || saved === 'ar' || saved === 'en') {
        return saved;
      }
    }
    return 'fr';
  }

  setLanguage(lang: AppLanguage): void {
    if (lang === 'fr' || lang === 'ar' || lang === 'en') {
      this.currentLang.set(lang);
    }
  }

  toggleLanguage(): void {
    const current = this.currentLang();
    if (current === 'fr') {
      this.setLanguage('ar');
    } else if (current === 'ar') {
      this.setLanguage('en');
    } else {
      this.setLanguage('fr');
    }
  }

  translate(key: TranslationKey): string {
    const lang = this.currentLang();
    let dictionary: { [K in TranslationKey]: string };
    if (lang === 'ar') {
      dictionary = TRANSLATIONS_AR;
    } else if (lang === 'en') {
      dictionary = TRANSLATIONS_EN;
    } else {
      dictionary = TRANSLATIONS_FR;
    }
    return dictionary[key] ?? TRANSLATIONS_FR[key] ?? key;
  }

  t(key: TranslationKey): string {
    return this.translate(key);
  }
}
