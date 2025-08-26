import Header from "./Header";
import MobileNavbar from "./MobileNavbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 pb-24 md:p-6 lg:pb-6">{children}</main>
      <MobileNavbar />
    </div>
  );
}
