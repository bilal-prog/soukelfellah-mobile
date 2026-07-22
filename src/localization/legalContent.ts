export type LegalTabType = "cgu" | "cgv" | "privacy" | "mentions"

export interface LegalSection {
  title: string
  content: string
}

export interface LegalDocument {
  title: string
  lastUpdated: string
  sections: LegalSection[]
}

export const legalContent: Record<string, Record<LegalTabType, LegalDocument>> = {
  fr: {
    cgu: {
      title: "Conditions Générales d'Utilisation (CGU)",
      lastUpdated: "21 Juillet 2026",
      sections: [
        {
          title: "1. Présentation de la Plateforme",
          content:
            "Bienvenue sur Souk El Fellah, la plateforme digitale marocaine dédiée à la mise en relation d'acteurs du secteur agricole (agriculteurs, éleveurs, acheteurs, vendeurs d'équipements et d'intrants agricoles). Souk El Fellah agit exclusivement en qualité de tiers intermédiaire neutre et hébergeur d'annonces.",
        },
        {
          title: "2. Inscription et Sécurité du Compte",
          content:
            "L'accès à la création d'annonces nécessite une inscription au moyen d'un numéro de téléphone valide. L'utilisateur s'engage à fournir des informations exactes et véridiques. L'utilisateur est seul responsable de l'utilisation et de la confidentialité de son compte.",
        },
        {
          title: "3. Règles de Publication des Annonces",
          content:
            "Toute annonce publiée doit concerner exclusivement des biens ou services agricoles légitimes (produits de la récolte, bétail, outillage, engins agricoles, semences, engrais). Sont strictement interdits : les contenus trompeurs, les contrefaçons, les espèces protégées, les substances illicites et tout contenu enfreignant la législation marocaine en vigueur.",
        },
        {
          title: "4. Rôle et Limites de Responsabilité de Souk El Fellah",
          content:
            "Souk El Fellah n'intervient pas dans les négociations, contrats ou transactions conclus directement entre vendeurs et acheteurs. En conséquence, la responsabilité de Souk El Fellah ne saurait être engagée quant à la qualité, la conformité, la sécurité ou la légalité des produits ou matériels proposés par les utilisateurs.",
        },
        {
          title: "5. Modération et Suspension de Compte",
          content:
            "Souk El Fellah se réserve le droit de modérer, refuser ou supprimer sans préavis toute annonce non conforme aux présentes CGU ou signalée comme frauduleuse, et de suspendre temporairement ou définitivement l'accès de l'utilisateur concerné.",
        },
        {
          title: "6. Propriété Intellectuelle",
          content:
            "Tous les éléments constitutifs de l'application (logos, chartes graphiques, logiciels, bases de données) sont la propriété exclusive de Souk El Fellah. Toute reproduction ou exploitation non autorisée est strictement interdite.",
        },
      ],
    },
    cgv: {
      title: "Conditions Générales de Vente (CGV)",
      lastUpdated: "21 Juillet 2026",
      sections: [
        {
          title: "1. Objet des CGV",
          content:
            "Les présentes CGV définissent les modalités relatives aux transactions conclues via les annonces déposées sur Souk El Fellah ainsi que les éventuelles options de mise en avant ou services payants proposés par la plateforme.",
        },
        {
          title: "2. Modalités des Transactions entre Utilisateurs",
          content:
            "Les ventes et achats de biens agricoles (fruits, légumes, bétail, tracteurs, pièces de rechange) sont conclus directement à gré à gré entre le vendeur et l'acheteur. Les prix fixés dans les annonces sont établis sous la seule responsabilité du vendeur et sont exprimés en Dirhams Marocains (MAD / DH).",
        },
        {
          title: "3. Paiement et Livraison",
          content:
            "Sauf indication contraire explicite, la plateforme ne perçoit pas directement les montants des transactions sur les produits agricoles. Les modalités de livraison, d'inspection préalable des produits et de paiement (remise en main propre, virement) sont arrêtées librement entre les parties.",
        },
        {
          title: "4. Absence de Droit de Rétractation entre Particuliers",
          content:
            "Conformément à la réglementation sur le commerce électronique au Maroc (Loi n° 31-08), le droit de rétractation s'applique aux ventes à distance professionnelles. Les transactions de gré à gré entre particuliers ou agriculteurs sont soumises au droit commun des contrats de vente du Code des Obligations et Contrats (DOC).",
        },
        {
          title: "5. Litiges et Réclamations",
          content:
            "Tout différend concernant la qualité d'un bien ou le déroulement d'une livraison doit être résolu directement entre le vendeur et l'acheteur. Souk El Fellah met à disposition un système de signalement pour prévenir les comportements malveillants.",
        },
      ],
    },
    privacy: {
      title: "Politique de Confidentialité & Données Personnelles",
      lastUpdated: "21 Juillet 2026",
      sections: [
        {
          title: "1. Conforme à la Loi Marocaine n° 09-08",
          content:
            "Souk El Fellah accorde une importance capitale à la protection de la vie privée de ses utilisateurs. Les traitements de données à caractère personnel réalisés dans le cadre de l'application sont conformes aux dispositions de la Loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel (CNDP).",
        },
        {
          title: "2. Données Collectées",
          content:
            "Nous collectons les données nécessaires au bon fonctionnement des services : numéro de téléphone portable, nom et prénom, localisation (ville/région/adresse communiquée), données relatives aux annonces publiées et identifiants techniques du terminal (token de notification OneSignal).",
        },
        {
          title: "3. Finalités du Traitement",
          content:
            "Les données collectées sont utilisées exclusivement pour : l'authentification et la sécurisation du compte, la publication et la recherche géolocalisée d'annonces agricoles, l'envoi d'notifications push en cas de contacts ou de mises à jour du service, et la prévention des fraudes.",
        },
        {
          title: "4. Destinataires des Données",
          content:
            "Les données du numéro de téléphone et de la localisation choisie sont rendues accessibles aux autres utilisateurs afin d'assurer la mise en relation. Vos données ne sont en aucun cas vendues ou cédées à des tiers à des fins commerciales.",
        },
        {
          title: "5. Vos Droits (Accès, Rectification, Suppression)",
          content:
            "Conformément à la Loi 09-08, vous disposez d'un droit d'accès, de rectification et d'opposition au traitement de vos données personnelles. Vous pouvez exercer ces droits ou demander la suppression de votre compte en contactant notre support à l'adresse email support@soukelfellah.ma.",
        },
      ],
    },
    mentions: {
      title: "Mentions Légales",
      lastUpdated: "21 Juillet 2026",
      sections: [
        {
          title: "1. Éditeur de l'Application",
          content:
            "L'application Souk El Fellah est éditée et exploitée par l'équipe Souk El Fellah SARL, société de droit marocain dédiée aux technologies agricoles, enregistrée au Registre du Commerce du Maroc.",
        },
        {
          title: "2. Contact et Support",
          content:
            "Adresse email de contact : contact@soukelfellah.ma\nSupport technique : support@soukelfellah.ma\nTéléphone : +212 5 22 00 00 00\nSiège social : Casablanca, Maroc.",
        },
        {
          title: "3. Hébergement et Infrastructures",
          content:
            "Les serveurs et infrastructures de bases de données assurant le fonctionnement de l'application sont hébergés sur des infrastructures cloud sécurisées conformes aux exigences de haute disponibilité et d'intégrité des données.",
        },
        {
          title: "4. Propriété et Marques",
          content:
            "La marque Souk El Fellah, son logo, son slogan ainsi que l'ensemble du code source et des graphismes sont la propriété exclusive de Souk El Fellah. Toute utilisation non autorisée du nom ou du logo est passible de poursuites judiciaires.",
        },
      ],
    },
  },
  ar: {
    cgu: {
      title: "الشروط العامة للاستخدام (CGU)",
      lastUpdated: "21 يوليو 2026",
      sections: [
        {
          title: "1. تقديم المنصة",
          content:
            "مرحباً بكم في منصة سوق الفلاح، التطبيق الرقمي المغربي المخصص للربط بين الفاعلين في القطاع الفلاحي (الفلاحين، الكسابة، المشتريين، وتجار المعدات والمدخلات الفلاحية). يعمل سوق الفلاح كطرف وسيط محايد ومستضيف للإعلانات فقط.",
        },
        {
          title: "2. التسجيل وأمان الحساب",
          content:
            "يتطلب نشر الإعلانات التسجيل باستخدام رقم هاتف محمول صحيح. يتعهد المستخدم بتقديم معلومات دقيقة وصحيحة، ويكون مسؤولاً بشكل كامل عن استخدام حسابه وسريته.",
        },
        {
          title: "3. قواعد نشر الإعلانات",
          content:
            "يجب أن يتعلق كل إعلان بنشاط أو منتج فلاحي مشروع (محاصيل، مواشي، معدات، آلات فلاحية، بذور، أسمدة). يُمنع منعاً باتاً نشر الإعلانات المضللة، المنتجات المزيفة، أو أي محتوى يخالف القوانين المغربية الجاري بها العمل.",
        },
        {
          title: "4. دور المنصة وحدود المسؤولية",
          content:
            "لا تتدخل منصة سوق الفلاح في المفاوضات أو العقود أو المعاملات المالية المباشرة بين البائع والمشتري. وبالتالي، لا تتحمل المنصة أي مسؤولية عن جودة أو سلامة أو مطابقة المنتجات والمعروضات.",
        },
        {
          title: "5. مراقبة وإيقاف الحسابات",
          content:
            "يحتفظ سوق الفلاح بحق مراجعة أو رفض أو حذف أي إعلان مخالف لهذه الشروط بدون إشعار مسبق، وحظر الحسابات التي تنتهك القواعد أو يُبلغ عنها بالاحتيال.",
        },
        {
          title: "6. الملكية الفكرية",
          content:
            "جميع مكونات التطبيق (الشعار، التصاميم، الشفرة البرمجية، وقواعد البيانات) هي ملك حصري لمنصة سوق الفلاح، ويُمنع أي استغلال أو نسخ غير مصرح به.",
        },
      ],
    },
    cgv: {
      title: "الشروط العامة للبيع (CGV)",
      lastUpdated: "21 يوليو 2026",
      sections: [
        {
          title: "1. موضوع الشروط",
          content:
            "تحدد هذه الشروط الضوابط المتعلقة بالمعاملات المنجزة عبر الإعلانات المنشورة في تطبيق سوق الفلاح وكذا الخدمات أو الخيارات المتاحة للمستخدمين.",
        },
        {
          title: "2. المعاملات بين المستخدمين",
          content:
            "تتم عمليات بيع وشراء المنتجات الفلاحية (خضر، فواكه، مواشي، تراكتورات، قطع غيار) مباشرة بين البائع والمشتري بالتراضي. الأسعار المحددة في الإعلانات تحت مسؤولية البائع وحده وتُدفع بالدرهم المغربي (DH).",
        },
        {
          title: "3. الأداء والتسليم",
          content:
            "المنصة لا تستلم مبالغ المبيعات الفلاحية مباشرة. يتم الاتفاق على طرق التسليم، المعاينة المسبقة للمنتجات، وطريقة الدفع (يداً بيد، تحويل بنكي) بحرية بين البائع والمشتري.",
        },
        {
          title: "4. التزامات الأطراف وحل النزاعات",
          content:
            "تخضع المعاملات بين الفلاحين والمشتريين للقواعد العامة لعقود البيع بالقانون المغربي (قانون الالتزامات والعقود). أي خلاف بشأن جودة المعروضات يتم حله مباشرة بين الأطراف المعنية.",
        },
      ],
    },
    privacy: {
      title: "سياسة الخصوصية وحماية المعطيات الشخصية",
      lastUpdated: "21 يوليو 2026",
      sections: [
        {
          title: "1. الامتثال للقانون المغربي رقم 09-08",
          content:
            "يولي سوق الفلاح أهمية قصوى لحماية الخصوصية المعطيات الشخصية لمستخدميه. تمت معالجة المعطيات وفقاً لأحكام القانون المغربي رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي (CNDP).",
        },
        {
          title: "2. المعطيات المجمعة",
          content:
            "نقوم بجمع المعطيات الضرورية لتقديم الخدمة: رقم الهاتف المحمول، الاسم والنسب، الموقع الجغرافي (المدينة/الجهة/العنوان)، بيانات الإعلانات المنشورة ومعرفات جهاز الهاتف لخدمة الإشعارات (OneSignal).",
        },
        {
          title: "3. الغرض من معالجة المعطيات",
          content:
            "تُستخدم المعطيات حصرياً لأغراض: إنشاء الحساب والتحقق منه، عرض الإعلانات بحسب الموقع الجغرافي، إرسال التنبيهات والإشعارات المهمة للمستخدم، والحد من الاحتيال.",
        },
        {
          title: "4. حقوق المستخدم (الولوج، التعديل، والحذف)",
          content:
            "وفقاً للقانون 09-08، يحق لكم الولوج إلى معطياتكم الشخصية، تصحيحها، أو طلب حذف حسابكم ومعطياتكم بالكامل من خلال مراسلة الدعم عبر البريد الإلكتروني: support@soukelfellah.ma.",
        },
      ],
    },
    mentions: {
      title: "الإشعارات القانونية",
      lastUpdated: "21 يوليو 2026",
      sections: [
        {
          title: "1. ناشر التطبيق",
          content:
            "تطبيق سوق الفلاح يتم تطويره وإدارته من طرف شركة سوق الفلاح ش.م.م، وهي شركة مسجلة بالمركب التجاري بالمملكة المغربية ومخصصة للتكنولوجيات الفلاحية.",
        },
        {
          title: "2. التواصل والدعم الفني",
          content:
            "البريد الإلكتروني للاتصال: contact@soukelfellah.ma\nالدعم الفني: support@soukelfellah.ma\nالهاتف: 00 00 00 22 5 212+\nالمقر الاجتماعي: الدار البيضاء، المغرب.",
        },
        {
          title: "3. الاستضافة والبنية التحتية",
          content:
            "تستضيف المنصة سيرفراتها وقواعد بياناتها على بنية تحتية سحابية آمنة تضمن استقرار الخدمة وسريتها وفق أعلى المعايير الأمنية.",
        },
      ],
    },
  },
}

export function getLegalContent(language: string, type: LegalTabType): LegalDocument {
  const langKey = language === "ar" || language === "ary" ? "ar" : "fr"
  const docGroup = legalContent[langKey] || legalContent.fr
  return docGroup[type] || docGroup.cgu
}
