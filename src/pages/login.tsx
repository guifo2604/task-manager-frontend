import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { LoginResponse } from "../types/index"; 
export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); 
    
    try {
      const { data } = await api.post<LoginResponse>("/auth/login", {
        email,
        password
      });

      localStorage.setItem("@TaskApp:token", data.token);
      localStorage.setItem("@TaskApp:user", JSON.stringify(data.user));

      alert(`Bem-vindo, ${data.user.username}!`);
        navigate("/dashboard");
      
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer login. Verifique e-mail e senha.");
    }
  }

  return (
    <div className="min-h-screen bg-eggshell flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h1>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email"
            placeholder="E-mail"
            className="p-3 border border-gray-300 rounded-lg focus:outline-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password"
            placeholder="Senha"
            className="p-3 border border-gray-300 rounded-lg focus:outline-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}