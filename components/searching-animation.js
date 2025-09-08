"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function SearchingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <DotLottieReact src="/searching-profile.lottie" loop autoplay style={{ width: 164, height: 164 }} />
      <p className="mt-4 text-sm text-muted-foreground">Searching across sources — this may take a few seconds</p>
    </div>
  );
}


