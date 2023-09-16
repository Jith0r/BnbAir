"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react'
import { IconType } from 'react-icons'
import qs from 'query-string'

interface CategoryBoxProps {
    icon: IconType;
    label: string;
    selected?: boolean
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ icon: Icon, label, selected }) => {

    const router = useRouter();
    const params = useSearchParams();

    //Ce code gère le clic sur un élément et met à jour l'URL en fonction de la valeur de label tout en prenant en compte les paramètres d'URL existants. 
    //Si la valeur de label correspond à la valeur actuelle de la propriété 'category' dans les paramètres d'URL, cette propriété est supprimée de l'URL.
    //Ensuite, la nouvelle URL est utilisée pour effectuer une navigation.

    const handleClick = useCallback(() => {
        //Objet vide
        let currentQuery = {};

        // Vérifier si on a un params
        if (params) {
            // Coverti en chaine de caractère
            // Le résultat est stocker dans currentQuery
            currentQuery = qs.parse(params.toString());
        }

        // Créer un nouvel objet updatedQuery en copiant currentQuery et en ajoutant la propriété 'category' avec la valeur de 'label'
        const updatedQuery: any = {
            ...currentQuery,
            category: label
        }

        // Vérifier si la propriété 'category' dans les paramètres existe et correspond à 'label'. Si oui, la supprimer de updatedQuery.
        if (params?.get('category') === label) {
            delete updatedQuery.category;
        }

        // Construire une URL en utilisant updatedQuery et spécifier que les valeurs null ou undefined doivent être exclues de l'URL.
        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true });

        // Utiliser le router pour naviguer vers la nouvelle URL.
        router.push(url);

    }, [label, params, router])


    return (
        <div
            onClick={handleClick}
            className={`
        flex
        flex-col
        items-center
        justify-center
        gap-2
        p-3
        border-b-2
        hover:text-neutral-800
        transition
        cursor-pointer
        ${selected ? 'border-b-neutral-800' : 'border-transparent'}
        ${selected ? 'text-neutral-800' : 'text-neutral-500'}
        `}>

            <Icon size={26} />

            <div className="font-medium text-sm">
                {label}
            </div>
        </div>
    )
}

export default CategoryBox