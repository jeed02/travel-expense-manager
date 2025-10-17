import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "~/lib/utils";
import { CURRENCIES } from "~/appwrite/expenses";

interface AddExpenseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    members: TripMember[];
    tripId?: string;
}

const CATEGORIES = [
    "Food",
    "Transport",
    "Accommodation",
    "Entertainment",
    "Shopping",
    "Travel",
    "Experience",
    "Other",
];

export function AddExpenseDialog({
                                     open,
                                     onOpenChange,
                                     members,
                                     tripId
                                 }: AddExpenseDialogProps) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [paidById, setPaidById] = useState("");
    const [isAll, setIsAll] = useState(true);
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const paidBy = members.find((m) => m.id === paidById);
        if (!paidBy) return;

        const sharedWith = isAll
            ? []
            : members.filter((m) => selectedMemberIds.includes(m.id));

        try {
            // Call API route to create expense (and payouts)
            // Attempt to infer tripId from the current URL: /admin/trips/:tripId or /admin/trip/:tripId etc.
            console.log(name, amount, category, currency, paidById, isAll, selectedMemberIds, tripId);

            const res = await fetch("/api/create-expense", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    amount: parseFloat(amount),
                    category: category,
                    currency: currency,
                    isAll: isAll,
                    paidBy: paidBy.id,
                    sharedWith: selectedMemberIds,
                    tripId: tripId,
                }),
            });


            if (!res.ok) {
                console.error("Failed to create expense", await res.text());
            }
        } catch (err) {
            console.error("Error calling create-expense API", err);
        }

        // Reset form
        setName("");
        setAmount("");
        setCategory("");
        setCurrency("USD");
        setPaidById("");
        setIsAll(true);
        setSelectedMemberIds([]);
        onOpenChange(false);
    };

    const toggleMember = (memberId: string) => {
        setSelectedMemberIds((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        );
    };

    const isValid =
        name.trim() &&
        amount &&
        !isNaN(parseFloat(amount)) &&
        category &&
        currency &&
        paidById &&
        (isAll || selectedMemberIds.length > 0);

    return (
        <div className="wrapper-md">
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Expense</DialogTitle>
                        <DialogDescription>
                            Fill out the details for the new expense.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Expense Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Dinner at Restaurant"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select value={currency} onValueChange={setCurrency}>
                                        <SelectTrigger id="currency">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CURRENCIES.map((curr) => (
                                                <SelectItem key={curr.code} value={curr.code}>
                                                    {curr.code} - {curr.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="paidBy">Paid By</Label>
                                    <Select value={paidById} onValueChange={setPaidById}>
                                        <SelectTrigger id="paidBy">
                                            <SelectValue placeholder="Select member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {members.map((member) => (
                                                <SelectItem key={member.id} value={member.id}>
                                                    {member.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label htmlFor="split-equally">Split Equally</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Share this expense with all trip members
                                        </p>
                                    </div>
                                    <Switch
                                        id="split-equally"
                                        checked={isAll}
                                        onCheckedChange={setIsAll}
                                    />
                                </div>

                                {!isAll && (
                                    <div className="space-y-2">
                                        <Label>Shared With</Label>
                                        <div className="border rounded-lg p-4 space-y-2">
                                            {members.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center space-x-3"
                                                >
                                                    <Checkbox
                                                        id={`member-${member.id}`}
                                                        checked={selectedMemberIds.includes(member.id)}
                                                        onCheckedChange={() => toggleMember(member.id)}
                                                    />
                                                    <label
                                                        htmlFor={`member-${member.id}`}
                                                        className="flex items-center gap-2 cursor-pointer flex-1"
                                                    >
                                                        <Avatar className="size-8">
                                                            <AvatarImage
                                                                src={member.imageUrl}
                                                                alt={member.name}
                                                            />
                                                            <AvatarFallback>
                                                                {getInitials(member.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p>{member.name}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {member.email}
                                                            </p>
                                                        </div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={!isValid}>
                                Add Expense
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>

    );
}