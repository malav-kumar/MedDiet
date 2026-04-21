import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db, isFirebaseConfigured } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useHealth } from "../context/HealthContext";

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("") || "U";

const Profile = () => {
  const { user } = useAuth();
  const { medicines, conditions } = useHealth();
  const [form, setForm] = useState({ name: "", age: "", allergies: "", medicalHistory: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user || !isFirebaseConfigured) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const d = snap.data();
        setForm({
          name: d.name || user.displayName || "",
          age: d.age || "",
          allergies: (d.allergies || []).join(", "),
          medicalHistory: d.medicalHistory || "",
        });
      } else {
        setForm((f) => ({ ...f, name: user.displayName || "" }));
      }
    };
    load();
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    if (!user || !isFirebaseConfigured) {
      toast.error("Sign in to save your profile.");
      return;
    }
    setBusy(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        age: form.age ? Number(form.age) : null,
        allergies: form.allergies.split(",").map((s) => s.trim()).filter(Boolean),
        medicalHistory: form.medicalHistory,
      }, { merge: true });
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-2xl font-display font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personal details help generate safer meal plans.
        </p>
      </header>

      <section className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground grid place-items-center font-display font-bold text-lg">
            {initials(form.name || user?.email)}
          </div>
          <div>
            <p className="font-display font-bold text-foreground">{form.name || "Unnamed user"}</p>
            <p className="text-sm text-muted-foreground">{user?.email || "Not signed in"}</p>
          </div>
        </div>

        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
              <input value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Age</label>
              <input type="number" min="0" value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })} className="input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Allergies <span className="text-muted-foreground font-normal">(comma separated)</span>
            </label>
            <input value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              placeholder="peanuts, lactose…" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Medical history</label>
            <textarea rows={4} value={form.medicalHistory}
              onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
              className="input resize-none" />
          </div>

          <button type="submit" disabled={busy} className="w-full btn-primary py-2.5">
            {busy ? "Saving…" : "Save profile"}
          </button>
        </form>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <ListCard title="Active medicines" items={medicines.map((m) => m.medicine)} empty="No medicines yet." />
        <ListCard title="Active conditions" items={conditions.map((c) => c.condition)} empty="No conditions yet." />
      </section>
    </div>
  );
};

const ListCard = ({ title, items, empty }) => (
  <div className="bg-card rounded-xl border border-border p-5">
    <h3 className="font-display font-bold text-foreground mb-3">{title}</h3>
    {items.length === 0 ? (
      <p className="text-sm text-slate-400">{empty}</p>
    ) : (
      <ul className="space-y-1.5">
        {items.map((i) => <li key={i} className="text-sm text-muted-foreground capitalize">• {i}</li>)}
      </ul>
    )}
  </div>
);

export default Profile;
