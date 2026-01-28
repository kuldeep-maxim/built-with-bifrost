export interface Submission {
    id: string;
    slug: string; // URL friendly version of title
    title: string;
    subtitle: string;
    shortDescription: string;
    longDescription: string; // Markdown
    authorName: string;
    authorEmail: string;
    authorLinkedin?: string;
    website?: string;
    github?: string;
    youtube?: string;
    imageUrls: string[];
    createdAt: string;
    status: 'pending' | 'approved';
}

export type SubmissionFormData = Omit<Submission, 'id' | 'createdAt' | 'status' | 'imageUrls' | 'slug'>;
