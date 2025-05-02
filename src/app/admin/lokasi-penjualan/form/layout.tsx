/** @format */

import React, { Suspense } from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
};

export default layout;
