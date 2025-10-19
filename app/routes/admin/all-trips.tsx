import React from 'react'
import TripCard from "~/components/TripCard";
import Header from "~/components/Header";
import {getAllTrips} from "~/appwrite/trips";
import type {LoaderFunctionArgs} from "react-router";
import {account} from "~/appwrite/client";
import type { Route } from "./+types/all-trips";

export const clientLoader = async ({request}: LoaderFunctionArgs) => {
    const user = await account.get();

    const {allTrips, total} = await getAllTrips(user.$id);

    return {allTrips};

}


const AllTrips = ({loaderData}: Route.ComponentProps) => {
    const tripData = loaderData.allTrips;

    return (
        <main className="all-trips wrapper">
            <Header title="Your Trips" description="View and edit your trips" ctaText="Create Trip" ctaUrl="/trips/create"/>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {tripData.map((value, index) => (
                    <TripCard id={value.$id} name={value.name} members={value.members} budget={value.budget} />
                ))}
            </section>

        </main>
    )
}
export default AllTrips
