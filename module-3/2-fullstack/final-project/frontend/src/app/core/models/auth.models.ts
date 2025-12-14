export interface LoginResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
  role: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}
