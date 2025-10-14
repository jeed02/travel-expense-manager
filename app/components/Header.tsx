import React from 'react'
import {Link, useLocation} from "react-router";
import {cn} from "~/lib/utils";
import {Button} from "~/components/ui/button";
import {PlusIcon} from "lucide-react";

interface Props{
    title: string,
    description: string,
    ctaText?: string,
    ctaUrl?: string,
}

const Header = ({title, description, ctaText, ctaUrl}: Props) => {
    const location = useLocation();
    return (
        <header className="header">
            <article>
                <h1 className={cn("text-foreground",
                    location.pathname === '/' ? 'text-2xl md:text-4xl font-bold' :
                        'text-xl md:text-2xl font-semibold')}>
                    {title}
                </h1>
                <p className={cn("text-muted-foreground font-normal",
                    location.pathname === '/' ? 'text-base md:text-lg' :
                        'text-sm md:text-lg')}>
                    {description}
                </p>
            </article>

            {ctaText && ctaUrl && (<Link to={ctaUrl}>
                <Button variant="outline" size="icon" aria-label={ctaText}>
                    <PlusIcon />
                </Button>
            </Link>)}


        </header>
    )
}
export default Header
