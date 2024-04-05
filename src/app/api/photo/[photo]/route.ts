import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

type Params = {
  photoId: string;
};

// Get a photo
export async function GET(req: Request, context: { params: Params }) {
  const photoId = context.params.photoId;
  try {
    const client = await clientPromise;
    const db = client.db("nextjs-photo-app");
    const photo = await db.collection("photos").findOne({ " _id": photoId });
    return NextResponse.json({ photo });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "An error occurred" });
  }
}
