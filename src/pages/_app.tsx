import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { fontSans } from "@/lib/fonts";
import { trpc } from "@/lib/trpc";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";
const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <div
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}
    >
      <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </div>
  );
};
export default trpc.withTRPC(App);
