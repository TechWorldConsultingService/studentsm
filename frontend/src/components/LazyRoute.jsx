import { Suspense } from "react";

import NavBar from "./navBar";
import Sidebar from "./sidebar";
import SkeletonLoader from "./Skeleton";
import { ErrorBoundary } from "./ErrorBoundary";

export default function LazyRoute(Component, props = {}) {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      {props.noMainLayout ? (
        <Suspense fallback={<SkeletonLoader />}>
          <Component {...props} />
        </Suspense>
      ) : (
        <div className="flex h-screen w-screen">
          <Sidebar />
          <div className="flex w-full flex-col h-full flex-1 transition-all duration-300 ease-in-out">
            <NavBar />
            <div className="bg-gray-100 p-4 ">
              <Suspense fallback={<SkeletonLoader />}>
                <Component {...props} />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}
