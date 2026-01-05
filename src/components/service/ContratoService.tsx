import { ClienteDto } from "./ClienteService";
import { Corretor } from "./CorretorService";
import { MotoristaDto } from "./MotoristaService";

const envUrl = process.env.NEXT_PUBLIC_CORRETOR_API_URL;

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
    page: PageObjectResponse
}

export interface TableContrato {
    cdContrato: number;
    cdCorretor: number;
    comprador?: ClienteDto;
    vendedor?: ClienteDto;
    motorista?: MotoristaDto;
    mercadoria?: {
        dsMercadoria?: string,
        flAtivo?: boolean,
    }
    dsStatus?: string;
    vlQuantidade?: number;
    vlQuantidadeSaco?: number,
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

export interface ContratoDto {
    cdContrato: number;
    cdCorretor: number;
    comprador: ClienteDto;
    vendedor: ClienteDto;
    motorista: MotoristaDto;
    mercadoria: {
        dsMercadoria: string,
        flAtivo: boolean,
    }
    dsStatus: string;
    vlQuantidade: number;
    vlQuantidadeSaco: number,
    precoSaco: number;
    vlKilo: number;
    dsPadraoTolerancia: string;
    dsArmazenagem: string;
    dsEnderecoEntrega: string;
    dsEmbalagem: string;
    dsPesoQualidade: string;
    dsCargaConta: string;
    dsPagamento: string;
    dsFormaPagamento: string;
    dsDescricao: string;
    dtContrato: string;
}

export interface TableContratoResponse {
    content: TableContrato[],
    page: PageObjectResponse
}

export interface PageObjectResponse {
    size: number,
    number: number,
    totalElements: number,
    totalPages: number
}

const baseUrl = `${envUrl}/contrato`;

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

export async function GetTableContratoView(cdCorretor: number, page: number,
    cdCod: string, dsStatus: string, dsCliente: string, dsMercadoria: string, 
    dsVendedor: string, vlPreco: string, startDate: Date | null, endDate: Date | null): Promise<TableContratoResponse> {
    try {
        const call = baseUrl + "/table/" + cdCorretor + "?page=" + page + "&pageSize=" + 10;
        
        let url = call;
        if(cdCod) {
            url = url + "&cod=" + cdCod;
        }
        if(dsStatus) {
            url += "&status=" + dsStatus;
        }
        if(dsCliente) {
            url += "&client=" + dsCliente;
        }
        if(dsMercadoria) {
            url += "&mercadoria=" + dsMercadoria;
        }
        if(dsVendedor) {
            url += "&vendedor=" + dsVendedor;
        }
        if(vlPreco) {
            url += "&preco=" + vlPreco;
        }
        if(startDate && endDate) {
            url += "&dtPeriod=" + `${startDate.toLocaleDateString('pt-BR')}-${endDate.toLocaleDateString('pt-BR')}`;
        }

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

export async function GetContratoById(id: string): Promise<ContratoDto> {
    try {
        const call = baseUrl + "/id/" + id;

        const response: Response = await fetch(call);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: ContratoDto = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch contratos:", error);
        throw new Error();
    }
}

export async function SaveContrato(body: TableContrato, id?: string): Promise<TableContrato> {
    try {
        const method = id ? "PUT" : "POST";
        const url = id ? baseUrl + "/" + id : baseUrl;
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorDetails}`);
        }

        const data: TableContrato = await response.json();
        return data as TableContrato;
    }
    catch(error: unknown) {
        console.error("Failed to save the contract:", error);
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}

export async function DownloadContract(id: string, corretor: Corretor) {
  try {
    const url = `${baseUrl}/${id}/pdf`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/pdf",
      },
      body: JSON.stringify(corretor),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorDetails}`);
    }

    const blob = await response.blob();

    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `contrato-${id}.pdf`;
    document.body.appendChild(link);

    link.click();

    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

  } catch (error: unknown) {
    console.error("Failed to download the contract:", error);
    throw error instanceof Error ? error : new Error("An unexpected error occurred");
  }
}

export async function DeleteContract(id: string) {
  try {
    const url = `${baseUrl}/${id}`;

    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });

  } catch (error: unknown) {
    console.error("Failed to delete the contract:", error);
    throw error instanceof Error ? error : new Error("An unexpected error occurred");
  }
}