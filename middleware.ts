export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
        "/voyages",
        "/reservations",
        "/favoris",
        "/logements"
    ]
}