"use client";
import dynamic from "next/dynamic";
const ProductPage = dynamic(() => import("@/src/views/Product/ProductPage"), { ssr: false });
export default function Page() { return <ProductPage />; }
