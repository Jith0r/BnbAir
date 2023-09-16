"use client";
import Container from '@/app/components/Container';
import ListingHead from '@/app/components/listings/ListingHead';
import ListingInfo from '@/app/components/listings/ListingInfo';
import ListingReservation from '@/app/components/listings/ListingReservation';
import { categories } from '@/app/components/Navbar/Categories';
import useLoginModal from '@/app/hooks/useLoginModal';
import { SafeListing, SafeReservation, SafeUser } from '@/app/types';
import { Reservation } from '@prisma/client'
import axios from 'axios';
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Range } from 'react-date-range';
import toast from 'react-hot-toast';

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

interface ListingClientProps {
    reservations?: SafeReservation[]; // Liste des réservations
    listing: SafeListing & {
        user: SafeUser
    };
    currentUser?: SafeUser | null;  // Utilisateur actuellement connecté
}

const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    reservations = [],
    currentUser
}) => {

    // Utilisation d'un hook personnalisé pour la gestion de la boîte de dialogue de connexion
    const loginModal = useLoginModal();
    const router = useRouter();

    // Calcul des dates désactivées pour les réservations existantes
    const disabledDates = useMemo(() => {
        let dates: Date[] = [];

        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate)
            })

            dates = [...dates, ...range];
        });

        return dates;

    }, [reservations]);

    // État local pour le chargement, le prix total et la plage de dates sélectionnée
    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    // Fonction pour créer une nouvelle réservation
    const onCreateReservation = useCallback(() => {
        if (!currentUser) {
            // Ouvre la boîte de dialogue de connexion si l'utilisateur n'est pas connecté
            return loginModal.onOpen();
        }

        setIsLoading(true);

        // Envoie une requête POST à l'API pour créer une réservation
        axios.post('/api/reservations', {
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing?.id
        })
            .then(() => {
                toast.success('Réservation avec succès!');
                setDateRange(initialDateRange);
                //Redirection vers mes voyages
                router.push('/voyages');
            })
            .catch(() => {
                toast.error('Un problème est survenue!')
            })
            .finally(() => {
                setIsLoading(false);
            })

    }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal])

    // Calculer le prix total en fonction de la plage de dates sélectionnée
    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays(dateRange.endDate, dateRange.startDate);

            if (dayCount && listing.price) {
                setTotalPrice(dayCount * listing.price);
            } else {
                setTotalPrice(listing.price)
            }
        }

    }, [dateRange, listing.price])

    // Recherche de la catégorie de la liste
    const category = useMemo(() => {
        return categories.find((item) =>
            item.label === listing.category);
    }, [listing.category]);



    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                    />
                    <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-7
                    md:gap-10
                    mt-6
                    ">
                        <ListingInfo
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            roomCount={listing.roomCount}
                            guestCount={listing.guestCount}
                            bathroomCount={listing.bathroomCount}
                            locationValue={listing.locationValue}

                        />
                        <div className="
                        order-first
                        mb-10
                        md:order-last
                        md:col-span-3
                        ">
                            <ListingReservation
                                price={listing.price}
                                totalPrice={totalPrice}
                                onChangeDate={(value) => setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateReservation}
                                disabled={isLoading}
                                disabledDates={disabledDates}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ListingClient