"use client";
import useSearchModal from '@/app/hooks/useSearchModal'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react'
import Modal from './Modal'
import { Range } from 'react-date-range';
import dynamic from 'next/dynamic';
import CountrySelect, { CountrySelectValue } from '../Inputs/CountrySelect';
import qs from 'query-string';
import { formatISO } from 'date-fns';
import Heading from '../Heading';
import Calendar from '../Inputs/Calendar';
import Counter from '../Inputs/Counter';

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const SearchModal = () => {

    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();

    const [location, setLocation] = useState<CountrySelectValue>()
    const [step, setStep] = useState(STEPS.LOCATION);
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    })

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location]);

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, [])

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, [])

    const onSubmit = useCallback(async () => {

        if (step !== STEPS.INFO) {
            return onNext();
        }

        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString())
        }

        const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount,
        };

        if (dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate)
        }

        if (dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate)
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true })

        setStep(STEPS.LOCATION)
        searchModal.onClose();
        router.push(url)
    }, [
        step,
        searchModal,
        location,
        router,
        guestCount,
        bathroomCount,
        roomCount,
        dateRange,
        onNext,
        params
    ]);


    const actionLabel = useMemo(() => {

        if (step === STEPS.INFO) {
            return 'Recherche';
        }
        return 'Suivant';
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
            return undefined;
        }

        return 'Précédent'
    }, [step])

    let bodyContent = (
        <div className='flex flex-col gap-8'>
            <Heading
                title="Où voulez-vous aller ?"
                subtitle="Trouvez la meilleure destination !"
            />
            <CountrySelect
                value={location}
                onChange={(value) => {
                    setLocation(value as CountrySelectValue)
                }}
            />
            <hr />
            <Map center={location?.latlng} />
        </div>
    )

    if (step === STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Quand voulez-vous partir ?"
                    subtitle="A vous de choisir !"
                />
                <Calendar
                    value={dateRange}
                    onChange={(value) => setDateRange(value.selection)}
                />
            </div>
        )
    }


    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Plus d'information"
                    subtitle="Trouvez votre logement parfait !"
                />

                <Counter
                    title="Voyageur(s)"
                    subtitle='Combien de voyageurs ?'
                    value={guestCount}
                    onChange={(value) => setGuestCount(value)}
                />

                <Counter
                    title="Chambre(s)"
                    subtitle='Combien de chambres avez-vous besoin ?'
                    value={roomCount}
                    onChange={(value) => setRoomCount(value)}
                />

                <Counter
                    title="Salle de bain(s)"
                    subtitle='Combien de salle de bain avez-vous besoin ?'
                    value={bathroomCount}
                    onChange={(value) => setBathroomCount(value)}
                />
            </div>
        )
    }

    return (
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Filtre de recherche"
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack} // Pour revenir en arrière
            body={bodyContent}

        />
    )
}

export default SearchModal