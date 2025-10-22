import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  route("sign-in", "routes/root/sign-in.tsx"),
  // Invite route (public entry for joining a trip)
  route("invite/:tripId", "routes/invite/$tripId.tsx"),

  // API routes
  route("api/create-trip", "routes/api/create-trip.ts"),
  route("api/create-expense", "routes/api/create-expense.ts"),
  route("api/invite-member", "routes/api/invite-member.ts"),
  
  // Admin layout and pages
  layout("routes/admin/admin-layout.tsx", [
    route("trips", "routes/admin/all-trips.tsx"),
    route("trips/create", "routes/admin/create-trip.tsx"),
    route('trips/:tripId', 'routes/admin/trip-detail.tsx'),
  ]),
] satisfies RouteConfig;
