import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, database } from "~/appwrite/client";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { tripId, userId } = await request.json();
    if (!tripId || typeof tripId !== "string") {
      return new Response(JSON.stringify({ error: "tripId is required" }), { status: 400 });
    }



    // Validate the trip exists
    try {
      await database.getDocument(appwriteConfig.databaseId, "trips", tripId);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Trip not found" }), { status: 404 });
    }

    // Check if membership already exists (idempotent)
    const existing = await database.listDocuments(
      appwriteConfig.databaseId,
      "trip_members",
      [Query.equal("tripId", tripId), Query.equal("userId", userId)]
    );

    if (existing.total > 0) {
      return data({ added: false, memberId: existing.documents[0].$id });
    }

    // Create membership
    const member = await database.createDocument(
      appwriteConfig.databaseId,
      "trip_members",
      ID.unique(),
      {
        budget: 0.0,
        tripId: tripId,
        userId: userId,
        $createdAt: new Date().toISOString(),
      }
    );

    return data({ added: true, memberId: member.$id });
  } catch (error) {
    console.error("Error in invite-member action", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
