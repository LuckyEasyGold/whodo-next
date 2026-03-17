export async function compressImage(file: File, options = { maxSizeMB: 1, maxWidthOrHeight: 1920 }): Promise<File> {
    // Se não for imagem (ex: vídeo), retorna o arquivo original sem mexer
    if (!file.type.startsWith('image/')) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                // Redimensionar mantendo proporção
                if (width > height && width > options.maxWidthOrHeight) {
                    height *= options.maxWidthOrHeight / width;
                    width = options.maxWidthOrHeight;
                } else if (height > options.maxWidthOrHeight) {
                    width *= options.maxWidthOrHeight / height;
                    height = options.maxWidthOrHeight;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                // Comprimir qualidade gradativamente até atingir o limite
                let quality = 0.9;
                const compress = () => {
                    canvas.toBlob((blob) => {
                        if (!blob) return reject(new Error('Falha ao comprimir imagem'));

                        if (blob.size / 1024 / 1024 > options.maxSizeMB && quality > 0.1) {
                            quality -= 0.1;
                            compress();
                        } else {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg', // Converter para JPEG para melhor compressão
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        }
                    }, 'image/jpeg', quality);
                };
                compress();
            };
        };
    });
}