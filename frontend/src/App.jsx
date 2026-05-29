import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";

function App() {

  return (
    <BrowserRouter>

      <div>

        <nav>
          <Link to="/signup">Signup</Link>

          {" | "}

          <Link to="/login">Login</Link>
        </nav>

        <hr />

        <Routes>

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/project/:projectId"
            element={<ProjectPage />}
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;