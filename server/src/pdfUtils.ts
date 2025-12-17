import PDFParser from 'pdf2json';

export function extractTextFromPDF(buffer: Buffer): Promise<string> {
    const parser = new PDFParser(null, true);

    return new Promise((resolve, reject) => {
        parser.on("pdfParser_dataError", (errData: any) => {
            console.error("PDF Parser Error:", errData.parserError);
            reject(errData.parserError);
        });

        parser.on("pdfParser_dataReady", () => {
            const text = parser.getRawTextContent();
            resolve(text);
        });

        parser.parseBuffer(buffer);
    });
}

export function chunkText(text: string, chunkSize = 1000): string[] {
    const cleanText = decodeURIComponent(text).replace(/\s+/g, " ").trim();
    const chunks: string[] = [];
    let currentChunk = "";
    
    // Split by sentences
    const sentences = cleanText.split(/(?<=[.?!])\s+/);

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length < chunkSize) {
            currentChunk += sentence + " ";
        } else {
            chunks.push(currentChunk.trim());
            currentChunk = sentence + " ";
        }
    }
    if (currentChunk) chunks.push(currentChunk.trim());
    
    return chunks;
}