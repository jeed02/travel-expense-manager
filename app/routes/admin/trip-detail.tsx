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
import {useRevalidator} from "react-router";
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


const TripDetail = ({loaderData}: Route.ComponentProps) => {
    const {trip, tripMembers, expenseData} = loaderData;
    const [displayCurrency, setDisplayCurrency] = useState("USD");
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const revalidator = useRevalidator();

    return (
        <main className="min-h-screen bg-background wrapper">
            <div className="max-w-7xl mx-auto space-y-6">
                <TripHeader
                    tripId={trip?.$id}
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
                    onCreated={() => revalidator.revalidate()}
                />
            </div>
        </main>
    )
}
export default TripDetail
