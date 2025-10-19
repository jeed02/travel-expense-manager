import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CheckCircle2, Users } from "lucide-react";
import { convertCurrency, formatCurrency } from "~/appwrite/expenses";
import { getInitials } from "~/lib/utils";

interface TripMember {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
}

interface Expense {
    id: string;
    name: string;
    amount: number;
    category: string;
    currency: string;
    paidBy: TripMember;
    isAll: boolean;
    sharedWith: TripMember[];
}

interface ExpensesTableProps {
    expenses: Expense[];
    displayCurrency: string;
    members?: TripMember[];
}

const categoryColors: Record<string, string> = {
    Food: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    Transport: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    Accommodation: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    Entertainment: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    Shopping: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export function ExpensesTable({ expenses, displayCurrency, members }: ExpensesTableProps) {
    return (
        <div className="rounded-lg border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Original Currency</TableHead>
                        <TableHead>Paid By</TableHead>
                        <TableHead className="text-center">Split Equally</TableHead>
                        <TableHead>Shared With</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.map((expense) => {
                        const memberMap = new Map((members || []).map(m => [m.id, m]));
                        const paidByResolved = memberMap.get(expense.paidBy?.id) || expense.paidBy;
                        const sharedResolved = expense.sharedWith?.map(m => memberMap.get(m.id) || m) || [];
                        const convertedAmount = convertCurrency(
                            expense.amount,
                            expense.currency,
                            displayCurrency
                        );
                        const isOriginalCurrency = expense.currency === displayCurrency;

                        return (
                            <TableRow key={expense.id}>
                                <TableCell>{expense.name}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span>{formatCurrency(convertedAmount, displayCurrency)}</span>
                                        {!isOriginalCurrency && (
                                            <span className="text-xs text-muted-foreground">
                        {formatCurrency(expense.amount, expense.currency)}
                      </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={categoryColors[expense.category] || categoryColors.Other}
                                    >
                                        {expense.category}
                                    </Badge>
                                </TableCell>
                                <TableCell>{expense.currency}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="size-6">
                                            <AvatarImage src={paidByResolved.imageUrl} alt={paidByResolved.name} />
                                            <AvatarFallback className="text-xs">{getInitials(paidByResolved.name || paidByResolved.id)}</AvatarFallback>
                                        </Avatar>
                                        <span>{paidByResolved.name || paidByResolved.id}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {expense.isAll ? (
                                        <CheckCircle2 className="size-5 text-green-600 dark:text-green-500 mx-auto" />
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {expense.isAll ? (
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Users className="size-4" />
                                            <span>All members</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <div className="flex -space-x-2">
                                                {sharedResolved.slice(0, 3).map((member) => (
                                                    <Avatar key={member.id} className="size-6 border-2 border-background">
                                                        <AvatarImage src={member.imageUrl} alt={member.name} />
                                                        <AvatarFallback className="text-xs">{getInitials(member.name || member.id)}</AvatarFallback>
                                                    </Avatar>
                                                ))}
                                            </div>
                                            {sharedResolved.length > 3 && (
                                                <span className="text-xs text-muted-foreground ml-1">
                          +{sharedResolved.length - 3}
                        </span>
                                            )}
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}