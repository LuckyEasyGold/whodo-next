import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImageToSupabase(
    file: File,
    bucketName: string,
    path: string
): Promise<{ url: string | null; error: Error | null }> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(path, buffer, {
                contentType: file.type,
                upsert: true,
            });

        if (error) {
            console.error('Erro ao fazer upload para o Supabase:', error);
            return { url: null, error };
        }

        const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(data.path);

        return { url: publicUrlData.publicUrl, error: null };
    } catch (error) {
        console.error('Exceção ao fazer upload:', error);
        return { url: null, error: error as Error };
    }
}
