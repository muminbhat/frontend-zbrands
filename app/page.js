import { Suspense } from "react";
import SearchClient from "@/app/search-client";

export default function Home() {
  return (
    <Suspense>
      <SearchClient />
    </Suspense>
  );
}
