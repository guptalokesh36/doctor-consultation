import type { Metadata } from "next";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Header, NavLink } from "@/components/Header";
import Footer from "@/components/Footer";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: "/favicon.svg",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className="m-2">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header>
              <NavLink href="/about">About</NavLink>            
             
            </Header>
            {children}
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
