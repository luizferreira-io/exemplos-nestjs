export interface User {
  id: string;
  username: string;
  password: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
}
