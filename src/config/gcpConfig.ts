import { VideoIntelligenceServiceClient } from "@google-cloud/video-intelligence";
import { protos } from "@google-cloud/video-intelligence";

export const FEATURE = protos.google.cloud.videointelligence.v1.Feature;
export type Feature = protos.google.cloud.videointelligence.v1.Feature;

export const FEATURES: protos.google.cloud.videointelligence.v1.Feature[] = [
  FEATURE.LABEL_DETECTION,
  FEATURE.SHOT_CHANGE_DETECTION,
  FEATURE.TEXT_DETECTION,
  FEATURE.SPEECH_TRANSCRIPTION,
  FEATURE.OBJECT_TRACKING,
  FEATURE.PERSON_DETECTION,
  FEATURE.FACE_DETECTION,
];

export const BUCKET_NAME = "gbt-test-bucket"; // Replace with your GCS bucket name
export const OUTPUT_DIRECTORY = "annotation-data";

const projectId = "gbt-471500"; // Replace with your Google Cloud project ID
const keyFilename = "path/to/your/service-account-file.json"; // Replace with the path to your service account key file

export const client = new VideoIntelligenceServiceClient();
