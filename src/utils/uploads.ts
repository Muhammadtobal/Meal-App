import path from "path";
import * as fs from "fs/promises";

const uploadPathCategory: string = path.join(
  __dirname,
  "..",
  "uploads",
  "category"
);
const uploadPathItem: string = path.join(__dirname, "..", "uploads", "items");

 async function deleteFile(fileName: string, directories: string | string[]) {
  const dirs = Array.isArray(directories) ? directories : [directories];
  for (const dir of dirs) {
    const filePath = path.join(dir, fileName);
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      console.log(`File deleted: ${filePath}`);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        console.warn(`File not found in: ${filePath}, skipping.`);
      } else {
        console.error(`Error deleting file ${filePath}:`, error);
      }
    }
  }
}

export { uploadPathCategory, uploadPathItem, deleteFile };
