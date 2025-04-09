import { baseURL } from "../baseUrl";
import ImageResizer from "react-native-image-resizer"; // ⬅️ import thêm

// Function: Convert file webp -> png
async function convertWebpToPng(file: {
  uri: string;
  type: string;
  name: string;
}) {
  console.log("🛠 Converting webp to png...");
  const converted = await ImageResizer.createResizedImage(
    file.uri,
    1000,
    1000,
    "PNG",
    100
  );

  return {
    uri: converted.uri,
    type: "image/png",
    name: file.name.replace(/\.\w+$/, ".png"), // đổi đuôi thành .png
  };
}
export async function uploadFileToGCS(file: {
  uri: string;
  type: string;
  name: string;
}): Promise<{ success: boolean; fileUrl?: string }> {
  try {
    let finalFile = { ...file };

    if (file.type === "image/webp") {
      finalFile = await convertWebpToPng(file);
    }

    // 1️⃣ Request signed URL
    const response = await fetch(`${baseURL}/gcp-storage/generate-signed-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          fileName: finalFile.name,
          fileType: finalFile.type,
        },
      ]),
    });

    const data = await response.json();
    // console.log("Backend response", data);
    // console.log("Final File Name:", finalFile.name);
    // console.log("Final File Type:", finalFile.type);

    const { signedUrl, fileUrl } = data[0];

    // 2️⃣ Upload file
    const blob = await (await fetch(finalFile.uri)).blob();
    const uploadResponse = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": finalFile.type,
      },
      body: blob,
    });

    if (uploadResponse.ok) {
      console.log("✅ File uploaded to GCS successfully!");
      return { success: true, fileUrl };
    } else {
      console.error("❌ File upload failed:", uploadResponse.statusText);
      return { success: false };
    }
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    return { success: false };
  }
}
