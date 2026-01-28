'use server';

import { submitProject } from "@/lib/storage";
import { SubmissionFormData } from "@/types/submission";

export async function createSubmission(formData: FormData) {
    console.log("createSubmission started");
    try {
        const images = formData.getAll('images') as File[];
        console.log("Images received:", images.length);

        // Basic validation - check if specific fields are present
        const title = formData.get('title') as string;
        if (!title) {
            return { success: false, message: "Title is required" };
        }

        const data: SubmissionFormData = {
            title: formData.get('title') as string,
            subtitle: formData.get('subtitle') as string,
            shortDescription: formData.get('shortDescription') as string,
            longDescription: formData.get('longDescription') as string,
            authorName: formData.get('authorName') as string,
            authorEmail: formData.get('authorEmail') as string,
            authorLinkedin: formData.get('authorLinkedin') as string || undefined,
            website: formData.get('website') as string || undefined,
            github: formData.get('github') as string || undefined,
            youtube: formData.get('youtube') as string || undefined,
        };

        console.log("Submitting project data...");

        await submitProject(data, images);
        console.log("Project submitted successfully");
        return { success: true, message: "Project submitted successfully!" };
    } catch (error: any) {
        console.error("Submission error details:", error);
        // Check if it's an S3 error
        if (error?.$metadata) {
            console.error("AWS Error Metadata:", error.$metadata);
        }
        return { success: false, message: `Failed to submit project: ${error.message || "Unknown error"}` };
    }
}
