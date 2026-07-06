"use client";
import dynamic from "next/dynamic";
const ProductsList = dynamic(() => import("@/src/admin/ProductsList"), { ssr: false });
export default function Page() { return <ProductsList />; }
