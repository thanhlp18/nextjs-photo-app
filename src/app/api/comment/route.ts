import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

type Params = {
  photoId: string;
};

// Add comment to a photo
export async function POST(req: Request, context: { params: Params }) {
  const data = await req.json();
  const { comment, name, photoId } = data;
  if (!comment) return NextResponse.json({ error: "No comment data provided" });
  try {
    const client = await clientPromise;
    const db = client.db("nextjs-photo-app");
    const savedComment = await db.collection("comments").insertOne({
      photoId: photoId,
      comment: comment,
      name: name,
      createdAt: Date.now(),
    });

    const photo = await db.collection("photos").updateOne(
      { _id: new ObjectId(photoId) },
      {
        $push: {
          comments: new ObjectId(savedComment.insertedId),
        } as any,
      }
    );
    console.log(photo);

    return NextResponse.json({
      message: "Comment added",
      data: {
        id: savedComment.insertedId,
        comment: comment,
        name: name,
        createdAt: Date.now(),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "An error occurred" });
  }
}
