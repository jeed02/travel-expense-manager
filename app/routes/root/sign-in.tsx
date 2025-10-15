import { Button } from "~/components/ui/button"
import { FcGoogle } from "react-icons/fc";
import {account} from "~/appwrite/client";
import {redirect} from "react-router";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import {loginWithGoogle} from "~/appwrite/auth";

export async function clientLoader() {
    try {
        const user = await account.get();

        if (user.$id) return redirect('/trips');
    } catch (e) {
        console.error('Error fetching user', e);
    }
}

const SignIn = () => {
    return (
        <main className="w-full h-screen flex">
            <section className="size-full flex justify-center items-center">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Start your travel journey</CardTitle>
                        <CardDescription>
                            Sign in with Google to manage your expenses and trips with ease
                        </CardDescription>
                    </CardHeader>

                    <CardFooter className="flex-col gap-2">
                        <Button type="button" className="w-full" onClick={() => loginWithGoogle()}>
                            Login with Google
                            <FcGoogle />
                        </Button>
                    </CardFooter>
                </Card>
            </section>

        </main>

    )
}
export default SignIn
