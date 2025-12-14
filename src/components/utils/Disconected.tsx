import { useRouter } from "next/navigation";

export function Disconected() {
    const router = useRouter();
    return (
        <div className="flex flex-col w-full h-full items-center justify-center space-y-3">
            <p className="font-semibold text-lg">Ops.. Você ainda não entrou, por favor entre no sistema</p>
            <button className="space-x-2 flex flex-row bg-orange-500 hover:bg-yellow-800 px-4 py-2 text-white rounded" type="button" onClick={() => router.push('/login')}>
                Voltar
            </button>
        </div>
    );
}