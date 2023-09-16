"use client"
import React from 'react'
import Container from '../Container'

import { IoDiamond } from 'react-icons/io5'
import { BsSnow } from 'react-icons/bs'
import { FaSkiing } from 'react-icons/fa'
import { TbBeach, TbMountain } from 'react-icons/tb'
import { LiaSwimmingPoolSolid } from 'react-icons/lia'
import { MdOutlineVilla } from 'react-icons/md'
import CategoryBox from '../CategoryBox'
import { usePathname, useSearchParams } from 'next/navigation'
import {
    GiBarn,
    GiBoatFishing,
    GiCactus,
    GiCastle,
    GiCaveEntrance,
    GiForestCamp,
    GiIsland
} from 'react-icons/gi'

export const categories = [

    {
        label: 'Piscine',
        icon: LiaSwimmingPoolSolid,
        description: 'Ce logement a une piscine'
    },
    {
        label: 'Bord de mer',
        icon: TbBeach,
        description: 'Ce logement est proche de la plage'
    },
    {
        label: 'Moderne',
        icon: MdOutlineVilla,
        description: 'Ce logement est moderne'
    },
    {
        label: 'Campagne',
        icon: TbMountain,
        description: 'Ce logement est situé en campagne'
    },
    {
        label: 'Îles',
        icon: GiIsland,
        description: 'Ce logement est situé dans une île'
    },
    {
        label: 'Lacs',
        icon: GiBoatFishing,
        description: 'Ce logement est situé proche des lacs'
    },
    {
        label: 'Au pied des pistes',
        icon: FaSkiing,
        description: 'Ce logement est situé proche des pistes de ski'
    },
    {
        label: 'Grandes demeures',
        icon: GiCastle,
        description: 'Ce logement est une Grandes demeures'
    },
    {
        label: 'Forêt',
        icon: GiForestCamp,
        description: 'Ce logement est proche des forêts'
    },
    {
        label: 'Arctique',
        icon: BsSnow,
        description: 'Ce logement est situé vers les endroits frais'
    },
    {
        label: 'Grotte',
        icon: GiCaveEntrance,
        description: 'Ce logement est situé vers les grottes'
    },
    {
        label: 'Désert',
        icon: GiCactus,
        description: 'Ce logement est situé vers les déserts'
    },
    {
        label: 'Granges',
        icon: GiBarn,
        description: 'Ce logement est un granges pour les cow-boys'
    },
    {
        label: 'Luxe',
        icon: IoDiamond,
        description: 'Ce logement est un luxe'
    },


]

const Categories = () => {

    const params = useSearchParams();
    const category = params?.get('category');
    const pathName = usePathname();

    const isMainPage = pathName === '/';

    if (!isMainPage) {
        return null;
    }

    return (
        <Container>
            <div className="
            pt-4
            flex
            flex-row
            items-center
            justify-between
            overflow-x-auto
            ">
                {categories.map((categorie) => (
                    <CategoryBox
                        key={categorie.label}
                        label={categorie.label}
                        selected={category === categorie.label}
                        icon={categorie.icon}
                    />
                ))}
            </div>
        </Container>
    )
}

export default Categories