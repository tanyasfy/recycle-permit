export type User = {
  id: string;
  password?: string;
  name: string;
  email: string;
  companyName: string;
  drafts?: number;
};

export type LoginRequest = {
  loginId: string;
  password: string;
};

export type LoginResponce = {
  loginId: string;
  id: string;
};
