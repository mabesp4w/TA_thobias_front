/** @format */

import { Suspense } from "react";
import UserDashboard from "./UserDashboard";

export default function Page() {
  return (
    <Suspense fallback={<span className="loading loading-dots loading-md" />}>
      <UserDashboard />
    </Suspense>
  );
}
