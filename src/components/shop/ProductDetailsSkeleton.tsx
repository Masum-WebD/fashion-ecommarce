export const ProductDetailsSkeleton = () => (
  <div className="container-main py-6 md:py-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-12 md:mb-16">
      {/* Left Column - Image Gallery */}
      <div className="space-y-4">
        <div className="aspect-square w-full bg-gray-200/60 rounded-lg animate-pulse" />
        <div className="flex gap-2 md:gap-3 overflow-hidden pb-2">
          {[1, 2, 3, 4].map(i => (
             <div key={i} className="w-16 h-16 md:w-20 md:h-20 bg-gray-200/60 rounded-lg animate-pulse shrink-0" />
          ))}
        </div>
      </div>
      
      {/* Right Column - Info */}
      <div className="space-y-4 md:space-y-6 pt-2">
        <div className="h-8 md:h-10 w-3/4 bg-gray-200/60 rounded-lg animate-pulse" />
        <div className="h-10 w-1/3 bg-gray-200/60 rounded-lg animate-pulse mt-4" />
        <div className="h-32 w-full bg-gray-200/60 rounded-2xl animate-pulse mt-6" />
        
        <div className="space-y-3 mt-6 pt-4 border-t border-gray-100">
           <div className="h-5 w-1/4 bg-gray-200/60 rounded animate-pulse" />
           <div className="h-12 w-full bg-gray-200/60 rounded-lg animate-pulse" />
        </div>
        
        <div className="flex gap-4 pt-6">
           <div className="h-12 w-32 bg-gray-200/60 rounded-full animate-pulse" />
           <div className="h-12 flex-1 bg-gray-200/60 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailsSkeleton;
