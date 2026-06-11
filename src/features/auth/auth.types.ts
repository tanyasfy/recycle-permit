export type User = {
  id: string;
  loginId: string;
  password: string;
  name: string;
  email: string;
  companyName: string;
  drafts?: number;
};

export type LoginRequest = Pick<User, "loginId" | "password">;

export type LoginResponce = Pick<User, "loginId" | "id">;
