"use client";
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useRegisterModal from '@/app/hooks/useRegisterModal';

import React from 'react'
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../Inputs/Input';
import toast from 'react-hot-toast';
import Button from '../Button';
import useLoginModal from '@/app/hooks/useLoginModal';

const RegisterModal = () => {

    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    //Fonction onSubmit
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);


        axios.post('/api/register', data).then(() => {
            toast.success("Inscription réussie")
            registerModal.onClose();
            loginModal.onOpen();
        }).catch((error) => {
            toast.error("Un problème est survenue..");
        }).finally(() => {
            setIsLoading(false);
        })

    }

    //Fonction pour fermer le RegisterModal et ouvrir le LoginModal
    const toggle = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen();
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title='Bienvenue sur BnbAir'
                subtitle='Crée un nouveau compte'
            />
            <Input
                id="email"
                label="Adresse e-mail"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />

            <Input
                id="name"
                label="Nom et prénom"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />

            <Input
                id="password"
                label="Mot de passe"
                disabled={isLoading}
                register={register}
                errors={errors}
                 type="password"
                required
            />
        </div>
    )


    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button
                outline
                label="Continuer avec Google"
                icon={FcGoogle}
                onClick={() => signIn('google')}
            />

            <Button
                outline
                label="Continuer avec Github"
                icon={AiFillGithub}
                onClick={() => signIn('github')}
            />

            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className='flex flex-row items-center justify-center gap-2'>
                    <div>
                        Déjà un compte ?
                    </div>
                    <div onClick={toggle} className='text-neutral-800 cursor-pointer hover:underline'>
                        Connexion
                    </div>
                </div>
            </div>

        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title="Inscription"
            actionLabel='Continuer'
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default RegisterModal
