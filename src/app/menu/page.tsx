'use client';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";
import { SideBarComponent } from '@/components/menu/SideBar';
import { CardContratoResponse, CardContrato, GetCardsContratoView } from '@/components/service/ContratoService';
import { Corretor } from '@/components/service/CorretorService';
import { useEffect, useState } from "react";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import { ClienteDto, GetAllClients } from "@/components/service/ClienteService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { GetAllMotorista, MotoristaDto } from "@/components/service/MotoristaService";
import { Loading } from "@/components/utils/Loading";
import { Truck } from "lucide-react";
import { Disconected } from "@/components/utils/Disconected";

export default function Menu() {
    const router = useRouter();
    const [corretor, setCorretor] = useState<Corretor | null>(null);
    const [clientes, setClientes] = useState<ClienteDto[]>([]);
    const [contratos, setContratos] = useState<CardContrato[]>([]);
    const [motoristas, setMotoristas] = useState<MotoristaDto[]>([]);
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
                    const clients: ClienteDto[] = await GetAllClients();
                    const motorists: MotoristaDto[] = await GetAllMotorista();
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
            {loading ? (
                <Loading/>
            ) : (
                <div className="flex flex-col w-full overflow-y-auto space-y-2">
                {corretor ? (
                    <>
                        {/* Contratos */}
                        <div className="p-6 m-6">
                            {/* Header */}
                            <div className="flex flex-row justify-between">
                                <div className="items-start justify-center">
                                    <h1 className="text-2xl font-bold mb-4">Contratos</h1>
                                    <p className="mb-6 font-light">Acesso rápido</p>
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
                            {contratos.length > 0 ? (
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
                                                <div className="bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col justify-between cursor-pointer"
                                                    onClick={(e) => {
                                                            e.preventDefault();
                                                            router.push("/contrato/" + contrato.cdContrato);
                                                        }}>
                                                    <div className="p-6">
                                                        <div className="flex flex-row w-full gap-4 mb-4">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                            </svg>
                                                            <h2 className="text-xl font-bold mb-2 text-gray-800">
                                                                {contrato.cdContrato}
                                                            </h2>
                                                        </div>
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
                                                <div className="bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col justify-between cursor-pointer"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        router.push("/cliente/" + cliente.cdCliente);
                                                    }}>
                                                    {/* Top Section - Contract Preview */}
                                                    <div className="p-6">
                                                        <div className="flex flex-row w-full gap-4 mb-4">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                                            </svg>
                                                            <h2 className="text-xl font-bold mb-2 text-gray-800">
                                                                {getFirstAndLastName(cliente.dsNome)}
                                                            </h2>
                                                        </div>
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
                                            <SwiperSlide key={motorista.cdMotorista} className="pb-[45px]">
                                                <div className="bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col justify-between cursor-pointer" 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        router.push("/motorista/" + motorista.cdMotorista);
                                                    }}>
                                                    {/* Top Section - Contract Preview */}
                                                    <div className="p-6">
                                                        <div className="flex flex-row w-full gap-4 mb-4">
                                                            <Truck></Truck>
                                                            <h2 className="text-xl font-bold mb-2 text-gray-800">
                                                                {motorista.dsNome}
                                                            </h2>
                                                        </div>
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
                    <Disconected/>
                )}
            </div>
            )
        }
    </div>
    );
}
