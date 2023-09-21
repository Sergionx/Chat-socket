import { useEffect } from "react";

interface Props {
  selectedImage: {
    src: string;
    caption?: string;
  } | null;
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
            <img src={selectedImage.src} className="max-w-full max-h-full" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90">
              {selectedImage.caption}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
