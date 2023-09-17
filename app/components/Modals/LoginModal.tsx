"use client";
import axios from 'axios';
import { signIn } from 'next-auth/react'
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';

import React from 'react'
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../Inputs/Input';
import toast from 'react-hot-toast';
import Button from '../Button';
import { useRouter } from 'next/navigation';



const LoginModal = () => {

    const router = useRouter();
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
            email: '',
            password: ''
        }
    });

    //Fonction onSubmit pour se connecter
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        signIn('credentials', {
            ...data,
            redirect: false
        }).then((callback) => {
            setIsLoading(false);

            if (callback?.ok) {
                toast.success('Connexion réussie !');
                router.refresh();
                loginModal.onClose();
            }

            if (callback?.error) {
                toast.error(callback.error)
            }
        })

    }

    //Fonction pour fermer le loginModal et ouvrir le RegisterModal
    const toggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title='Vous revoilà !'
                subtitle='Connectez-vous à votre compte'
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
                        Pas de compte ?
                    </div>
                    <div onClick={toggle} className='text-neutral-800 cursor-pointer hover:underline'>
                        Inscription
                    </div>
                </div>
            </div>

        </div>
    )


    return (
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Connexion"
            actionLabel='Continuer'
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default LoginModal
