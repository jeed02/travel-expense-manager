import React from 'react'
import { Link, useLoaderData, useNavigate } from "react-router";
import { logoutUser } from "~/appwrite/auth";
import { IoIosLogOut } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { FaPaperPlane } from "react-icons/fa";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";

const Navbar = () => {
    const user = useLoaderData();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate('/sign-in');
    }

    const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

    const goProfile = () => {
        navigate('/profile');
    }

    return (
        <header className="border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-12 lg:mb-10">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link to="/trips" className="flex items-center gap-2">
                        <div className="size-6 rounded bg-primary flex justify-center items-center" >
                            <FaPaperPlane className="text-white"/>
                        </div>
                        <span className="font-semibold">Trip Expense Manager</span>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="User menu">
                                <Avatar className="size-8">
                                    {user?.imageUrl ? (
                                        <AvatarImage src={user?.imageUrl} alt={user?.name || "User"} />
                                    ) : null}
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>{user?.name || user?.email || "User"}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={goProfile}>Profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout} variant="destructive">
                                Logout
                                <IoIosLogOut/>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

// Export both named and default to satisfy various imports
export { Navbar as Navbar05 }
export default Navbar
