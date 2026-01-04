'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Corretor } from '@/components/service/CorretorService';
import { SideBarComponent } from '@/components/menu/SideBar';
import { ChevronRight, ChevronLeft, Search, RefreshCcw, Trash2, CircleCheck, CircleX } from "lucide-react";
import { GetTableContratoView, TableContratoResponse, TableContrato, DeleteContract } from "@/components/service/ContratoService";
import Modal from '@/components/utils/Modal';
import { Loading } from "@/components/utils/Loading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Disconected } from "@/components/utils/Disconected";

export default function Contrato() {
    const router = useRouter();
    const [corretor, setCorretor] = useState<Corretor | null>(null);
    const [contratos, setContratos] = useState<TableContrato[]>([]);

    const [loading, setLoading] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [messageModal, setMessageModal] = useState<string | null>(null);
    const [successModal, setSuccessModal] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
    const [selectedContratoId, setSelectedContratoId] = useState<number | null>(null);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [cod, setCod] = useState('');
    const [status, setStatus] = useState('');
    const [client, setClient] = useState('');
    const [mercadoria, setMercadoria] = useState('');
    const [vendedor, setVendedor] = useState('');
    const [preco, setPreco] = useState('');

    const fetchContratosFilter = async () => {
        if (corretor?.cdCorretor != null) {
            setLoading(true);
            try {
                const data: TableContratoResponse = await GetTableContratoView(corretor.cdCorretor, currentPage,
                    cod, status, client, mercadoria, vendedor, preco, startDate, endDate
                );
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

    const refreshFilter = async () => {
        setCod('');
        setStatus('');
        setClient('');
        setMercadoria('');
        setVendedor('');
        setPreco('');
        setStartDate(null);
        setEndDate(null);
        if (corretor?.cdCorretor != null) {
            const data: TableContratoResponse = await GetTableContratoView(corretor.cdCorretor, currentPage,
                '', '', '', '', '', '', null, null);
            setContratos(data.content);
            setTotalPages(data.page.totalPages);
            setTotalElements(data.page.totalElements);
        }
    };

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
                    const data: TableContratoResponse = await GetTableContratoView(corretor.cdCorretor, currentPage,
                        '', '', '', '', '', '', null, null);
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

    const deleteContract = async (id: number) => {
        setLoadingModal(true);
        try {
            await DeleteContract(id.toString());
            setLoadingModal(false);
            setSuccessModal(true);
            setMessageModal("Contrato deletado!");
        }catch(err) {
            setLoadingModal(false);
            console.log(err);
            setErrorModal(true);
            setMessageModal("Ocorreu um erro ao tentar deletar o contrato, tente novamente mais tarde");
        }
    } 

     const onChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    const goToContract = (contrato: TableContrato) => {
        router.push("/contrato/" + contrato.cdContrato);
    }

    return (
        <div className="bg-[#FFF7E5] flex flex-row h-screen overflow-hidden">
            <SideBarComponent nome={corretor?.dsNome} />

            {corretor ? (
                <div className="flex flex-col w-full space-y-6 overflow-y-auto">
                    {/* Header */}
                    <div className="w-full flex flex-col">
                        <div className="w-full flex flex-row justify-between mt-8 pl-8">
                            <div className="items-start justify-center">
                                <h1 className="text-2xl font-bold mb-4">Contratos</h1>
                            </div>
                            
                            <div className="relative flex items-center space-x-5 pb-5 mr-6">    
                                <button 
                                    type="button" 
                                    className="bg-green-700 hover:bg-green-800 rounded px-4 py-2 text-white" 
                                    onClick={() => router.push("/contrato/cadastro")}
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
                        <div className="flex flex-col space-y-5 items-center mt-5 bg-white ml-10 mr-10 pb-10 rounded-md shadow" 
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    fetchContratosFilter();
                                }
                            }}>
                            <div className="items-start w-full">
                                <h1 className="mt-5 ml-8 font-medium text-lg">Pesquisar contratos</h1>
                            </div>
                            <div className="flex flex-row space-x-4">
                                <div className="flex flex-col">
                                    <label htmlFor="dsCliente">Código</label>
                                    <input
                                        id="codigo"
                                        type="number"
                                        placeholder={`codigo`}
                                        value={cod}
                                        onChange={(e) => setCod(e.target.value)}
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm rounded"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="dsCliente">Cliente</label>
                                    <input
                                        id="dsCliente"
                                        type="text"
                                        placeholder={`cliente`}
                                        value={client}
                                        onChange={(e) => setClient(e.target.value)}
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm rounded"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="dsCliente">Mercadoria</label>
                                    <input
                                        id="dsMercadoria"
                                        type="text"
                                        placeholder={`mercadoria`}
                                        value={mercadoria}
                                        onChange={(e) => setMercadoria(e.target.value)}
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm rounded"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="dsCliente">Vendedor</label>
                                    <input
                                        id="dsVendedor"
                                        type="text"
                                        placeholder={`vendedor`}
                                        value={vendedor}
                                        onChange={(e) => setVendedor(e.target.value)}
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm rounded"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row space-x-4">
                                <div className="flex flex-col">
                                    <label htmlFor="dsCliente">Preço/Saco</label>
                                    <input
                                        id="dsPreco"
                                        type="number"
                                        placeholder={`preço`}
                                        value={preco}
                                        onChange={(e) => setPreco(e.target.value)}
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm rounded"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="dsCliente">Período</label>
                                    <DatePicker
                                        className="px-4 py-2 border-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm rounded"
                                        onChange={onChange}
                                        startDate={startDate}
                                        endDate={endDate}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Pesquise por período"
                                        selectsRange
                                        isClearable
                                    />
                                </div>
                                <div className="flex flex-col mt-[22px]">
                                    <button 
                                        type="submit" 
                                        className="space-x-2 flex flex-row bg-blue-700 hover:bg-blue-800 px-4 py-2 text-white rounded"
                                        onClick={() => fetchContratosFilter()}
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
                    {contratos.length > 0 ? (
                        <div className="items-center justify-center pl-20 pr-20">
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                                    <thead className="bg-gray-100">
                                        <tr className="items-center">
                                            <th className="px-6 py-3 border-b text-left">Código</th>
                                            <th className="px-6 py-3 border-b text-left">Data</th>
                                            <th className="px-6 py-3 border-b text-left">Mercadoria</th>
                                            <th className="px-6 py-3 border-b text-left">Comprador</th>
                                            <th className="px-6 py-3 border-b text-left">Vendedor</th>
                                            <th className="px-6 py-3 border-b text-left">Preço/Saco</th>
                                            <th className="px-6 py-3 border-b text-left">Motorista</th>
                                            <th className="px-6 py-3 border-b text-left">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contratos.map((contrato) => (
                                            <tr key={contrato.cdContrato} className="border-b items-center hover:bg-gray-200">
                                                <td className="px-6 py-4 cursor-pointer" onClick={e => {e.preventDefault(); goToContract(contrato);}}>{contrato.cdContrato}</td>
                                                <td className="px-6 py-4 cursor-pointer" onClick={e => {e.preventDefault(); goToContract(contrato);}}>{contrato.dtContrato ? contrato.dtContrato : "" }</td>
                                                <td className="px-6 py-4 cursor-pointer" onClick={e => {e.preventDefault(); goToContract(contrato);}}>{contrato.mercadoria?.dsMercadoria === null ? "" : contrato.mercadoria?.dsMercadoria}</td>
                                                <td className="px-6 py-4 cursor-pointer" onClick={e => {e.preventDefault(); goToContract(contrato);}}>{contrato.comprador?.dsNome}</td>
                                                <td className="px-6 py-4 cursor-pointer" onClick={e => {e.preventDefault(); goToContract(contrato);}}>{contrato.vendedor?.dsNome}</td>
                                                <td className="px-6 py-4 cursor-pointer" onClick={e => {e.preventDefault(); goToContract(contrato);}}>${contrato.precoSaco === null ? "" : contrato.precoSaco?.toFixed(2)}</td>
                                                <td className="px-6 py-4 cursor-pointer" onClick={e => {e.preventDefault(); goToContract(contrato);}}>{contrato.motorista?.dsNome}</td>
                                                <td className="px-10 py-4 flex justify-center items-center">
                                                    <div className="flex flex-row gap-5">
                                                        <button type="button" onClick={() => {setOpenDeleteModal(true); setSelectedContratoId(contrato.cdContrato!)}}>
                                                            <Trash2/>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Modal
                                open={openDeleteModal}
                                onClose={() => {
                                    setOpenDeleteModal(false);
                                    setSelectedContratoId(null);
                                    setSuccessModal(false);
                                    setErrorModal(false);
                                }}
                                >
                                <div className="w-[500px] h-[300px] flex flex-col justify-center items-center gap-4">
                                    {loadingModal ? (
                                    <Loading />
                                    ) : (
                                    <>
                                        {!successModal && !errorModal && (
                                        <>
                                            <Trash2 className="text-red-400" size={40} />
                                            <h1 className="text-xl font-bold">
                                                Tem certeza que deseja deletar o contrato {selectedContratoId}?
                                            </h1>
                                            <div className="flex gap-4">
                                                <button
                                                    className="w-[85px] h-[40px] bg-gray-400 rounded text-white font-semibold"
                                                    onClick={() => setOpenDeleteModal(false)}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    className="w-[85px] h-[40px] bg-red-400 rounded text-white font-semibold"
                                                    onClick={() => deleteContract(selectedContratoId!)}
                                                >
                                                    Sim
                                                </button>
                                            </div>
                                        </>
                                        )}

                                        {successModal && (
                                        <>
                                            <CircleCheck className="text-green-400" size={40} />
                                            <h1 className="text-xl font-bold">{messageModal}</h1>
                                            <button
                                                className="w-[85px] h-[40px] bg-gray-400 rounded text-white font-semibold"
                                                onClick={() => {setOpenDeleteModal(false); setErrorModal(false); setSuccessModal(false); refreshFilter();}}>
                                                Ok
                                            </button>
                                        </>
                                        )}

                                        {errorModal && (
                                        <>
                                            <CircleX className="text-red-400" size={40} />
                                            <h1 className="text-xl font-bold">{messageModal}</h1>
                                            <button
                                                className="w-[85px] h-[40px] bg-gray-400 rounded text-white font-semibold"
                                                onClick={() => {setOpenDeleteModal(false); setErrorModal(false); setSuccessModal(false);}}>
                                                Ok
                                            </button>
                                        </>
                                        )}
                                    </>
                                    )}
                                </div>
                            </Modal>

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
                        <p className="text-center text-sm">Nenhum contrato encontrado.</p>
                    )}
                    
                </div>
            ) : (
                <Disconected/>
            )}
        </div>
    );

}