import type { ReactNode } from "react";

// The locale layout owns <html>; this root layout only exists because Next
// requires one at the top of app/.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
