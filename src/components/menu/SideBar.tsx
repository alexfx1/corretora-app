import { useRouter } from "next/navigation";
import Image from "next/image";

export function SideBarComponent({nome} : {nome?: string}) {
    const router = useRouter();

    return (
        <aside className="w-[364px] min-h-screen bg-[#69A5D5] text-white flex flex-col overflow-auto">
            <div className="flex flex-col justify-center items-center mt-10">
                <div className="flex justify-center">
                    <Image
                        className="max-w-[90px] cursor-pointer"
                        onClick={() => router.push("/menu")}
                        alt="logo"
                        src="/images/logo.webp"
                        quality={100}
                        width={60}
                        height={0}
                    />
                </div>
                {/* Header */}
                <div className="mt-8 text-center font-bold text-lg">
                    Olá {nome} <br />
                    Seja bem {nome?.endsWith("a") ? "vinda" : "vindo"}!
                </div>
            </div>

            {/* Options */}
            <div className="m-10 flex flex-col justify-center">
                <ul className="space-y-10 flex flex-col justify-center items-center">
                    <li className="bg-[#FF8B00] hover:bg-orange-600 p-2 cursor-pointer text-center font-semibold rounded w-[175px]" onClick={() => router.push("/contrato")}>
                        CONTRATOS
                    </li>
                    <li className="bg-[#FF8B00] hover:bg-orange-600 p-2 cursor-pointer text-center font-semibold rounded w-[175px]" onClick={() => router.push("/motorista")}>
                        MOTORISTA
                    </li>
                    <li className="bg-[#FF8B00] hover:bg-orange-600 p-2 cursor-pointer text-center font-semibold rounded w-[175px]" onClick={() => router.push("/cliente")}>
                        CLIENTE
                    </li>
                    <li className="bg-[#FF8B00] hover:bg-orange-600 p-2 cursor-pointer text-center font-semibold rounded w-[175px]" onClick={() => router.push("/perfil")}>
                        MEU PERFIL
                    </li>
                    <li className="bg-[#FF8B00] hover:bg-orange-600 p-2 cursor-pointer text-center font-semibold rounded w-[175px]" onClick={() => router.push("/utilidades")}>
                        OUTROS
                    </li>
                </ul>
            </div>

            {/* Footer */}
            <div className="mt-auto text-center mb-10">
                <button
                    onClick={() => router.push("/")}
                    className="bg-[#FF8B00] hover:shadow-[inset_-12px_-8px_30px_#46464620] text-white py-2 px-4 w-[100px] font-semibold rounded"
                >
                    SAIR
                </button>
            </div>
        </aside>
    );
}
