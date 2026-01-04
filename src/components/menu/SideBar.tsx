import { useRouter } from "next/navigation";
import Image from "next/image";

export function SideBarComponent({nome} : {nome?: string}) {
    const router = useRouter();

    return (
        <aside className="w-[364px] h-screen bg-[#69A5D5] text-white flex flex-col">
            <div className="mt-10 flex justify-center">
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
            <div className="mt-10 text-center font-bold text-lg">
                Olá {nome} <br />
                Seja bem {nome?.endsWith("a") ? "vinda" : "vindo"}!
            </div>

            {/* Options */}
            <div className="flex-grow p-4 m-[40px]">
                <ul className="space-y-10">
                    <li className="bg-[#FF8B00] hover:bg-orange-600 p-2 cursor-pointer text-center font-semibold rounded" onClick={() => router.push("/contrato")}>
                        CONTRATOS
                    </li>
                    <li className="bg-[#FF8B00] hover:bg-orange-600 p-2 cursor-pointer text-center font-semibold rounded" onClick={() => router.push("/motorista")}>
                        MOTORISTA
                    </li>
                    <li className="bg-[#FF8B00] hover:bg-orange-600 p-2 cursor-pointer text-center font-semibold rounded" onClick={() => router.push("/cliente")}>
                        CLIENTE
                    </li>
                    <li className="bg-[#FF8B00] hover:bg-orange-600 p-2 cursor-pointer text-center font-semibold rounded" onClick={() => router.push("/perfil")}>
                        MEU PERFIL
                    </li>
                    <li className="bg-[#FF8B00] hover:bg-orange-600 p-2 cursor-pointer text-center font-semibold rounded" onClick={() => router.push("/utilidades")}>
                        OUTROS
                    </li>
                </ul>
            </div>

            {/* Footer */}
            <div className="p-4 text-center m-[30px]">
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
