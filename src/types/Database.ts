export interface UserAttributes {
  id: string;
  xp: number;
  level: number;
  commandsCount: number;
}

export interface ServerAttributes {
  id: string;
  welcomeChannel: string | null;
}