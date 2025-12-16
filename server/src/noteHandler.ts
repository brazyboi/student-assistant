import { getSupabaseClient, getOpenAIClient } from './helpers.js';

// Helper to generate the vector
async function generateEmbedding(text: string) {
    const openai = getOpenAIClient();
    const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text.replace(/\n/g, ' '),
    });
    return embeddingResponse.data[0].embedding;
}

export async function addNote(userId: string, noteContent: string) {
    const supabase = getSupabaseClient();
    
    const vector = await generateEmbedding(noteContent);

    const { data, error } = await supabase
        .from('documents')
        .insert({
            content: noteContent,
            embedding: vector,
            user_id: userId
        });

    if (error) {
        throw new Error(`Error saving note: ${error.message}`);
    }
    
    return { success: true };
}

export async function searchUserNotes(userId: string, query: string) {
    const supabase = getSupabaseClient();
    
    const queryEmbedding = await generateEmbedding(query);

    const { data: documents, error } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5, 
        match_count: 3,
        filter_user_id: userId
    });

    if (error) {
        console.error("Search Error:", error);
        return "";
    }

    return documents.map((doc: any) => doc.content).join("\n\n");
}