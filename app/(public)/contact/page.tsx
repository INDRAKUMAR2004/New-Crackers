"use client";
import dynamic from "next/dynamic";
const ContactPage = dynamic(() => import("@/src/views/Contact/ContactPage"), { ssr: false });
export default function Page() { return <ContactPage />; }
