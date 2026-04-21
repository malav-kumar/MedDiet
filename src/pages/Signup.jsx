import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isFirebaseConfigured } from "../services/firebase";
import { toast } from "sonner";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signup(name, email, password);
      toast.success("Account created");
      navigate("/");
    } catch (err) {
      setError(err.message || "Signup failed");
      toast.error(err.message || "Signup failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center px-4 py-10 bg-gradient-to-br from-primary-soft via-background to-secondary">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary shadow-lg shadow-primary/20 grid place-items-center mb-3">
            <span className="font-display font-bold text-primary-foreground text-xl">Md</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Personalised diet guidance</p>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          {!isFirebaseConfigured && (
            <div className="mb-4 rounded-xl border border-caution/40 bg-caution-soft p-3 text-xs text-caution-text">
              Firebase isn't configured yet.
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-xl border border-avoid/30 bg-avoid-soft p-3 text-xs text-avoid-text">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input type="password" required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)} className="input" />
            </div>
            <button type="submit" disabled={busy} className="w-full btn-primary py-2.5">
              {busy ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-text hover:text-primary font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Signup;
