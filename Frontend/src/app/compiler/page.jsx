import { Suspense } from "react";
import BattlePage from "./BattlePage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BattlePage />
    </Suspense>
  );
}
