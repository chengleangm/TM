import type { Bilingual, ContentPage, Database } from "@/types/platform";
const b = (en: string, km: string): Bilingual => ({ en, km });
const page = (
  slug: string,
  title: Bilingual,
  content: Bilingual,
  image = "/images/practice.jpg",
): ContentPage => ({
  slug,
  title,
  content,
  image,
  seo: content,
  published: true,
});
export const seed: Database = {
  pages: [
    page(
      "home",
      b(
        "A quieter mind.\nA fuller life.",
        "ចិត្តស្ងប់ជាងមុន។\nជីវិតពេញលេញជាងមុន។",
      ),
      b(
        "Make a little space for yourself. Discover an effortless meditation practice, personally taught here in Cambodia.",
        "ទុកពេលបន្តិចសម្រាប់ខ្លួនអ្នក។ ស្វែងយល់ពីការតាំងសមាធិដែលងាយស្រួល និងបង្រៀនដោយផ្ទាល់នៅកម្ពុជា។",
      ),
      "/images/hero.jpg",
    ),
    page(
      "about",
      b(
        "A tradition of inner peace.\nA community here for you.",
        "ប្រពៃណីនៃសន្តិភាពខាងក្នុង។\nសហគមន៍សម្រាប់អ្នក។",
      ),
      b(
        "The Maharishi Foundation for World Peace brings Transcendental Meditation to Cambodia. Our approach starts with a conversation, personal instruction, and ongoing support.\n\nTM was introduced to the world by Maharishi Mahesh Yogi. It is a practical technique, open to people of different backgrounds and beliefs.\n\nMeet the local team and ask about learning in Khmer or English. We will help you understand the course before you decide to join.",
        "មូលនិធិមហាឫស្សីដើម្បីសន្តិភាពពិភពលោកនាំមកនូវការតាំងសមាធិ TM នៅកម្ពុជា។ យើងចាប់ផ្តើមពីការសន្ទនា ការបង្រៀនផ្ទាល់ខ្លួន និងការគាំទ្របន្ត។\n\nTM ត្រូវបានណែនាំដល់ពិភពលោកដោយមហាឫស្សី មហេស យោគី។ មនុស្សគ្រប់មជ្ឈដ្ឋាន និងជំនឿអាចរៀនបាន។\n\nជួបក្រុមការងាររបស់យើង និងសួរអំពីការរៀនជាភាសាខ្មែរ ឬអង់គ្លេស។",
      ),
    ),
    page(
      "what-is-tm",
      b(
        "Less effort.\nMore inner stillness.",
        "ការប្រឹងប្រែងតិច។\nភាពស្ងប់ខាងក្នុងច្រើន។",
      ),
      b(
        "Transcendental Meditation is a simple practice, usually enjoyed for 20 minutes twice a day while sitting comfortably with your eyes closed.\n\nThere is no need to control your breathing, concentrate, or try to stop your thoughts. A teacher guides you personally as you learn.\n\nYou do not need a particular belief, a special posture, or previous meditation experience. Start with an introductory conversation to find out whether TM is right for you.",
        "ការតាំងសមាធិ TM គឺជាការអនុវត្តងាយស្រួល ជាទូទៅ ២០ នាទី ពីរដងក្នុងមួយថ្ងៃ ដោយអង្គុយស្រួល និងបិទភ្នែក។\n\nមិនចាំបាច់គ្រប់គ្រងដង្ហើម ផ្តោតអារម្មណ៍ ឬព្យាយាមបញ្ឈប់គំនិតទេ។ គ្រូណែនាំអ្នកដោយផ្ទាល់។\n\nអ្នកមិនចាំបាច់មានជំនឿពិសេស ឥរិយាបថពិសេស ឬបទពិសោធន៍តាំងសមាធិពីមុនទេ។ ចាប់ផ្តើមជាមួយការសន្ទនាណែនាំ។",
      ),
    ),
    page(
      "benefits",
      b(
        "More room for\nwhat matters.",
        "ពេលវេលាច្រើនជាងមុន\nសម្រាប់អ្វីដែលសំខាន់។",
      ),
      b(
        "Explore the relationship between regular meditation and everyday wellbeing. People come to TM for different reasons: time to pause, a steadier routine, and space to think. Experiences vary.\n\nAn introductory session is a chance to discuss your expectations with a teacher. TM is a wellbeing practice and does not replace medical care.",
        "ស្វែងយល់ពីទំនាក់ទំនងរវាងការតាំងសមាធិទៀងទាត់ និងសុខុមាលភាពប្រចាំថ្ងៃ។ មនុស្សមករៀន TM ដោយមូលហេតុខុសៗគ្នា៖ ពេលសម្រាក ទម្លាប់ប្រចាំថ្ងៃ និងពេលគិត។ បទពិសោធន៍របស់មនុស្សម្នាក់ៗខុសគ្នា។\n\nវគ្គណែនាំជាឱកាសពិភាក្សាជាមួយគ្រូ។ TM មិនជំនួសការថែទាំវេជ្ជសាស្ត្រទេ។",
      ),
    ),
    page(
      "learn",
      b(
        "A personal beginning.\nSupport along the way.",
        "ការចាប់ផ្តើមផ្ទាល់ខ្លួន។\nការគាំទ្រជាបន្តបន្ទាប់។",
      ),
      b(
        "01 — Meet your teacher\nJoin an introductory session, ask questions, and explore what learning involves.\n\n02 — Learn personally\nBegin with individual instruction and follow-up sessions over consecutive days. Your teacher will confirm your schedule.\n\n03 — Make it your own\nBuild a comfortable daily practice with continued guidance and opportunities to reconnect.",
        "០១ — ជួបគ្រូរបស់អ្នក\nចូលរួមវគ្គណែនាំ សួរសំណួរ និងស្វែងយល់ពីការរៀន។\n\n០២ — រៀនដោយផ្ទាល់\nចាប់ផ្តើមជាមួយការបង្រៀនផ្ទាល់ខ្លួន និងវគ្គតាមដានជាបន្តបន្ទាប់។ គ្រូនឹងបញ្ជាក់កាលវិភាគ។\n\n០៣ — បង្កើតទម្លាប់របស់អ្នក\nអនុវត្តប្រចាំថ្ងៃដោយស្រួល ជាមួយការណែនាំបន្ត។",
      ),
    ),
    page(
      "courses",
      b(
        "Your next chapter\nstarts with a little stillness.",
        "ជំហានបន្ទាប់របស់អ្នក\nចាប់ផ្តើមពីភាពស្ងប់។",
      ),
      b(
        "Find a session that fits your life. Small groups, personal guidance, and a welcoming place to begin.",
        "ស្វែងរកវគ្គដែលសមនឹងជីវិតរបស់អ្នក។ ក្រុមតូច ការណែនាំផ្ទាល់ខ្លួន និងកន្លែងស្វាគមន៍សម្រាប់ចាប់ផ្តើម។",
      ),
    ),
    page(
      "teachers",
      b(
        "A real person.\nA personal practice.",
        "គ្រូនៅក្បែរអ្នក។\nការអនុវត្តផ្ទាល់ខ្លួន។",
      ),
      b(
        "Get to know your teacher before taking the first step. Contact the foundation to confirm availability and instruction in your preferred language.",
        "ស្គាល់គ្រូរបស់អ្នកមុនចាប់ផ្តើម។ ទាក់ទងមូលនិធិដើម្បីបញ្ជាក់ពេលវេលា និងភាសាដែលអ្នកចង់រៀន។",
      ),
    ),
    page(
      "centers",
      b("Find your place\nto begin.", "ស្វែងរកកន្លែង\nដើម្បីចាប់ផ្តើម។"),
      b(
        "Connect with TM in Cambodia. Visits are by appointment; the team will confirm the meeting address before your session.",
        "ភ្ជាប់ទំនាក់ទំនងជាមួយ TM នៅកម្ពុជា។ សូមណាត់ជួបជាមុន ក្រុមការងារនឹងបញ្ជាក់អាសយដ្ឋានមុនវគ្គរបស់អ្នក។",
      ),
    ),
    page(
      "testimonials",
      b(
        "Different lives.\nA shared moment of calm.",
        "ជីវិតខុសគ្នា។\nភាពស្ងប់រួមគ្នា។",
      ),
      b(
        "Discover personal perspectives on learning TM. These international stories are shared on the official Cambodia website; individual experiences are not promises of results.",
        "ស្វែងយល់ពីបទពិសោធន៍ផ្ទាល់ខ្លួនក្នុងការរៀន TM។ រឿងរ៉ាវអន្តរជាតិទាំងនេះមាននៅលើគេហទំព័រផ្លូវការកម្ពុជា។ បទពិសោធន៍មិនមែនជាការធានាលទ្ធផលទេ។",
      ),
    ),
    page(
      "videos",
      b("Take a moment.\nGet to know TM.", "ទុកពេលបន្តិច។\nស្វែងយល់ពី TM។"),
      b(
        "Watch an introduction and hear personal experiences. Videos open on their original hosting platform.",
        "មើលវីដេអូណែនាំ និងស្តាប់បទពិសោធន៍ផ្ទាល់ខ្លួន។ វីដេអូបើកនៅលើវេទិកាដើម។",
      ),
    ),
    page(
      "faq",
      b(
        "A little clarity\nbefore you begin.",
        "ស្វែងយល់ឱ្យច្បាស់\nមុនចាប់ផ្តើម។",
      ),
      b(
        "Is experience needed?\nNo. Your teacher will guide you from the beginning.\n\nHow long is the practice?\nUsually 20 minutes, twice a day. Ask your teacher about your circumstances.\n\nHow do I learn?\nStart with an introductory session, then arrange personal instruction and follow-up.\n\nCan I learn in Khmer?\nContact the local team to arrange instruction in Khmer or English.\n\nAre these real course dates and fees?\nThis preview uses sample schedules and prices. Confirm current arrangements directly with the foundation before making plans.",
        "តើត្រូវការបទពិសោធន៍ទេ?\nទេ។ គ្រូនឹងណែនាំអ្នកតាំងពីដំបូង។\n\nតើអនុវត្តរយៈពេលប៉ុន្មាន?\nជាទូទៅ ២០ នាទី ពីរដងក្នុងមួយថ្ងៃ។ សូមសួរគ្រូអំពីស្ថានភាពរបស់អ្នក។\n\nតើរៀនដូចម្តេច?\nចាប់ផ្តើមពីវគ្គណែនាំ បន្ទាប់មករៀបចំការបង្រៀនផ្ទាល់ខ្លួន និងតាមដាន។\n\nតើអាចរៀនជាភាសាខ្មែរទេ?\nទាក់ទងក្រុមការងារដើម្បីរៀបចំការរៀនជាភាសាខ្មែរ ឬអង់គ្លេស។\n\nតើកាលបរិច្ឆេទ និងតម្លៃនេះពិតប្រាកដទេ?\nនេះជាកាលវិភាគ និងតម្លៃគំរូ។ សូមបញ្ជាក់ជាមួយមូលនិធិមុនរៀបចំផែនការ។",
      ),
    ),
    page(
      "contact",
      b(
        "Every journey starts\nwith a conversation.",
        "ដំណើរនីមួយៗចាប់ផ្តើម\nពីការសន្ទនា។",
      ),
      b(
        "Ask a question or request an introductory session. We would love to help you find your next step.",
        "សួរសំណួរ ឬស្នើសុំវគ្គណែនាំ។ យើងរីករាយជួយអ្នករកជំហានបន្ទាប់។",
      ),
    ),
    page(
      "register",
      b("Make time for yourself.", "ទុកពេលសម្រាប់ខ្លួនអ្នក។"),
      b(
        "A few details, and you are one step closer to your course.",
        "បំពេញព័ត៌មានខ្លីៗ ដើម្បីបន្តទៅវគ្គរបស់អ្នក។",
      ),
    ),
    page(
      "checkout",
      b("Your place to begin.", "កន្លែងចាប់ផ្តើមរបស់អ្នក។"),
      b(
        "Review your registration and choose how you would like to pay.",
        "ពិនិត្យការចុះឈ្មោះ និងជ្រើសរើសរបៀបបង់ប្រាក់។",
      ),
    ),
    page(
      "privacy",
      b("Privacy policy", "គោលការណ៍ឯកជនភាព"),
      b(
        "Demo privacy notice — for review before launch.\n\nThis preview stores registration details and payment simulation records in a local server repository. Payment card numbers, CVV and PINs are never collected. An essential session cookie connects your browser to your registration.\n\nOnly provide fictional details while testing. Contact the foundation about access or deletion. Before public launch, the operator must confirm retention periods, hosting, privacy contacts and the final policy.",
        "សេចក្តីជូនដំណឹងឯកជនភាពគំរូ — ត្រូវពិនិត្យមុនដាក់ឱ្យប្រើប្រាស់។\n\nការមើលជាមុននេះរក្សាទុកព័ត៌មានចុះឈ្មោះ និងកំណត់ត្រាទូទាត់សាកល្បងនៅលើម៉ាស៊ីនមេមូលដ្ឋាន។ មិនប្រមូលលេខកាត CVV ឬ PIN ទេ។ ខូគីភ្ជាប់កម្មវិធីរុករកទៅការចុះឈ្មោះ។\n\nសូមប្រើព័ត៌មានប្រឌិតសម្រាប់សាកល្បង។ ទាក់ទងមូលនិធិអំពីការចូលមើល ឬលុបព័ត៌មាន។ គោលការណ៍ចុងក្រោយត្រូវបញ្ជាក់មុនដាក់ឱ្យប្រើប្រាស់។",
      ),
    ),
    page(
      "terms",
      b("Terms & conditions", "លក្ខខណ្ឌប្រើប្រាស់"),
      b(
        "Demo booking terms — for review before launch.\n\nDates, fees, locations and availability shown in this preview are sample data. A simulated payment does not reserve a real course and no money is collected.\n\nFor a real course, confirm eligibility, schedule, fees, cancellation and refund arrangements with the foundation before payment. These details must be approved and published before live booking is enabled.",
        "លក្ខខណ្ឌចុះឈ្មោះគំរូ — ត្រូវពិនិត្យមុនដាក់ឱ្យប្រើប្រាស់។\n\nកាលបរិច្ឆេទ តម្លៃ ទីតាំង និងកន្លែងទំនេរនេះជាទិន្នន័យគំរូ។ ការបង់ប្រាក់សាកល្បងមិនកក់វគ្គពិតប្រាកដ ហើយមិនប្រមូលប្រាក់ទេ។\n\nសម្រាប់វគ្គពិត សូមបញ្ជាក់កាលវិភាគ តម្លៃ ការលុបចោល និងការសងប្រាក់ជាមួយមូលនិធិមុនបង់ប្រាក់។",
      ),
    ),
  ],
  teachers: [
    {
      id: "samen",
      slug: "samen",
      name: b("Mok Samen", "សាម៉ែន"),
      description: b(
        "Connect with the Cambodia teaching team for a personal introduction to TM. The foundation will confirm the teacher and language for your session.",
        "ទាក់ទងក្រុមគ្រូនៅកម្ពុជា ដើម្បីស្វែងយល់ពី TM ដោយផ្ទាល់។ មូលនិធិនឹងបញ្ជាក់គ្រូ និងភាសាសម្រាប់វគ្គរបស់អ្នក។",
      ),
      image: "/images/samen.jpg",
      published: true,
    },
  ],
  centers: [
    {
      id: "phnom-penh",
      slug: "phnom-penh",
      name: b("Phnom Penh", "ភ្នំពេញ"),
      city: b("Phnom Penh", "ភ្នំពេញ"),
      address: b(
        "By appointment · address confirmed by the team",
        "តាមការណាត់ជួប · ក្រុមការងារបញ្ជាក់អាសយដ្ឋាន",
      ),
      description: b(
        "A personal introduction to TM in the heart of Cambodia. Contact the team to arrange your visit.",
        "ការណែនាំ TM ដោយផ្ទាល់នៅកម្ពុជា។ ទាក់ទងក្រុមការងារដើម្បីរៀបចំការណាត់ជួប។",
      ),
      map: "https://www.google.com/maps/search/?api=1&query=Phnom+Penh+Cambodia",
      image: "/images/practice.jpg",
      published: true,
    },
    {
      id: "siem-reap",
      slug: "siem-reap",
      name: b("Siem Reap · demo venue", "សៀមរាប · ទីតាំងគំរូ"),
      city: b("Siem Reap", "សៀមរាប"),
      address: b(
        "Sample venue · location to be confirmed",
        "ទីតាំងគំរូ · ត្រូវបញ្ជាក់ទីតាំង",
      ),
      description: b(
        "A sample regional course location for this booking demonstration. Contact the foundation for actual local availability.",
        "ទីតាំងវគ្គគំរូសម្រាប់ការបង្ហាញការកក់។ ទាក់ទងមូលនិធិដើម្បីបញ្ជាក់វគ្គពិតប្រាកដ។",
      ),
      map: "https://www.google.com/maps/search/?api=1&query=Siem+Reap+Cambodia",
      image: "/images/hero.jpg",
      published: true,
    },
  ],
  courses: [0, 1, 2].map((i) => ({
    id: `course-${i + 1}`,
    slug: [
      "tm-course-phnom-penh",
      "intro-session-phnom-penh",
      "tm-course-siem-reap",
    ][i],
    title: [
      b("TM course · Phnom Penh", "វគ្គ TM · ភ្នំពេញ"),
      b("An introduction to TM", "វគ្គណែនាំអំពី TM"),
      b("TM course · Siem Reap", "វគ្គ TM · សៀមរាប"),
    ][i],
    description: b(
      "Begin a lasting practice with personal instruction and a small, supportive group. This sample course demonstrates the complete registration experience; dates and fees are illustrative.",
      "ចាប់ផ្តើមការអនុវត្តយូរអង្វែងជាមួយការបង្រៀនផ្ទាល់ខ្លួន និងក្រុមតូច។ វគ្គគំរូនេះបង្ហាញពីការចុះឈ្មោះពេញលេញ។ កាលបរិច្ឆេទ និងតម្លៃជាគំរូប៉ុណ្ណោះ។",
    ),
    image: i === 1 ? "/images/hero.jpg" : "/images/practice.jpg",
    type: i === 1 ? ("intro" as const) : ("course" as const),
    centerId: i === 2 ? "siem-reap" : "phnom-penh",
    teacherId: "samen",
    start: ["2026-11-07", "2026-11-14", "2026-11-21"][i],
    end: ["2026-11-10", "2026-11-14", "2026-11-24"][i],
    schedule: b(
      i === 1
        ? "Saturday · 10:00–11:00 (Cambodia time)"
        : "Day 1: personal instruction by appointment. Days 2–4: 10:00–11:30 (Cambodia time).",
      i === 1
        ? "ថ្ងៃសៅរ៍ · ១០:០០–១១:០០ (ម៉ោងកម្ពុជា)"
        : "ថ្ងៃទី១៖ ការបង្រៀនផ្ទាល់តាមណាត់។ ថ្ងៃទី២–៤៖ ១០:០០–១១:៣០ (ម៉ោងកម្ពុជា)។",
    ),
    language: i === 2 ? ("en" as const) : ("both" as const),
    price: i === 1 ? 0 : 150,
    priceKhr: i === 1 ? 0 : 600000,
    capacity: i === 1 ? 20 : 8,
    status: "open" as const,
    included: b(
      "Personal guidance\nSmall-group sessions\nFollow-up support",
      "ការណែនាំផ្ទាល់ខ្លួន\nវគ្គក្រុមតូច\nការគាំទ្រតាមដាន",
    ),
    requirements: b(
      "Attend an introductory session before personal instruction. No previous meditation experience is needed.",
      "ចូលរួមវគ្គណែនាំមុនការបង្រៀនផ្ទាល់ខ្លួន។ មិនត្រូវការបទពិសោធន៍ពីមុនទេ។",
    ),
  })),
  registrations: [],
  payments: [],
  messages: [],
  settings: {
    siteName: "TM Cambodia",
    phone: "+855 10 980 840",
    email: "",
    footer: b(
      "A little stillness. A new beginning.",
      "ភាពស្ងប់បន្តិច។ ការចាប់ផ្តើមថ្មី។",
    ),
    nav: [
      "about",
      "learn",
      "courses",
      "teachers",
      "centers",
      "resources",
      "contact",
    ],
    provider: "ABA PayWay",
    environment: "Demo",
    khqr: true,
    visa: true,
    mastercard: true,
    seo: b(
      "Discover Transcendental Meditation in Cambodia.",
      "ស្វែងយល់ពីការតាំងសមាធិ TM នៅកម្ពុជា។",
    ),
  },
  media: [
    "hero.jpg",
    "practice.jpg",
    "samen.jpg",
    "cameron.jpg",
    "paul.png",
  ].map((name) => ({
    id: name,
    path: `/images/${name}`,
    alt: name.split(".")[0],
  })),
};
