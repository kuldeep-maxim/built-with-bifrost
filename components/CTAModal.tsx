'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CTAModal() {
  return (
    <div className="hidden lg:block w-full mt-auto mb-12">
      <div 
        className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#1E293B] to-[#1a2d2a] text-white group"
        style={{
          boxShadow: '0 4px 6px -1px rgba(59, 183, 143, 0.1), 0 2px 4px -1px rgba(59, 183, 143, 0.06)'
        }}
      >
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[rgba(59,183,143,0.2)] rounded-full blur-3xl hover:bg-[rgba(59,183,143,0.3)] transition-all duration-700"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[rgba(59,183,143,0.1)] rounded-full blur-2xl"></div>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px'}}></div>
        <div className="relative p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex-grow space-y-5">
            <div className="flex items-center justify-between">
              <Image
                src="https://mintcdn.com/bifrost/qFMmk8bNSnvgFYDI/media/bifrost-logo-dark.png?fit=max&auto=format&n=qFMmk8bNSnvgFYDI&q=85&s=84d264aad5f421c526dd17893e7c5739"
                alt="Bifrost Logo"
                width={120}
                height={32}
                className="h-8 w-auto"
                unoptimized
              />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                Scale with the <span className="text-[#3BB78F]">Fastest LLM Gateway</span>
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                Built for enterprise-grade reliability, governance, and scale.
              </p>
            </div>
          </div>
          <div className="w-full md:w-72 shrink-0 space-y-3 flex flex-col">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-3 font-mono text-sm border border-white/10 flex items-center justify-center">
              <span className="text-[#3BB78F] mr-2">$</span>
              <span className="text-gray-300">npx @maximhq/bifrost</span>
            </div>
            <Link 
              className="group relative flex items-center justify-center bg-[#3BB78F] hover:bg-[#2fa37d] text-white font-mono font-bold py-3 px-4 rounded-lg shadow-lg transition-all transform active:scale-95 text-sm tracking-wide uppercase border border-transparent hover:border-[rgba(59,183,143,0.5)] overflow-hidden" 
              href="https://github.com/maximhq/bifrost"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="relative z-10 flex items-center gap-3">
                Get Started
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/40 -translate-x-0.5 -translate-y-0.5"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/40 translate-x-0.5 translate-y-0.5"></div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
