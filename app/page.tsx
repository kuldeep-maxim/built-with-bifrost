import { SiteConfig } from '@/lib/site.config';
import Link from 'next/link';
import { getApprovedSubmissions } from '@/lib/storage';
import ProjectCard from '@/components/ProjectCard';
import { Plus } from 'lucide-react';

// Force dynamic rendering to ensure we get the latest submissions
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const projects = await getApprovedSubmissions();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center relative z-10">
            <span className="provider-badge mb-6">
              [ BUILT WITH BIFROST ]
            </span>
            <h1 className="text-3xl md:text-5xl font-medium text-gray-900 mb-6 leading-[1.1] tracking-tight text-center">
              Innovative Projects <br className="hidden md:block" /> Built With Bifrost
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
              Discover amazing projects, tools, and applications created by the community using the Bifrost AI infrastructure.
            </p>

            <div className="flex justify-center gap-4">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white text-sm font-medium rounded-none hover:bg-[var(--accent-dark)] transition-all shadow-sm hover:shadow-md uppercase tracking-wide"
              >
                <Plus size={16} /> Submit Project
              </Link>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-light)] to-transparent rounded-full blur-3xl" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20">
        <div className="text-center mb-12">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium font-mono mb-2">[ COMMUNITY PROJECTS ]</p>
          <div className="h-px w-20 bg-[var(--accent)] mx-auto opacity-30"></div>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 mb-4">No projects have been approved yet.</p>
            <Link href="/submit" className="text-[var(--accent-text-dark)] hover:underline text-sm font-medium uppercase tracking-wide">
              Be the first to submit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
