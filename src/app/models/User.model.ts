export interface User {
  _id: string;
  email: string;
  name: string;
  role?: string;
  iat: number;
  exp: number;
}
