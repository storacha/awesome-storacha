"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, CheckCircle, XCircle, Link, Copy, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { uploadFileToStoracha } from "../lib/storacha";
import { SecretStorage } from "../lib/secretRecord";

export default function UploaderBox() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      toast.error("Invalid file type. Please upload a ZIP file.");
      return;
    }
    const file = acceptedFiles[0];
    if (file.type !== "application/zip" && !file.name.endsWith(".zip") &&
      file.type !== "application/pdf" && !file.name.endsWith(".pdf") &&
      file.type !== "application/msword" && !file.name.endsWith(".doc") &&
      file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && !file.name.endsWith(".docx")) {
      toast.error("Invalid file type. Please upload a ZIP, PDF, or DOC/DOCX file.");
      return;
    }
    setUploadedFile(file);
    setUploadResult(null);
    setUploadProgress(0);
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/zip": [".zip"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 2,
  });

  const handleUpload = async () => {
    if (!uploadedFile) {
      toast.error("Please select a file first.");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadFileToStoracha(uploadedFile);
      setUploading(false);
      setUploadResult(result);
      setUploadProgress(100);
      SecretStorage.addSecret({
        secret: result.filename,
        shareLink: result.url,
        usageLimit: (result.size / 1024 / 1024).toFixed(2) + " MB",
        usage: result.type,
        recipient: localStorage.getItem("agentDID") || "XRachaX",
        expiry: new Date(Date.now() + (60 * 60 * 24)).toISOString(),
        cid: result.cid
      })
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
      setUploadResult(null);
      setUploadProgress(0);
    } finally {
      setUploading(false);
      if (uploadResult) {
        setTimeout(() => {
          setUploadProgress(0);
        }, 2000);
      }
    }
  };

  const copyCIDToClipboard = () => {
    if (uploadResult?.url) {
      navigator.clipboard.writeText(uploadResult.url);
      setCopied(true);
      toast.success("Link copied to clipboard!", { position: "bottom-center" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-2xl mx-auto my-10 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Upload a File
      </h2>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 mb-6
          ${isDragActive
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
            : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
          }`}
      >
        <input {...getInputProps()} />
        <UploadCloud
          size={48}
          className="mx-auto text-gray-400 dark:text-gray-400 mb-3"
        />
        {isDragActive ? (
          <p className="text-gray-700 dark:text-gray-300">
            Drop the file here...
          </p>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            Drag 'n' drop a ZIP/pdf/doc/docx file here, or click to select one
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          (Max 1 file)
        </p>
      </div>

      {uploadedFile && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText size={20} className="text-indigo-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {uploadedFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={() => setUploadedFile(null)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            aria-label="Remove file"
          >
            <XCircle size={20} />
          </button>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!uploadedFile || uploading}
        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors duration-200 mb-6 flex items-center justify-center space-x-2 ${!uploadedFile || uploading
          ? "bg-indigo-400 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          }`}
      >
        {uploading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span>Uploading... ({uploadProgress.toFixed(0)}%)</span>
          </>
        ) : (
          "Upload File"
        )}
      </button>

      {uploadResult && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
            <CheckCircle size={24} className="mr-2" /> Upload Success!
          </h3>
          <div className="flex items-center mb-2">
            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">CID:</p>
            <span className="ml-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-md break-all text-sm text-gray-800 dark:text-gray-200 flex-grow relative">
              {uploadResult.cid}
              <button
                onClick={copyCIDToClipboard}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors duration-200 ${copied
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300"
                  }`}
                aria-label="Copy URL"
              >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              </button>
            </span>
          </div>
          <p className="text-md text-gray-800 dark:text-gray-200 flex items-center">
            <Link size={16} className="mr-1 text-indigo-500" /> IPFS Link:
            <a
              href={uploadResult.url}
              target="_blank"
              className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline break-all"
            >
              {uploadResult.url}
            </a>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Uploaded at: {new Date(uploadResult.uploadedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
