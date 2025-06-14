import { auth } from "@/auth";
import TwSizeIndicator from "@/helpers/tw-size-indicator";
import "@/styles/main.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import RtlLangProvider from "./rtl/RtlLangWrapper";
import ReduxProvider from "@/redux/reduxProvider";
import { ReactNode } from "react";
import ThemeProviders from "@/styles/themeProvider";
const fontPrimary = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-primary",
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex" />
      </head>
      <body className=" {fontPrimary.variable}" suppressHydrationWarning={true}>
        <ThemeProviders>
          {/* <ThemeProviders> */}
          <ReduxProvider>
            <RtlLangProvider>
              <TwSizeIndicator />
              <SessionProvider key={JSON.stringify(session)} session={session}>
                {children}
              </SessionProvider>
              <Toaster />
            </RtlLangProvider>
          </ReduxProvider>
        </ThemeProviders>
        {/* </ThemeProviders> */}
      </body>
    </html>
  );
}
