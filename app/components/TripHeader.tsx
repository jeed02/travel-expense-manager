import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "./ui/avatar";
import { Badge } from "./ui/badge";
import {Calendar, MapPin, Pencil, Users} from "lucide-react";
import {Button} from "~/components/ui/button";
import {formatDate} from "~/lib/utils";


interface TripHeaderProps {
    tripName: string;
    country: string;
    startDate: string;
    endDate: string;
    members: TripMember[];
}

export function TripHeader({
                               tripName,
                               country,
                               startDate,
                               endDate,
                               members,
                           }: TripHeaderProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="mb-2">{tripName}</CardTitle>
                        <div className="flex flex-wrap gap-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <MapPin className="size-4" />
                                <span>{country}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="size-4" />
                                <span>
                  {formatDate(startDate)} - {formatDate(endDate)}
                </span>
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">
                        <Pencil className="size-4 mr-2" />
                        Edit Trip
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="size-4" />
                        <span>Members</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center gap-2"
                            >
                                <Avatar className="size-8">
                                    <AvatarImage
                                        src={member.imageUrl}
                                        alt={member.name}
                                    />
                                    <AvatarFallback>
                                        {member.name}
                                    </AvatarFallback>
                                </Avatar>
                                <span>{member.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}