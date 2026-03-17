import SymptomAnalyzer from "@/components/SymptomAnalyzer";

export default function SymptomsPage() {
  return (
    <main className="min-h-screen pt-32 bg-[#050505]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none"></div>
      <SymptomAnalyzer />
    </main>
  );
}
