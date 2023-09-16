import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import ReservationsClient from "./ReservationsClient";

const ReservationsPage = async () => {

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Pas connecter"
                    subtitle="Merci de vous connecter"
                />
            </ClientOnly>
        )
    }

    const reservations = await getReservations({
        authorId: currentUser.id
    });

    if (reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Aucune réservation trouvé"
                    subtitle="Pas de réservation pour mes logements"
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <ReservationsClient
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    )

};

export default ReservationsPage;