import { LayoutDashboard, CreditCard, ArrowUpDown, Blocks } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/transactions", icon: ArrowUpDown, label: "Transações" },
  { href: "/cards", icon: CreditCard, label: "Cartões" },
  { href: "/categories", icon: Blocks, label: "Categorias" },
];

export default function MobileNavbar() {
  return (
    <nav className="fixed bottom-0 z-10 block w-full border-t bg-background/80 backdrop-blur-sm lg:hidden">
      <div className="grid h-16 grid-cols-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
