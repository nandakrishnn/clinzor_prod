import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Clinzor - Expert Physiotherapy in Bangalore",
    description: "Clinzor - Expert Physiotherapy in Bangalore",
};

export default function ConnectWithUsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
