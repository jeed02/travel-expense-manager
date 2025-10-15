import React from 'react'
import {Outlet, redirect} from "react-router";
import {getExistingUser, storeUserData} from "~/appwrite/auth";
import {account} from "~/appwrite/client";
import Navbar from "~/components/Navbar";


export async function clientLoader() {
    try {
        const user = await account.get();

        if (!user.$id) return redirect('/sign-in') ;

        const existingUser = await getExistingUser(user.$id);

        if(existingUser?.status === 'user'){
            return redirect('/trips');
        }

        return existingUser?.$id ? existingUser : await storeUserData();
    } catch (e) {
        console.error('Error in clientLoader', e);
        return redirect('/sign-in');
    }
}

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <aside className="children">
                <Navbar/>
                <Outlet />
            </aside>
        </div>
    )
}
export default AdminLayout
