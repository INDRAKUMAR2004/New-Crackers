"use client";
import dynamic from "next/dynamic";
const OrderManagement = dynamic(() => import("@/src/admin/OrderManagement"), { ssr: false });
export default function Page() { return <OrderManagement />; }
