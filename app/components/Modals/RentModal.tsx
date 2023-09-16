"use client";
import useRentModal from '@/app/hooks/useRentModal'
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Heading from '../Heading';
import CategoryInput from '../Inputs/CategoryInput';
import Counter from '../Inputs/Counter';
import CountrySelect from '../Inputs/CountrySelect';
import ImageUpload from '../Inputs/ImageUpload';
import Input from '../Inputs/Input';
import { categories } from '../Navbar/Categories';
import Modal from './Modal'

//Modal pour louer

enum STEPS {

    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {

    const router = useRouter();
    const rentModal = useRentModal();

    const [step, setStep] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: '',
        }
    });

    const category = watch('category');
    const location = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location])

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        })
    }

    const onBack = () => {
        setStep((value) => value - 1);
    }

    const onNext = () => {
        setStep((value) => value + 1);
    }

    //Fonction pour crée
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        //Si on est pas à la dernière étape
        if (step !== STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);

        axios.post('/api/listings', data)
            .then(() => {
                toast.success('Votre logement a bien été crée !');
                router.refresh();
                reset();
                setStep(STEPS.CATEGORY);
                rentModal.onClose();
            }).catch(() => {
                toast.error('Un problème est survenue..')
            }).finally(() => {
                setIsLoading(false);
            })
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Crée mon logement';
        }

        return 'Suivant';
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined;
        }

        return 'Précédent'
    }, [step])

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title='Quel est le meilleur choix ?'
                subtitle='Veuillez choisir une catégorie'
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto'>

                {categories.map((categorie) => (
                    <div key={categorie.label} className='col-span-1'>
                        <CategoryInput
                            onClick={(category) => setCustomValue('category', category)}
                            selected={category === categorie.label}
                            label={categorie.label}
                            icon={categorie.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    )

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className='flex flex-col  gap-8'>

                <Heading
                    title='Où est situé votre logement ?'
                    subtitle='Aidez les voyageurs à vous trouver !'
                />

                <CountrySelect
                    value={location}
                    onChange={(value) => setCustomValue('location', value)}
                />

                <Map center={location?.latlng} />
            </div>
        )
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Ajouter les informations sur votre logement'
                    subtitle='Choisir les caractéristique du logement'
                />

                <Counter
                    title="Voyageur(s)"
                    subtitle='Combien de voyageurs acceptez-vous ?'
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value)}
                />
                <hr />
                <Counter
                    title="Chambre(s)"
                    subtitle='Combien de chambre avez-vous ?'
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value)}
                />
                <hr />
                <Counter
                    title="Salle de bain"
                    subtitle='Combien de salle de bain avez-vous ?'
                    value={bathroomCount}
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                />
            </div>
        )
    }


    // LES IMAGES
    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Ajouter des photos de votre logement'
                    subtitle='Donnez envie à vos invités avec vos photos'
                />
                <ImageUpload
                    value={imageSrc}
                    onChange={(value) => setCustomValue('imageSrc', value)}

                />
            </div>
        )
    }

    //DESCRIPTION
    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Décrivez votre logement'
                    subtitle='Pas trop long, pas trop court !'
                />
                <Input
                    id="title"
                    label="Nom du logement"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
                <hr />
                <Input
                    id="description"
                    label="Description du logement"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Maintenant, ajouter votre prix'
                    subtitle='Combien est le prix par nuit ?'
                />
                <Input
                    id="price"
                    label='Prix'
                    formatPrice={true}
                    type="number"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }

    return (
        <Modal
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title="Crée mon logement"
            body={bodyContent}
        />
    )
}

export default RentModal