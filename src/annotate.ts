import path from "node:path";
import { client, BUCKET_NAME } from "./config/gcpConfig.js";
import { Storage } from "@google-cloud/storage";
import {
  VideoIntelligenceServiceClient,
  protos,
} from "@google-cloud/video-intelligence";
import { IterableElement } from "type-fest";
import { saveAnnotatedVideo } from "./utils/fileHandler.js";
type Feature = IterableElement<
  Parameters<VideoIntelligenceServiceClient["annotateVideo"]>[0]["features"]
>;

const LABEL_DETECTION = "LABEL_DETECTION";

async function annotateVideos(): Promise<void> {
  const storage = new Storage();

  // List all files in the bucket
  const [files] = await storage.bucket(BUCKET_NAME).getFiles();

  for (const file of files) {
    if (!file.name.match(/\.(mp4|mov|avi|mkv)$/i)) {
      // Skip non-video files
      console.log(`Skipping non-video file: ${file.name}`);
      continue;
    }

    const inputUri = `gs://${BUCKET_NAME}/${file.name}`;
    console.log(`Annotating video: ${inputUri}`);

    const [operation] = await client.annotateVideo({
      inputUri: inputUri,
      features: [LABEL_DETECTION as unknown as Feature],
    });

    console.log("Waiting for operation to complete...");
    const [result] = await operation.promise();

    const labels = (
      result.annotationResults?.[0]?.segmentLabelAnnotations || []
    ).map(
      (l: protos.google.cloud.videointelligence.v1.ILabelAnnotation) =>
        l.entity?.description || "Unknown",
    );

    console.log("\n=== SUMMARY ===");
    console.log("URI:", inputUri);
    console.log("Top labels:", labels.slice(0, 5).join(", ") || "(none)");

    const outputFileName =
      path.basename(file.name, path.extname(file.name)) + "-annotated.json";
    await saveAnnotatedVideo(
      "output-videos",
      outputFileName,
      JSON.stringify(result, null, 2),
    );
    console.log(`Annotated video saved as: ${outputFileName}`);
  }
}

annotateVideos().catch((err) => {
  console.error("Annotation failed:", err.message || err);
});
