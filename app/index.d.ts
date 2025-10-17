declare interface BaseUser {
    id: string;
    name: string;
    email: string;
    dateJoined: string;
    imageUrl: string;
}

declare type User = BaseUser;

declare interface Trip {
    id: string;
    name: string;
    country: string;
    startDate: string;
    endDate: string;
}

declare interface CreateTripResponse {
    id?: string;
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

declare interface Payout {
    id: string;
    owedBy: string;
    owedUser: string;
    amount: number;
    expenseId: string;
    tripId: string;
    hasPaid: boolean;
}

declare interface TripCardProps {
    id: string;
    name: string;
    members: number;
    budget?: number;
}

declare interface Country {
    name: string;
    value: string;
}

interface TripMember {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
}