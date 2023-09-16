"use client";
import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useRentModal from '@/app/hooks/useRentModal';
import { SafeUser } from '@/app/types';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'
import Avatar from '../Avatar';
import MenuItem from './MenuItem';

interface UserMenuProps {
    currentUser?: SafeUser | null;
}

//Menu de l'utilisateur
const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {

    const router = useRouter();

    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const rentModal = useRentModal();

    const [isOpen, setIsOpen] = useState(false);


    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value); // Inverser la valeur de setIsopen
    }, [])

    //Le Modal de logement pour louer
    const onRent = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen();
        }

        //Ouvrir le rentModal
        rentModal.onOpen();

    }, [currentUser, loginModal, rentModal])

    return (
        <div className='relative'>
            <div className="flex flex-row items-center gap-3">
                <div onClick={onRent}
                    className="
                    hidden
                    md:block
                    text-sm
                    font-semibold
                    py-3
                    px-4
                    rounded-full
                    hover:bg-neutral-100
                    transition
                    cursor-pointer"
                >
                    Mettre mon logement sur BnbAir
                </div>
                <div onClick={toggleOpen}
                    className="
                    p-4
                    md:py-1
                    md:px-2
                    border-[1px]
                    border-neutral-200
                    flex
                    flex-row
                    items-center
                    gap-3
                    rounded-full
                    cursor-pointer
                    hover:shadow-md
                    transition
                    ">
                    <AiOutlineMenu />
                    <div className='hidden md:block'>
                        <Avatar src={currentUser?.image} />
                    </div>
                </div>
            </div>


            {isOpen && (
                <div className="
                absolute
                rounded-xl
                shadow-md
                w-[40vw]
                md:w-3/4
                bg-white
                overflow:hidden
                right-0
                top-12
                text-sm
                ">
                    <div className="flex flex-col cursor-pointer">
                        {currentUser ? (

                            <>
                                <MenuItem
                                    onClick={() => router.push('/voyages')}
                                    label="Mes voyages"
                                />

                                <MenuItem
                                    onClick={() => router.push('/favoris')}
                                    label="Mes favoris"
                                />


                                <MenuItem
                                    onClick={() => router.push('/reservations')}
                                    label="Réservation de mes logements"
                                />


                                <MenuItem
                                    onClick={() => router.push('/logements')}
                                    label="Mes logements"
                                />


                                <MenuItem
                                    onClick={rentModal.onOpen}
                                    label="Ajouter mon logement"
                                />

                                <hr />

                                <MenuItem
                                    onClick={() => signOut()}
                                    label="Déconnexion"
                                />
                            </>
                        ) :
                            (
                                <>
                                    <MenuItem
                                        onClick={loginModal.onOpen}
                                        label="Connexion"
                                    />

                                    <MenuItem
                                        onClick={registerModal.onOpen}
                                        label="Inscription"
                                    />
                                </>
                            )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserMenu