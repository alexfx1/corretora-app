const baseUrl = process.env.NEXT_PUBLIC_CORRETOR_API_URL;
const url = `${baseUrl}/parametro`;

export interface ParametroDto {
    cdParametro: number;
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

export async function UpdateParam(body: ParametroDto) : Promise<ParametroDto> {
    try {
        const call = `${url}/${body.dsChaveParametro}`;
        const response = await fetch(call, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const result: ParametroDto = await response.json();
        return result as ParametroDto;
    } catch (error: unknown) {
        console.error("Failed to update param: ", JSON.stringify(error));
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}