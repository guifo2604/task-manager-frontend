import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth(); // Usamos a função do contexto que já guarda o token
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn({ email, password });
      
      navigate("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      alert("Erro ao fazer login. Verifique as suas credenciais.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5dd] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">TaskApp</h1>
          <p className="text-gray-500 mt-2">Faça login para gerir as suas tarefas</p>
        </header>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">E-mail</label>
            <input 
              type="email"
              placeholder="seu@email.com"
              className="p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-900 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Senha</label>
            <input 
              type="password"
              placeholder="••••••••"
              className="p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-900 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-all disabled:opacity-50 mt-2"
          >
            {loading ? "A entrar..." : "Entrar"}
          </button>
        </form>

        <footer className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Ainda não tem conta?{' '}
            <Link 
              to="/register" 
              className="text-blue-600 font-bold hover:underline transition-all"
            >
              Criar conta agora
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}