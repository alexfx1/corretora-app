export interface Corretor {
    cdCorretor: number;
    dsNome: string;
    cdCpf: string;
    dsBanco: string;
    cdAgencia: string;
    cdConta: string;
    dsCidade: string;
    dsEstado: string;
    dsChavePix?: string;
}
const envUrl = process.env.NEXT_PUBLIC_CORRETOR_API_URL;
const baseUrl = `${envUrl}/corretor`;

/**
* Fetches all corretores from the backend.
* @returns A Promise that resolves to an array of Corretor objects.
*/
export async function GetAllCorretores(): Promise<Corretor[]> {

   try {
       const response: Response = await fetch(baseUrl);

       if (!response.ok) {
           throw new Error(`Error ${response.status}: ${response.statusText}`);
       }

       const data: Corretor[] = await response.json();
       return data;
   } catch (error) {
       console.error("Failed to fetch corretores:", error);
       return [];
   }
}

/**
 * Post to include a new corretor in the database.
 * @param corretor The `Corretor` object to add.
 * @returns The newly added `Corretor` object.
 * @throws An error if the post operation fails.
 */
export async function PostCorretor(corretor: Corretor): Promise<Corretor> {
    try {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(corretor),
        });

        // Handle HTTP errors explicitly
        if (!response.ok) {
            const errorDetails = await response.text(); // Get additional details if the API provides them
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorDetails}`);
        }

        const data: unknown = await response.json();

        // Type check the response to ensure it matches Corretor
        if (typeof data !== "object" || !data) {
            throw new Error("Unexpected response format: Not an object");
        }

        // Return the successfully created Corretor
        return data as Corretor;
    } catch (error: unknown) {
        // Log the error for debugging purposes
        console.error("Failed to post corretor:", error);

        // Re-throw or handle the error as needed
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}