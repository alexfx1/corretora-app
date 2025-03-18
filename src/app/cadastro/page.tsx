"use client";
import "@/app/globals.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PostCorretor, Corretor } from "@/components/service/CorretorService";
import { useRouter } from "next/navigation";
import { cpfCnpjSchema, FormatterCpfCnpj } from "@/components/utils/CpfCnpjFormatter";
import { Bank, GetBanks } from "@/components/service/BancoService";
import { Select } from "@/components/utils/Search";

export default function Cadastro() {
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

    const router = useRouter();

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

    useEffect(() => {
      const fetchBancos = async () => {
        const data = await GetBanks();
        setBancos(data);
      };
      fetchBancos();
    }, []);

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

            <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF7E5] space-y-20">
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

                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
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

                    {/* Nome Field */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            id="dsNome"
                            name="dsNome"
                            type="text"
                            value={corretor.dsNome}
                            onChange={handleChange}
                            placeholder=" "
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            required
                        />
                        <label
                            htmlFor="dsNome"
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
                        >
                            Nome
                        </label>
                    </div>

                    {/* CPF/CNPJ Field */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                                id="cdCpf"
                                name="cdCpf"
                                type="text"
                                value={FormatterCpfCnpj(corretor.cdCpf)} // Display the formatted value
                                onChange={(e) => handleFormatterCpfCnpj(e, (event) => {
                                    // Update the value in your state
                                    setCorretor((prev) => ({
                                        ...prev,
                                        cdCpf: event.target.value,
                                    }));
                                })}
                                maxLength={18} // Maximum length for CPF/CNPJ formats
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                            />
                            {errorCnpj && <p className="text-red-600 text-sm mt-1">{errorCnpj}</p>}
                        <label
                            htmlFor="cdCpf"
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
                        >
                            CPF/CNPJ
                        </label>
                    </div>

                    {/* Banco Field */}
                    <label htmlFor="dsBanco" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Banco
                    </label>
                    <Select
                        id="dsBanco"
                        options={bancos.map((bank) => bank.fullName)}
                        value={corretor.dsBanco}
                        onChange={(selectedBanco) =>
                            setCorretor((prev) => ({
                                ...prev,
                                dsBanco: selectedBanco,
                            }))
                        }
                    />
                    
                    <div className="h-[20px]"/>

                    {/* Agência Field */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            id="cdAgencia"
                            name="cdAgencia"
                            type="text"
                            value={corretor.cdAgencia}
                            onChange={handleChange}
                            placeholder=" "
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            required
                        />
                        <label
                            htmlFor="cdAgencia"
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
                        >
                            Agencia
                        </label>
                    </div>

                    {/* Conta Field */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            id="cdConta"
                            name="cdConta"
                            type="text"
                            value={corretor.cdConta}
                            onChange={handleChange}
                            placeholder=" "
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            required
                        />
                        <label
                            htmlFor="cdConta"
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
                        >
                            Conta
                        </label>
                    </div>

                    {/* Cidade Field */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            id="dsCidade"
                            name="dsCidade"
                            type="text"
                            value={corretor.dsCidade}
                            onChange={handleChange}
                            placeholder=" "
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            required
                        />
                        <label
                            htmlFor="dsCidade"
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
                        >
                            Cidade
                        </label>
                    </div>

                    {/* Estado Field */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            id="dsEstado"
                            name="dsEstado"
                            type="text"
                            value={corretor.dsEstado?.toUpperCase()}
                            onChange={(e) => {
                                const value = e.target.value.toUpperCase();
                                if (value.length <= 2) {
                                    handleChange(e);
                                }
                            }}
                            maxLength={2}
                            placeholder=" "
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            required
                        />
                        <label
                            htmlFor="dsEstado"
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
                        >
                            Estado
                        </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-between mt-6 space-x-4">
                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="bg-[#FF8B00] text-white px-4 py-2 rounded hover:bg-orange-600 shadow-inner transition focus:ring-2 focus:ring-orange-500 w-[100%]"
                        >
                            Voltar
                        </button>
                        <button
                            type="submit"
                            className="bg-[#018BFD] text-white px-4 py-2 rounded hover:bg-blue-600 transition focus:ring-2 focus:ring-blue-500 w-[100%]"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
