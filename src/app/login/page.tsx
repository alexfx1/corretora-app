"use client";
import "@/app/globals.css";
import Image from "next/image";
import { GetAllCorretores, Corretor, PostCorretor } from "@/components/service/CorretorService";
import { useEffect, useState } from "react";
import { cpfCnpjSchema, FormatterCpfCnpj } from "@/components/utils/CpfCnpjFormatter";
import { Bank, GetBanks } from "@/components/service/BancoService";
import { Select } from "@/components/utils/Search";
import { estados } from '@/components/utils/EstadosBr';
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [corretores, setCorretores] = useState<Corretor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [title, setTitle] = useState<boolean>(true);
    const [showCadastro, setShowCadastro] = useState<boolean>(false);

    useEffect(() => {
        const fetchCorretores = async () => {
            localStorage.clear();
            const data = await GetAllCorretores();
            const banks = await GetBanks();
            setCorretores(data);
            setBancos(banks);
            setLoading(false);
            setTitle(data.length > 0 ? false: true);
        };

        fetchCorretores();
    }, []);
    
    const [bancos, setBancos] = useState<Bank[]>([]);
    const [corretor, setCorretor] = useState<Corretor>({
        cdCorretor: 0,
        dsNome: "",
        cdCpf: "",
        dsBanco: "",
        cdAgencia: "",
        cdConta: "",
        dsCidade: "",
        dsEstado: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [errorCnpj, setErrorCnpj] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            const createdCorretor = await PostCorretor(corretor);
            setSuccessMessage(`Corretor ${createdCorretor.dsNome} cadastrado com sucesso!`);

            setTimeout(() => {
                router.push("/");
            }, 1200);
        } catch (err) {
            setError("Servidor indisponível. " + err);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCorretor((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFormatterCpfCnpj = (e: React.ChangeEvent<HTMLInputElement>, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => {
        const input = e.target.value;
        const formatted = FormatterCpfCnpj(input);
    
        const isValid = cpfCnpjSchema.safeParse(formatted);
        setErrorCnpj(isValid.success ? null : isValid.error.errors[0]?.message);
    
        const sanitized = input.replace(/\D/g, "");
        e.target.value = sanitized;
        onChange(e);
    };

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
                {!showCadastro ? <>
                    <div className="bg-white shadow-lg rounded-xl mt-10 p-10 space-y-5 m-10 w-[600px] h-[660px]">
                        <div className="flex justify-center">
                            <Image
                                className="max-w-[90px]"
                                alt="logo"
                                src="/images/logo.webp"
                                quality={100}
                                width={95}
                                height={1}
                            />
                        </div>
                        {/* Form Section */}
                        <form className="p-10 flex justify-center flex-col items-center">
                            <h1 className="text-3xl font-bold mb-6 text-center" hidden={title}>Entrar Como</h1>
                            {/* Loading State */}
                            {loading ? (
                                <p className="text-sm text-gray-500 animate-pulse mb-4">Carregando usuários...</p>
                            ) : corretores.length > 0 ? (
                                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md shadow-sm mb-6">
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
                                <p className="text-sm text-gray-500 mb-4">Cadastre-se no sistema</p>
                            )}

                            {/* Button */}
                            <button
                                onClick={() => setShowCadastro(true)}
                                className="flex justify-center bg-[#FF8B00] text-white py-2 px-4 rounded hover:bg-orange-600 transition"
                                type="button"
                                >
                                CADASTRE-SE
                            </button>
                        </form>
                    </div>
                </> : <>
                    <div className="bg-white shadow-lg rounded-xl mt-10 p-10 space-y-5 m-10 w-[600px]">
                        <div className="flex justify-center mb-4">
                            <Image
                                className="max-w-[90px]"
                                alt="logo"
                                src="/images/logo.webp"
                                quality={100}
                                width={95}
                                height={140}
                            />
                        </div>
                        <div className="flex justify-center">
                            <h1 className="text-3xl font-bold mb-6 text-center">Cadastro</h1>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5 flex flex-col">
                            {/* Success Message */}
                            {successMessage && (
                            <p className="bg-green-100 text-green-800 p-3 rounded mb-4 text-center">
                                {successMessage}
                            </p>
                            )}
    
                            {/* Error Message */}
                            {error && (
                                <p className="bg-red-100 text-red-800 p-3 rounded mb-4 text-center">
                                    {error}
                                </p>
                            )}
                            <div className="flex flex-row gap-1">
                                <div className="flex flex-col w-full">
                                    <label htmlFor="dsNome" className='mb-1 text-sm font-medium text-gray-700'>Nome</label>
                                    <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                        id='dsNome' 
                                        name='dsNome' 
                                        type="text" 
                                        value={corretor.dsNome} 
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className='flex flex-col w-full'>
                                    <label htmlFor="cdCpf" className='mb-1 text-sm font-medium text-gray-700'>CPF</label>
                                    <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                        id='cdCpf' 
                                        name='cdCpf' 
                                        type="text" 
                                        value={FormatterCpfCnpj(corretor.cdCpf)} 
                                        maxLength={11} 
                                        onChange={(e) => handleFormatterCpfCnpj(e, (event) => {
                                            setCorretor((prev) => ({
                                                ...prev,
                                                cdCpf: event.target.value,
                                            }));
                                        })}
                                    />
                                    {errorCnpj && <p className="text-red-600 text-sm mt-1">{errorCnpj}</p>}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="dsBanco" className='mb-1 text-sm font-medium text-gray-700'>Banco</label>
                                <Select
                                    id="dsBanco"
                                    options={bancos.map((bank) => bank.fullName)}
                                    value={corretor.dsBanco}
                                    width='w-full'
                                    onChange={(selectedBanco) =>
                                        setCorretor((prev) => ({
                                            ...prev,
                                            dsBanco: selectedBanco,
                                        }))
                                    }
                                />
                            </div>
                            <div className="flex flex-row gap-1">
                                <div className='flex flex-col w-full'>
                                    <label htmlFor="cdAgencia" className='mb-1 text-sm font-medium text-gray-700'>Agência</label>
                                    <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                        id='cdAgencia' 
                                        name='cdAgencia' 
                                        type="text" 
                                        value={corretor.cdAgencia} 
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col w-full'>
                                    <label htmlFor="cdConta" className='mb-1 text-sm font-medium text-gray-700'>Conta</label>
                                    <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                        id='cdConta' 
                                        name='cdConta' 
                                        type="text" 
                                        value={corretor.cdConta} 
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row gap-1">
                                <div className='flex flex-col w-full'>
                                    <label htmlFor="dsCidade" className='mb-1 text-sm font-medium text-gray-700'>Cidade</label>
                                    <input className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition' 
                                        id='dsCidade' 
                                        name='dsCidade' 
                                        type="text" 
                                        value={corretor.dsCidade} 
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label htmlFor="dsEstado" className='mb-1 text-sm font-medium text-gray-700'>Estado</label>
                                    <Select
                                        width="w-full"
                                        id="dsEstado"
                                        options={estados.map((estado) => estado)}
                                        value={corretor.dsEstado}
                                        onChange={(selectedEstado) =>
                                            setCorretor((prev) => ({
                                                ...prev,
                                                dsEstado: selectedEstado,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            {/* Submit Buttons */}
                            <div className="flex justify-center mt-[35px] gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCadastro(false)}
                                    className="bg-[#FF8B00] text-white px-4 py-2 rounded hover:bg-orange-600 shadow-inner transition focus:ring-2 focus:ring-orange-500 w-[150px]"
                                >
                                    Voltar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#018BFD] text-white px-4 py-2 rounded hover:bg-blue-600 transition focus:ring-2 focus:ring-blue-500 w-[150px]"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </>}
            </div>
        </div>
    );
}