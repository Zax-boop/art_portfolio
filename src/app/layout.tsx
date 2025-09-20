import "./globals.css";
import { Playfair_Display } from "next/font/google";
import Header from "./components/general/header";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Anubhuti's Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-white">
      <body className={`${playfair.className} bg-white flex flex-col items-center md:min-h-screen`}>
        <div className="xs:w-3/5 md:w-1/5">
          <Header />
        </div>
        <main className="w-full flex flex-col items-center">{children}</main>
      </body>
    </html>
  );
}
