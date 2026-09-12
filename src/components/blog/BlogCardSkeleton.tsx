const BlogCardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
    <div className="aspect-[4/3] animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />
    <div className="space-y-3 p-5 text-center">
      <div className="mx-auto h-5 w-4/5 animate-pulse rounded-md bg-muted" />
      <div className="mx-auto h-4 w-full animate-pulse rounded-md bg-muted" />
      <div className="mx-auto h-4 w-3/4 animate-pulse rounded-md bg-muted" />
      <div className="mx-auto mt-2 h-4 w-24 animate-pulse rounded-md bg-muted" />
    </div>
  </div>
);

export default BlogCardSkeleton;
