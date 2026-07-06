"use client";
// Product Card Skeleton Loader
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden">
    {/* Image Skeleton */}
    <div className="w-full aspect-square bg-gray-200 animate-pulse rounded-t-lg" />

    {/* Content Skeleton */}
    <div className="p-3 space-y-2">
      {/* Product Name */}
      <div className="h-4 bg-gray-200 rounded animate-pulse" />

      {/* Category */}
      <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />

      {/* Price */}
      <div className="flex gap-2 pt-2">
        <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Button */}
      <div className="h-8 bg-gray-200 rounded-lg animate-pulse mt-3" />
    </div>
  </div>
);

// Grid Skeleton Loader
export const ProductGridSkeleton = ({ count = 12 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i}>
        <ProductCardSkeleton />
      </div>
    ))}
  </div>
);

// Inventory Row Skeleton
export const InventoryRowSkeleton = ({ count = 8 }) => (
  <tbody className="divide-y divide-[#f0f0f0]">
    {Array.from({ length: count }).map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-5 py-4">
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </td>
        <td className="px-4 py-4">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </td>
        <td className="px-4 py-4">
          <div className="h-6 bg-gray-200 rounded-md w-12 mx-auto" />
        </td>
        <td className="px-4 py-4">
          <div className="h-8 bg-gray-200 rounded w-20 mx-auto" />
        </td>
        <td className="px-4 py-4">
          <div className="h-8 bg-gray-200 rounded w-16 ml-auto" />
        </td>
      </tr>
    ))}
  </tbody>
);

// Stat Card Skeleton
export const StatCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-[#dfe1e6] p-4 animate-pulse">
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
    <div className="h-8 bg-gray-200 rounded w-2/3" />
  </div>
);

// Table Header Skeleton
export const TableHeaderSkeleton = () => (
  <div className="space-y-2">
    <div className="h-4 bg-gray-200 rounded w-1/4" />
    <div className="h-2 bg-gray-100 rounded w-1/3" />
  </div>
);
