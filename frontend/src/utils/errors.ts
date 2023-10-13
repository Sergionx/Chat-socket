export enum SocketError {
  ROOM_DOES_NOT_EXIST = "Room does not exist",
  INVALID_PASSWORD = "Invalid password",
  INVALID_USERNAME = "Invalid username",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export function showError(error: SocketError) {
  switch (error) {
    case SocketError.ROOM_DOES_NOT_EXIST:
      return "The room does not exist, please create a new one";

    case SocketError.INVALID_PASSWORD:
      return "You need to provide the correct password";

    case SocketError.INVALID_USERNAME:
      return "Please, choose a username";

    case SocketError.UNKNOWN_ERROR:
      return "Unknown error";

    default:
      return "Unknown error";
  }
}
