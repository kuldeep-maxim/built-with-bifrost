"use client";

import { useState } from "react";
import { createSubmission } from "@/app/actions";
import { Upload, X, Loader2, FileText, Image as ImageIcon, Eye, Edit2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
);

export default function SubmissionForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    // isPreview is no longer needed with the new editor which has built-in preview
    // const [isPreview, setIsPreview] = useState(false); 
    const [longDescription, setLongDescription] = useState("");
    const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    async function onSubmit(formData: FormData) {
        setIsSubmitting(true);
        setMessage(null);

        // Append files manually since we managed them in state
        if (files.length === 0) {
            setIsSubmitting(false);
            setMessage({ type: "error", text: "Please upload at least one screenshot." });
            return;
        }

        files.forEach((file) => {
            formData.append("images", file);
        });

        // Ensure long description is in formData (controlled input)
        formData.set("longDescription", longDescription);

        const result = await createSubmission(formData);

        if (result.success) {
            setMessage({ type: "success", text: result.message! });
            setFiles([]);
            setLongDescription("");
            // Reset form via DOM if needed or just reload/redirect
            // (formData is reset on next render if using state for all fields, but here we used native form except for controlled inputs)
        } else {
            setMessage({ type: "error", text: result.message! });
        }
        setIsSubmitting(false);
    }

    return (
        <form action={onSubmit} className="space-y-8 max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100">

            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            {/* Project details */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-4">Project Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Project Title *</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Bifrost Analytics"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtitle *</label>
                        <input
                            type="text"
                            name="subtitle"
                            id="subtitle"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Analytics dashboard for modern teams"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">Short Description (max 150 words) *</label>
                    <textarea
                        name="shortDescription"
                        id="shortDescription"
                        required
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Brief overview of your project..."
                    />
                </div>

                <div className="space-y-2" data-color-mode="light">
                    <div className="flex items-center justify-between">
                        <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700">Long Description (&lt;2000 words, rich markdown supported) *</label>
                        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                            <button
                                type="button"
                                onClick={() => setPreviewMode('edit')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${previewMode === 'edit'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Edit2 size={12} className="inline mr-1" /> Write
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreviewMode('preview')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${previewMode === 'preview'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Eye size={12} className="inline mr-1" /> Preview
                            </button>
                        </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <MDEditor
                            value={longDescription}
                            onChange={(val) => setLongDescription(val || '')}
                            height={400}
                            preview={previewMode}
                            hideToolbar={true}
                            style={{ borderRadius: '0.5rem', overflow: 'hidden' }}
                            textareaProps={{
                                placeholder: "# Introduction\n\nDescribe your project in detail..."
                            }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 text-right">~2000 words recommended</p>
                </div>

            </div>

            {/* Images */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-4">Screenshots / Images</h2>
                <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-[var(--accent)] bg-[var(--accent-light)]' : 'border-gray-200 hover:border-[var(--accent)]'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                        <div className="p-3 bg-gray-50 rounded-full text-gray-400">
                            <ImageIcon size={24} />
                        </div>
                        <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max 5MB)</p>
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {files.map((file, idx) => (
                            <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${idx}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFile(idx)}
                                    className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Author Details */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-4">Author Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">Author Name *</label>
                        <input
                            type="text"
                            name="authorName"
                            id="authorName"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-700">Author Email *</label>
                        <input
                            type="email"
                            name="authorEmail"
                            id="authorEmail"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="authorLinkedin" className="block text-sm font-medium text-gray-700">LinkedIn Profile (Optional)</label>
                        <input
                            type="url"
                            name="authorLinkedin"
                            id="authorLinkedin"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">Project Website (Optional)</label>
                        <input
                            type="url"
                            name="website"
                            id="website"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="github" className="block text-sm font-medium text-gray-700">GitHub Repo (Optional)</label>
                        <input
                            type="url"
                            name="github"
                            id="github"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">YouTube Video Link (Optional)</label>
                        <input
                            type="url"
                            name="youtube"
                            id="youtube"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-3 bg-[var(--accent)] text-white font-medium rounded-lg hover:bg-[var(--accent-dark)] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm uppercase tracking-wide"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={18} /> Submitting...
                        </>
                    ) : (
                        'Submit Project'
                    )}
                </button>
            </div>
        </form>
    );
}
