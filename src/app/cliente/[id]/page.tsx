'use client';
import { useParams } from 'next/navigation';
import ClientForm from '../components/ClientForm';

export default function ClienteDetail() {
    const { id } = useParams();
    return ClientForm("Detalhes Cliente", id as string);
}
