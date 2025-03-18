import { useRouter } from "next/navigation";

export function SideBarComponent({nome} : {nome?: string}) {
    const router = useRouter();

    return (
        <aside className="w-[364px] h-screen bg-[#69A5D5] text-white flex flex-col">
            {/* Header */}
            <div className="p-10 m-[20px] text-center font-bold text-lg">
                Olá {nome} <br />
                Seja bem {nome?.endsWith("a") ? "vinda" : "vindo"}!
            </div>

            {/* Options */}
            <div className="flex-grow p-4 m-[40px]">
                <ul className="space-y-10">
                    <li className="bg-[#FF8B00] hover:bg-orange-600 p-2 cursor-pointer text-center font-semibold" onClick={() => router.push("/contrato")}>
                        CONTRATOS
                    </li>
                    <li className="bg-[#FF8B00] hover:bg-orange-600 p-2 cursor-pointer text-center font-semibold">
                        MOTORISTA
                    </li>
                    <li className="bg-[#FF8B00] hover:bg-orange-600 p-2 cursor-pointer text-center font-semibold">
                        CLIENTE
                    </li>
                    <li className="bg-[#FF8B00] hover:bg-orange-600 p-2 cursor-pointer text-center font-semibold">
                        OUTROS
                    </li>
                </ul>
            </div>

            {/* Footer */}
            <div className="p-4 text-center m-[30px]">
                <button
                    onClick={() => router.push("/")}
                    className="bg-[#FF8B00] hover:shadow-[inset_-12px_-8px_30px_#46464620] text-white py-2 px-4 w-[100px] font-semibold"
                >
                    SAIR
                </button>
            </div>
        </aside>
    );
}
