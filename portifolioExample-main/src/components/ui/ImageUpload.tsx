// src/components/ui/ImageUpload.tsx
import { motion } from 'framer-motion';
import { Upload, X, Edit2 } from 'lucide-react'; // Camera foi removida em passo anterior
import { useState, useRef, useEffect } from 'react'; // Adicionado useEffect
import { toast } from 'react-toastify';

interface ImageUploadProps {
  currentImage?: string | null; // Permitir null para reset explícito
  onImageSelect: (file: File) => void;
  onImageRemove?: () => void;
  uploadProgress?: number;
  isUploading?: boolean;
  label?: string;
  description?: string;
  shape?: 'circle' | 'square'; // ADICIONAR ESTA LINHA
  size?: number;              // ADICIONAR ESTA LINHA
}

const ImageUpload = ({
  currentImage,
  onImageSelect,
  onImageRemove,
  uploadProgress = 0,
  isUploading = false,
  label = "Foto de Perfil",
  // description = "Recomendado: 400x400px, máximo 2MB",
  shape = 'square', // Default value
  size = 128,       // Default value
}: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sincronizar previewImage com currentImage quando currentImage mudar externamente
  // e não houver um preview local (ou seja, não há um novo arquivo selecionado)
  useEffect(() => {
    if (!previewImage && currentImage) {
      // Se não há preview local mas existe uma currentImage (ex: ao carregar o formulário para edição)
      // não precisamos setar previewImage aqui, pois displayImage já usa currentImage.
      // Se currentImage for explicitamente setado para null/undefined (ex: imagem removida no submit e re-fetch)
      // e não houver um novo file selecionado, o preview deve limpar.
    }
    if (currentImage === null && !previewImage) { // Se a currentImage foi explicitamente limpa
         setPreviewImage(null);
    }

  }, [currentImage]);


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    } else {
      // Se o usuário cancelar a seleção de arquivo, podemos querer limpar o preview se ele era de um arquivo anterior não salvo
      // setPreviewImage(null); 
      // onImageSelect(null); // ou notificar o pai
    }
  };

  const handleFileSelection = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB
      toast.error('A imagem deve ter no máximo 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelect(file);
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPreviewImage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const triggerFileSelect = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // Prioriza o preview local, depois a imagem atual vinda das props
  const displayImage = previewImage || currentImage;
  const imageSizeStyle = { width: `${size}px`, height: `${size}px` };
  const borderRadiusStyle = shape === 'circle' ? 'rounded-full' : 'rounded-lg';

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={inputRef}
        disabled={isUploading}
      />
      <div
        className={`group relative cursor-pointer border-2 border-dashed 
                    transition-colors duration-300 ease-in-out
                    ${dragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                 : 'border-dark-200 hover:border-primary-400 dark:border-dark-700 dark:hover:border-primary-500'}
                    ${borderRadiusStyle}`}
        style={imageSizeStyle}
        onClick={!isUploading ? triggerFileSelect : undefined}
        onDrop={!isUploading ? handleDrop : undefined}
        onDragOver={!isUploading ? handleDragOver : undefined}
        onDragLeave={!isUploading ? handleDragLeave : undefined}
        title={isUploading ? "Enviando..." : "Clique ou arraste uma imagem"}
      >
        {displayImage && !isUploading ? (
          <>
            <img
              src={displayImage}
              alt="Preview"
              className={`object-cover ${borderRadiusStyle}`}
              style={imageSizeStyle}
            />
            <div className={`absolute inset-0 flex items-center justify-center 
                           bg-black bg-opacity-0 group-hover:bg-opacity-50 
                           transition-opacity duration-300 ease-in-out ${borderRadiusStyle}`}>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); triggerFileSelect(); }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-dark-700 hover:bg-white shadow-md"
                  title="Alterar Imagem"
                >
                  <Edit2 size={20} />
                </button>
                {onImageRemove && (currentImage || previewImage) && ( // Mostrar botão de remover somente se houver imagem
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/80 text-white hover:bg-red-600 shadow-md"
                    title="Remover Imagem"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className={`flex h-full w-full flex-col items-center justify-center 
                         text-dark-400 dark:text-dark-500 ${borderRadiusStyle}
                         ${isUploading ? '' : 'bg-gray-50 dark:bg-dark-800/50'}`}>
            {isUploading ? (
              <div className="w-full p-2 text-center">
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-dark-700 mb-1">
                  <motion.div
                    className="h-2 rounded-full bg-primary-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs">
                  {Math.round(uploadProgress)}%
                </p>
              </div>
            ) : (
              <>
                <Upload size={Math.max(24, size / 5)} className="mb-1" />
                <span className="text-xs text-center px-2">
                  {dragActive ? "Solte aqui!" : (shape === 'circle' ? "Enviar foto" : "Clique ou arraste")}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="md:ml-4 text-center md:text-left mt-2 md:mt-0">
        <p className="label font-medium text-sm">{label}</p>
        <p className="text-xs text-dark-500 dark:text-dark-400">
            Recomendado: {size}x{size}px, máx 2MB.
        </p>
        <p className="mt-0.5 text-xs text-dark-500 dark:text-dark-400">
            PNG, JPG, GIF.
        </p>
        {!displayImage && !isUploading && (
             <button
                type="button"
                onClick={triggerFileSelect}
                className="btn-outline btn-xs mt-2" // btn-xs para menor
             >
                <Upload size={14} className="mr-1.5" />
                Escolher Arquivo
            </button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;