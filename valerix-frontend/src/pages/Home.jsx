import React from "react";
import Hero from "../components/Hero";
import ProductList from "./ProductList";

export default function Home() {
  return (
    <div className="space-y-6">
      <Hero />
      <div>
        <h2 className="text-2xl font-semibold mt-4">Featured</h2>
        <ProductList compact />
      </div>
    </div>
  );
}
