import getCurrentUser from "../actions/getCurrentUser";
import getFavorites from "../actions/getFavorites";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import FavoritesClient from "./FavoritesClient";


const ListingPage = async () => {

    const listings = await getFavorites();
    const currentUser = await getCurrentUser();

    if (listings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Pas de favoris"
                    subtitle="Vous n'avez pas de voyage favoris, vous pouvez en ajouter en cliquant sur le Coeur"
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <FavoritesClient
                listings={listings}
                currentUser={currentUser}
            />
        </ClientOnly>
    )

}

export default ListingPage;