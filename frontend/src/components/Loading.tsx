import { AiOutlineLoading } from "react-icons/ai";

interface Props {
  loading: boolean;
}

export default function Loading({ loading }: Props) {
  return (
    <section
      className={`fixed top-0 left-0 w-full h-full 
        flex items-center justify-center bg-black bg-opacity-50
        ${loading ? "" : "hidden"}`}
    >
      <div
        role="status"
        className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
      >
        <AiOutlineLoading
          size={108}
          className="animate-spin text-primary-400"
        />
        <span className="sr-only">Loading...</span>
      </div>
    </section>
  );
}
