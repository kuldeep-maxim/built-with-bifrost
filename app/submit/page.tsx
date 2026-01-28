import SubmissionForm from "@/components/SubmissionForm";
import { SiteConfig } from "@/lib/site.config";

export const metadata = {
    title: `Submit Project - ${SiteConfig.siteName}`,
    description: "Submit your Bifrost project to the showcase.",
};

export default function SubmitPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="provider-badge mb-4">
                        [ CALL FOR SUBMISSIONS ]
                    </span>
                    <h1 className="text-3xl md:text-5xl font-medium text-gray-900 mb-4 tracking-tight">
                        Submit your Project
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Built something amazing with Bifrost? Share it with the community.
                        Approved projects will be featured in our showcase.
                    </p>
                </div>

                <SubmissionForm />
            </div>
        </div>
    );
}
