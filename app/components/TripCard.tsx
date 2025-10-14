import {Link, useLocation} from "react-router";
import {Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,} from "~/components/ui/card";

const TripCard = ({id, name, members, budget} : TripCardProps) => {
    const path = useLocation();


    return (
        <Card className="w-full max-w-sm">
            <Link to={path.pathname === '/' || path.pathname.startsWith('/travel') ? `/travel/${id}` : `/trips/${id}`}>

            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>Members: {members}</CardDescription>
                <CardAction>${budget}</CardAction>
            </CardHeader>
            </Link>
        </Card>
    )
}
export default TripCard
