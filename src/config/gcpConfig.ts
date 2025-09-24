import { VideoIntelligenceServiceClient } from "@google-cloud/video-intelligence";

export const BUCKET_NAME = "gbt-test-bucket"; // Replace with your GCS bucket name
const projectId = "gbt-471500"; // Replace with your Google Cloud project ID
const keyFilename = "path/to/your/service-account-file.json"; // Replace with the path to your service account key file

export const client = new VideoIntelligenceServiceClient();
