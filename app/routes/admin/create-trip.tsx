"use client"
import {
    useState
} from "react"
import type {Route} from './+types/create-trip'
import {
    toast
} from "sonner"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import {
    z
} from "zod"
import {
    cn
} from "~/lib/utils"
import {
    Button
} from "~/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import {
    Input
} from "~/components/ui/input"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "~/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import {
    Check,
    ChevronsUpDown
} from "lucide-react"
import {
    format
} from "date-fns"

import {
    Calendar
} from "~/components/ui/calendar"
import {
    Calendar as CalendarIcon
} from "lucide-react"
import { MultiSelect } from "~/components/ui/multi-select";

import Header from "~/components/Header";
import {Card} from "~/components/ui/card";

const formSchema = z.object({
    name: z.string({
        error: "Name is required",
    }).min(1),
    countries: z.string({
        error: "Country is required"
    }),
    startDate: z.date(),
    endDate: z.date(),
    supportedCurrencies: z.array(z.string()).min(1, {
        error: "Please select at least one item"
    })
});

export const loader = async () => {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flag");
    const data = await response.json();

    return data.map((country: any) => ({
        name: country.flag + country.name.common,
        value: country.name.common,
    }));
}

const currencyList = [
    {value: "USD", label: "USD"},
    {value: "CAD", label: "CAD"}
]


const CreateTrip = ({loaderData}: Route.ComponentProps) => {
    const countries = loaderData as Country[];
    const [loading, setLoading] = useState(false);


    const countryData = countries.map((country) => ({
        text: country.name,
        value: country.value
    }))

    const form = useForm < z.infer < typeof formSchema >> ({
        resolver: zodResolver(formSchema),
        defaultValues: {
            "startDate": new Date(),
            "endDate": new Date(),
            "supportedCurrencies": []
        },
    })

    const onSubmit = async (values: z.infer < typeof formSchema > ) => {
        // setLoading(true);
        try {
            console.log(values);
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
            );
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header title="Add a new Trip" description="Create a Trip" />

            <section className="wrapper-md">
                <Card><Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

                        <div className="grid grid-cols-12 gap-4">

                            <div className="col-span-4">

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Name your Trip"

                                                    type="text"
                                                    {...field} />
                                            </FormControl>
                                            <FormDescription>Name of your Trip</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>
                        <FormField
                            control={form.control}
                            name="countries"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Country</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}

                                                >
                                                    {field.value
                                                        ? countryData.find(
                                                            (c) => c.value === field.value
                                                        )?.value
                                                        : "Select country"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search country..." />
                                                <CommandList>
                                                    <CommandEmpty>No language found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {countryData.map((c) => (
                                                            <CommandItem
                                                                value={c.value}
                                                                key={c.value}
                                                                onSelect={() => {
                                                                    form.setValue("countries", c.value);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        c.value === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {c.value}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>Country</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-12 gap-4">

                            <div className="col-span-6">

                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Start Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>Beginning of Trip</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>End Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>End date of Trip</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>

                        <FormField
                            control={form.control}
                            name="supportedCurrencies"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Currencies</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={currencyList}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            placeholder="Choose currencies..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="cursor-pointer">Submit</Button>
                    </form>
                </Form></Card>

            </section>

        </main>
    )
}
export default CreateTrip