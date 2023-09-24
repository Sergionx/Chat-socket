import { useState } from "react";
import { SocketMessage } from "../models/SocketMessage";

export default function useSelectedImage() {
  const [selectedImage, setSelectedImage] = useState<SocketMessage | null>(null);

  const handleImageClick = (messageSelected: SocketMessage) => {
    setSelectedImage(messageSelected);
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
