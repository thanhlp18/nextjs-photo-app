import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import { NextApiRequest } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
  const formData = await req.formData();
  const newPhoto: any = {};
  formData.forEach((value, key) => (newPhoto[key] = value));
  if (!newPhoto) return NextResponse.json({ error: "No photo data provided" });
  try {
    const client = await clientPromise;
    const db = client.db("nextjs-photo-app");
    const photoInsertResult = await db.collection("photos").insertOne(newPhoto);
    return NextResponse.json({ ...photoInsertResult, photo: newPhoto });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "An error occurred" });
  }
}
