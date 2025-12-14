'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SideBarComponent } from '@/components/menu/SideBar';
import { Corretor } from '@/components/service/CorretorService';
import { PostMotorista, MotoristaDto } from "@/components/service/MotoristaService";
import { Input } from "@/components/utils/InputProps";
import { cpfCnpjSchema, FormatterCpfCnpj } from "@/components/utils/CpfCnpjFormatter";
import { Disconected } from "@/components/utils/Disconected";

export default function CadastroMotorista() {
    const router = useRouter();
    const [corretor, setCorretor] = useState<Corretor | null>(null);
    const [formData, setFormData] = useState<MotoristaDto>({
        dsTelefone: '',
        dsContato: '',
        cdCpf: '',
        dsNome: '',
        dsPlaca: '',
        dsCidade: '',
        dsEstado: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem('corretor');
        if (storedData) {
            const userData: Corretor = JSON.parse(storedData);
            setCorretor(userData);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleFormatterCpfCnpj = (e: React.ChangeEvent<HTMLInputElement>, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => {
        const input = e.target.value;
        const formatted = FormatterCpfCnpj(input);
    
        cpfCnpjSchema.safeParse(formatted);
    
        const sanitized = input.replace(/\D/g, "");
        e.target.value = sanitized;
        onChange(e);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        try {
            const result = await PostMotorista(formData);
            setSuccessMessage("Motorista "+ result.dsNome + " cadastrado com sucesso!");
            setTimeout(() => {
                router.push("/motorista/" + result.cdMotorista);
            }, 2000);
        } catch (error) {
            setError("Servidor indisponível");
            console.error(error);
        }
    };

    return(
        <div className="bg-[#FFF7E5] flex flex-row h-screen overflow-hidden">
            <SideBarComponent nome={corretor?.dsNome} />

            {corretor ? (
                <div className="flex flex-col w-full space-y-6 overflow-y-auto">
                    <div className="bg-white shadow-lg rounded-xl mt-10 p-10 space-y-10 m-10">
                        <h1 className="text-2xl font-semibold text-gray-800">Novo Motorista</h1>

                        {/* Success Message */}
                        {successMessage && (
                        <p className="bg-green-100 text-green-800 p-3 rounded text-center border border-green-300">
                            {successMessage}
                        </p>
                        )}

                        {/* Error Message */}
                        {error && (
                        <p className="bg-red-100 text-red-800 p-3 rounded text-center border border-red-300">
                            {error}
                        </p>
                        )}

                        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5">
                            <Input label="Nome" name="dsNome" value={formData.dsNome} onChange={handleChange} required />
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium text-gray-700">
                                    CPF
                                </label>
                                <input
                                    id='cpf'
                                    name='cpf'
                                    type="text"
                                    value={formData.cdCpf}
                                    maxLength={11}
                                    onChange={(e) => handleFormatterCpfCnpj(e, (event) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            cdCpf: event.target.value,
                                            }));
                                        })}
                                    className="bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition"
                                />
                            </div>
                            <Input label="Placa" name="dsPlaca" value={formData.dsPlaca} onChange={handleChange} />
                            <Input label="Cidade" name="dsCidade" value={formData.dsCidade} onChange={handleChange} />
                            <Input label="Estado" name="dsEstado" value={formData.dsEstado} onChange={handleChange} />
                            <Input label="Telefone" name="dsTelefone" value={formData.dsTelefone} onChange={handleChange} />
                            <Input label="Telefone 2 (opcional)" name="dsContato" value={formData.dsContato} onChange={handleChange} />

                            <div className="flex flex-row items-center justify-center space-x-3">
                                <button
                                    type="button"
                                    className="w-[150px] mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md shadow"
                                    onClick={() => router.push('/motorista')}
                                >
                                    Voltar
                                </button>
                                <button
                                    type="submit"
                                    className="w-[150px] mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow"
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
        </div>
    )
}