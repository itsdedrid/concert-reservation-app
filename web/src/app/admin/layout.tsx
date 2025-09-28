import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:flex bg-gray-100">
      <Sidebar role="Admin" />
      <main className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
