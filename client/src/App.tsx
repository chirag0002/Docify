import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import { ProtectedRoutes } from "./components/ProtectedRoute";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify/" element={<VerifyEmail />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-your-password/:token" element={<ForgotPassword />} />
        <Route path="/verify-your-email/:token" element={<VerifyEmail />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
        </Route>

      </Routes>
    </BrowserRouter >
  )
}

export default App
