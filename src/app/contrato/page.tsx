'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Corretor } from '@/components/service/CorretorService';
import { SideBarComponent } from '@/components/menu/SideBar';
import { ChevronRight, ChevronLeft, Search } from "lucide-react";
import { GetTableContratoView, TableContratoResponse, TableContrato } from "@/components/service/ContratoService";


export default function Contrato() {
    const router = useRouter();
    const [corretor, setCorretor] = useState<Corretor | null>(null);
    const [contratos, setContratos] = useState<TableContrato[]>([]);

    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        const storedData = localStorage.getItem('corretor');
        if (storedData) {
            const userData: Corretor = JSON.parse(storedData);
            setCorretor(userData);
        }
    }, []);

    useEffect(() => {
        const fetchContratos = async () => {
            if (corretor?.cdCorretor != null) {
                setLoading(true);
                try {
                    const data: TableContratoResponse = await GetTableContratoView(corretor.cdCorretor, currentPage, 20);
                    setContratos(data.content);
                    setTotalPages(data.page.totalPages);
                    setTotalElements(data.page.totalElements);
                } catch (error) {
                    console.error("Failed to fetch contracts:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchContratos();

    }, [corretor?.cdCorretor, currentPage]);

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

    return (
        <div className="bg-[#FFF7E5] flex flex-row h-screen overflow-hidden">
            <SideBarComponent nome={corretor?.dsNome} />

            {corretor ? (
                <div className="flex flex-col w-full space-y-6 overflow-y-auto">
                    {/* Header */}
                    <div className="w-full flex flex-col">
                        <div className="w-full flex flex-row justify-between p-8 m-8">
                            <div className="items-start justify-center">
                                <h1 className="text-2xl font-bold mb-4">Contratos</h1>
                                <p className="">Pesquisar contratos</p>
                            </div>
                            
                            <div className="relative flex items-center space-x-5 pb-5 mr-6">    
                                <button 
                                    type="button" 
                                    className="bg-green-700 hover:bg-green-800 rounded px-4 py-2 text-white" 
                                    onClick={() => router.push("/menu")}
                                >
                                    Novo Contrato
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
                        <div className="flex flex-col space-y-5 items-center">
                            <div className="flex flex-row space-x-4">
                                <div className="flex flex-col">
                                    <label htmlFor="dsCliente">Código</label>
                                    <input
                                        id="codigo"
                                        type="text"
                                        placeholder={`codigo`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="dsStatus">Status</label>
                                    <select 
                                        id="dsStatus"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-[200px] px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    >
                                        <option value=""></option>
                                        <option value="OK">OK</option>
                                        <option value="RASCUNHO">RASCUNHO</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="dsCliente">Cliente</label>
                                    <input
                                        id="dsCliente"
                                        type="text"
                                        placeholder={`cliente`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="dsCliente">Mercadoria</label>
                                    <input
                                        id="dsMercadoria"
                                        type="text"
                                        placeholder={`mercadoria`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row space-x-4">
                                <div className="flex flex-col">
                                    <label htmlFor="dsCliente">Preço/Saco</label>
                                    <input
                                        id="dsPreco"
                                        type="text"
                                        placeholder={`preço`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="dsCliente">Data Contrato</label>
                                    <input
                                        id="dtData"
                                        type="text"
                                        placeholder={`data`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                                <div className="flex flex-col mt-[22px]">
                                    <button 
                                        type="submit" 
                                        className="space-x-2 flex flex-row bg-blue-700 hover:bg-blue-800 px-4 py-2 text-white"
                                    >
                                        <p className="">Buscar</p>
                                        <Search className="w-[20px] h-[20px]"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Table */}
                    {contratos.length > 0 ? (
                        <div className="items-center justify-center pl-20 pr-20">
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                                    <thead className="bg-gray-100">
                                        <tr className="items-center">
                                            <th className="px-6 py-3 border-b text-left">Código</th>
                                            <th className="px-6 py-3 border-b text-left">Status</th>
                                            <th className="px-6 py-3 border-b text-left">Data</th>
                                            <th className="px-6 py-3 border-b text-left">Mercadoria</th>
                                            <th className="px-6 py-3 border-b text-left">Comprador</th>
                                            <th className="px-6 py-3 border-b text-left">Preço/Saco</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contratos.map((contrato) => (
                                            <tr key={contrato.cdContrato} className="border-b items-center">
                                                <td className="px-6 py-4">{contrato.cdContrato}</td>
                                                <td className="px-6 py-4">{contrato.dsStatus === null ? "" : contrato.dsStatus}</td>
                                                <td className="px-6 py-4">{contrato.dtContrato === null ? "" : new Date(contrato.dtContrato).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">{contrato.mercadoria?.dsMercadoria === null ? "" : contrato.mercadoria?.dsMercadoria}</td>
                                                <td className="px-6 py-4">{contrato.comprador?.dsNome}</td>
                                                <td className="px-6 py-4">${contrato.precoSaco === null ? "" : contrato.precoSaco?.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {contratos.length > 0 ? (
                                <div className="flex flex-col">
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
                                ) : <></>
                            }
                        </div>
                    ) : (
                        <p className="text-center text-sm">Nenhum contrato encontrado.</p>
                    )}
                    
                </div>
            ) : (
                <p>Você ainda não entrou, por favor entre no sistema</p>
            )}
        </div>
    );

}