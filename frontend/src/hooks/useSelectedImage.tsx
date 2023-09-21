import { useState } from "react";

export default function useSelectedImage() {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    caption?: string;
  } | null>(null);

  const handleImageClick = (src: string, caption?: string) => {
    setSelectedImage({ src, caption });
  };

  const handleCloseClick = () => {
    setSelectedImage(null);
  };

  return {
    selectedImage,
    handleImageClick,
    handleCloseClick,
  };
}
