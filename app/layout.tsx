import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ReduxProvider } from "@/components/ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";



const schibstedGrotesk = Schibsted_Grotesk({
    variable: "--font-schibstedGrotesk",
    subsets: ["latin"],
});

const martianMono = Martian_Mono({
    variable: "--font-martianMono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "EventHub",
    description: "Place Where you can find every Event!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
            >
                <ReduxProvider>
                    <AuthProvider>
                        <ErrorBoundary>
                            {/* Blurred Background Image */}
                            <div 
                                className="blurred-bg" 
                                style={{ backgroundImage: 'url(/images/DeveloperEvents.png)' }}
                            />
                            <div className="blurred-bg-overlay" />
                            
                            <Navbar /> 
                            <main>
                                {children}
                            </main>
                        </ErrorBoundary>
                    </AuthProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
