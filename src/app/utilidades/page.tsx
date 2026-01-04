'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SideBarComponent } from '@/components/menu/SideBar';
import { Corretor } from '@/components/service/CorretorService';
import { Disconected } from "@/components/utils/Disconected";
import { Loading } from "@/components/utils/Loading";
import { Info } from "lucide-react";
import { GetAllParametro, ParametroDto, UpdateParam } from "@/components/service/ParametroService";

export default function Utilidades() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [corretor, setCorretor] = useState<Corretor | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [params, setParams] = useState<ParametroDto[]>([]);

    useEffect(() => {
        const storedData = localStorage.getItem('corretor');
        if (storedData) {
            const userData: Corretor = JSON.parse(storedData);
            setCorretor(userData);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        const fetchParams = async () => {
        const data = await GetAllParametro();
            setParams(data);
        };
        fetchParams();
        setLoading(false);
    }, []);
    
    const handleParamChange = (id: number | undefined, value: string) => {
        setParams(prev =>
            prev.map(p => (p.cdParametro === id ? { ...p, vlParametro: value } : p))
        );
    };

    const updateParam = async (param: ParametroDto) => {
        setLoading(true);
        try {
            const resp = await UpdateParam(param);
            setSuccessMessage(`${resp.dsParametro ?? param.dsParametro} atualizado!`);
            const refresh = await GetAllParametro();
            setParams(refresh);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            setError('Ocorreu um erro ao atualizar ' + param.dsParametro);
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
                                <Info size={30}/>
                                <big><h1 className="text-2xl font-semibold text-gray-800">Utilidades</h1></big>
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

                            {params.map((param) => (
                            <div
                                key={param.cdParametro}
                                className="flex flex-col border-gray-400 border-2 p-4 rounded-md shadow-sm"
                            >
                                <div className="flex flex-row gap-4 mb-4">
                                    <span className="font-semibold text-[20px]">
                                        {param.dsParametro}
                                    </span>
                                </div>
                                <div className="flex flex-row space-x-5">
                                    <div className="flex flex-col w-full">
                                        <textarea
                                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition"
                                        rows={5}
                                        value={param.vlParametro ?? ''}
                                        onChange={(e) =>
                                            handleParamChange(param.cdParametro, e.target.value)
                                        }
                                        style={{ resize: 'none' }}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center items-center">
                                    <button
                                        type="button"
                                        className="w-[150px] mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow"
                                        onClick={() => updateParam(param)}
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </div>
                            ))}
                            <div className="flex flex-row items-center justify-center space-x-3">
                                <button
                                    type="button"
                                    className="w-[150px] mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md shadow"
                                    onClick={() => router.back()}
                                >
                                    Voltar
                                </button>
                            </div>
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