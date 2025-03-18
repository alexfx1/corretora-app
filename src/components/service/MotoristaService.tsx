export interface Motorista {
    cdCpf: string;
    dsNome: string;
    dsPlaca: string;
    dsCidade: string;
    dsEstado: string;
}

const url = "http://localhost:8099/ms-corretora/motorista";

export async function GetAllMotorista() : Promise<Motorista[]> {
    try {
        const response: Response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: Motorista[] = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch clientes:", error);
        return [];
    }
}