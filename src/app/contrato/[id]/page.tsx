'use client';
import { useParams } from 'next/navigation';
import ContratoForm from "../components/ContratoForm";

export default function EditarContrato() {
    const { id } = useParams();
    return ContratoForm("Editar Contrato", id?.toString());
}
