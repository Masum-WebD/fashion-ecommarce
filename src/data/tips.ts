export interface Tip {
    id: string;
    title: string;
    category: string;
    date: string;
    author: string;
    image?: string;
    excerpt: string;
    content: string;
    tags: string[];
}

export const tips: Tip[] = [
    {
        id: "organic-fertilizer",
        title: "জৈব সার তৈরির সহজ পদ্ধতি",
        category: "গাছের যত্ন",
        date: "Jan 12, 2025",
        author: "Siraj Tech Expert",
        excerpt: "বাড়িতে বসেই কীভাবে রান্নাঘরের বর্জ্য থেকে উন্নত মানের জৈব সার তৈরি করবেন তা জানুন।",
        content: `
      <p>জৈব সার বা কম্পোস্ট সার গাছের জন্য অত্যন্ত উপকারী। এটি মাটির উর্বরতা বৃদ্ধি করে এবং গাছের বৃদ্ধিতে সাহায্য করে। বাড়িতে বসেই আপনি খুব সহজে জৈব সার তৈরি করতে পারেন।</p>
      
      <h3>উপকরণসমূহ:</h3>
      <ul>
        <li>রান্নাঘরের পচনশীল বর্জ্য (সবজির খোসা, ফলের অংশ ইত্যাদি)</li>
        <li>শুকনো পাতা বা খড়</li>
        <li>একটি বড় পাত্র বা গর্ত</li>
        <li>সামান্য পানি</li>
      </ul>

      <h3>ধাপসমূহ:</h3>
      <ol>
        <li>প্রথমেই একটি বড় পাত্র বা গর্ত নির্বাচন করুন যেখানে বাতাস চলাচলের ব্যবস্থা আছে।</li>
        <li>পাত্রের নিচে ৪-৫ ইঞ্চি শুকনো পাতা বা খড়ের একটি স্তর তৈরি করুন।</li>
        <li>এর উপরে রান্নাঘরের পচনশীল বর্জ্য দিন।</li>
        <li>মাঝে মাঝে হালকা পানি ছিটিয়ে আর্দ্রতা বজায় রাখুন।</li>
        <li>প্রতি সপ্তাহে একবার মিশ্রণটি ওলটপালট করে দিন।</li>
        <li>২-৩ মাসের মধ্যে এটি কালো রঙের ঝুরঝুরে সারে পরিণত হবে।</li>
      </ol>
      
      <p>এই সার সরাসরি গাছের গোড়ায় ব্যবহার করা যায়। এটি কোনো রাসায়নিক পার্শ্বপ্রতিক্রিয়া ছাড়া গাছের পুষ্টি নিশ্চিত করে।</p>
    `,
        tags: ["জৈব সার", "বাগান", "গাছের যত্ন"],
        image: "https://images.unsplash.com/photo-1599819177626-b50f9dd21c9b?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "rooftop-soil-mix",
        title: "ছাদ বাগানে মাটির সঠিক মিশ্রণ",
        category: "মাটি প্রস্তুতি",
        date: "Jan 05, 2025",
        author: "Agronomist Team",
        excerpt: "ছাদ বাগানের গাছের জন্য আদর্শ মাটি তৈরির গোপন সূত্র এবং উপকরণ সমূহের সঠিক অনুপাত।",
        content: `
      <p>ছাদ বাগানের সাফল্যের মূল চাবিকাঠি হলো সঠিক মাটি নির্বাচন ও মিশ্রণ। সাধারণ মাটির তুলনায় ছাদের টবের মাটি হতে হয় হালকা এবং পুষ্টিসমৃদ্ধ।</p>
      
      <h3>আদর্শ মিশ্রণের অনুপাত:</h3>
      <ul>
        <li>বেলে দোঁআশ মাটি: ৫০%</li>
        <li>জৈব সার বা কম্পোস্ট: ৩০%</li>
        <li>কোকোপিট: ১০%</li>
        <li>নদীর লাল বালু: ৫%</li>
        <li>হাড়ের গুঁড়ো ও নিম খৈল: ৫%</li>
      </ul>

      <h3>প্রস্তুত প্রণালী:</h3>
      <p>সবগুলো উপকরণ এক সাথে মিশিয়ে অন্তত ৭-১০ দিন ছায়াযুক্ত স্থানে রেখে দিন। এর পরে এই মাটি টবে ব্যবহারের জন্য উপযুক্ত হবে।</p>
    `,
        tags: ["ছাদ বাগান", "মাটি প্রস্তুতি", "চাষাবাদ"],
        image: "https://images.unsplash.com/photo-1416870262648-2513df5e3b91?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "lemon-tree-fruiting",
        title: "টবে লেবু গাছে ফলন বৃদ্ধির উপায়",
        category: "ফলন",
        date: "Dec 28, 2024",
        author: "Garden Expert",
        excerpt: "আপনার লেবু গাছে ফুল ও ফল আসছে না? জেনে নিন কেন এমন হয় এবং কীভাবে ফলন বাড়াবেন।",
        content: `
      <p>লেবু গাছ অনেকের খুব প্রিয় হলেও টবে এর ফলন পাওয়া মাঝে মাঝে চ্যালেঞ্জিং হয়ে দাঁড়ায়। সঠিক যত্ন নিলে আপনিও সারা বছর লেবু পেতে পারেন।</p>
      
      <h3>যত্নের টিপস:</h3>
      <ul>
        <li>সূর্যালোক: দিনে অন্তত ৫-৬ ঘণ্টা কড়া রোদ লাগে এমন জায়গায় টবটি রাখুন।</li>
        <li>পানি: টবের উপরের মাটি শুকিয়ে গেলে তবেই পানি দিন। বেশি পানিতে ফুল ঝরে যেতে পারে।</li>
        <li>ছাঁটাই: বছরে একবার বর্ষার শেষে ডালপালা ছাঁটাই করুন।</li>
        <li>সার: ৩ মাস অন্তর মাস্টার্ড কেক বা সরিষার খৈল পচা পানি ব্যবহার করুন।</li>
      </ul>
    `,
        tags: ["লেবু চাষ", "ফলন বৃদ্ধি", "টবের গাছ"],
        image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "winter-vegetable-routine",
        title: "শীতকালীন সবজি চাষের রুটিন",
        category: "মৌসুমী চাষ",
        date: "Dec 15, 2024",
        author: "Agro Expert",
        excerpt: "শীতকালে কী কী সবজি চাষ করবেন এবং কীভাবে সেগুলোর যত্ন নেবেন তার বিস্তারিত গাইড।",
        content: `
      <p>শীতকাল বাংলাদেশে সবজি চাষের শ্রেষ্ঠ সময়। পালং শাক, ফুলকপি, বাঁধাকপি, শিম ইত্যাদি চাষের জন্য সঠিক পরিকল্পনা প্রয়োজন।</p>
      
      <h3>রোপন ক্যালেন্ডার:</h3>
      <ul>
        <li>অক্টোবর-নভেম্বর: বীজ বপন।</li>
        <li>ডিসেম্বর: চারা রোপন ও নিড়ানি।</li>
        <li>জানুয়ারি-ফেব্রুয়ারি: ফসল সংগ্রহ।</li>
      </ul>
    `,
        tags: ["শীতের সবজি", "চাষ রুটিন", "কৃষি"],
        image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "neem-oil-pest-control",
        title: "কীটপতঙ্গ দমনে নিম তেলের ব্যবহার",
        category: "রোগবালাই দমন",
        date: "Dec 10, 2024",
        author: "Siraj Tech Expert",
        excerpt: "বিষমুক্ত সবজি পেতে ঘরোয়া পদ্ধতিতে কীভাবে নিম তেলের কীটনাশক তৈরি ও প্রয়োগ করবেন।",
        content: `
      <p>নিরাপদ খাদ্য নিশ্চিত করতে রাসায়নিকের পরিবর্তে জৈব কীটনাশক হিসেবে নিম তেল অপ্রতিদ্বন্দ্বী।</p>
      
      <h3>কীভাবে তৈরি করবেন:</h3>
      <p>১ লিটার পানিতে ৫ মিলি নিম তেল এবং ৩-৪ ফোঁটা লিকুইড সোপ মিশিয়ে ভালো করে ঝাকিয়ে নিন। এটি বিকেলে স্প্রে করুন।</p>
    `,
        tags: ["নিম তেল", "জৈব কীটনাশক", "পোকামাকড় দমন"],
        image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "drip-irrigation-install",
        title: "ড্রিপ ইরিগেশন কীভাবে ইনস্টল করবেন",
        category: "প্রযুক্তি",
        date: "Dec 01, 2024",
        author: "Agro Tech Specialist",
        excerpt: "আধুনিক সেচ ব্যবস্থা বা ড্রিপ ইরিগেশন পদ্ধতিতে পানি সাশ্রয় করে কীভাবে বাগান করবেন।",
        content: `
      <p>ড্রিপ ইরিগেশন মূলত গাছের গোড়ায় ফোঁটা ফোঁটা পানি দেওয়ার পদ্ধতি। এতে পানি অপচয় রোধ হয় এবং গাছ সঠিক আর্দ্রতা পায়।</p>
    `,
        tags: ["ড্রিপ ইরিগেশন", "আধুনিক কৃষি", "সেচ"],
        image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800"
    }
];

