import { Loader2 } from "lucide-react";

export const ContentSkeleton = () => (
  <div className="container-main py-10 flex-grow w-full max-w-[1400px] mx-auto bg-gray-50/50">
    {/* Banner Skeleton */}
    <div className="h-[300px] md:h-[400px] w-full bg-gray-200/60 rounded-3xl animate-pulse mb-12 shadow-sm" />
    
    {/* Title Skeleton */}
    <div className="h-10 w-72 bg-gray-200/80 rounded-lg animate-pulse mb-10 mx-auto" />
    
    {/* Grid Skeleton */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-8">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div key={i} className="flex flex-col gap-4">
          <div className="aspect-square w-full bg-gray-200/60 rounded-2xl animate-pulse shadow-sm" />
          <div className="space-y-2">
            <div className="h-5 w-3/4 bg-gray-200/80 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-200/60 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PageLoader = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center">
    <Loader2 className="w-10 h-10 animate-spin text-primary" />
  </div>
);

export default PageLoader;
