import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { User } from "lucide-react";
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
    <div className="space-y-8 max-w-3xl">
      <header>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <User className="h-6 w-6 text-primary" /> Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personal details help generate safer meal plans.
        </p>
      </header>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground grid place-items-center text-lg font-semibold">
            {initials(form.name || user?.email)}
          </div>
          <div>
            <p className="font-semibold">{form.name || "Unnamed user"}</p>
            <p className="text-sm text-muted-foreground">{user?.email || "Not signed in"}</p>
          </div>
        </div>

        <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
          <Field label="Full name">
            <input value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input" />
          </Field>
          <Field label="Age">
            <input type="number" min="0" value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="input" />
          </Field>
          <Field label="Allergies (comma separated)" full>
            <input value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              placeholder="peanuts, lactose…" className="input" />
          </Field>
          <Field label="Medical history" full>
            <textarea rows={4} value={form.medicalHistory}
              onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
              className="input resize-none" />
          </Field>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={busy}
              className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
              {busy ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <ListCard title="Active medicines" items={medicines.map((m) => m.medicine)} empty="No medicines yet." />
        <ListCard title="Active conditions" items={conditions.map((c) => c.condition)} empty="No conditions yet." />
      </section>
    </div>
  );
};

const Field = ({ label, children, full }) => (
  <label className={`block ${full ? "md:col-span-2" : ""}`}>
    <span className="text-sm font-medium">{label}</span>
    <div className="mt-1">{children}</div>
  </label>
);

const ListCard = ({ title, items, empty }) => (
  <div className="rounded-2xl border bg-card p-5">
    <h3 className="font-semibold mb-3">{title}</h3>
    {items.length === 0 ? (
      <p className="text-sm text-muted-foreground">{empty}</p>
    ) : (
      <ul className="space-y-1.5">
        {items.map((i) => <li key={i} className="text-sm">• {i}</li>)}
      </ul>
    )}
  </div>
);

export default Profile;
