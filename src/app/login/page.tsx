"use client";
import Image from "next/image";
import { GetAllCorretores, CorretorResponse } from "@/components/service/CorretorService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
    const [corretores, setCorretores] = useState<CorretorResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [title, setTitle] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCorretores = async () => {
            localStorage.clear();
            const data = await GetAllCorretores();
            setCorretores(data);
            setLoading(false);
            setTitle(data.length > 0 ? false: true);
        };

        fetchCorretores();
    }, []);

    return (
        <div className="grid grid-cols-[1.5fr,1fr] h-screen">
            {/* Sidebar with Image */}
            <aside className="relative">
                <Image
                    src="/images/farm2.webp"
                    alt="farm"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
            </aside>

            <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF7E5] space-y-10">
                <div className="mb-4">
                    <Image
                        className="max-w-[90px]" // Add margin below the logo
                        alt="logo"
                        src="/images/logo.webp"
                        quality={100}
                        width={95}
                        height={140}
                    />
                </div>
                {/* Form Section */}
                <form className="p-10 flex justify-center flex-col bg-[#FFF7E5] items-center">
                    <h1 className="text-3xl font-bold mb-6 text-center" hidden={title}>Entrar Como</h1>
                    {/* Loading State */}
                    {loading ? (
                        <p className="text-sm text-gray-500 animate-pulse mb-4">Carregando usuários...</p>
                    ) : corretores.length > 0 ? (
                        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md shadow-sm mb-4">
                            <table className="min-w-full border-collapse w-[300px]">
                                <tbody>
                                    {corretores.map((corretor, index) => (
                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-3 text-gray-700 hover:bg-neutral-300 min-w-full cursor-pointer" onClick={(e) => {
                                                    e.preventDefault();
                                                    localStorage.setItem("corretor", JSON.stringify(corretor));
                                                    router.push("/menu");
                                                }}
                                                >
                                                    {corretor.dsNome}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 mb-4">Ainda não possui cadastros salvos.</p>
                    )}

                    {/* Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            router.push("/cadastro");
                        }}
                        className="flex justify-center bg-[#FF8B00] text-white py-2 px-4 rounded hover:bg-orange-600 transition"
                        type="button"
                        >
                        CADASTRE-SE
                    </button>
                </form>
            </div>
        </div>
    );
}