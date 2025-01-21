import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const multipleUploadToS3 = async (
  files: File[], // Change from File to File[]
  customPath: string = "bms/profilePic",
): Promise<string[]> => {
  // Change return type to Promise<string[]>
  const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
  });

  const uploadPromises = files.map(async (file) => {
    // Iterate over files
    const fileName = `${Date.now()}-${file.name}`;
    const key = `${customPath}/${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: key,
      ContentType: file.type,
    });

    try {
      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });
      await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
      return signedUrl.split("?")[0]; // Return the base URL
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error; // Rethrow error to handle it in the calling function
    }
  });

  return Promise.all(uploadPromises); // Wait for all uploads to complete
};
