import { RouterProvider } from "react-router";
import "./App.css";
import "./global.css";
import { router } from "./routes/router";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
