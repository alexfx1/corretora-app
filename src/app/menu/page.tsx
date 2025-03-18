'use client';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { SideBarComponent } from '@/components/menu/SideBar';
import { CardContratoResponse, CardContrato, GetCardsContratoView } from '@/components/service/ContratoService';
import { Corretor } from '@/components/service/CorretorService';
import { useEffect, useState } from "react";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import { Cliente, GetAllClients } from "@/components/service/ClienteService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { GetAllMotorista, Motorista } from "@/components/service/MotoristaService";

export default function Menu() {
    const [corretor, setCorretor] = useState<Corretor | null>(null);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [contratos, setContratos] = useState<CardContrato[]>([]);
    const [motoristas, setMotoristas] = useState<Motorista[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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
                    const data: CardContratoResponse = await GetCardsContratoView(corretor.cdCorretor);
                    const clients: Cliente[] = await GetAllClients();
                    const motorists: Motorista[] = await GetAllMotorista();
                    setClientes(clients);
                    setContratos(data.content);
                    setMotoristas(motorists);
                } catch (error) {
                    console.error("Failed to fetch contracts:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchContratos();
    }, [corretor]);

    const getFirstAndLastName = (fullName: string) => {
        if (!fullName) return "";
        const parts = fullName.trim().split(" ");
        if (parts.length === 1) return parts[0];
        return `${parts[0]} ${parts[parts.length - 1]}`;
    };

    const fetchContratos = async (search: string = "") => {
        if (corretor?.cdCorretor != null) {
            setLoading(true);
            try {
                const data: CardContratoResponse = await GetCardsContratoView(corretor.cdCorretor, search);
                setContratos(data.content);
            } catch (error) {
                console.error("Failed to fetch contracts:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="bg-[#FFF7E5] flex flex-row h-screen overflow-hidden">
            {/* Sidebar */}
            <SideBarComponent nome={corretor?.dsNome} />

            {/* Main Content */}
            <div className="flex flex-col w-full overflow-y-auto space-y-2">
                {corretor ? (
                    <>
                        {/* Contratos */}
                        <div className="p-6 m-6">
                            {/* Header */}
                            <div className="flex flex-row justify-between">
                                <div className="items-start justify-center">
                                    <h1 className="text-2xl font-bold mb-4">Contratos</h1>
                                    <p className="mb-6 font-light">Últimos acessos</p>
                                </div>
                                {/* Search Bar */}
                                <div className="relative flex items-center space-x-4 pb-5">
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            placeholder="Pesquisar..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    fetchContratos(searchTerm);
                                                }
                                            }}
                                            className="pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
                                        />
                                        <div onClick={() => fetchContratos(searchTerm)} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
                                            <Search className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cards Section with Swiper */}
                            {loading ? (
                                <p className="text-sm text-gray-500 animate-pulse mb-4">Carregando...</p>
                            ) : contratos.length > 0 ? (
                                <div className="relative w-full px-10">
                                    {/* Custom navigation buttons */}
                                    <button className="swiper-button-prev-custom absolute -left-5 z-10 top-[45%] -translate-y-1/2 p-3 bg-gray-300 rounded-full shadow-lg hover:bg-gray-400">
                                        <ChevronLeft className="w-6 h-6 text-black" />
                                    </button>

                                    <button className="swiper-button-next-custom absolute -right-5 z-10 top-[45%] -translate-y-1/2 p-3 bg-gray-300 rounded-full shadow-lg hover:bg-gray-400">
                                        <ChevronRight className="w-6 h-6 text-black" />
                                    </button>

                                    <Swiper
                                        modules={[Navigation, Pagination]}
                                        spaceBetween={24}
                                        slidesPerView={4}
                                        pagination={{ clickable: true,  }}
                                        navigation={{
                                            nextEl: ".swiper-button-next-custom",
                                            prevEl: ".swiper-button-prev-custom",
                                        }}
                                        breakpoints={{
                                            320: { slidesPerView: 1 },
                                            640: { slidesPerView: 2 },
                                            1024: { slidesPerView: 4, slidesPerGroup: 4 },
                                        }}
                                        className="w-full"
                                    >
                                        {contratos.map((contrato) => (
                                            <SwiperSlide key={contrato.cdContrato} className="pb-[45px]">
                                                <div className="bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col justify-between">
                                                    <div className="p-6">
                                                        <h2 className="text-xl font-bold mb-2 text-gray-800">
                                                            Contrato #{contrato.cdContrato}
                                                        </h2>
                                                        <p className="text-gray-600"><strong>Status:</strong> {contrato.dsStatus ?? ""}</p>
                                                        <p className="text-gray-600"><strong>Atualizado em:</strong> {contrato.dtInicial ? new Date(contrato.dtInicial).toLocaleDateString() : ""}</p>
                                                        <p className="text-gray-600"><strong>Grão:</strong> {contrato.mercadoria ?? ""}</p>
                                                        <p className="text-gray-600"><strong>Preço por saco:</strong> ${contrato.precoSaco ? contrato.precoSaco.toFixed(2) : ""}</p>
                                                    </div>
                                                    <div className="bg-[#FF8B00] text-white text-center font-semibold p-4 rounded-b-lg">
                                                        <p>Comprador: {getFirstAndLastName(contrato.comprador)}</p>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            ) : (
                                <div className="justify-center items-center">
                                    <p className="mb-6 font-semibold">Nenhum resultado encontrado.</p>
                                </div>
                            )}
                        </div>
        

                        {/* Cliente ----------------------------------------------- */}
                        <div className="p-6 m-6">
                            <div className="flex flex-row justify-between">
                                <div className="items-start justify-center">
                                    <h1 className="text-2xl font-bold mb-4">Clientes</h1>
                                </div>
                            </div>

                            {/* Cliente Section */} 
                            {clientes.length > 0 ? (
                                <div className="relative w-full px-10">
                                    <button className="swiper-button-prev-client absolute -left-5 z-10 top-[45%] -translate-y-1/2 p-3 bg-gray-300 rounded-full shadow-lg hover:bg-gray-400">
                                        <ChevronLeft className="w-6 h-6 text-black" />
                                    </button>

                                    <button className="swiper-button-next-client absolute -right-5 z-10 top-[45%] -translate-y-1/2 p-3 bg-gray-300 rounded-full shadow-lg hover:bg-gray-400">
                                        <ChevronRight className="w-6 h-6 text-black" />
                                    </button>

                                    <Swiper
                                        modules={[Navigation, Pagination]}
                                        spaceBetween={24}
                                        slidesPerView={4}
                                        pagination={{ clickable: true,  }}
                                        navigation={{
                                            nextEl: ".swiper-button-next-client",
                                            prevEl: ".swiper-button-prev-client",
                                        }}
                                        breakpoints={{
                                            320: { slidesPerView: 1 },
                                            640: { slidesPerView: 2 },
                                            1024: { slidesPerView: 4, slidesPerGroup: 4 },
                                        }}
                                        className="w-full"
                                    >
                                        {clientes.map((cliente) => (
                                            <SwiperSlide key={cliente.cdCpfCnpj} className="pb-[45px]">
                                                <div className="bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col justify-between">
                                                    {/* Top Section - Contract Preview */}
                                                    <div className="p-6">
                                                        <h2 className="text-xl font-bold mb-2 text-gray-800">
                                                            {getFirstAndLastName(cliente.dsNome)}
                                                        </h2>
                                                        <p className="text-gray-600"> <strong>CPF/CNPJ: </strong> {cliente.cdCpfCnpj === null ? "" : cliente.cdCpfCnpj}</p>
                                                        <p className="text-gray-600"><strong>Localização:</strong> {cliente.dsCidade === null ? "" : cliente.dsCidade}</p>
                                                        <p className="text-gray-600"><strong>Estado:</strong> {cliente.dsEstado === null ? "" : cliente.dsEstado}</p>
                                                    </div>

                                                    <div className="bg-[#FF8B00] text-white text-center font-semibold p-4 rounded-b-lg">
                                                        <p>CEP: {cliente.cdCep}</p>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            ) : (
                                <p>Você ainda não possui clientes.</p>
                            )}
                        </div>

                        {/* Motorista ----------------------------------------------- */}
                        <div className="p-6 m-6">
                            <div className="flex flex-row justify-between">
                                <div className="items-start justify-center">
                                    <h1 className="text-2xl font-bold mb-4">Motoristas</h1>
                                </div>
                            </div>

                            {/* Cliente Section */} 
                            {motoristas.length > 0 ? (
                                <div className="relative w-full px-10">
                                    <button className="swiper-button-prev-motorista absolute -left-5 z-10 top-[45%] -translate-y-1/2 p-3 bg-gray-300 rounded-full shadow-lg hover:bg-gray-400">
                                        <ChevronLeft className="w-6 h-6 text-black" />
                                    </button>

                                    <button className="swiper-button-next-motorista absolute -right-5 z-10 top-[45%] -translate-y-1/2 p-3 bg-gray-300 rounded-full shadow-lg hover:bg-gray-400">
                                        <ChevronRight className="w-6 h-6 text-black" />
                                    </button>

                                    <Swiper
                                        modules={[Navigation, Pagination]}
                                        spaceBetween={24}
                                        slidesPerView={4}
                                        pagination={{ clickable: true,  }}
                                        navigation={{
                                            nextEl: ".swiper-button-next-motorista",
                                            prevEl: ".swiper-button-prev-motorista",
                                        }}
                                        breakpoints={{
                                            320: { slidesPerView: 1 },
                                            640: { slidesPerView: 2 },
                                            1024: { slidesPerView: 4, slidesPerGroup: 4 },
                                        }}
                                        className="w-full"
                                    >
                                        {motoristas.map((motorista) => (
                                            <SwiperSlide key={motorista.cdCpf} className="pb-[45px]">
                                                <div className="bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col justify-between">
                                                    {/* Top Section - Contract Preview */}
                                                    <div className="p-6">
                                                        <h2 className="text-xl font-bold mb-2 text-gray-800">
                                                            {motorista.dsNome}
                                                        </h2>
                                                        <p className="text-gray-600"> <strong>CPF: </strong> {motorista.cdCpf === null ? "" : motorista.cdCpf}</p>
                                                        <p className="text-gray-600"><strong>Localização:</strong> {motorista.dsCidade === null ? "" : motorista.dsCidade}</p>
                                                        <p className="text-gray-600"><strong>Estado:</strong> {motorista.dsEstado === null ? "" : motorista.dsEstado}</p>
                                                    </div>

                                                    <div className="bg-[#FF8B00] text-white text-center font-semibold p-4 rounded-b-lg">
                                                        <p>Placa: {motorista.dsPlaca}</p>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            ) : (
                                <p>Você ainda não possui motoristas.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <p>Você ainda não entrou, por favor entre no sistema</p>
                )}
            </div>
        </div>
    );
}
