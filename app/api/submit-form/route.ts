import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const gasUrl = process.env.GOOGLE_SCRIPT_URL;

        if (!gasUrl) {
            return NextResponse.json({ error: "Google Script URL not configured" }, { status: 500 });
        }

        const emailPayload =
            data.formType === "corporate"
                ? {
                      "Company Name": data.companyName,
                      "Contact Person": data.contactPerson,
                      Email: data.email,
                      Phone: data.phone,
                      "Team Size": data.teamSize,
                      _subject: "New Corporate Wellness Consultation Request",
                  }
                : {
                      Name: data.name,
                      Phone: data.phone,
                      "Service Type": data.serviceType,
                      _subject: "New Booking Request - Clinzor",
                  };

        // Run both in parallel — Sheets + Email
        await Promise.all([
            fetch(gasUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                redirect: "follow",
            }),
            fetch("https://formsubmit.co/ajax/clinzorofficial@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(emailPayload),
            }),
        ]);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("submit-form error:", err);
        return NextResponse.json({ error: "Failed to submit form" }, { status: 500 });
    }
}
