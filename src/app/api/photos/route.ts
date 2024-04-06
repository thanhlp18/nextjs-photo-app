import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import { NextApiRequest } from "next";
import axios from "axios";

async function uploadToCloudflare(imageData: FormDataEntryValue) {
  try {
    const formData = new FormData();
    formData.append("file", imageData); // Append the image data to FormData

    const response = await axios.post(
      "https://api.cloudflare.com/client/v4/accounts/bde5bd3a01beddab331fa8720a225013/images/v1",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
        },
      }
    );

    console.log("Upload successful:", response.data);
    return response.data;
  } catch (error: Error | any) {
    console.error("Upload failed:", error.response.data);
    throw error;
  }
}

// Get all photos
export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("nextjs-photo-app");
    const photos = await db.collection("photos").find().toArray();
    const processedPhotoData = photos.map((photo) => {
      const commentsCount = photo.comments ? photo.comments.length : 0;
      const { comments, _id, ...photoDataWithoutComments } = photo; // Remove the comments array
      return {
        photoId: photo._id,
        ...photoDataWithoutComments,
        commentsCount: commentsCount,
      };
    });

    return NextResponse.json({ status: 200, data: processedPhotoData });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "An error occurred" });
  }
}

// Upload a photo
export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const formData: FormData = await req.formData();

    // Extract the file from the form data
    const file = formData.get("image");
    if (!file) {
      return NextResponse.json({ error: "No file data provided" });
    }

    // Upload the file to Cloudflare
    const cloudflareUploadResult = await uploadToCloudflare(file);
    const imageVariants = cloudflareUploadResult.result.variants;
    const imageUrl = imageVariants[0].replace(
      imageVariants[0].split("/")[imageVariants[0].split("/").length - 1],
      ""
    );

    const newPhoto = {
      ownerName: formData.get("ownerName"),
      ownerComment: formData.get("ownerComment"),
      image: imageUrl,
      comments: [],
      // Add additional metadata fields here if needed
    };

    // // Save the photo information in your database
    const db = client.db("nextjs-photo-app");
    const photoInsertResult = await db.collection("photos").insertOne(newPhoto);

    // return NextResponse.json({
    //   photo: newPhoto,
    //   insertedId: photoInsertResult.insertedId,
    // });
    return NextResponse.json({
      statusCode: 200,
      data: { _id: photoInsertResult.insertedId, ...newPhoto },
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: "An error occurred" });
  }
}
