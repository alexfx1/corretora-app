'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GetMotoristaById, MotoristaDto, PostMotorista } from "@/components/service/MotoristaService";
import { SideBarComponent } from '@/components/menu/SideBar';
import { Corretor } from '@/components/service/CorretorService';
import { Input } from '@/components/utils/InputProps';
import { Disconected } from '@/components/utils/Disconected';
import { Loading } from '@/components/utils/Loading';

export default function MotoristaDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [corretor, setCorretor] = useState<Corretor | null>(null);
    const [motorista, setMotorista] = useState<MotoristaDto>({
        dsTelefone: '',
        dsContato: '',
        cdCpf: '',
        dsNome: '',
        dsPlaca: '',
        dsCidade: '',
        dsEstado: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMotorista = async () => {
            setLoading(true);
            try {
                const data: MotoristaDto = await GetMotoristaById(id as string);
                setMotorista(data);
            } catch (error) {
                console.error("Failed to fetch motorista:", error);
                setError("Motorista não encontrado..");
            } finally {
                setLoading(false);
            }
        };

        fetchMotorista();

    }, [id]);

    useEffect(() => {
        const storedData = localStorage.getItem('corretor');
        if (storedData) {
            const userData: Corretor = JSON.parse(storedData);
            setCorretor(userData);
        }
    }, []);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (motorista) {
            setMotorista({
                ...motorista,
                [e.target.name]: e.target.value,
            });
        }
    };

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (motorista && !isEditing) {
            setLoading(true);
            await PostMotorista(motorista);
            setIsEditing(true);
            setSuccessMessage("Motorista atualizado com sucesso!");
            setLoading(false);
            setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
        }
    };

    if (!motorista) return <p>Carregando motorista...</p>;

    return (
        <div className="bg-[#FFF7E5] flex flex-row h-screen overflow-hidden">
            <SideBarComponent nome={corretor?.dsNome} />
            
            {corretor ? (
                <div className="flex flex-col w-full space-y-6 overflow-y-auto">
                    <div className="bg-white shadow-lg rounded-xl mt-10 p-10 space-y-1 m-10">
                        <div className="flex flex-col space-y-4 items-center">
                            <big><h1 className="text-2xl font-semibold text-gray-800">Detalhes Motorista</h1></big>
                            <button
                                type="button"
                                className={`w-[150px] py-2 px-4 rounded transition duration-200 ${
                                    isEditing
                                    ? 'bg-green-700 shadow-inner'
                                    : 'bg-green-800 shadow-inner'
                                } text-white`}
                                onClick={() => setIsEditing((prev) => !prev)}
                            >
                                {isEditing ? 'Editar' : 'Cancelar'}
                            </button>
                        </div>
                        
                        {/* Success Message */}
                        {successMessage && (
                            <div className="flex justify-center mt-4">
                                <p className="w-[400px] bg-green-100 text-green-800 p-3 rounded text-center border border-green-300 shadow">
                                    {successMessage}
                                </p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <p className="w-[400px] bg-red-100 text-red-800 p-3 rounded text-center border border-red-300">
                                {error}
                            </p>
                        )}

                        {loading ? (
                            <Loading/>
                        ) : (
                            <form onSubmit={handleUpdate} className="max-w-xl mx-auto space-y-5">
                                <Input label="Nome" name="dsNome" value={motorista.dsNome} onChange={handleChange} required readonly={isEditing} />
                                <Input label="CPF" name="cdCpf" value={motorista.cdCpf} onChange={handleChange} required readonly={isEditing} maxLength={11} />
                                <Input label="Placa" name="dsPlaca" value={motorista.dsPlaca} onChange={handleChange} readonly={isEditing} />
                                <Input label="Cidade" name="dsCidade" value={motorista.dsCidade} onChange={handleChange} readonly={isEditing} />
                                <Input label="Estado" name="dsEstado" value={motorista.dsEstado} onChange={handleChange} readonly={isEditing} maxLength={2} />
                                <Input label="Telefone" name="dsTelefone" value={motorista.dsTelefone} onChange={handleChange} readonly={isEditing} />
                                <Input label="Telefone 2 (opcional)" name="dsContato" value={motorista?.dsContato} onChange={handleChange} readonly={isEditing} />

                                <div className="flex flex-row items-center justify-center space-x-3">
                                    <button
                                        type="button"
                                        className="w-[150px] mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md shadow"
                                        onClick={() => router.back()}
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        type="submit"
                                        className={`w-[150px] mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow
                                            ${isEditing ? 'cursor-not-allowed': ''}`}
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            ): (
                <Disconected/>
            )}
        </div>
    );
}
