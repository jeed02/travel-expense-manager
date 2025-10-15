import {type RouteConfig, index, layout, route} from "@react-router/dev/routes";

export default [
    route('sign-in', 'routes/root/sign-in.tsx'),
    layout('routes/admin/admin-layout.tsx', [
        route('trips', 'routes/admin/all-trips.tsx'),
        route('trips/create', 'routes/admin/create-trip.tsx')

    ])
] satisfies RouteConfig;
