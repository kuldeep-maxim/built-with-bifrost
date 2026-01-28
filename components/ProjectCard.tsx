import Link from 'next/link';
import { Submission } from '@/types/submission';
import { ArrowUpRight, User } from 'lucide-react';

interface ProjectCardProps {
    project: Submission;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/project/${project.slug}`} className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[var(--accent-border)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
            {/* Image Container */}
            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                {project.imageUrls && project.imageUrls.length > 0 ? (
                    <img
                        src={project.imageUrls[0].replace(
                            'https://t3.storage.dev/built-with-bifrost-images',
                            'https://built-with-bifrost-images.fly.storage.tigris.dev'
                        )}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                        <span className="text-sm font-mono uppercase tracking-widest">No Image</span>
                    </div>
                )}

                {/* Overlay Badge */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white/90 backdrop-blur-sm text-[var(--accent-text-dark)] text-xs font-medium px-2 py-1 rounded-full border border-gray-200 shadow-sm flex items-center gap-1">
                        View Details <ArrowUpRight size={10} />
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight group-hover:text-[var(--accent-text-dark)] transition-colors">
                        {project.title}
                    </h3>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {project.shortDescription}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wide">
                        <div className="p-1 bg-gray-50 rounded-full">
                            <User size={12} />
                        </div>
                        {project.authorName}
                    </div>

                    {/* Optional: Add tags or date here */}
                </div>
            </div>
        </Link>
    );
}
