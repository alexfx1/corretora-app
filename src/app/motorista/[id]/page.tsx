'use client';
import { useParams } from 'next/navigation';
import MotoristaForm from '../components/MotoristaForm';

export default function MotoristaDetail() {
    const { id } = useParams();
    return MotoristaForm("Detalhe Motorista", id as string);
}
