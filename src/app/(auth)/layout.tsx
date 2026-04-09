export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(252 80% 60%) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, hsl(280 75% 55%) 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, hsl(38 95% 60%) 0%, transparent 70%)" }} />
      </div>
      <div className="w-full max-w-sm relative z-10 animate-slide-up">{children}</div>
    </div>
  );
}
