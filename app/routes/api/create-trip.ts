import {type ActionFunctionArgs, data} from "react-router";
import {appwriteConfig, database} from "~/appwrite/client";
import {ID} from "appwrite";


export const action = async ({request}: ActionFunctionArgs) => {
    const {
        name,
        country,
        startDate,
        endDate,
        adminId
    } = await request.json();

    try{
        const result = await database.createDocument(
            appwriteConfig.databaseId,
            "trips",
            ID.unique(),
            {
                name: name,
                country: country,
                startDate: startDate,
                endDate: endDate,
                adminId: adminId,
                $createdAt: new Date().toISOString()
            }
        )

        if (result) {
            await database.createDocument(
                appwriteConfig.databaseId,
                "trip_members",
                ID.unique(),
                {
                    budget: 0.0,
                    tripId: result.$id,
                    userId: adminId,
                    $createdAt: new Date().toISOString()
                }
            )
        }

        return data({id: result.$id});
    } catch (error) {
        console.error("Error creating trip", error);
    }



}
