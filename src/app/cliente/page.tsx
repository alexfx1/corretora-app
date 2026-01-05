'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SideBarComponent } from '@/components/menu/SideBar';
import { ChevronRight, ChevronLeft, Search, RefreshCcw, Edit } from "lucide-react";
import { Corretor } from '@/components/service/CorretorService';
import { ClienteDto, TableClienteResponse, GetAllClientsPage } from '@/components/service/ClienteService';
import { Disconected } from "@/components/utils/Disconected";


export default function Cliente() {
    const router = useRouter();
    const [cliente, setCliente] = useState<ClienteDto[]>([]);
    const [corretor, setCorretor] = useState<Corretor | null>(null);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const[nome, setNome] = useState('');
    const[endereco, setEndereco] = useState('');
    const[cidade, setCidade] = useState('');
    const[estado, setEstado] = useState('');
    const[cpfCnpj, setCpfCnpj] = useState('');

    useEffect(() => {
        const fetchClientes = async () => {
            setLoading(true);
            try {
                const data: TableClienteResponse = await GetAllClientsPage(currentPage, '', '', '', '', '');
                setCliente(data.content);
                setTotalPages(data.page.totalPages);
                setTotalElements(data.page.totalElements);
            } catch (error) {
                console.error("Failed to fetch clientes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();

    }, [currentPage]);

    useEffect(() => {
        const storedData = localStorage.getItem('corretor');
        if (storedData) {
            const userData: Corretor = JSON.parse(storedData);
            setCorretor(userData);
        }
    }, []);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1);
        }
    };
    
    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const fetchClienteFilter = async () => {
        setLoading(true);
        try {
            const data: TableClienteResponse = await GetAllClientsPage(currentPage, nome, cpfCnpj, endereco, cidade, estado);
            setCliente(data.content);
            setTotalPages(data.page.totalPages);
            setTotalElements(data.page.totalElements);
        } catch (error) {
            console.error("Failed to fetch clientes:", error);
        } finally {
            setLoading(false);
        }
    };

    const refreshFilter = async () => {
        setNome('');
        setEndereco('');
        setCidade('');
        setEstado('');
        setCpfCnpj('');

        const data: TableClienteResponse = await GetAllClientsPage(currentPage, '', '', '', '', '');
        setCliente(data.content);
        setTotalPages(data.page.totalPages);
        setTotalElements(data.page.totalElements);
    };

    return (
        <div className="bg-[#FFF7E5] flex flex-row h-screen overflow-hidden">
            <SideBarComponent nome={corretor?.dsNome} />

            {corretor ? (
                <div className="flex flex-col w-full space-y-6 overflow-y-auto">
                    {/* Header */}
                    <div className="w-full flex flex-col">
                        <div className="w-full flex flex-row justify-between mt-8 pl-8">
                            <div className="items-start justify-center">
                                <h1 className="text-2xl font-bold mb-4">Clientes</h1>
                            </div>
                            
                            <div className="relative flex items-center space-x-5 pb-5 mr-6">    
                                <button 
                                    type="button" 
                                    className="bg-green-700 hover:bg-green-800 rounded px-4 py-2 text-white" 
                                    onClick={() => router.push("/cliente/cadastro")}
                                >
                                    Novo Cliente
                                </button>                   

                                <button 
                                    type="button" 
                                    className="bg-blue-700 hover:bg-blue-800 rounded px-4 py-2 text-white" 
                                    onClick={() => router.push("/menu")}
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="flex flex-col space-y-5 items-center mt-5 bg-white ml-10 mr-10 rounded-md shadow" 
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    fetchClienteFilter();
                                }
                            }}>
                            <div className="items-start w-full">
                                <p className="mt-5 ml-8 font-medium text-lg">Pesquisar por clientes</p>
                            </div>
                            <div className="flex flex-row space-x-4">
                                <div className="flex flex-col">
                                    <label htmlFor="dsNome">Nome</label>
                                    <input
                                        id="dsNome"
                                        type="text"
                                        placeholder={`nome`}
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm rounded"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="dsEndereco">Endereço</label>
                                    <input
                                        id="dsEndereco"
                                        type="text"
                                        placeholder={`endereço`}
                                        value={endereco}
                                        onChange={(e) => setEndereco(e.target.value)}
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm rounded"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="cdCpfCnpj">CPF/CNPJ</label>
                                    <input
                                        id="cdCpfCnpj"
                                        type="text"
                                        placeholder={`cpf ou cnpj`}
                                        value={cpfCnpj}
                                        onChange={(e) => setCpfCnpj(e.target.value)}
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm rounded"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row space-x-4">
                                <div className="flex flex-col">
                                    <label htmlFor="dsCidade">Cidade</label>
                                    <input
                                        id="dsCidade"
                                        type="text"
                                        placeholder={`cidade`}
                                        value={cidade}
                                        onChange={(e) => setCidade(e.target.value)}
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm rounded"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="dsEstado">Estado</label>
                                    <input
                                        id="dsEstado"
                                        type="text"
                                        placeholder={`estado`}
                                        value={estado}
                                        onChange={(e) => {
                                            const value = e.target.value.toUpperCase();
                                            if (value.length <= 2) {
                                                setEstado(value);
                                            }
                                        }}
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm rounded"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row space-x-4">
                                <div className="flex flex-col mt-[22px] mb-5">
                                    <button 
                                        type="submit" 
                                        className="space-x-2 flex flex-row bg-blue-700 hover:bg-blue-800 px-4 py-2 text-white rounded"
                                        onClick={() => fetchClienteFilter()}
                                    >
                                        <p className="">Buscar</p>
                                        <Search className="w-[20px] h-[20px]"/>
                                    </button>
                                </div>
                                <div className="flex flex-col mt-[22px]">
                                    <button 
                                        type="submit" 
                                        className="space-x-2 flex flex-row bg-orange-500 hover:bg-yellow-800 px-4 py-2 text-white rounded"
                                        onClick={() => refreshFilter()}
                                    >
                                        <p>Limpar</p>
                                        <RefreshCcw className="w-[20px] h-[20px]"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    {cliente.length > 0 ? (
                        <div className="items-center justify-center pl-20 pr-20">
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                                    <thead className="bg-gray-100">
                                        <tr className="items-center">
                                            <th className="px-6 py-3 border-b text-left">Nome</th>
                                            <th className="px-6 py-3 border-b text-left">Telefone</th>
                                            <th className="px-6 py-3 border-b text-left">CPF/CNPJ</th>
                                            <th className="px-6 py-3 border-b text-left">Cidade</th>
                                            <th className="px-6 py-3 border-b text-left">INS/IR</th>
                                            <th className="px-6 py-3 border-b text-left">Chave Pix</th>
                                            <th className="px-6 py-3 border-b text-left">Editar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cliente.map((cliente) => (
                                            <tr key={cliente.cdCliente} className="border items-center">
                                                <td className="px-6 py-4">{cliente.dsNome}</td>
                                                <td className="px-6 py-4">{cliente.dsTelefone === null ? '' : cliente.dsTelefone}</td>
                                                <td className="px-6 py-4">{cliente.cdCpfCnpj}</td>
                                                <td className="px-6 py-4">{cliente.dsCidade === null ? '' : cliente.dsCidade}</td>
                                                <td className="px-6 py-4">{cliente.dsIns === null ? '' : cliente.dsIns}</td>
                                                <td className="px-6 py-4 max-w-[158px]">
                                                    <div className="break-all line-clamp-4 leading-relaxed" title={cliente.dsChavePix ?? ''}
                                                    >
                                                        {cliente.dsChavePix ?? ''}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-4 items-center">
                                                    <button type="button" onClick={(e) => {
                                                        e.preventDefault();
                                                        router.push("/cliente/" + cliente.cdCliente);
                                                    }}>
                                                        <Edit/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex flex-col mt-3 mb-3">
                                <div className="flex justify-center mt-6 space-x-4 p-2">
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 0 || loading}
                                        className={`px-4 py-2 rounded w-[50px] ${
                                            currentPage === 0
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                    >
                                        <ChevronLeft/>
                                    </button>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage >= totalPages - 1 || loading}
                                        className={`px-4 py-2 rounded w-[50px] ${
                                            currentPage >= totalPages - 1
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                    >
                                        <ChevronRight/>
                                    </button>
                                </div>
                                <div className="flex justify-center">
                                    <span className="text-gray-600">Página {currentPage+1} de {totalPages} | Total {totalElements}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-sm">Nenhum cliente encontrado.</p>
                    )}
                    
                </div>
            ) : (
                <Disconected/>
            )}
        </div>
    );

}