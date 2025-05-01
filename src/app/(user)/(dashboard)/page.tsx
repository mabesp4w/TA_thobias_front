/** @format */

import { Suspense } from "react";
import UserDashboard from "./UserDashboard";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserDashboard />
    </Suspense>
  );
}
