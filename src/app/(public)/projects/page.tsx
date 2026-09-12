import { Metadata } from 'next';
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Projects | Siraj Tech",
  description: "আমাদের করা বিভিন্ন বাড়ির ডিজাইন, টিন শেড এবং প্রজেক্টের ধারণা পেতে নিচের তালিকা দেখুন।",
  alternates: {
    canonical: "/projects",
  }
};

const homeDesignImg = "/assets/home-design.jpg";
const architecturalModelImg = "/architectural-model.png";
const tinShedCollage = "/assets/tin-shed-designs.png";
const industrialCollage = "/assets/industrial-designs.png";
const oneStoreyCollage = "/assets/one-storey-designs.png";
const twoStoreyCollage = "/assets/two-storey-designs.png";

const projectsData = [
    { title: "L shaped 5 bedroom house plans | এল শেপ ঘরের নকশা ও খরচ", excerpt: "L shaped 5 bedroom house plans | এল শেপ ঘরের নকশা ও খরচ Lshaped [...]", comments: 0, image: tinShedCollage },
    { title: "2 bhk house plan | ২ রুমের টিনের বাড়ির ডিজাইন", excerpt: "2 bhk house plan | ২ রুমের টিনের বাড়ির ডিজাইন 2bhk house plan [...]", comments: 0, image: oneStoreyCollage },
    { title: "Cottage house plans | কার পার্কিং সহ ৩ রুমের ঘরের নকশা ও খরচ", excerpt: "Cottage house plans | কার পার্কিং সহ ৩ রুমের ঘরের নকশা ও খরচ Cottage house [...]", comments: 0, image: homeDesignImg },
    { title: "U Shaped House plans in Bangladesh | ইউ আকৃতির কটেজ বাড়ির ডিজাইন", excerpt: "U Shaped House plans in Bangladesh | ইউ আকৃতির কটেজ বাড়ির ডিজাইন U Shaped [...]", comments: 0, image: twoStoreyCollage },
    { title: "Tin shed house design and plans | কটেজ টাইপ টিনের ঘরের ডিজাইন ও খরচ", excerpt: "Tin shed house design and plans | কটেজ টাইপ টিনের ঘরের ডিজাইন ও খরচ Tin [...]", comments: 1, image: tinShedCollage },
    { title: "4 bedroom house plans in Bangladesh | চার রুমের বাড়ির ডিজাইন", excerpt: "4 bedroom house plans in Bangladesh | চার রুমের বাড়ির ডিজাইন 4 bedroom house plans [...]", comments: 0, image: architecturalModelImg },
    { title: "3 Bedroom Cottage House Plan | টিনের ঘরের ডিজাইন", excerpt: "3 Bedroom Cottage House Plan | ৩ বেডরুম টিনের ঘরের ডিজাইন 3 bedroom cottage house [...]", comments: 0, image: industrialCollage },
    { title: "2 Bedroom cottage house plans | দুই বেডরুমের টিনের বাড়ির ডিজাইন", excerpt: "2 bedroom cottage house plans | দুই বেডরুমের টিনের বাড়ির ডিজাইন 2 bedroom cottage house [...]", comments: 0, image: homeDesignImg },
    { title: "Tin shed house design in BD – ইউ শেপ টিনের ঘরের ডিজাইন", excerpt: "Tin shed house design in BD – ইউ শেপ টিনের ঘরের ডিজাইন Tin shed house [...]", comments: 1, image: tinShedCollage },
    { title: "Tin shed house plans – টালি টিন দিয়ে আধুনিক বাড়ির নকশা", excerpt: "Tin shed house plans – টালি টিন দিয়ে আধুনিক বাড়ির নকশা Tin shed house plans [...]", comments: 0, image: oneStoreyCollage },
    { title: "Tiny house design – গ্রামের আধুনিক টিনশেড বাড়ির ডিজাইন", excerpt: "Tiny house design – গ্রামের আধুনিক টিনশেড বাড়ির ডিজাইন Tiny house design - টিনশেড বাড়ির [...]", comments: 1, image: industrialCollage },
    { title: "Small house plans in Bangladesh – ২ রুমের টিনের ঘরের ডিজাইন ও খরচ", excerpt: "Small house plans in Bangladesh – ২ রুমের টিনের ঘরের ডিজাইন ও খরচ Small house [...]", comments: 0, image: twoStoreyCollage }
];

export default function Projects() {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <main className="flex-grow py-12 md:py-16">
                <div className="container-main max-w-6xl">
                    <div className="text-center mb-10 md:mb-14">
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">সমস্ত ডিজাইন ও প্রজেক্ট সমূহ</h1>
                        <p className="text-gray-500 max-w-2xl mx-auto font-medium">
                            আমাদের করা বিভিন্ন বাড়ির ডিজাইন, টিন শেড এবং প্রজেক্টের ধারণা পেতে নিচের তালিকা দেখুন।
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                        {projectsData.map((project, idx) => (
                            <Link href="/contact" key={idx} className="group flex flex-col items-center text-center mx-auto w-full max-w-[350px]">
                                <div className="aspect-[4/3] w-full overflow-hidden mb-5 bg-gray-100 relative">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h2 className="text-[15px] font-bold text-gray-900 leading-snug mb-2 group-hover:text-primary transition-colors hover:underline px-2">
                                    {project.title}
                                </h2>
                                <p className="text-xs text-gray-500 mb-3 px-2 line-clamp-2 leading-relaxed">
                                    {project.excerpt}
                                </p>
                                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-100 pt-2 w-12 text-center mt-auto">
                                    {project.comments} {project.comments === 1 ? 'COMMENT' : 'COMMENTS'}
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-20 flex justify-center items-center gap-2">
                        <button className="w-8 h-8 rounded-full bg-[#8B2E3E] text-white flex items-center justify-center text-[13px] font-bold shadow-sm">
                            1
                        </button>
                        {[2, 3, 4, 5].map((num) => (
                            <button key={num} className="w-8 h-8 rounded-full bg-transparent border-[1.5px] border-gray-600 text-gray-800 hover:border-[#8B2E3E] hover:text-[#8B2E3E] flex items-center justify-center text-[13px] font-bold transition-colors">
                                {num}
                            </button>
                        ))}
                        <button className="w-8 h-8 rounded-full bg-transparent border-[1.5px] border-gray-600 text-gray-800 hover:border-[#8B2E3E] flex items-center justify-center text-sm transition-colors font-black">
                            &gt;
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
