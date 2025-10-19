import {appwriteConfig, database} from "~/appwrite/client";
import {Query} from "appwrite";

export const getAllTrips = async (userId: string) => {
    // Find membership records for this user
    const memberships = await database.listDocuments(
        appwriteConfig.databaseId,
        "trip_members",
        [Query.equal("userId", userId)]
    );

    if (memberships.total === 0) {
        // User is not part of any trips
        return { allTrips: [], total: 0 };
    }

    // Extract unique tripIds from membership docs
    const tripIds = Array.from(
        new Set(
            memberships.documents
                .map((m: any) => m.tripId)
                .filter((id: any) => typeof id === "string" && id.length > 0)
        )
    );

    if (tripIds.length === 0) {
        return { allTrips: [], total: 0 };
    }

    // Fetch trips where id in the user's tripIds
    const tripsResult = await database.listDocuments(
        appwriteConfig.databaseId,
        "trips",
        [Query.equal("$id", tripIds), Query.orderDesc("$createdAt")]
    );

    // For each trip, compute number of members from trip_members and include budget
    // Build a map of tripId -> memberCount by scanning memberships we already fetched
    const memberCountByTrip = new Map<string, number>();
    for (const m of memberships.documents as any[]) {
        const tId = String(m.tripId || "");
        if (!tId) continue;
        memberCountByTrip.set(tId, (memberCountByTrip.get(tId) || 0) + 1);
    }

    const enrichedTrips = tripsResult.documents.map((t: any) => {
        const budget = Number(t?.budget ?? 0);
        const members = memberCountByTrip.get(t.$id) ?? 0;
        return { ...t, budget, members };
    });

    return {
        allTrips: enrichedTrips,
        total: tripsResult.total,
    };
}

export const getTripById = async (tripId: string) => {
    const trip = await database.getDocument(
        appwriteConfig.databaseId,
        "trips",
        tripId
    );

    if (!trip.$id) {
        console.log('Trip not found')
        return null;
    }

    return trip;
}

export const getTripMembers = async (tripId: string) => {
    // Fetch trip_members entries for this trip
    const members = await database.listDocuments(
        appwriteConfig.databaseId,
        "trip_members",
        [Query.equal("tripId", tripId), Query.orderDesc('$createdAt')]
    );

    if (members.total === 0) {
        return [] as TripMember[];
    }

    // Collect unique userIds from trip_members (these store the Appwrite accountId as per create-trip.ts)
    const userIds = Array.from(new Set(members.documents.map((m: any) => m.userId).filter(Boolean)));

    if (userIds.length === 0) {
        return [] as TripMember[];
    }

    // Query users collection for those accountIds and only select what we need
    const usersResult = await database.listDocuments(
        appwriteConfig.databaseId,
        "users",
        [
            Query.equal("accountId", userIds),
            Query.select(["name", "email", "imageUrl", "accountId"]),
        ]
    );

    // Build a quick lookup from accountId -> user data
    const userByAccountId = new Map<string, any>();
    for (const user of usersResult.documents) {
        userByAccountId.set(user.accountId, user);
    }

    // Map trip_members (preserving order) to TripMember shape using user data
    const parsed: TripMember[] = members.documents.map((m: any) => {
        const u = userByAccountId.get(m.userId);
        return {
            id: u?.accountId ?? m.userId ?? "",
            name: u?.name ?? "Unknown",
            email: u?.email ?? "",
            imageUrl: u?.imageUrl ?? undefined,
        } as TripMember;
    });

    return parsed;
}