import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register({ username, email, password });
      alert("Conta criada com sucesso! Agora pode fazer login.");
      navigate("/"); 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const messages = error.response?.data;
      alert(Array.isArray(messages) ? messages.join("\n") : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5dd] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Criar Conta</h1>
        
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input 
            placeholder="Nome de utilizador" 
            className="p-3 border rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="E-mail" 
            className="p-3 border rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Senha (mín. 8 caracteres)" 
            className="p-3 border rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-all disabled:opacity-50"
          >
            {loading ? "A processar..." : "Registar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta? <Link to="/" className="text-blue-600 font-bold hover:underline">Entre aqui</Link>
        </p>
      </div>
    </div>
  );
}