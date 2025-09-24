import fs from "node:fs/promises";
import path from "node:path";

export async function readVideoFiles(inputDir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(inputDir);
    return files.filter((file) => /\.(mp4|mov|avi)$/.test(file));
  } catch (error) {
    console.error("Error reading video files:", error);
    throw error;
  }
}

export async function saveAnnotatedVideo(
  outputDir: string,
  filename: string,
  data: string,
): Promise<void> {
  try {
    const outputPath = path.resolve(path.join(outputDir, filename));
    await fs.writeFile(outputPath, data);
    console.log(`Annotated video saved to: ${outputPath}`);
  } catch (error) {
    console.error("Error saving annotated video:", error);
    throw error;
  }
}
