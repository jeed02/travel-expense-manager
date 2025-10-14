declare interface BaseUser {
    id: string;
    name: string;
    email: string;
    dateJoined: string;
    imageUrl: string;
}

declare interface UserData extends BaseUser {
    itineraryCreated: number | string;
    status: "user" | "admin";
}

declare type User = BaseUser;

declare interface Trip {
    id: string;
    name: string;
    country: string;
    startDate: string;
    endDate: string;
    currencies: string[];
    members: string[];
}

declare interface Expense {
    id: string;
    name: string;
    amount: number;
    category: string;
    currency: string;
    paidBy: string;
    isAll: boolean;
    sharedWith: string[];
}

declare interface Payout {
    id: string;
    owingUser: string;
    owedUser: string;
    amount: number;
    item: string;
    hasPaid: boolean;
}

declare interface TripCardProps {
    id: string;
    name: string;
    members: number;
    budget: number;
}

declare interface Country {
    name: string;
    value: string;
}