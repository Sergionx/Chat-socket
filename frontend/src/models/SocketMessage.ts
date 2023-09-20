export interface SocketMessage {
  body: string;
  id: string;
  type: "text" | "image";
}