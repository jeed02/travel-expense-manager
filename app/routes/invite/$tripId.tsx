import React from "react";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { account } from "~/appwrite/client";
import { loginWithGoogle, getExistingUser, storeUserData } from "~/appwrite/auth";

export const clientLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const tripId = params?.tripId as string | undefined;

  if (!tripId) {
    return redirect("/trips");
  }

  try {
    // If user is authenticated, attempt to join the trip via API
    const user = await account.get();
    if (!user?.$id) throw new Error("Unauthenticated");

    // Ensure we have a corresponding user document in DB
    const existing = await getExistingUser(user.$id);
    if (!existing) {
      await storeUserData();
    }

    const res = await fetch("/api/invite-member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripId: tripId, userId: user?.$id  }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        // Not authorized, trigger OAuth
        await loginWithGoogle(request.url);
        return null;
      }
      // For other errors like 404/500, fallback to trips home
      return redirect("/trips");
    }

    // Regardless of membership creation or already a member, go to trip page
    return redirect(`/trips/${tripId}`);
  } catch (e) {
    // Not signed in: start OAuth with a success redirect back to this invite URL
    await loginWithGoogle(request.url);
    return null;
  }
};

const InviteJoin = () => {
  return (
    <main className="w-full min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Joining trip...</h1>
        <p className="text-muted-foreground">Please wait while we process your invitation.</p>
      </div>
    </main>
  );
};

export default InviteJoin;
