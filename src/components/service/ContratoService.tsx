import { Cliente } from "./ClienteService";
import { Motorista } from "./MotoristaService";

export interface CardContrato {
    cdContrato: number;
    dsStatus: string;
    dtInicial: Date;
    mercadoria: string;
    comprador: string;
    precoSaco: number;
}

export interface CardContratoResponse {
    content: CardContrato[]
    page: {
        size: number,
        number: number,
        totalElements: number,
        totalPages: number
    }
}

export interface TableContrato {
    cdContrato: number;
    cdCorretor: number;
    comprador?: Cliente;
    vendedor?: Cliente;
    motorista?: Motorista;
    mercadoria?: {
        dsMercadoria?: string,
        flAtivo?: boolean,
    }
    dsStatus?: string;
    vlQuantidade?: number;
    precoSaco?: number;
    vlKilo?: number;
    dsPadraoTolerancia?: string;
    dsArmazenagem?: string;
    dsEnderecoEntrega?: string;
    dsEmbalagem?: string;
    dsPesoQualidade?: string;
    dsCargaConta?: string;
    dsPagamento?: string;
    dsFormaPagamento?: string;
    dsDescricao?: string;
    dtContrato: string;
    dtInicio?: string;
}

export interface TableContratoResponse {
    content: TableContrato[],
    page: {
        size: number,
        number: number,
        totalElements: number,
        totalPages: number
    }
}

const baseUrl = process.env.NEXT_PUBLIC_CORRETOR_API_URL || "http://localhost:8099/ms-corretora/contrato";

export async function GetCardsContratoView(cdCorretor: number, searchTerm?: string): Promise<CardContratoResponse> {
    try {
        const call = baseUrl + "/cards/" + cdCorretor;
        const url = searchTerm ? call + "?search=" + searchTerm : call;
        const response: Response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: CardContratoResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch contratos:", error);
        throw new Error();
    }
}

export async function GetTableContratoView(cdCorretor: number, page: number, pageSize: number, searchTerm?: string): Promise<TableContratoResponse> {
    try {
        const call = baseUrl + "/table/" + cdCorretor + "?page=" + page + "&pageSize=" + pageSize;
        const url = searchTerm ? call + "?search=" + searchTerm : call;
        const response: Response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: TableContratoResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch contratos:", error);
        throw new Error();
    }
}