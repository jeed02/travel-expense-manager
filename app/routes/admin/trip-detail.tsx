import {getTripById, getTripMembers} from "~/appwrite/trips";
import {type LoaderFunctionArgs} from "react-router";
import type {Route} from "./+types/trip-detail";
import {TripHeader} from "~/components/TripHeader";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {ExpensesTable} from "~/components/ExpenseTable";
import {Button} from "~/components/ui/button";
import {Plus} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {CURRENCIES, getAllExpenses} from "~/appwrite/expenses";
import {useState} from "react";
import {AddExpenseDialog} from "~/components/AddExpenseDialog";


export const loader = async ({params}: LoaderFunctionArgs) => {
    const {tripId} = params;

    if (!tripId) throw new Error("Trip Id is required");

    const [trip, tripMembers, expenseData] = await Promise.all([
        getTripById(tripId),
        getTripMembers(tripId),
        getAllExpenses(tripId)
    ])

    return {trip, tripMembers, expenseData};
}

// Mock data
const initialExpensesData: Expense[] = [
    {
        id: "1",
        name: "Hotel Paris - 3 Nights",
        amount: 450.00,
        category: "Accommodation",
        currency: "USD",
        paidBy: { id: "1", name: "Sarah Chen", email: "sarah.chen@example.com" },
        isAll: true,
        sharedWith: [],
    },
    {
        id: "2",
        name: "Dinner at Le Bistro",
        amount: 125.50,
        category: "Food",
        currency: "USD",
        paidBy: { id: "2", name: "Mike Johnson", email: "mike.johnson@example.com" },
        isAll: true,
        sharedWith: [],
    },
    {
        id: "3",
        name: "Train to Rome",
        amount: 280.00,
        category: "Transport",
        currency: "USD",
        paidBy: { id: "3", name: "Emma Davis", email: "emma.davis@example.com" },
        isAll: false,
        sharedWith: [
            { id: "1", name: "Sarah Chen", email: "sarah.chen@example.com" },
            { id: "2", name: "Mike Johnson", email: "mike.johnson@example.com" },
            { id: "3", name: "Emma Davis", email: "emma.davis@example.com" },
        ],
    },
    {
        id: "4",
        name: "Colosseum Tickets",
        amount: 64.00,
        category: "Entertainment",
        currency: "USD",
        paidBy: { id: "4", name: "Alex Kim", email: "alex.kim@example.com" },
        isAll: true,
        sharedWith: [],
    },
    {
        id: "5",
        name: "Grocery Shopping",
        amount: 85.30,
        category: "Food",
        currency: "USD",
        paidBy: { id: "1", name: "Sarah Chen", email: "sarah.chen@example.com" },
        isAll: true,
        sharedWith: [],
    },
    {
        id: "6",
        name: "Uber to Airport",
        amount: 45.00,
        category: "Transport",
        currency: "USD",
        paidBy: { id: "2", name: "Mike Johnson", email: "mike.johnson@example.com" },
        isAll: false,
        sharedWith: [
            { id: "2", name: "Mike Johnson", email: "mike.johnson@example.com" },
            { id: "4", name: "Alex Kim", email: "alex.kim@example.com" },
        ],
    },
    {
        id: "7",
        name: "Souvenir Shopping",
        amount: 120.00,
        category: "Shopping",
        currency: "USD",
        paidBy: { id: "3", name: "Emma Davis", email: "emma.davis@example.com" },
        isAll: false,
        sharedWith: [
            { id: "3", name: "Emma Davis", email: "emma.davis@example.com" },
        ],
    },
    {
        id: "8",
        name: "Museum Pass Barcelona",
        amount: 95.00,
        category: "Entertainment",
        currency: "USD",
        paidBy: { id: "4", name: "Alex Kim", email: "alex.kim@example.com" },
        isAll: true,
        sharedWith: [],
    },
    {
        id: "9",
        name: "Tapas Restaurant",
        amount: 156.75,
        category: "Food",
        currency: "USD",
        paidBy: { id: "1", name: "Sarah Chen", email: "sarah.chen@example.com" },
        isAll: true,
        sharedWith: [],
    },
    {
        id: "10",
        name: "Airbnb Barcelona - 4 Nights",
        amount: 520.00,
        category: "Accommodation",
        currency: "USD",
        paidBy: { id: "2", name: "Mike Johnson", email: "mike.johnson@example.com" },
        isAll: true,
        sharedWith: [],
    },
];


const TripDetail = ({loaderData}: Route.ComponentProps) => {
    const {trip, tripMembers, expenseData} = loaderData;
    const [displayCurrency, setDisplayCurrency] = useState("USD");
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

    return (
        <main className="min-h-screen bg-background wrapper">
            <div className="max-w-7xl mx-auto space-y-6">
                <TripHeader
                    tripName={trip?.name}
                    country={trip?.country}
                    startDate={trip?.startDate}
                    endDate={trip?.endDate}
                    members={tripMembers}
                />

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Expenses</CardTitle>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Display in:</span>
                                    <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CURRENCIES.map((currency) => (
                                                <SelectItem key={currency.code} value={currency.code}>
                                                    {currency.code} - {currency.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button size="sm" onClick={() => setIsAddExpenseOpen(true)}>
                                    <Plus className="size-4 mr-2" />
                                    Add Expense
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ExpensesTable expenses={expenseData} displayCurrency={displayCurrency} members={tripMembers} />
                    </CardContent>
                </Card>

                <AddExpenseDialog
                    open={isAddExpenseOpen}
                    onOpenChange={setIsAddExpenseOpen}
                    members={tripMembers}
                    tripId={trip?.$id}
                />
            </div>
        </main>
    )
}
export default TripDetail
