const baseUrl = process.env.NEXT_PUBLIC_CORRETOR_API_URL;
const url = `${baseUrl}/mercadoria`;

export interface MercadoriaDto {
    dsMercadoria: string;
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