import InjuryDetector from "@/components/InjuryDetector";

export default function InjuriesPage() {
  return (
    <main className="min-h-screen pt-32 bg-[#050505]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent pointer-events-none"></div>
      <InjuryDetector />
    </main>
  );
}