export const civilTips: Tip[] = [
    {
        id: "road-base-stabilization",
        title: "Road Base stabilization",
        category: "Civil Engineering",
        date: "Feb 10, 2025",
        author: "Civil Engineer",
        excerpt: "How geotextiles prevent soil mixing and increase load capacity in road construction.",
        content: "<p>Geotextiles are used for separation, filtration, and reinforcement. In road construction, they prevent the mixing of the subgrade soil and the aggregate base...</p>",
        tags: ["Geotextile", "Construction", "Roads"],
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "retaining-wall-hacks",
        title: "Retaining Wall hacks",
        category: "Civil Engineering",
        date: "Feb 05, 2025",
        author: "Site Supervisor",
        excerpt: "Using geo-bags for natural-looking, durable retaining structures that prevent erosion.",
        content: "<p>Geo-bags offer a flexible and cost-effective alternative to traditional concrete retaining walls. They are breathable and allow for vegetation growth...</p>",
        tags: ["Geo-bags", "Erosion Control", "Walls"],
        image: "https://images.unsplash.com/photo-1590069223402-60199017606e?auto=format&fit=crop&q=80&w=800"
    }
];

export const decorTips: Tip[] = [
    {
        id: "vertical-indoor-gardens",
        title: "Vertical Indoor Gardens",
        category: "Home Decor",
        date: "Mar 01, 2025",
        author: "Interior Designer",
        excerpt: "Turn your balcony wall into a lush green haven with grow bags and vertical frames.",
        content: "<p>Vertical gardening is the perfect solution for urban homes with limited space. Use our specialized grow bags to create a stunning living wall...</p>",
        tags: ["Vertical Garden", "Balcony", "Decor"],
        image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "sustainable-coir-decor",
        title: "Sustainable Coir Decor",
        category: "Home Decor",
        date: "Feb 20, 2025",
        author: "Minimalist Designer",
        excerpt: "Using natural coir products for minimalist, eco-friendly home styling and plant care.",
        content: "<p>Coir products are not only sustainable but also add a touch of natural warmth to your interiors. From coir pots to rugs, the options are endless...</p>",
        tags: ["Coir", "Eco-friendly", "Home Styles"],
        image: "https://images.unsplash.com/photo-1597047084897-512cb14b0e50?auto=format&fit=crop&q=80&w=800"
    }
];
