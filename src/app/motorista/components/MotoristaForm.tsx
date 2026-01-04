'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GetMotoristaById, MotoristaDto, PostMotorista } from "@/components/service/MotoristaService";
import { SideBarComponent } from '@/components/menu/SideBar';
import { Corretor } from '@/components/service/CorretorService';
import { Disconected } from '@/components/utils/Disconected';
import { Loading } from '@/components/utils/Loading';
import { Tractor } from 'lucide-react';
import { Select } from '@/components/utils/Search';
import { estados } from '@/components/utils/EstadosBr';

export default function MotoristaForm(pageTitle: string, id?: string) {
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

        if(id) {
            fetchMotorista();
        }

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

    return (
        <div className="bg-[#FFF7E5] flex flex-row h-screen overflow-hidden">
            <SideBarComponent nome={corretor?.dsNome} />
            
            {loading ? (
                <Loading/>
            ) : (
                <>
                {corretor ? (
                <div className="flex flex-col w-full space-y-6 overflow-y-auto">
                    <div className="bg-white shadow-lg rounded-xl mt-10 p-10 space-y-5 m-10">
                        <div className="flex flex-row space-x-4 items-center">
                            <Tractor size={30}/>
                            <big><h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1></big>
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

                        <form onSubmit={handleUpdate} className="space-y-5">
                            <div className='flex flex-col border-gray-400 border-2 p-4 rounded-md shadow-sm'>
                                <span className='font-semibold mb-4'>Informações Pessoais</span>
                                <div className="flex flex-row space-x-5 items-center">
                                    <div className="flex flex-col">
                                        <label htmlFor="dsNome" className='mb-1 text-sm font-medium text-gray-700'>Nome</label>
                                        <input className='w-[350px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsNome' 
                                            name='dsNome' 
                                            type="text" 
                                            value={motorista.dsNome ?? ''} 
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cdCpf" className='mb-1 text-sm font-medium text-gray-700'>CPF</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='cdCpf' 
                                            name='cdCpf' 
                                            type="text"
                                            value={motorista.cdCpf ?? ''} 
                                            maxLength={14} 
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col border-gray-400 border-2 p-4 rounded-md shadow-sm'>
                                <span className='font-semibold mb-4'>Contato</span>
                                <div className='flex flex-row space-x-5 items-center'>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsTelefone" className='mb-1 text-sm font-medium text-gray-700'>Telefone/WhatsApp</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsTelefone' 
                                            name='dsTelefone' 
                                            type="number" 
                                            value={motorista.dsTelefone ?? 0} 
                                            maxLength={20}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsContato" className='mb-1 text-sm font-medium text-gray-700'>E-mail ou Telefone alternativo</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsContato' 
                                            name='dsContato' 
                                            type="text" 
                                            value={motorista.dsContato ?? ''} 
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col border-gray-400 border-2 p-4 rounded-md shadow-sm'>
                                <span className='font-semibold mb-4'>Veículo e Localização</span>
                                <div className='flex flex-row space-x-5 items-center'>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsPlaca" className='mb-1 text-sm font-medium text-gray-700'>Placa</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsPlaca' 
                                            name='dsPlaca' 
                                            type="text" 
                                            value={motorista.dsPlaca ?? ''} 
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsCidade" className='mb-1 text-sm font-medium text-gray-700'>Cidade</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsCidade' 
                                            name='dsCidade' 
                                            type="text" 
                                            value={motorista.dsCidade ?? ''} 
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsEstado" className='mb-1 text-sm font-medium text-gray-700'>Estado</label>
                                        <Select
                                            id="dsEstado"
                                            options={estados.map((estado) => estado)}
                                            value={motorista.dsEstado}
                                            onChange={(selectedEstado) =>
                                                setMotorista((prev) => ({
                                                    ...prev,
                                                    dsEstado: selectedEstado,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

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
                                    className={`w-[150px] mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow`}
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ): (
                <Disconected/>
            )}
                </>
            )}
        </div>
    );
}
