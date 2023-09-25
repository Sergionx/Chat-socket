import { SocketMessage } from "../models/SocketMessage";

interface Props {
  messages: SocketMessage[];
  handleImageClick(selectedImage: SocketMessage): void;
}

export default function Messages({ messages, handleImageClick }: Props) {
  return (
    <>
      <ul className="flex flex-col gap-2 mb-6">
        {messages.map((message, index) => (
          <li
            key={index}
            className={`p-2 rounded-lg w-fit max-w-[100%] 
                ${
                  message.userName === "Me"
                    ? "bg-primary-400/80 rounded-br-none self-end"
                    : "bg-primary-300/90 rounded-bl-none"
                }`}
            style={{
              overflow: "hidden", // Hide any text that exceeds the width of the element
              textOverflow: "ellipsis", // Add an ellipsis at the end of the text if it is truncated
            }}
          >
            <header
              className={`text-sm font-semibold mb-[2px]
            ${message.userName === "Me" ? "text-end" : "text-start"}`}
            >
              {message.userName === "Me" ? "You" : message.userName}
            </header>
            {message.text}

            {message.image && (
              <img
                src={message.image}
                className={`aspect-auto max-w-[25rem] cursor-pointer rounded-sm mb-2
                ${message.text ? "mt-2" : ""}
                `}
                onClick={() => handleImageClick(message)}
              />
            )}

            <footer className="text-end text-sm">
              {message.sendedAt.toLocaleString(navigator.language, {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </footer>
          </li>
        ))}
      </ul>
    </>
  );
}
