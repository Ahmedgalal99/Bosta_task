interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="h-48 p-4 bg-gray-50 flex items-center justify-center">
        <Skeleton className="w-32 h-32 rounded-lg" />
      </div>
      <div className="p-4 flex flex-col grow">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-6 w-16 mt-auto mb-3" />
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-8">
        <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
          <Skeleton className="w-64 h-64 rounded-lg" />
        </div>
        <div className="flex flex-col">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-5 w-32 mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-6" />
          <div className="mt-auto">
            <Skeleton className="h-10 w-28 mb-6" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
