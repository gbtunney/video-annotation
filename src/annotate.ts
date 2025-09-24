import readline from "node:readline";
import fs from "node:fs/promises";
import path from "node:path";
import {
  client,
  BUCKET_NAME,
  FEATURES,
  OUTPUT_DIRECTORY,
} from "./config/gcpConfig.js"; // Import OUTPUT_DIRECTORY
import { Storage } from "@google-cloud/storage";
import {
  VideoIntelligenceServiceClient,
  protos,
} from "@google-cloud/video-intelligence";
import { saveAnnotatedVideo } from "./utils/fileHandler.js";
import { createProgressBar } from "./utils/progressBar.js"; // Import the progress bar utility

let isExiting = false; // Flag to track if the script is exiting

// Display message to inform the user about Esc key
console.log("Press Esc to exit the script gracefully.");

// Handle Esc key to exit gracefully
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Enable raw mode to capture keypress events
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

process.stdin.on("data", (chunk: Buffer) => {
  const key = chunk.toString();
  if (key === "\u001b") {
    // Escape key
    if (!isExiting) {
      isExiting = true;
      console.log("\nExiting... Cleaning up resources.");
      rl.close();
      process.exit(0); // Exit the process
    }
  }
});

async function annotateVideos(
  overwrite = false,
  target?: string,
): Promise<void> {
  const storage = new Storage();

  let files;

  if (target) {
    // If a specific file or folder is provided
    if (target.endsWith("/")) {
      // List all files in the specified folder
      [files] = await storage.bucket(BUCKET_NAME).getFiles({ prefix: target });
    } else {
      // Single file
      files = [{ name: target }];
    }
  } else {
    // List all files in the bucket
    [files] = await storage.bucket(BUCKET_NAME).getFiles();
  }
  for (const file of files) {
    const progressBar = createProgressBar(`Processing: ${file.name}`);
    progressBar.start();

    if (!file.name.match(/\.(mp4|mov|avi|mkv)$/i)) {
      // Skip non-video files
      progressBar.stop();
      console.log(`SKIPPED: ${file.name} (Not a video file)`);
      continue;
    }

    // Create a local directory structure that mirrors the bucket
    const relativePath = file.name; // Use the full path in the bucket
    const outputFilePath = path.join(OUTPUT_DIRECTORY, `${relativePath}.json`);
    const outputDir = path.dirname(outputFilePath);

    try {
      // Ensure the directory exists
      await fs.mkdir(outputDir, { recursive: true });
    } catch (err) {
      console.error(
        `FAILED to create directory: ${outputDir} (Error: ${(err as Error).message})`,
      );
      progressBar.stop();
      continue;
    }

    if (!overwrite) {
      try {
        // Check if the JSON file already exists
        await fs.access(outputFilePath);
        progressBar.stop();
        console.log(`SKIPPED: ${file.name} (Already processed)`);
        continue; // Skip this video
      } catch {
        // File does not exist, proceed with annotation
      }
    }

    const inputUri = `gs://${BUCKET_NAME}/${file.name}`;
    progressBar.setText(`Annotating: ${file.name}`);

    try {
      const [operation] = await client.annotateVideo({
        inputUri: inputUri,
        features: FEATURES,
      });

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

      await saveAnnotatedVideo(
        outputDir,
        path.basename(outputFilePath),
        JSON.stringify(result, null, 2),
      );

      progressBar.stop();
      console.log(`PROCESSED: ${file.name} (Saved as ${outputFilePath})`);
    } catch (error) {
      progressBar.stop();
      console.error(
        `FAILED: ${file.name} (Error: ${error instanceof Error ? error.message : "Unknown error"})`,
      );
    }
  }

  console.log("Annotation process completed!");
}

// Parse command-line arguments
const args = process.argv.slice(2);
const overwrite = args.includes("--overwrite");
const target = args.find((arg) => !arg.startsWith("--"));

annotateVideos(overwrite, target).catch((err) => {
  console.error("Annotation failed:", err.message || err);
});
