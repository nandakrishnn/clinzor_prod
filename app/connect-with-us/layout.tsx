import type { Metadata } from "next";
import WhatsAppButton from "./_components/WhatsAppButton";
import MetaPixel from "./_components/MetaPixel";

export const metadata: Metadata = {
    title: "Clinzor - Expert Physiotherapy in Bangalore",
    description: "Clinzor - Expert Physiotherapy in Bangalore",
};

export default function ConnectWithUsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <MetaPixel />
            {children}
            <WhatsAppButton />
        </>
    );
}
