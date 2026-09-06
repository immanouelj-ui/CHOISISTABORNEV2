export type GuideSeed = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
};

export const GUIDES: GuideSeed[] = [
    {
      slug: "quelle-borne-de-recharge-choisir",
      title: "Quelle borne de recharge choisir ?",
      excerpt: "Puissance, connectivité, usage : les critères essentiels pour choisir la bonne borne.",
      category: "Guide d'achat",
      content:
        "Choisir une borne de recharge dépend avant tout de trois facteurs : la puissance de charge souhaitée, le type de logement et l'usage quotidien du véhicule.\n\nPour un usage résidentiel classique, une borne de 7,4 kW couvre la majorité des besoins : elle permet de recharger une batterie de taille moyenne en une nuit. Pour les gros rouleurs ou les véhicules à grande capacité de batterie, une borne 11 kW ou 22 kW réduit sensiblement le temps de charge, à condition que l'installation électrique du logement le permette.\n\nLa connectivité (Wi-Fi, application mobile, RFID) apporte un confort supplémentaire : suivi de consommation, programmation des heures creuses, gestion multi-utilisateurs. Elle n'est cependant pas indispensable pour un usage individuel simple.\n\nEnfin, pensez à vérifier la compatibilité du connecteur avec votre véhicule : la quasi-totalité des véhicules vendus en Europe utilisent aujourd'hui un connecteur Type 2.",
    },
    {
      slug: "quelle-puissance-pour-une-borne-a-domicile",
      title: "Quelle puissance pour une borne à domicile ?",
      excerpt: "3,7 kW, 7,4 kW, 11 kW ou 22 kW : comment choisir la puissance adaptée à votre logement.",
      category: "Guide technique",
      content:
        "La puissance d'une borne de recharge domestique dépend à la fois de votre installation électrique et de votre véhicule.\n\nUne installation monophasée standard permet généralement d'aller jusqu'à 7,4 kW. Pour bénéficier de 11 kW ou 22 kW, une installation triphasée est nécessaire, ce qui peut impliquer une intervention sur votre compteur électrique.\n\nCôté véhicule, la plupart des voitures électriques grand public acceptent une charge en 7,4 kW ou 11 kW en courant alternatif ; au-delà, le gain de vitesse de charge devient marginal pour beaucoup de modèles.\n\nEn pratique, une borne 7,4 kW couvre les besoins d'un usage quotidien pour la majorité des foyers, avec une recharge complète en une nuit.",
    },
    {
      slug: "prix-installation-borne-de-recharge",
      title: "Combien coûte l'installation d'une borne de recharge ?",
      excerpt: "Les facteurs qui influencent le prix d'une installation : distance, puissance, travaux annexes.",
      category: "Prix & aides",
      content:
        "Le coût d'installation d'une borne de recharge varie principalement selon trois critères : la distance entre le tableau électrique et l'emplacement de la borne, la puissance choisie, et la nécessité éventuelle de travaux complémentaires (tranchée, mise à la terre, renforcement du tableau).\n\nUne installation simple, à proximité immédiate du tableau électrique, reste la configuration la plus économique. À l'inverse, une installation nécessitant une tranchée extérieure ou un raccordement en copropriété augmente le coût de la main d'œuvre.\n\nDes aides existent pour réduire ce coût, notamment pour les installations en copropriété ou en entreprise, sous réserve d'éligibilité. Un devis personnalisé, établi après étude de votre situation, reste la meilleure façon de connaître le coût exact de votre projet.",
    },
    {
      slug: "borne-7kw-ou-11kw",
      title: "Borne 7,4 kW ou 11 kW ?",
      excerpt: "Les avantages et limites de chaque puissance pour un usage résidentiel.",
      category: "Guide technique",
      content:
        "La borne 7,4 kW reste le choix le plus répandu pour un usage résidentiel : elle est compatible avec une installation monophasée standard et permet une recharge complète en une nuit pour la plupart des véhicules.\n\nLa borne 11 kW nécessite une installation triphasée, plus coûteuse à mettre en place si elle n'existe pas déjà, mais réduit le temps de charge d'environ un tiers par rapport au 7,4 kW.\n\nPour un usage quotidien classique, la différence de confort entre les deux puissances reste limitée. Elle devient significative pour les gros rouleurs ou les foyers équipés de plusieurs véhicules électriques.",
    },
    {
      slug: "installation-borne-copropriete",
      title: "Installation d'une borne de recharge en copropriété",
      excerpt: "Le droit à la prise, l'assemblée générale et les étapes clés pour équiper votre place de parking.",
      category: "Copropriété",
      content:
        "Le droit à la prise permet à tout copropriétaire ou locataire disposant d'une place de stationnement de faire installer une borne de recharge à ses frais, sans avoir besoin d'un vote favorable en assemblée générale — le syndic ne peut s'y opposer que pour des motifs sérieux et légitimes.\n\nLa démarche commence par une notification au syndic, accompagnée d'une description technique du projet. Un professionnel qualifié IRVE réalise ensuite une étude du réseau électrique de l'immeuble avant de procéder à l'installation.\n\nPour les copropriétés souhaitant équiper plusieurs places à terme, une infrastructure collective mutualisée peut être une solution plus économique sur le long terme qu'une multiplication d'installations individuelles.",
    },
    {
      slug: "combien-de-temps-pour-recharger-une-voiture-electrique",
      title: "Combien de temps faut-il pour recharger une voiture électrique ?",
      excerpt: "Le temps de charge dépend de la puissance de la borne et de la capacité de la batterie.",
      category: "Guide technique",
      content:
        "Le temps de recharge d'une voiture électrique dépend principalement de deux facteurs : la puissance de la borne et la capacité de la batterie du véhicule.\n\nSur une prise domestique classique (2,3 kW), une charge complète peut prendre plus de 24 heures pour une batterie de taille moyenne. Sur une borne de 7,4 kW, ce temps est généralement divisé par trois. Sur une borne 11 kW ou 22 kW, la charge est encore plus rapide, à condition que le véhicule accepte cette puissance en courant alternatif.\n\nEn pratique, la plupart des usagers rechargent leur véhicule la nuit : une borne 7,4 kW suffit alors largement à restituer l'autonomie consommée dans la journée.",
    },
    {
      slug: "aides-et-primes-borne-de-recharge",
      title: "Quelles aides pour l'installation d'une borne de recharge ?",
      excerpt: "Panorama des dispositifs d'aide existants pour réduire le coût d'installation, et comment vérifier votre éligibilité.",
      category: "Prix & aides",
      content:
        "Plusieurs dispositifs peuvent réduire le coût d'installation d'une borne de recharge, sous conditions d'éligibilité qui évoluent régulièrement : crédit d'impôt pour les particuliers, prime à l'installation pour certains copropriétaires et bailleurs, ou encore aides régionales et locales selon votre commune.\n\nLes conditions précises (montants, plafonds, profils éligibles) changent fréquemment et dépendent de votre situation : nous vous recommandons de vérifier les dispositifs en vigueur sur les sites officiels (service-public.fr, impots.gouv.fr) avant de finaliser votre projet.\n\nNos installateurs partenaires qualifiés IRVE peuvent vous indiquer, lors de l'étude de votre devis, si votre projet est éligible aux aides applicables au moment de votre demande.",
    },
    {
      slug: "difference-borne-monophasee-triphasee",
      title: "Borne monophasée ou triphasée : quelle différence ?",
      excerpt: "Comprendre la différence entre une installation monophasée et triphasée avant de choisir votre borne.",
      category: "Guide technique",
      content:
        "Une installation électrique monophasée délivre généralement une puissance maximale de 7,4 kW à 9,2 kW pour une recharge de véhicule électrique. Une installation triphasée permet d'atteindre 11 kW voire 22 kW, avec un temps de charge réduit d'autant.\n\nLa plupart des logements résidentiels en France sont raccordés en monophasé. Passer en triphasé nécessite une intervention sur le raccordement électrique du logement, à étudier avec votre installateur et, le cas échéant, votre gestionnaire de réseau.\n\nAvant de choisir une borne 11 kW ou 22 kW, vérifiez donc que votre installation électrique (ou le budget prévu pour l'adapter) le permet réellement.",
    },
    {
      slug: "borne-de-recharge-tesla",
      title: "Quelle borne de recharge pour une Tesla ?",
      excerpt: "Les Tesla utilisent un connecteur Type 2 standard : voici ce qu'il faut savoir avant d'installer une borne.",
      category: "Guide d'achat",
      content:
        "Les modèles Tesla vendus en Europe sont équipés d'un port de charge Type 2, compatible avec la quasi-totalité des bornes de recharge domestiques du marché : aucun adaptateur ni borne de marque spécifique n'est nécessaire.\n\nLa puissance de charge acceptée en courant alternatif varie selon le modèle et la version, généralement jusqu'à 11 kW ou 22 kW selon la configuration du véhicule. Une borne 11 kW représente un bon compromis entre vitesse de charge et coût d'installation pour la plupart des usages quotidiens.\n\nLes fonctionnalités connectées (Wi-Fi, application mobile, programmation des horaires de charge) sont particulièrement appréciées par les propriétaires de Tesla souhaitant profiter des heures creuses.",
    },
    {
      slug: "borne-de-recharge-maison-individuelle",
      title: "Installer une borne de recharge en maison individuelle",
      excerpt: "En maison individuelle, l'installation d'une borne est généralement plus simple et plus rapide qu'en copropriété.",
      category: "Guide technique",
      content:
        "En maison individuelle, vous n'avez besoin d'aucune autorisation de copropriété pour installer une borne de recharge : seule une étude technique de votre installation électrique par un professionnel qualifié IRVE est nécessaire.\n\nL'emplacement idéal se situe à proximité du tableau électrique, dans un garage ou contre une façade extérieure protégée. Plus la distance entre la borne et le tableau est importante, plus les travaux de câblage (et donc le coût) augmentent.\n\nUne borne de 7,4 kW convient à la majorité des maisons équipées d'une installation monophasée standard ; une puissance supérieure suppose généralement une installation triphasée.",
    },
    {
      slug: "borne-de-recharge-entreprise",
      title: "Installer des bornes de recharge en entreprise",
      excerpt: "Équiper un parking d'entreprise permet de répondre aux besoins des salariés et de la flotte de véhicules.",
      category: "Guide d'achat",
      content:
        "Les entreprises équipent de plus en plus leurs parkings de bornes de recharge, que ce soit pour leur flotte de véhicules de service ou pour permettre aux salariés de recharger leur véhicule personnel pendant les heures de travail.\n\nUn projet d'installation en entreprise nécessite généralement une étude de la puissance disponible sur le site, un choix entre bornes individuelles ou solution de gestion dynamique de puissance (pour répartir intelligemment l'énergie entre plusieurs points de charge), et parfois un système de supervision pour suivre les consommations par utilisateur.\n\nNos installateurs partenaires qualifiés IRVE réalisent l'étude technique et le chiffrage adapté à la taille de votre parking, de quelques places à plusieurs dizaines de points de charge.",
    },
    {
      slug: "installer-une-borne-de-recharge-les-etapes",
      title: "Installer une borne de recharge : les étapes, du devis à la mise en service",
      excerpt: "Panorama complet des étapes d'un projet d'installation, de la demande de devis à la mise en service de la borne.",
      category: "Guide technique",
      content:
        "Un projet d'installation de borne de recharge se déroule généralement en cinq étapes. D'abord, la demande de devis : vous décrivez votre logement, votre véhicule et vos besoins de puissance. Ensuite, l'étude technique : un installateur qualifié IRVE évalue votre installation électrique et l'emplacement envisagé.\n\nVient ensuite la validation du devis détaillé, puis la planification de l'intervention, généralement sous 2 à 4 semaines. Le jour de l'installation, l'électricien pose la borne, raccorde le circuit dédié et effectue les tests de sécurité réglementaires.\n\nEnfin, la mise en service : vérification du bon fonctionnement, remise des documents de conformité et, le cas échéant, configuration de l'application mobile associée à votre borne.",
    },
    {
      slug: "prise-renforcee-ou-borne-de-recharge",
      title: "Prise renforcée ou borne de recharge : que choisir ?",
      excerpt: "La prise renforcée dépanne, mais la borne de recharge reste la solution recommandée pour un usage quotidien.",
      category: "Guide d'achat",
      content:
        "Une prise renforcée (type Green'Up) permet de recharger un véhicule électrique jusqu'à environ 3,2 kW, en toute sécurité, mais avec un temps de charge nettement plus long qu'une borne dédiée.\n\nUne borne de recharge, à partir de 7,4 kW, réduit ce temps de charge de plus de moitié et intègre des protections électriques spécifiques (différentiel dédié, disjoncteur adapté) non présentes sur une simple prise.\n\nLa prise renforcée peut convenir à un usage très occasionnel ou à un petit rouleur quotidien ; pour un usage régulier ou un véhicule à grande capacité de batterie, une borne de recharge reste la solution recommandée à moyen terme.",
    },
    {
      slug: "borne-de-recharge-connectee",
      title: "Faut-il choisir une borne de recharge connectée ?",
      excerpt: "Wi-Fi, application mobile, RFID : les apports concrets d'une borne connectée au quotidien.",
      category: "Guide d'achat",
      content:
        "Une borne de recharge connectée permet de suivre votre consommation d'électricité en temps réel, de programmer vos sessions de charge pendant les heures creuses, et parfois de gérer plusieurs utilisateurs grâce à un badge RFID.\n\nCes fonctionnalités sont particulièrement utiles pour les foyers équipés d'un contrat électrique à tarification variable, ou pour les copropriétés et entreprises souhaitant répartir la facturation entre plusieurs usagers.\n\nPour un usage individuel simple, sans besoin de suivi détaillé, une borne non connectée reste une option fiable et plus économique, avec les mêmes garanties de sécurité électrique.",
    },
    {
      slug: "entretien-et-duree-de-vie-borne-de-recharge",
      title: "Entretien et durée de vie d'une borne de recharge",
      excerpt: "Une borne de recharge nécessite peu d'entretien, mais quelques vérifications régulières prolongent sa durée de vie.",
      category: "Guide technique",
      content:
        "Une borne de recharge résidentielle est conçue pour fonctionner plusieurs années sans entretien particulier, grâce à son indice de protection (IP55 ou supérieur pour une installation extérieure) qui la protège de la poussière et de l'humidité.\n\nUn contrôle visuel périodique du câble et du connecteur, ainsi qu'un nettoyage léger sans produit agressif, suffisent dans la majorité des cas. En cas de dysfonctionnement (voyant d'erreur, charge interrompue), il est recommandé de faire appel à l'installateur d'origine plutôt que d'intervenir soi-même.\n\nLa garantie constructeur, généralement de 2 à 3 ans selon les marques, couvre les défauts de fabrication ; elle est distincte de la garantie décennale qui couvre l'installation électrique elle-même.",
    },
    {
      slug: "assemblee-generale-copropriete-borne-recharge",
      title: "Borne de recharge en copropriété : que dire en assemblée générale ?",
      excerpt: "Le droit à la prise dispense d'un vote, mais informer sa copropriété reste une étape utile.",
      category: "Copropriété",
      content:
        "Contrairement à une idée reçue, le droit à la prise ne nécessite pas de vote favorable en assemblée générale : il suffit de notifier votre projet au syndic, qui ne peut s'y opposer que pour des motifs sérieux et légitimes (impossibilité technique avérée, par exemple).\n\nIl reste toutefois utile d'informer les autres copropriétaires de votre démarche, notamment si plusieurs résidents envisagent une installation à court terme : cela peut permettre d'anticiper une solution collective mutualisée, souvent plus économique qu'une multiplication d'installations individuelles.\n\nSi votre copropriété souhaite au contraire équiper l'ensemble du parking de façon coordonnée, un vote en assemblée générale sur une infrastructure collective devient alors pertinent, avec un chiffrage global réalisé par un installateur qualifié IRVE.",
    },
    {
      slug: "cable-de-recharge-type-2",
      title: "Câble de recharge Type 2 : lequel choisir ?",
      excerpt: "Longueur, intensité, compatibilité : les critères pour bien choisir son câble de recharge.",
      category: "Guide technique",
      content:
        "Le connecteur Type 2 est aujourd'hui le standard européen pour la recharge en courant alternatif, utilisé par la quasi-totalité des véhicules électriques et hybrides rechargeables vendus en France.\n\nLe choix d'un câble dépend de l'intensité supportée (16A ou 32A, à adapter à la puissance de votre borne) et de sa longueur, généralement entre 5 et 8 mètres pour un usage résidentiel. Un câble trop court limite les possibilités de stationnement ; un câble trop long complique le rangement au quotidien.\n\nCertaines bornes sont livrées avec un câble attaché en permanence, d'autres fonctionnent avec un câble amovible que vous transportez avec votre véhicule : ce choix dépend surtout de votre préférence d'usage.",
    },
    {
      slug: "borne-de-recharge-flotte-entreprise",
      title: "Équiper une flotte de véhicules électriques en entreprise",
      excerpt: "La gestion dynamique de puissance permet d'équiper plusieurs véhicules sans surdimensionner l'installation électrique.",
      category: "Guide d'achat",
      content:
        "Équiper une flotte de véhicules électriques d'entreprise pose une question spécifique : comment recharger plusieurs véhicules simultanément sans dépasser la puissance électrique disponible sur le site ?\n\nLa gestion dynamique de puissance répond à ce besoin en répartissant automatiquement l'énergie disponible entre les bornes actives, évitant ainsi de surdimensionner (et de payer plus cher) le raccordement électrique du bâtiment.\n\nUn système de supervision permet également de suivre la consommation par véhicule ou par utilisateur, utile pour la gestion administrative et la refacturation éventuelle des frais de recharge.",
    },
    {
      slug: "difference-wallbox-borne-rapide",
      title: "Wallbox résidentielle ou borne de recharge rapide : quelle différence ?",
      excerpt: "Les bornes rapides des réseaux publics et les wallbox résidentielles répondent à des besoins différents.",
      category: "Guide technique",
      content:
        "Une wallbox résidentielle, comme celles proposées sur CHOISISTABORNE, délivre une puissance en courant alternatif comprise entre 3,7 kW et 22 kW, adaptée à une recharge de plusieurs heures à domicile ou en entreprise.\n\nLes bornes de recharge rapide que l'on trouve sur les aires d'autoroute ou dans certains parkings publics fonctionnent en courant continu, avec des puissances de 50 kW à plus de 300 kW, permettant une recharge partielle en quelques minutes.\n\nCes deux solutions sont complémentaires : la wallbox pour la recharge du quotidien à domicile, la borne rapide pour les longs trajets. L'achat d'une wallbox ne concerne que le premier usage.",
    },
    {
      slug: "quelle-marque-de-borne-choisir",
      title: "Quelle marque de borne de recharge choisir ?",
      excerpt: "Fiabilité, garantie, service après-vente : les critères pour choisir une marque plutôt qu'une autre.",
      category: "Guide d'achat",
      content:
        "Le choix d'une marque de borne de recharge repose sur plusieurs critères au-delà du prix affiché : la durée et l'étendue de la garantie constructeur, la disponibilité d'un service après-vente en France, et le retour d'expérience des installateurs professionnels.\n\nNotre catalogue sélectionne des marques reconnues dans le secteur de la mobilité électrique, choisies pour leur fiabilité et la disponibilité de pièces détachées en cas de besoin.\n\nAu-delà de la marque, la compatibilité avec votre véhicule (connecteur Type 2, puissance acceptée) et la connectivité souhaitée (Wi-Fi, application, RFID) restent les critères les plus déterminants pour votre usage quotidien.",
    },
    {
      slug: "borne-de-recharge-appartement-sans-parking-dedie",
      title: "Recharger son véhicule électrique en appartement sans place de parking dédiée",
      excerpt: "Sans place de parking attitrée, la recharge à domicile est plus complexe mais des solutions existent.",
      category: "Copropriété",
      content:
        "Sans place de stationnement dédiée, l'installation d'une borne de recharge individuelle n'est généralement pas possible : le droit à la prise s'applique à une place de parking identifiée, privative ou attribuée.\n\nDans ce cas, plusieurs solutions existent : louer ou acheter une place de parking dans votre résidence si l'opportunité se présente, vous renseigner sur une éventuelle infrastructure de recharge collective mise en place par la copropriété, ou utiliser le réseau de bornes publiques de votre ville pour une recharge occasionnelle.\n\nSi votre copropriété envisage d'équiper le parking commun de plusieurs bornes partagées, une demande collective en assemblée générale permet d'étudier un projet mutualisé adapté à plusieurs résidents.",
    },
    {
      slug: "garantie-et-sav-borne-de-recharge",
      title: "Garantie et service après-vente d'une borne de recharge",
      excerpt: "Ce que couvre la garantie constructeur d'une borne, et comment se déroule une prise en charge SAV.",
      category: "Prix & aides",
      content:
        "La garantie constructeur d'une borne de recharge couvre généralement les défauts de fabrication et les pannes électroniques, pour une durée de 2 à 3 ans selon les marques ; certaines options de garantie étendue peuvent être proposées.\n\nCette garantie produit est distincte de la garantie décennale, qui couvre l'installation électrique réalisée par le professionnel qualifié IRVE, et de la garantie légale de conformité applicable à tout achat.\n\nEn cas de panne, la première étape consiste à contacter le service client indiqué sur votre facture ou votre espace client : selon le diagnostic, une intervention sur site ou un échange de pièce peut être proposé, sans frais si le défaut est couvert par la garantie.",
    },
  ];
