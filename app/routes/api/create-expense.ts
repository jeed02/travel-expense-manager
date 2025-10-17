import type {ActionFunctionArgs} from "react-router";
import {appwriteConfig, database} from "~/appwrite/client";
import {ID} from "appwrite";

export const action = async ({request}: ActionFunctionArgs) => {
    const {
        name,
        amount,
        category,
        currency,
        isAll,
        tripId,
        paidBy,
        sharedWith
    } = await request.json();

    try{
        // 1) Create the expense document first
        const expense = await database.createDocument(
            appwriteConfig.databaseId,
            "expenses",
            ID.unique(),
            {
                name: name,
                amount: amount,
                category: category,
                currency: currency,
                isAll: isAll,
                tripId: tripId,
                paidBy: paidBy,
                sharedWith: sharedWith,
                $createdAt: new Date().toISOString()
            }
        )

        // 2) After the expense is created, create payouts for users in sharedWith
        if (expense && Array.isArray(sharedWith) && sharedWith.length > 0) {
            // Filter out any participant that is the payer themself
            const participants = sharedWith.filter((m: any) => m?.id && m.id !== paidBy?.id);

            if (participants.length > 0) {
                const perPerson = Number(amount) / participants.length;
                const nowIso = new Date().toISOString();

                await Promise.all(
                    participants.map((member: any) =>
                        database.createDocument(
                            appwriteConfig.databaseId,
                            "payouts",
                            ID.unique(),
                            {
                                amount: perPerson,
                                hasPaid: false,
                                tripId: tripId,
                                expenseId: expense.$id,
                                owedTo: paidBy,
                                owedBy: member.id,            // the person who owes
                                $createdAt: nowIso,
                            }
                        )
                    )
                );
            }
        }

        // 3) Return the created expense id as response
        return new Response(JSON.stringify({ id: expense.$id }), { status: 200 });
    } catch (error) {
        console.error("Error creating expense and payouts", error);
        return new Response(JSON.stringify({ error: "Failed to create expense" }), { status: 500 });
    }
}