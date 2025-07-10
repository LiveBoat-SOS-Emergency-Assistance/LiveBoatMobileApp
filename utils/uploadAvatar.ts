import { baseURL } from "../baseUrl";
import ImageResizer from "react-native-image-resizer";
import axios from 'axios';

async function convertWebpToPng(file: {
  uri: string;
  type: string;
  name: string;
}) {
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
    name: file.name.replace(/\.\w+$/, ".png"),
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

    const response = await fetch(`${baseURL}/file-storage/cloudinary/generate-signed-url`, {
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
    const { signedUrl, fileUrl, public_id, timestamp, signature, api_key } = data[0];

    const formData = new FormData();
    formData.append("file", {
      uri: finalFile.uri,
      type: finalFile.type,
      name: finalFile.name,
    });
    formData.append("api_key", api_key);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("public_id", public_id);

    try {
      if (typeof formData === "object" && formData !== null && "_parts" in formData) {
        // @ts-ignore
        void formData._parts.map((p: any) => p[0]);
      }
    } catch (e) {}

    const uploadResponse = await axios.post(signedUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (uploadResponse.data.secure_url) {
      return { success: true, fileUrl: uploadResponse.data.secure_url };
    } else {
      return { success: false };
    }
  } catch (error) {
    return { success: false };
  }
}
