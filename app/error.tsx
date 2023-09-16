"use client";
import React, { useEffect } from 'react'
import EmptyState from './components/EmptyState';

interface ErrorStateProps {
    error: Error
}

const Error: React.FC<ErrorStateProps> = ({ error }) => {

    useEffect(() => {
        console.log(error);
    }, [error])

    return (
        <EmptyState
            title="Hum.."
            subtitle="Quelque chose ne va pas, la page n'existe pas ou autres erreurs"
        />
    )
}

export default Error