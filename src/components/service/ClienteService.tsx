import { PageObjectResponse } from '@/components/service/ContratoService';

export interface ClienteDto {
    cdCliente?: number;
    dsTelefone: string;
    dsContato: string;
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

export interface TableClienteResponse {
    page: PageObjectResponse,
    content: ClienteDto[]
}

const url = "http://localhost:8099/ms-corretora/cliente";

export async function GetAllClients(): Promise<ClienteDto[]> {
    try {
        const response: Response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: ClienteDto[] = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch clientes:", error);
        return [];
    }
}

export async function GetAllClientsPage(page: number, dsNome: string, dsCpfCnpj: string, 
    dsEndereco: string, dsCidade: string, dsEstado: string
): Promise<TableClienteResponse> {
    try {
        const call = url + "/pageable?page=" + page + "&pageSize=" + 10;
        let back = call;

        if(dsNome) {
            back += "&nome=" + dsNome
        }
        if(dsCpfCnpj) {
            back += "&cpfCnpj=" + dsCpfCnpj;
        }
        if(dsEndereco) {
            back += "&endereco=" + dsEndereco;
        }
        if(dsCidade) {
            back += "&cidade=" + dsCidade;
        }
        if(dsEstado) {
            back += "&estado=" + dsEstado;
        }

        const response: Response = await fetch(back);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: TableClienteResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch clientes:", error);
        throw new Error();
    }
}

/**
 * Post to include a new motorista in the database.
 * @param cliente The `ClienteDto` object to add.
 * @returns The newly added `ClienteDto` object.
 * @throws An error if the post operation fails.
 */
export async function PostCliente(cliente: ClienteDto): Promise<ClienteDto> {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cliente),
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorDetails}`);
        }

        const data: ClienteDto = await response.json();

        return data as ClienteDto;
    } catch (error: unknown) {
        console.error("Failed to post cliente:", error);
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}

export async function GetClienteById(cdCliente: string): Promise<ClienteDto> {
    try {

        const backend = url + "/id/" + cdCliente;
        const response = await fetch(backend);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result: ClienteDto = await response.json();

        return result;

    } catch (error) {
        console.error("Failed to fetch motorista:", error);
        throw new Error();
    }
}