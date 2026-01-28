import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Submission, SubmissionFormData } from "@/types/submission";
import { v4 as uuidv4 } from "uuid";

const S3_ENDPOINT = process.env.AWS_ENDPOINT_URL_S3;
const AWS_REGION = process.env.AWS_REGION && process.env.AWS_REGION !== "auto" ? process.env.AWS_REGION : "us-east-1";
const SUBMISSIONS_BUCKET = "built-with-bifrost-submissions";
const APPROVED_BUCKET = "built-with-bifrost-approved";
const IMAGES_BUCKET = "built-with-bifrost-images";

// Initialize S3 Client
const s3Client = new S3Client({
    region: AWS_REGION,
    endpoint: S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true, // Often needed for S3-compatible storage
});

export const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};

// Helper to convert stream to string
const streamToString = (stream: any): Promise<string> =>
    new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on("data", (chunk: any) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

export async function uploadImage(file: File): Promise<string> {
    console.log(`Starting upload for file: ${file.name}, size: ${file.size}, type: ${file.type}`);
    try {
        const extension = file.name.split(".").pop();
        const filename = `${uuidv4()}.${extension}`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const command = new PutObjectCommand({
            Bucket: IMAGES_BUCKET,
            Key: filename,
            Body: buffer,
            ContentType: file.type,
            ACL: "public-read", // Assuming standard public read, or we rely on bucket policy
        });

        console.log(`Sending PutObjectCommand to ${IMAGES_BUCKET}/${filename}`);
        await s3Client.send(command);
        console.log("Upload successful");

        // Construct URL - Adjust based on how Tigris serves public files
        // If use virtual-hosted style: https://{bucket}.{endpoint}/{key}
        // If use path style: {endpoint}/{bucket}/{key}
        // Tigris usually supports standard S3 URLs. Let's assume path style as safe default or specific Tigris format.
        // Actually, usually it is https://{bucket}.{endpoint_domain}/{key} or similar.
        // For safety given "S3 Endpoint" (https://t3.storage.dev), let's assume `https://{bucket}.t3.storage.dev/{key}` isn't guaranteed if endpoint is customized.
        // Best bet often `endpoint/bucket/key` if forcePathStyle is true.

        // Let's rely on constructing it.
        // Tigris public bucket URL format
        return `https://${IMAGES_BUCKET}.fly.storage.tigris.dev/${filename}`;
    } catch (error) {
        console.error("Error in uploadImage:", error);
        throw error;
    }
}

export async function submitProject(formData: SubmissionFormData, images: File[]) {
    console.log("submitProject calling uploadImage for", images.length, "images");
    const id = uuidv4();
    const slug = slugify(formData.title);

    // Upload images
    const imageUrls = await Promise.all(images.map((img) => uploadImage(img)));
    console.log("Images uploaded, URLs:", imageUrls);

    const submission: Submission = {
        id,
        slug, // functionality to handle duplicate slugs could be added here
        ...formData,
        imageUrls,
        createdAt: new Date().toISOString(),
        status: "pending",
    };

    const command = new PutObjectCommand({
        Bucket: SUBMISSIONS_BUCKET,
        Key: `${slug}.json`, // Using slug as key for clearer filenames
        Body: JSON.stringify(submission, null, 2),
        ContentType: "application/json",
    });

    console.log(`Saving submission JSON to ${SUBMISSIONS_BUCKET}/${slug}.json`);
    await s3Client.send(command);
    console.log("Submission JSON saved");
    return submission;
}

export async function getApprovedSubmissions(): Promise<Submission[]> {
    const command = new ListObjectsV2Command({
        Bucket: APPROVED_BUCKET,
    });

    try {
        const data = await s3Client.send(command);
        if (!data.Contents) return [];

        const submissions = await Promise.all(
            data.Contents.map(async (item) => {
                if (!item.Key || !item.Key.endsWith(".json")) return null;
                try {
                    const getCommand = new GetObjectCommand({
                        Bucket: APPROVED_BUCKET,
                        Key: item.Key,
                    });
                    const response = await s3Client.send(getCommand);
                    const body = await streamToString(response.Body);
                    const submission = JSON.parse(body) as Submission;

                    // Ensure slug matches the filename so links work correctly
                    const slugFromKey = item.Key.replace(/\.json$/, "");
                    return { ...submission, slug: slugFromKey };
                } catch (e) {
                    console.error(`Error reading ${item.Key}`, e);
                    return null;
                }
            })
        );

        return submissions.filter((s): s is Submission => s !== null);
    } catch (error) {
        console.error("Error fetching approved submissions:", error);
        return [];
    }
}

export async function getProjectBySlug(slug: string): Promise<Submission | null> {
    try {
        const command = new GetObjectCommand({
            Bucket: APPROVED_BUCKET,
            Key: `${slug}.json`,
        });

        try {
            const response = await s3Client.send(command);
            const body = await streamToString(response.Body);
            return JSON.parse(body) as Submission;
        } catch (e: any) {
            if (e.name === 'NoSuchKey') return null;
            throw e;
        }
    } catch (error) {
        console.error(`Error fetching project by slug ${slug}:`, error);
        return null;
    }
}
