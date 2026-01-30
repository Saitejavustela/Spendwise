import { Sidebar } from "@/components/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-20 lg:ml-64 min-h-screen bg-background">
        {children}
      </main>
    </div>
  );
}
