'use client';
import "flowbite";
import "flowbite-datepicker";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ClienteDto, GetAllClients } from "@/components/service/ClienteService";
import { SideBarComponent } from '@/components/menu/SideBar';
import { Corretor } from '@/components/service/CorretorService';
import { Bank, GetBanks } from "@/components/service/BancoService";
import { estados } from '@/components/utils/EstadosBr';
import { Disconected } from '@/components/utils/Disconected';
import { Loading } from '@/components/utils/Loading';
import { FilePenLine, RefreshCcw, Pencil } from "lucide-react";
import { GetAllMotorista, MotoristaDto } from '@/components/service/MotoristaService';
import { ContratoDto, SaveContrato } from '@/components/service/ContratoService';
import { Search } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse } from 'date-fns';


import Modal from '@/components/utils/Modal';
import { Select } from '@/components/utils/Search';
import { GetAllMercadoria, MercadoriaDto } from '@/components/service/MercadoriaService';

export default function NovoContrato() {
    const initialStateClient: ClienteDto = {
        cdCliente: undefined,
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
    };

    const initialStateMotorista: MotoristaDto = {
        cdMotorista: undefined,
        dsTelefone: '',
        dsContato: '',
        cdCpf: '',
        dsNome: '',
        dsPlaca: '',
        dsCidade: '',
        dsEstado: '',
    };

    const initialStateMercadoria: MercadoriaDto = {
        nome: '',
        flAtivo: true
    }

    const [buttonClients, setButtonClients] = useState(false);
    const [buttonMotoristas, setButtonMotoristas] = useState(false);

    const [openComprador, setOpenComprador] = useState(false);
    const [openVendedor, setOpenVendedor] = useState(false);
    const [openMotorista, setOpenMotorista] = useState(false);

    const [searchComprador, setSearchComprador] = useState("");
    const [searchVendedor, setSearchVendedor] = useState("");
    const [searchMotorista, setSearchMotorista] = useState("");


    // Page loadings
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [corretor, setCorretor] = useState<Corretor | null>(null);

    // Form requests
    const [bancos, setBancos] = useState<Bank[]>([]);
    const [clients, setArrayClients] = useState<ClienteDto[]>([]);
    const [motoristas, setArrayMotoristas] = useState<MotoristaDto[]>([]);
    const [mercadorias, setArrayMercadorias] = useState<MercadoriaDto[]>([]);

    // Form body call objects
    const [comprador, setComprador] = useState<ClienteDto>(initialStateClient);
    const [vendedor, setVendedor] = useState<ClienteDto>(initialStateClient);
    const [motorista, setMotorista] = useState<MotoristaDto>(initialStateMotorista);
    const [mercadoria, setMercadoria] = useState<MercadoriaDto>(initialStateMercadoria);

    // Contract form request body
    const [contrato, setContrato] = useState<ContratoDto>({
        cdCorretor: 0,
        dtContrato: '',
        comprador: comprador,
        vendedor: vendedor,
        motorista: motorista,
        mercadoria: {
            dsMercadoria: '',
            flAtivo: true,
        },
        dsStatus: '',
        vlQuantidade: 0,
        vlQuantidadeSaco: 0,
        precoSaco: 0,
        vlKilo: 0,
        dsPadraoTolerancia: '',
        dsArmazenagem: '',
        dsEnderecoEntrega: '',
        dsEmbalagem: 'A granel',
        dsPesoQualidade: 'Na origem',
        dsCargaConta: '',
        dsPagamento: 'SOBRE RODAS',
        dsFormaPagamento: '',
        dsDescricao: ''
    });

    // Corretor
    useEffect(() => {
        const storedData = localStorage.getItem('corretor');
        if (storedData) {
            const userData: Corretor = JSON.parse(storedData);
            setCorretor(userData);
        }
    }, []);

    useEffect(() => {
        const input = document.getElementById("default-datepicker") as HTMLInputElement;

        const handleDateChange = (e: Event) => {
                setContrato((prev) => ({
                ...prev,
                dtContrato: (e.target as HTMLInputElement).value,
            }));
        };

        input?.addEventListener("change", handleDateChange);

        return () => input?.removeEventListener("change", handleDateChange);
    }, []);


    // Clientes - Motoristas - Bancos
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const dataClient: ClienteDto[] = await GetAllClients();
                const dataMotorista: MotoristaDto[] = await GetAllMotorista();
                const dataMercadorias: MercadoriaDto[] = await GetAllMercadoria();
                const banks = await GetBanks();
                setArrayClients(dataClient);
                setArrayMotoristas(dataMotorista);
                setArrayMercadorias(dataMercadorias);
                setBancos(banks);
            } catch (error) {
                setError("Failed to fetch: "+ error);
            } finally {
                if(clients.length > 0) setButtonClients(true);
                if(motoristas.length > 0) setButtonMotoristas(true);
                setLoading(false);
            }
        };
        fetchAll();
    }, [clients.length, motoristas.length]);

    const handleChangeComprador = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setComprador((prev) => ({ ...prev, [id]: value }));
    };

    const handleChangeVendedor = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setVendedor((prev) => ({ ...prev, [id]: value }));
    };

    const handleChangeCorretor = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setCorretor((prev) => {
            if (!prev) return prev;
            return { ...prev, [id]: value };
        });
    };

    const handleChangeMotorista = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setMotorista((prev) => ({ ...prev, [id]: value }));
    };

    const handleChangeContrato = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        setContrato((prev) => {
            const updated = { ...prev, [id]: value };

            if (id === "vlQuantidadeSaco" || id === "vlKilo") {
                const quantidadeSaco = Number(updated.vlQuantidadeSaco) || 0;
                const kilo = Number(updated.vlKilo) || 0;
                updated.vlQuantidade = quantidadeSaco * kilo;
            }

            return updated;
        });
    };


    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if(corretor) {
            contrato.cdCorretor = corretor.cdCorretor;
        }
        else {
            return (
                <div className="bg-[#FFF7E5] flex flex-row h-screen overflow-hidden">
                    <SideBarComponent nome={''}/>
                    <Disconected/>
                </div>
            )
        }

        contrato.comprador = comprador;
        contrato.vendedor = vendedor;
        contrato.motorista = motorista;
        contrato.mercadoria.dsMercadoria = mercadoria.nome;
        contrato.mercadoria.flAtivo = mercadoria.flAtivo;

        setContrato(contrato);
        await SaveContrato(contrato);

        setSuccessMessage("Contrato salvo com sucesso!");
        setLoading(false);
        setTimeout(() => {
            setSuccessMessage(null);
        }, 5000);
    };

    const refreshInfoMercadoria = () => {
        setMercadoria(initialStateMercadoria);
        contrato.dsEmbalagem = '';
        contrato.dsPesoQualidade = '';
        contrato.dsPadraoTolerancia = '';
        contrato.dsCargaConta = '';
        contrato.vlQuantidadeSaco = 0;
        contrato.vlKilo = 0;
        contrato.vlQuantidade = 0;
        contrato.dsArmazenagem = '';
        contrato.dsEnderecoEntrega = '';
    }

    const refreshInfoPagamento = () => {
        contrato.precoSaco = 0;
        contrato.dsPagamento = '';
        contrato.dsFormaPagamento = '';
        setVendedor(initialStateClient);
    }

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(num);
    };

    const handleCurrencyChangeContrato = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const sanitized = value.replace(/\D/g, '');
        const numericValue = parseFloat(sanitized) / 100;

        setContrato((prev) => ({
            ...prev,
            [name]: numericValue,
        }));
    };

    const handleDateChange = (date: Date | null) => {
        if (!date) return;

        const formattedDate = date.toLocaleDateString('pt-BR');

        setContrato((prev) => ({
            ...prev,
            dtContrato: formattedDate,
        }));
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
                            <FilePenLine size={30}/>
                            <big><h1 className="text-2xl font-semibold text-gray-800">Novo Contrato</h1></big>
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
                            {/*COMPRADOR */}
                            <div className='flex flex-col border-gray-400 border-2 p-4 rounded-md shadow-sm'>
                                <div className='flex flex-row gap-4 mb-4'>
                                    <span className='font-semibold text-[20px]'>Comprador</span>
                                    { buttonClients && <>
                                        <button type="button" className='border-2 p-1' onClick={() => setOpenComprador(true)}>
                                            <Search />
                                        </button>
                                        <button type='button' className='border-2 p-1' onClick={() => setComprador(initialStateClient)}>
                                            <RefreshCcw/>
                                        </button>
                                        <Modal open={openComprador} onClose={() => setOpenComprador(false)}>
                                            <div className='w-[500px] h-[500px] flex flex-col'>
                                                <div className='flex flex-col gap-4'>
                                                    <span className='font-semibold text-[20px]'>Selecione o Comprador</span>
                                                    <div className="relative w-full">
                                                        <input
                                                            type="text"
                                                            placeholder="Pesquisar..."
                                                            value={searchComprador}
                                                            onChange={(e) => {setSearchComprador(e.target.value);}}
                                                            className="pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
                                                        />
                                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
                                                            <Search className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-1 overflow-y-auto mt-4">
                                                    <table className='min-w-full'>
                                                        <tbody>
                                                            {clients.filter((cliente) => cliente.dsNome.toLowerCase().includes(searchComprador.toLowerCase())).map((cliente) => (
                                                                <tr key={cliente.cdCliente} className='items-center hover:bg-gray-300 cursor-pointer' 
                                                                        onClick={() => {setComprador(cliente); setOpenComprador(false); setSearchComprador("");}}>
                                                                    <td className="px-6 py-4">{cliente.cdCliente}</td>
                                                                    <td className="px-6 py-4">{cliente.dsNome}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </Modal> 
                                    </>}
                                </div>
                                <div className="flex flex-row space-x-5 items-center">
                                    <div className='flex flex-col'>
                                        <label htmlFor="nomeComprador" className='w-[350px] mb-1 text-sm font-medium text-gray-700'>Nome</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsNome'
                                            name='dsNome' 
                                            type="text" 
                                            value={comprador.dsNome} 
                                            onChange={handleChangeComprador}
                                            required
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cdCpfCnpj" className='mb-1 text-sm font-medium text-gray-700'>CPF/CNPJ</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='cdCpfCnpj' 
                                            name='cdCpfCnpj' 
                                            type="text" 
                                            value={comprador.cdCpfCnpj} 
                                            maxLength={14} 
                                            onChange={handleChangeComprador}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsIns" className='mb-1 text-sm font-medium text-gray-700'>INSC.</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsIns' 
                                            name='dsIns' 
                                            type="text" 
                                            value={comprador.dsIns} 
                                            onChange={handleChangeComprador}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row space-x-5 items-center mt-4">
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsEndereco" className='mb-1 text-sm font-medium text-gray-700'>Endereço</label>
                                        <input className='w-[784px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsEndereco' 
                                            name='dsEndereco' 
                                            type="text" 
                                            value={comprador.dsEndereco} 
                                            onChange={handleChangeComprador}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row space-x-5 items-center mt-4">
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsCidade" className='mb-1 text-sm font-medium text-gray-700'>Cidade</label>
                                        <input className='w-[350px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsCidade' 
                                            name='dsCidade' 
                                            type="text" 
                                            value={comprador.dsCidade}
                                            onChange={handleChangeComprador}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsEstado" className='mb-1 text-sm font-medium text-gray-700'>Estado</label>
                                        <Select
                                            id="dsEstado"
                                            options={estados}
                                            value={comprador.dsEstado}
                                            onChange={(estado) =>
                                                setComprador((prev) => ({
                                                    ...prev,
                                                    dsEstado: estado,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/*VENDEDOR*/}               
                            <div className='flex flex-col border-gray-400 border-2 p-4 rounded-md shadow-sm'>
                                <div className='flex flex-row gap-4 mb-4'>
                                    <span className='font-semibold text-[20px]'>Vendedor</span>
                                    { buttonClients && <>
                                        <button type="button" className='border-2 p-1' onClick={() => setOpenVendedor(true)}>
                                            <Search />
                                        </button>
                                        <button type='button' className='border-2 p-1' onClick={() => setVendedor(initialStateClient)}>
                                            <RefreshCcw/>
                                        </button>
                                        <Modal open={openVendedor} onClose={() => setOpenVendedor(false)}>
                                            <div className='w-[500px] h-[500px] flex flex-col'>
                                                <div className='flex flex-col gap-4'>
                                                    <span className='font-semibold text-[20px]'>Selecione o Vendedor</span>
                                                    <div className="relative w-full">
                                                        <input
                                                            type="text"
                                                            placeholder="Pesquisar..."
                                                            value={searchVendedor}
                                                            onChange={(e) => {setSearchVendedor(e.target.value);}}
                                                            className="pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
                                                        />
                                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
                                                            <Search className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-1 overflow-y-auto mt-4">
                                                    <table className='min-w-full'>
                                                        <tbody>
                                                            {clients.filter((cliente) => cliente.dsNome.toLowerCase().includes(searchVendedor.toLowerCase())).map((cliente) => (
                                                                <tr key={cliente.cdCliente} className='items-center hover:bg-gray-300 cursor-pointer' 
                                                                        onClick={() => {setVendedor(cliente); setOpenVendedor(false); setSearchVendedor("");}}>
                                                                    <td className="px-6 py-4">{cliente.cdCliente}</td>
                                                                    <td className="px-6 py-4">{cliente.dsNome}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </Modal> 
                                    </>}
                                </div>
                                <div className="flex flex-row space-x-5 items-center">
                                    <div className='flex flex-col'>
                                        <label htmlFor="nomeVendedor" className='w-[350px] mb-1 text-sm font-medium text-gray-700'>Nome</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsNome'
                                            name='dsNome' 
                                            type="text" 
                                            value={vendedor.dsNome} 
                                            onChange={handleChangeVendedor}
                                            required
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cdCpfCnpj" className='mb-1 text-sm font-medium text-gray-700'>CPF/CNPJ</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='cdCpfCnpj' 
                                            name='cdCpfCnpj' 
                                            type="text" 
                                            value={vendedor.cdCpfCnpj} 
                                            maxLength={14} 
                                            onChange={handleChangeVendedor}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsIns" className='mb-1 text-sm font-medium text-gray-700'>INSC.</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsIns' 
                                            name='dsIns' 
                                            type="text" 
                                            value={vendedor.dsIns} 
                                            onChange={handleChangeVendedor}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row space-x-5 items-center mt-4">
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsEndereco" className='mb-1 text-sm font-medium text-gray-700'>Endereço</label>
                                        <input className='w-[784px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsEndereco' 
                                            name='dsEndereco' 
                                            type="text" 
                                            value={vendedor.dsEndereco} 
                                            onChange={handleChangeVendedor}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row space-x-5 items-center mt-4">
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsCidade" className='mb-1 text-sm font-medium text-gray-700'>Cidade</label>
                                        <input className='w-[350px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsCidade' 
                                            name='dsCidade' 
                                            type="text" 
                                            value={vendedor.dsCidade}
                                            onChange={handleChangeVendedor}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsEstado" className='mb-1 text-sm font-medium text-gray-700'>Estado</label>
                                        <Select
                                            id="dsEstado"
                                            options={estados}
                                            value={vendedor.dsEstado}
                                            onChange={(estado) =>
                                                setVendedor((prev) => ({
                                                    ...prev,
                                                    dsEstado: estado,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/*MOTORISTA*/}                   
                            <div className='flex flex-col border-gray-400 border-2 p-4 rounded-md shadow-sm'>
                                <div className='flex flex-row gap-4 mb-4'>
                                    <span className='font-semibold text-[20px]'>Motorista</span>
                                    { buttonMotoristas && <>
                                        <button type="button" className='border-2 p-1' onClick={() => setOpenMotorista(true)}>
                                            <Search />
                                        </button>
                                        <button type='button' className='border-2 p-1' onClick={() => setMotorista(initialStateMotorista)}>
                                            <RefreshCcw/>
                                        </button>
                                        <Modal open={openMotorista} onClose={() => setOpenMotorista(false)}>
                                            <div className='w-[500px] h-[500px] flex flex-col'>
                                                <div className='flex flex-col gap-4'>
                                                    <span className='font-semibold text-[20px]'>Selecione o Motorista</span>
                                                    <div className="relative w-full">
                                                        <input
                                                            type="text"
                                                            placeholder="Pesquisar..."
                                                            value={searchMotorista}
                                                            onChange={(e) => {setSearchMotorista(e.target.value);}}
                                                            className="pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
                                                        />
                                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
                                                            <Search className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-1 overflow-y-auto mt-4">
                                                    <table className='min-w-full'>
                                                        <tbody>
                                                            {motoristas.filter((motorista) => motorista.dsNome.toLowerCase().includes(searchMotorista.toLowerCase())).map((motorista) => (
                                                                <tr key={motorista.cdMotorista} className='items-center hover:bg-gray-300 cursor-pointer' 
                                                                        onClick={() => {setMotorista(motorista); setOpenMotorista(false); setSearchMotorista("");}}>
                                                                    <td className="px-6 py-4">{motorista.cdMotorista}</td>
                                                                    <td className="px-6 py-4">{motorista.dsNome}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </Modal> 
                                    </>}
                                </div>
                                <div className="flex flex-row space-x-5 items-center">
                                    <div className='flex flex-col'>
                                        <label htmlFor="nomeMotorista" className='w-[350px] mb-1 text-sm font-medium text-gray-700'>Nome</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsNome'
                                            name='dsNome' 
                                            type="text" 
                                            value={motorista.dsNome} 
                                            onChange={handleChangeMotorista}
                                            required
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cdCpf" className='mb-1 text-sm font-medium text-gray-700'>CPF</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='cdCpf' 
                                            name='cdCpf' 
                                            type="text" 
                                            value={motorista.cdCpf} 
                                            maxLength={14} 
                                            onChange={handleChangeMotorista}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsPlaca" className='mb-1 text-sm font-medium text-gray-700'>Placa</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsPlaca' 
                                            name='dsPlaca' 
                                            type="text" 
                                            value={motorista.dsPlaca} 
                                            onChange={handleChangeMotorista}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row space-x-5 items-center mt-4">
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsCidade" className='mb-1 text-sm font-medium text-gray-700'>Cidade</label>
                                        <input className='w-[350px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsCidade' 
                                            name='dsCidade' 
                                            type="text" 
                                            value={motorista.dsCidade} 
                                            onChange={handleChangeMotorista}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsEstado" className='mb-1 text-sm font-medium text-gray-700'>Estado</label>
                                        <Select
                                            id="dsEstado"
                                            options={estados}
                                            value={motorista.dsEstado}
                                            onChange={(estado) =>
                                                setMotorista((prev) => ({
                                                    ...prev,
                                                    dsEstado: estado,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/*INFORMAÇÕES MERCADORIA*/}
                            <div className='flex flex-col border-gray-400 border-2 p-4 rounded-md shadow-sm'>
                                <div className='flex flex-row gap-4 mb-4'>
                                    <span className='font-semibold text-[20px]'>Informações Mercadoria</span>
                                    <button type='button' className='border-2 p-1' onClick={() => refreshInfoMercadoria()}>
                                        <RefreshCcw/>
                                    </button>
                                </div>
                                <div className="flex flex-row space-x-5 items-center">
                                    <div className='flex flex-col'>
                                        <label htmlFor="nome" className='mb-1 text-sm font-medium text-gray-700'>Mercadoria</label>
                                        <Select
                                            id="nome"
                                            options={mercadorias.map((mercadoria) => mercadoria.nome)}
                                            value={mercadoria.nome}
                                            onChange={(mercadoria) =>
                                                setMercadoria((prev) => ({
                                                    ...prev,
                                                    nome: mercadoria,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsEmbalagem" className='mb-1 text-sm font-medium text-gray-700'>Embalagem</label>
                                        <input className='w-[350px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsEmbalagem' 
                                            name='dsEmbalagem' 
                                            type="text" 
                                            value={contrato.dsEmbalagem} 
                                            onChange={handleChangeContrato}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsPesoQualidade" className='mb-1 text-sm font-medium text-gray-700'>Peso/Qualidade</label>
                                        <input className='w-[350px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsPesoQualidade' 
                                            name='dsPesoQualidade' 
                                            type="text" 
                                            value={contrato.dsPesoQualidade} 
                                            onChange={handleChangeContrato}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row space-x-5 items-center mt-4">
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsPadraoTolerancia" className='mb-1 text-sm font-medium text-gray-700'>Padrão de Tolerância</label>
                                        <input className='w-[700px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsPadraoTolerancia' 
                                            name='dsPadraoTolerancia' 
                                            type="text" 
                                            value={contrato.dsPadraoTolerancia} 
                                            onChange={handleChangeContrato}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsCargaConta" className='mb-1 text-sm font-medium text-gray-700'>Carga para conta</label>
                                        <input className='w-[276px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsCargaConta' 
                                            name='dsCargaConta' 
                                            type="text" 
                                            value={contrato.dsCargaConta} 
                                            onChange={handleChangeContrato}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row space-x-5 items-center mt-4">
                                    <div className='flex flex-col'>
                                        <label htmlFor="vlQuantidadeSaco" className='mb-1 text-sm font-medium text-gray-700'>Quantidade de Sacos</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='vlQuantidadeSaco' 
                                            name='vlQuantidadeSaco' 
                                            type="number" 
                                            value={contrato.vlQuantidadeSaco} 
                                            onChange={handleChangeContrato}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="vlKilo" className='mb-1 text-sm font-medium text-gray-700'>Quilo Saco (KG)</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='vlKilo' 
                                            name='vlKilo' 
                                            type="number" 
                                            value={contrato.vlKilo} 
                                            onChange={handleChangeContrato}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="vlQuantidade" className='mb-1 text-sm font-medium text-gray-700'>A quantidade será de</label>
                                        <input
                                            className='font-bold px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm transition bg-gray-100'
                                            id='vlQuantidade'
                                            name='vlQuantidade'
                                            type="number"
                                            value={contrato.vlQuantidade}
                                            onChange={handleChangeContrato}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row space-x-5 items-center mt-4">
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsArmazenagem" className='mb-1 text-sm font-medium text-gray-700'>Armazenagem</label>
                                        <input className='w-[276px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsArmazenagem' 
                                            name='dsArmazenagem' 
                                            type="text" 
                                            value={contrato.dsArmazenagem} 
                                            onChange={handleChangeContrato}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsEnderecoEntrega" className='mb-1 text-sm font-medium text-gray-700'>Endereço de entrega</label>
                                        <input className='w-[700px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsEnderecoEntrega' 
                                            name='dsEnderecoEntrega' 
                                            type="text" 
                                            value={contrato.dsEnderecoEntrega} 
                                            onChange={handleChangeContrato}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/*DADOS DO PAGAMENTO*/}
                            <div className='flex flex-col border-gray-400 border-2 p-4 rounded-md shadow-sm'>
                                <div className='flex flex-row gap-4 mb-4'>
                                    <span className='font-semibold text-[20px]'>Informações Pagamento</span>
                                    <button type='button' className='border-2 p-1' onClick={() => refreshInfoPagamento()}>
                                        <RefreshCcw/>
                                    </button>
                                </div>
                                <div className="flex flex-row space-x-5">
                                    <div className='flex flex-col'>
                                        <label htmlFor="precoSaco" className='mb-1 text-sm font-bold text-gray-700'>PREÇO</label>
                                        <input className='font-bold px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id="precoSaco"
                                            name="precoSaco"
                                            type="text"
                                            value={formatCurrency(contrato.precoSaco || 0)}
                                            onChange={handleCurrencyChangeContrato}
                                            placeholder="0,00"
                                            required
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsPagamento" className='mb-1 text-sm font-medium text-gray-700'>Pagamento</label>
                                        <input className='w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id="dsPagamento"
                                            name="dsPagamento"
                                            type="text"
                                            value={contrato.dsPagamento}
                                            onChange={handleChangeContrato}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsFormaPagamento" className='mb-1 text-sm font-medium text-gray-700'>Forma de Pagamento</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id="dsFormaPagamento"
                                            name="dsFormaPagamento"
                                            type="text"
                                            value={contrato.dsFormaPagamento}
                                            onChange={handleChangeContrato}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row space-x-5 mt-4">
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsNome" className='w-[350px] mb-1 text-sm font-medium text-gray-700'>Favorecido</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsNome'
                                            name='dsNome' 
                                            type="text" 
                                            value={vendedor.dsNome} 
                                            onChange={handleChangeVendedor}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsCidade" className='mb-1 text-sm font-medium text-gray-700'>Cidade</label>
                                        <input className='w-[350px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='dsCidade' 
                                            name='dsCidade' 
                                            type="text" 
                                            value={vendedor.dsCidade}
                                            onChange={handleChangeVendedor}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsEstado" className='mb-1 text-sm font-medium text-gray-700'>Estado</label>
                                        <Select
                                            id="dsEstado"
                                            options={estados}
                                            value={vendedor.dsEstado}
                                            onChange={(estado) =>
                                                setVendedor((prev) => ({
                                                    ...prev,
                                                    dsEstado: estado,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row space-x-5 mt-4">
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsBanco" className='mb-1 text-sm font-medium text-gray-700'>Banco</label>
                                        <Select
                                            id="dsBanco"
                                            width='w-[350px]'
                                            options={bancos.map((banco) => banco.fullName)}
                                            value={vendedor.dsBanco}
                                            onChange={(banco) =>
                                                setVendedor((prev) => ({
                                                    ...prev,
                                                    dsBanco: banco,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cdAgencia" className='mb-1 text-sm font-medium text-gray-700'>Agencia</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='cdAgencia' 
                                            name='cdAgencia' 
                                            type="text" 
                                            value={vendedor.cdAgencia}
                                            onChange={handleChangeVendedor}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cdConta" className='mb-1 text-sm font-medium text-gray-700'>Conta</label>
                                        <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                            id='cdConta' 
                                            name='cdConta' 
                                            type="text" 
                                            value={vendedor.cdConta}
                                            onChange={handleChangeVendedor}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/*CORRETOR*/}
                            <div className='flex flex-col border-gray-400 border-2 p-4 rounded-md shadow-sm'>
                                <div className='flex flex-row gap-4 mb-4'>
                                    <span className='font-semibold text-[20px]'>Comissão</span>
                                    <button className="border-2 p-1" type="button" onClick={() => router.push("/perfil")}>
                                        <span className="flex flex-row gap-2">
                                            Editar
                                            <Pencil size={20}/>
                                        </span>
                                    </button>
                                </div>
                                <div className="flex flex-row space-x-5">
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsNome" className='mb-1 text-sm font-medium text-gray-700'>Nome</label>
                                        <input className='cursor-not-allowed px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm transition bg-gray-100' 
                                            id='dsNome' 
                                            name='dsNome' 
                                            type="text" 
                                            value={corretor.dsNome}
                                            onChange={handleChangeCorretor}
                                            readOnly
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cdCpf" className='mb-1 text-sm font-medium text-gray-700'>CPF</label>
                                        <input className='cursor-not-allowed px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm transition bg-gray-100' 
                                            id='cdCpf' 
                                            name='cdAcdCpfgencia' 
                                            type="text" 
                                            value={corretor.cdCpf}
                                            onChange={handleChangeCorretor}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row space-x-5 mt-4">
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsCidade" className='mb-1 text-sm font-medium text-gray-700'>Cidade</label>
                                        <input className='cursor-not-allowed px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm transition bg-gray-100' 
                                            id='dsCidade' 
                                            name='dsCidade' 
                                            type="text" 
                                            value={corretor.dsCidade}
                                            onChange={handleChangeCorretor}
                                            readOnly
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="dsCidade" className='mb-1 text-sm font-medium text-gray-700'>Estado</label>
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
                                <div className="flex flex-row space-x-5 mt-4">
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
                                    <div className='flex flex-col'>
                                        <label htmlFor="cdAgencia" className='mb-1 text-sm font-medium text-gray-700'>Agencia</label>
                                        <input className='cursor-not-allowed px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm transition bg-gray-100' 
                                            id='cdAgencia' 
                                            name='cdAgencia' 
                                            type="text" 
                                            value={corretor.cdAgencia}
                                            onChange={handleChangeCorretor}
                                            readOnly
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cdConta" className='mb-1 text-sm font-medium text-gray-700'>Conta</label>
                                        <input className='cursor-not-allowed px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm transition bg-gray-100' 
                                            id='cdConta' 
                                            name='cdConta' 
                                            type="text" 
                                            value={corretor.cdConta}
                                            onChange={handleChangeCorretor}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col border-gray-400 border-2 p-4 rounded-md shadow-sm items-center gap-2'>
                                <span className='font-semibold text-[20px]'>Data do Contrato</span>
                                <DatePicker
                                    selected={ contrato.dtContrato ? parse(contrato.dtContrato, 'dd/MM/yyyy', new Date()) : null }
                                    onChange={handleDateChange}
                                    showIcon={true}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Selecione a Data"
                                    showYearDropdown
                                    scrollableYearDropdown
                                    scrollableMonthYearDropdown
                                    required
                                />
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
