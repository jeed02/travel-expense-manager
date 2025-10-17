import {appwriteConfig, database} from "~/appwrite/client";
import {Query} from "appwrite";

export const getAllTrips = async (limit: number, offset: number) => {
    const allTrips = await database.listDocuments(
        appwriteConfig.databaseId,
        "trips",
        [Query.limit(limit), Query.offset(offset), Query.orderDesc('$createdAt')]
    )

    if (allTrips.total === 0) {
        console.error('No trips found');
        return {allTrips: [], total: 0}
    }

    return {
        allTrips: allTrips.documents,
        total: allTrips.total,
    }
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