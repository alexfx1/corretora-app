import { PageObjectResponse } from '@/components/service/ContratoService';

export interface MotoristaDto {
    cdMotorista?: number;
    dsTelefone: string;
    dsContato: string;
    cdCpf: string;
    dsNome: string;
    dsPlaca: string;
    dsCidade: string;
    dsEstado: string;
}

export interface TableMotoristaResponse {
    content: MotoristaDto[],
    page: PageObjectResponse
}

const baseUrl = process.env.NEXT_PUBLIC_CORRETOR_API_URL;
const url = `${baseUrl}/motorista`;

export async function GetAllMotorista() : Promise<MotoristaDto[]> {
    try {
        const response: Response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: MotoristaDto[] = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch clientes:", error);
        return [];
    }
}

export async function GetAllMotoristaPageable(page: number, nome: string, placa: string, cpf: string, cidade: string, estado: string) : Promise<TableMotoristaResponse> {
    try {
        const call = url + '/pageable?page=' + page;
        let back = call;
        
        if(nome) {
            back += "&nome=" + nome;
        }
        if(placa) {
            back += "&placa=" + placa;
        }
        if(cpf) {
            back += "&cpf=" + cpf;
        }
        if(cidade) {
            back += "&cidade=" + cidade;
        }
        if(estado) {
            back += "&estado=" + estado;
        }

        const response: Response = await fetch(back);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: TableMotoristaResponse = await response.json();
        return data;

    } catch (error) {
        console.error("Failed to fetch motoristas:", error);
        throw new Error();
    }
}

/**
 * Post to include a new motorista in the database.
 * @param motorista The `MotoristaDto` object to add.
 * @returns The newly added `MotoristaDto` object.
 * @throws An error if the post operation fails.
 */
export async function PostMotorista(motorista: MotoristaDto): Promise<MotoristaDto> {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(motorista),
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorDetails}`);
        }

        const data: MotoristaDto = await response.json();

        return data as MotoristaDto;
    } catch (error: unknown) {
        console.error("Failed to post motorista:", error);

        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}

export async function GetMotoristaById(cdMotorista: string): Promise<MotoristaDto> {
    try {

        const backend = url + "/id/" + cdMotorista;
        const response = await fetch(backend);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result: MotoristaDto = await response.json();

        return result;

    } catch (error) {
        console.error("Failed to fetch motorista:", error);
        throw new Error();
    }
}