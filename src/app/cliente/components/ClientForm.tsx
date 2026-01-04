'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GetClienteById, ClienteDto, PostCliente } from "@/components/service/ClienteService";
import { SideBarComponent } from '@/components/menu/SideBar';
import { Corretor } from '@/components/service/CorretorService';
import { Bank, GetBanks } from "@/components/service/BancoService";
import { Select } from "@/components/utils/Search";
import { estados } from '@/components/utils/EstadosBr';
import { Disconected } from '@/components/utils/Disconected';
import { Loading } from '@/components/utils/Loading';
import { UserRoundPen } from "lucide-react";

export default function ClientForm(pageTitle: string, id?: string) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [corretor, setCorretor] = useState<Corretor | null>(null);
    const [cliente, setCliente] = useState<ClienteDto>({
        dsTelefone: '',
        dsContato: '',
        dsNome: '',
        cdCpfCnpj: '',
        dsEndereco: '',
        cdCep: '',
        dsCidade: '',
        dsEstado: '',
        dsIns: '',
        dsBanco: '',
        cdAgencia: '',
        cdConta: '',
        dsChavePix: ''
    });
    const [bancos, setBancos] = useState<Bank[]>([]);

    useEffect(() => {
        const fetchCliente = async () => {
            setLoading(true);
            try {
                const data: ClienteDto = await GetClienteById(id as string);
                setCliente(data);
            } catch (error) {
                console.error("Failed to fetch cliente:", error);
                setError("Cliente não encontrado..");
            } finally {
                setLoading(false);
            }
        };

        if(id) {
            fetchCliente();
        }

    }, [id]);

    useEffect(() => {
        const storedData = localStorage.getItem('corretor');
        if (storedData) {
            const userData: Corretor = JSON.parse(storedData);
            setCorretor(userData);
        }
    }, []);

    useEffect(() => {
        const fetchBancos = async () => {
            setLoading(true);
            const data = await GetBanks();
            setBancos(data);
        };
        fetchBancos();
        setLoading(false);
    }, []);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (cliente) {
            setCliente({
                ...cliente,
                [e.target.name]: e.target.value,
            });
        }
    };

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (cliente) {
            setLoading(true);
            await PostCliente(cliente);
            setSuccessMessage("Cliente atualizado com sucesso!");
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
                            <UserRoundPen size={30}/>
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
                                            value={cliente.dsNome ?? ""} 
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cdCpfCnpj" className='mb-1 text-sm font-medium text-gray-700'>CPF/CNPJ</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='cdCpfCnpj' 
                                            name='cdCpfCnpj' 
                                            type="text" 
                                            value={cliente.cdCpfCnpj ?? ""} 
                                            maxLength={14} 
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsIns" className='mb-1 text-sm font-medium text-gray-700'>INSC.</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsIns' 
                                            name='dsIns' 
                                            type="text" 
                                            value={cliente.dsIns ?? ""} 
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
                                            type="tel"
                                            pattern="^\(\d{2}\)\s\d{4,5}-\d{4}$*" 
                                            value={cliente.dsTelefone ?? ""} 
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
                                            value={cliente.dsContato ?? ""} 
                                            onChange={handleChange}
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
                                            value={cliente.dsCidade ?? ""} 
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsEstado" className='mb-1 text-sm font-medium text-gray-700'>Estado</label>
                                        <Select
                                            id="dsEstado"
                                            options={estados.map((estado) => estado)}
                                            value={cliente.dsEstado}
                                            onChange={(selectedEstado) =>
                                                setCliente((prev) => ({
                                                    ...prev,
                                                    dsEstado: selectedEstado,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cdCep" className='mb-1 text-sm font-medium text-gray-700'>CEP</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='cdCep' 
                                            name='cdCep' 
                                            type="text" 
                                            value={cliente.cdCep ?? ""} 
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-row space-x-5 items-center mt-4'>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsEndereco" className='mb-1 text-sm font-medium text-gray-700'>Endereço/Fazenda</label>
                                        <input className='w-[690px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsEndereco' 
                                            name='dsEndereco' 
                                            type="text" 
                                            value={cliente.dsEndereco ?? ""} 
                                            onChange={handleChange}
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
                                            value={cliente.cdAgencia ?? ""} 
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cdConta" className='mb-1 text-sm font-medium text-gray-700'>Conta</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='cdConta' 
                                            name='cdConta' 
                                            type="text" 
                                            value={cliente.cdConta ?? ""} 
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsChavePix" className='mb-1 text-sm font-medium text-gray-700'>PIX</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsChavePix' 
                                            name='dsChavePix' 
                                            type="text" 
                                            value={cliente.dsChavePix ?? ""} 
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-row space-x-5 items-center mt-4'>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsBanco" className='mb-1 text-sm font-medium text-gray-700'>Nome do Banco</label>
                                        <Select
                                            id="dsBanco"
                                            options={bancos.map((bank) => bank.fullName)}
                                            value={cliente.dsBanco}
                                            width='w-[630px]'
                                            onChange={(selectedBanco) =>
                                                setCliente((prev) => ({
                                                    ...prev,
                                                    dsBanco: selectedBanco,
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
