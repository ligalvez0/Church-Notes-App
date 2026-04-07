import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { QuickCaptureButton } from "@/components/notes/quick-capture";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-dvh">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader userEmail={user.email} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-4">
          {children}
        </main>
        <BottomNav />
        <QuickCaptureButton />
      </div>
    </div>
  );
}
