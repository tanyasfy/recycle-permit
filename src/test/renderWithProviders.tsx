import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../store/authSlice";
import type { ReactNode } from "react";
import type { RootState } from "../store/store";

export function renderWithProviders(
  ui: ReactNode,
  {
    preloadedState = {},
    route = "/",
  }: { preloadedState?: Partial<RootState>; route?: string } = {},
) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });

  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>,
    ),
    store,
  };
}
