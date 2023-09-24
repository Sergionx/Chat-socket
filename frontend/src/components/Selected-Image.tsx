import { useEffect } from "react";
import { SocketMessage } from "../models/SocketMessage";

interface Props {
  selectedImage: SocketMessage | null;
  handleCloseClick: () => void;
}

export default function SelectedImage({
  selectedImage,
  handleCloseClick,
}: Props) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (selectedImage && target.tagName !== "IMG") {
        handleCloseClick();
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [selectedImage]);

  return (
    <>
      {selectedImage && (
        <section className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative lg:max-w-[90%]">
            <img src={selectedImage.image} className="max-w-full max-h-full" />
            {/* TODO - Handle large text and better UI */}
            {selectedImage?.text && (
              <div className="p-4 bg-white">{selectedImage.text}</div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
