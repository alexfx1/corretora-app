


const url = "http://localhost:8099/ms-corretora/parametro";

export interface ParametroDto {
    cdParametro?: number;
    dsChaveParametro: string;
    dsParametro: string;
    vlParametro: string;
}

export async function GetAllParametro() : Promise<ParametroDto[]> {
    try {
        const response: Response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: ParametroDto[] = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch parametro:", error);
        return [];
    }
}

export async function GetParametroByKey(dsChaveParametro: string) : Promise<ParametroDto> {
    try {
        const call = url + "/" + dsChaveParametro;
        const response: Response = await fetch(call);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: ParametroDto = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch parametro:", error);
        throw error;
    }
}