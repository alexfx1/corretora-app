

const url = "http://localhost:8099/ms-corretora/mercadoria";

export interface MercadoriaDto {
    nome: string;
    flAtivo: boolean;
}

export async function GetAllMercadoria() : Promise<MercadoriaDto[]> {
    try {
        const response: Response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: MercadoriaDto[] = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch mercadorias:", error);
        return [];
    }
}