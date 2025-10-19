// Top 15 most used currencies
import {appwriteConfig, database} from "~/appwrite/client";
import {Query} from "appwrite";

export const CURRENCIES = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr" },
    { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
    { code: "MXN", name: "Mexican Peso", symbol: "$" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
    { code: "KRW", name: "South Korean Won", symbol: "₩" },
] as const;

// Mock exchange rates (relative to USD as base)
// In a real app, you'd fetch these from an API like exchangerate-api.com
export const EXCHANGE_RATES: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    JPY: 149.50,
    GBP: 0.79,
    AUD: 1.53,
    CAD: 1.36,
    CHF: 0.88,
    CNY: 7.24,
    SEK: 10.87,
    NZD: 1.67,
    MXN: 17.15,
    SGD: 1.34,
    HKD: 7.83,
    NOK: 10.95,
    KRW: 1342.50,
};

/**
 * Convert amount from one currency to another
 */
export function convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
): number {
    if (fromCurrency === toCurrency) return amount;

    // Convert to USD first, then to target currency
    const amountInUSD = amount / EXCHANGE_RATES[fromCurrency];
    const convertedAmount = amountInUSD * EXCHANGE_RATES[toCurrency];

    return convertedAmount;
}

/**
 * Format currency amount with proper symbol and decimals
 */
export function formatCurrency(amount: number, currencyCode: string): string {
    const currency = CURRENCIES.find(c => c.code === currencyCode);
    const symbol = currency?.symbol || currencyCode;

    // JPY and KRW typically don't use decimal places
    const decimals = currencyCode === "JPY" || currencyCode === "KRW" ? 0 : 2;

    return `${symbol}${amount.toFixed(decimals)}`;
}

export const getAllExpenses = async (tripId: string) => {
    const allExpenses = await database.listDocuments(
        appwriteConfig.databaseId,
        "expenses",
        [Query.equal("tripId", tripId), Query.orderDesc('$createdAt')]
    );

    if (allExpenses.total == 0){
        return [] as Expense[];
    }

    const parsed: Expense[] = allExpenses.documents.map((doc: any) => {
        // In DB, paidBy is stored as a userId (string) and sharedWith is an array of userIds (string[])
        const paidById = String(doc?.paidBy ?? "");
        const sharedWithIds: string[] = Array.isArray(doc?.sharedWith) ? doc.sharedWith.map((id: any) => String(id)) : [];
        return {
            id: doc?.$id ?? "",
            name: String(doc?.name ?? ""),
            amount: Number(doc?.amount ?? 0),
            category: String(doc?.category ?? "Other"),
            currency: String(doc?.currency ?? "USD"),
            isAll: Boolean(doc?.isAll),
            paidBy: { id: paidById, name: "", email: "" } as TripMember,
            sharedWith: sharedWithIds.map((id) => ({ id, name: "", email: "" })) as TripMember[],
        } as Expense;
    });

    return parsed;
}