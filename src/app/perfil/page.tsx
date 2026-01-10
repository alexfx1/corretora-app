'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SideBarComponent } from '@/components/menu/SideBar';
import { Corretor } from '@/components/service/CorretorService';
import { PostCorretor } from "@/components/service/CorretorService";
import { Bank, GetBanks } from "@/components/service/BancoService";
import { Select } from "@/components/utils/Search";
import { Disconected } from "@/components/utils/Disconected";
import { Loading } from "@/components/utils/Loading";
import { UserCircle } from "lucide-react";
import { estados } from "@/components/utils/EstadosBr";

export default function Perfil() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [corretor, setCorretor] = useState<Corretor | null>(null);
    const [bancos, setBancos] = useState<Bank[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem('corretor');
        if (storedData) {
            const userData: Corretor = JSON.parse(storedData);
            setCorretor(userData);
        }
    }, []);

    useEffect(() => {
        const fetchBancos = async () => {
        const data = await GetBanks();
        setBancos(data);
        };
        fetchBancos();
    }, []);

    const handleChangeCorretor = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setCorretor((prev) => {
            if (!prev) return prev;
            return { ...prev, [id]: value };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);
        try {
            if(corretor) {
                const resp = await PostCorretor(corretor);
                setSuccessMessage("Informações atualizadas com sucesso!");
                localStorage.setItem("corretor", JSON.stringify(resp));
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 6000);
            }
        } catch (error) {
            setError("Servidor indisponível");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return(
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
                            <UserCircle size={30}/>
                            <big><h1 className="text-2xl font-semibold text-gray-800">Meu Perfil</h1></big>
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

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className='flex flex-col border-gray-400 border-2 p-4 rounded-md shadow-sm'>
                                <span className='font-semibold mb-4'>Informações Pessoais</span>
                                <div className="flex flex-row space-x-5 items-center">
                                    <div className="flex flex-col">
                                        <label htmlFor="dsNome" className='mb-1 text-sm font-medium text-gray-700'>Nome</label>
                                        <input className='w-[350px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsNome' 
                                            name='dsNome' 
                                            type="text" 
                                            value={corretor.dsNome ?? ''} 
                                            onChange={handleChangeCorretor}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cdCpf" className='mb-1 text-sm font-medium text-gray-700'>CPF</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='cdCpf' 
                                            name='cdCpf' 
                                            type="text" 
                                            value={corretor.cdCpf ?? ''} 
                                            maxLength={11} 
                                            onChange={handleChangeCorretor}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col border-gray-400 border-2 p-4 rounded-md shadow-sm'>
                                <span className='font-semibold mb-4'>Localização</span>
                                <div className='flex flex-row space-x-5 items-center'>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsCidade" className='mb-1 text-sm font-medium text-gray-700'>Cidade</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsCidade' 
                                            name='dsCidade' 
                                            type="text" 
                                            value={corretor.dsCidade ?? ''} 
                                            onChange={handleChangeCorretor}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsEstado" className='mb-1 text-sm font-medium text-gray-700'>Estado</label>
                                        <Select
                                            id="dsEstado"
                                            options={estados}
                                            value={corretor.dsEstado}
                                            onChange={(estado: string) =>
                                                setCorretor((prev) => {
                                                    if(!prev) return prev;
                                                    return { ...prev, dsEstado: estado}
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col border-gray-400 border-2 p-4 rounded-md shadow-sm'>
                                <span className='font-semibold mb-4'>Dados Bancários</span>
                                <div className='flex flex-row space-x-5 items-center'>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cdAgencia" className='mb-1 text-sm font-medium text-gray-700'>Agência</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='cdAgencia' 
                                            name='cdAgencia' 
                                            type="text" 
                                            value={corretor.cdAgencia ?? ''} 
                                            onChange={handleChangeCorretor}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cdConta" className='mb-1 text-sm font-medium text-gray-700'>Conta</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='cdConta' 
                                            name='cdConta' 
                                            type="text" 
                                            value={corretor.cdConta ?? ''} 
                                            onChange={handleChangeCorretor}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsChavePix" className='mb-1 text-sm font-medium text-gray-700'>PIX</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsChavePix' 
                                            name='dsChavePix' 
                                            type="text" 
                                            value={corretor.dsChavePix ?? ''} 
                                            onChange={handleChangeCorretor}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-row space-x-5 items-center mt-4'>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsBanco" className='mb-1 text-sm font-medium text-gray-700'>Banco</label>
                                        <Select
                                            id="dsBanco"
                                            width='w-[350px]'
                                            options={bancos.map((banco) => banco.fullName)}
                                            value={corretor.dsBanco}
                                            onChange={(selectedBanco: string) =>
                                                setCorretor((prev) => {
                                                    if (!prev) return prev;
                                                    return { ...prev, dsBanco: selectedBanco };
                                                })
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
    )
}