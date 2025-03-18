export interface Bank {
    ispb: string;
    name: string;
    code: number;
    fullName: string;
}

const baseUrl = process.env.NEXT_PUBLIC_CORRETOR_API_URL || "https://brasilapi.com.br/api/banks/v1";

export async function GetBanks() {
    try {
           const response: Response = await fetch(baseUrl);
    
           if (!response.ok) {
               throw new Error(`Error ${response.status}: ${response.statusText}`);
           }
    
           const data: Bank[] = await response.json();
           return data;
       } catch (error) {
           console.error("Failed to fetch bancos:", error);
           return [];
       }
}