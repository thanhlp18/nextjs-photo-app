import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

// Get all photos
export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("nextjs-photo-app");
    const photos = await db.collection("photos").find().toArray();
    const processedPhotoData = photos.map((photo) => {
      const commentsCount = photo.comments.length;
      const { comments, _id, ...photoDataWithoutComments } = photo; // Remove the comments array
      return {
        photoId: photo._id,
        ...photoDataWithoutComments,
        commentsCount: commentsCount,
      };
    });

    return NextResponse.json({ processedPhotoData });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "An error occurred" });
  }
}

// Upload new photo
export async function POST(req: Request) {
  const newPhoto = req.body;
  if (!newPhoto) return NextResponse.json({ error: "No photo data provided" });
  try {
    const client = await clientPromise;
    const db = client.db("nextjs-photo-app");
    const photos = await db.collection("photos").find().toArray();
    const photoInsertResult = await db.collection("photos").insertOne(newPhoto);
    return NextResponse.json({ photoInsertResult });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "An error occurred" });
  }
}
