import type { LoginRequest, LoginResponce } from "./auth.types";

export const authService = {
  async createUser(user: LoginRequest): Promise<LoginResponce> {
    const newUser = {
      id: "user-001",
      loginId: user.loginId,
      password: user.password,
    };
    return Promise.resolve(newUser);
  },

  async login(userData: LoginRequest): Promise<LoginResponce> {
    const user = {
      id: "user-001",
      loginId: userData.loginId,
    };

    return Promise.resolve(user);
  },
};
