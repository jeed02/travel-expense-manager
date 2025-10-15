import React from 'react'
import TripCard from "~/components/TripCard";
import Header from "~/components/Header";

const AllTrips = () => {
    const AllTripsDummyData = [
        {
            "id": "1",
            "name": "Canada Trip",
            "members": 4,
            "budget": 2800
        },
        {
            "id": "2",
            "name": "Tokyo Adventure",
            "members": 3,
            "budget": 3600
        },
        {
            "id": "3",
            "name": "Roadtrip USA",
            "members": 5,
            "budget": 4200
        },
        {
            "id": "4",
            "name": "Bali Getaway",
            "members": 2,
            "budget": 1800
        },
        {
            "id": "5",
            "name": "European Expedition",
            "members": 6,
            "budget": 7500
        }
    ]

    return (
        <main className=" all-trips wrapper">
            <Header title="Your Trips" description="View and edit your trips" ctaText="Create Trip" ctaUrl="/trips/create"/>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {AllTripsDummyData.map((value, index) => (
                    <TripCard id={value.id} name={value.name} members={value.members} budget={value.budget} />
                ))}
            </section>

        </main>
    )
}
export default AllTrips
