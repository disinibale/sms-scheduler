export enum EStatus {
  ACCEPTED = 'ACCEPTD', // ??
  DELIVERED = 'DELIVRD', // Message sent to the recipient
  UNDELIVERED = 'UNDELIV', // Message can't be sent to recipient
  UNKNOWN = 'UNKNOWN', // Waiting to be send
}
