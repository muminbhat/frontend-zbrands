import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { LogoLottie } from "@/components/logo-lottie";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HumanSearch",
  description: "Find people using multi-source deep search",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-grid`}> 
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-white/5">
            <div className="mx-auto w-full max-w-6xl px-6 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="h-12 w-8 grid place-items-center rounded-lg bg-transparent">
                  <LogoLottie />
                </div>
                <span className="text-base font-semibold tracking-tight text-gray-400">HumanSearch</span>
              </Link>
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <a href="https://muminbhat.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Mumin Bhat</a>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            <div className="mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
          </main>
          <footer className="border-t border-white/5">
            <div className="mx-auto w-full max-w-6xl px-6 py-6 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} HumanSearch</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
