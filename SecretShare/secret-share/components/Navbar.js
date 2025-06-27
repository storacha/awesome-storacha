import Link from "next/link";
import { Menu, Shield } from "lucide-react";
import ConnectWalletButton from "./ConnectWalletBtn";

export const Navbar = () => {
  return (
    <nav className="w-full bg-black/70 backdrop-blur sticky text-lime-500 top-0 z-50 shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center ">
          <Link href="/" className="space-y-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#dcfe50]" />
            <h1 className="text-xl md:text-2xl font-bold text-lime-400">SecretShare</h1>
          </Link>
        </div>
        <div className="md:flex hidden gap-6 text-md text-lime-400 font-bold">
          <Link href="/" className="hover:text-lime-300">Home</Link>
          <Link href="/issue" className="hover:text-lime-300">Delegate Secret</Link>
          <Link href="/upload" className="hover:text-lime-300">Upload a File</Link>
          <Link href="/dashboard" className="hover:text-lime-300">Dashboard</Link>
          <span className="hover:text-lime-300">
            <ConnectWalletButton />
          </span>
        </div>
        <button className="md:hidden text-lime-400">
          <Menu />
        </button>
      </div>
    </nav>
  );
};