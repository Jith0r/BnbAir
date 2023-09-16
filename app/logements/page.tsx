
import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";
import LogementsClient from "./LogementsClient";


const LogementPage = async () => {
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

    const listings = await getListings({
        userId: currentUser.id
    })

    if (listings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Aucun logement trouvé"
                    subtitle="Vous n'avez aucun logement ajouté"
                />
            </ClientOnly>
        )

    }

    return (
        <ClientOnly>
            <LogementsClient
                listings={listings}
                currentUser={currentUser}
            />
        </ClientOnly>
    )


}

export default LogementPage;