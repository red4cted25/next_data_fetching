import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: "Pokemon Stats PC",
  description: "Next application created with PokeAPI",
  author: "Nicolas Diaz"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`font-poke ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
