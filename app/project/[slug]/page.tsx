import { getProjectBySlug } from "@/lib/storage";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { User, Linkedin, Globe, Github, Youtube, ArrowLeft, Calendar } from "lucide-react";
import { Metadata } from "next";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

// Force dynamic to ensure we get fresh data
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    return {
        title: `${project.title} - Built with Bifrost`,
        description: project.shortDescription,
        openGraph: {
            title: project.title,
            description: project.shortDescription,
            images: project.imageUrls ? [project.imageUrls[0]] : [],
        }
    };
}

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--accent-text-dark)] mb-8 transition-colors">
                        <ArrowLeft size={16} /> Back to Showcase
                    </Link>

                    <div className="max-w-4xl">
                        <span className="provider-badge mb-4">
                            [ FEATURED PROJECT ]
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
                            {project.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed mb-6">
                            {project.subtitle}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-mono uppercase tracking-wide">
                            <div className="flex items-center gap-2">
                                <User size={14} /> {project.authorName}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} /> {new Date(project.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-12 order-last lg:order-none">
                        {/* Images Gallery */}
                        {project.imageUrls && project.imageUrls.length > 0 && (
                            <div className="space-y-8">
                                {project.imageUrls.map((url, idx) => (
                                    <div key={idx} className="rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                                        <img
                                            src={url.replace(
                                                'https://t3.storage.dev/built-with-bifrost-images',
                                                'https://built-with-bifrost-images.fly.storage.tigris.dev'
                                            )}
                                            alt={`${project.title} Screenshot ${idx + 1}`}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="prose prose-lg max-w-none prose-headings:font-medium prose-a:text-[var(--accent-text)] prose-img:rounded-xl">
                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                {project.longDescription}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 order-first lg:order-none">
                        <div className="sticky top-24 space-y-8">
                            {/* Links */}
                            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Project Links</h3>
                                <div className="space-y-3">
                                    {project.website && (
                                        <a href={project.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-[var(--accent-text-dark)] transition-colors p-2 hover:bg-gray-50 rounded-lg group">
                                            <div className="p-2 bg-gray-100 group-hover:bg-white rounded-full transition-colors">
                                                <Globe size={18} />
                                            </div>
                                            <span className="font-medium">Visit Website</span>
                                        </a>
                                    )}
                                    {project.github && (
                                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-[var(--accent-text-dark)] transition-colors p-2 hover:bg-gray-50 rounded-lg group">
                                            <div className="p-2 bg-gray-100 group-hover:bg-white rounded-full transition-colors">
                                                <Github size={18} />
                                            </div>
                                            <span className="font-medium">GitHub Repo</span>
                                        </a>
                                    )}
                                    {project.youtube && (
                                        <a href={project.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-[var(--accent-text-dark)] transition-colors p-2 hover:bg-gray-50 rounded-lg group">
                                            <div className="p-2 bg-gray-100 group-hover:bg-white rounded-full transition-colors">
                                                <Youtube size={18} />
                                            </div>
                                            <span className="font-medium">Watch Video</span>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Author */}
                            <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Creator</h3>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-lg">
                                        {project.authorName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{project.authorName}</div>
                                        {project.authorEmail && <div className="text-xs text-gray-500">{project.authorEmail}</div>}
                                    </div>
                                </div>

                                {project.authorLinkedin && (
                                    <a href={project.authorLinkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#0077b5] hover:underline">
                                        <Linkedin size={14} /> LinkedIn Profile
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
