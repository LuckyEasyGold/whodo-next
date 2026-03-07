// src/lib/upload-security.ts

const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'text/plain'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.webm', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'];

export function validateUpload(file: File): { valid: boolean; error?: string } {
    // Verifica tipo MIME
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: `Tipo de arquivo não permitido.`
        };
    }

    // Verifica tamanho
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `Arquivo muito grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`
        };
    }

    // Verifica extensão
    const fileNameParts = file.name.split('.');
    const ext = '.' + (fileNameParts.length > 1 ? fileNameParts.pop()?.toLowerCase() : '');
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return {
            valid: false,
            error: `Extensão não permitida`
        };
    }

    // Verifica nome de arquivo (previne path traversal)
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_ ()]/g, '_');
    if (sanitizedName !== file.name && sanitizedName.length > 100) {
        return {
            valid: false,
            error: `Nome de arquivo inválido`
        };
    }

    return { valid: true };
}
