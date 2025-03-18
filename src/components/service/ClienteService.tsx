export interface Cliente {
    dsNome: string;
    cdCpfCnpj: string;
    dsEndereco: string;
    cdCep: string;
    dsCidade: string;
    dsEstado: string;
    dsIns: string;
    dsBanco: string;
    cdAgencia: string;
    cdConta: string;
    dsChavePix: string;
}

const url = "http://localhost:8099/ms-corretora/cliente";

export async function GetAllClients(): Promise<Cliente[]> {
    try {
        const response: Response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: Cliente[] = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch clientes:", error);
        return [];
    }
}