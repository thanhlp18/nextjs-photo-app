import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

type Params = {
  photo: string;
};

// Get a photo
export async function GET(req: Request, context: { params: Params }) {
  const photoId = context.params.photo;
  try {
    const client = await clientPromise;
    const db = client.db("nextjs-photo-app");
    // Aggregate pipeline with $match and $lookup stages
    const photo = await db
      .collection("photos")
      .aggregate([
        { $match: { _id: new ObjectId(photoId) } }, // Match by _id
        {
          $lookup: {
            from: "comments", // Join with comments collection
            localField: "comments",
            foreignField: "_id",
            as: "comments",
          },
        },
      ])
      .toArray();

    return NextResponse.json({ data: photo[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "An error occurred" });
  }
}
