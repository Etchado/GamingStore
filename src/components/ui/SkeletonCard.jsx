export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
      <div className="bg-gray-100 animate-pulse" style={{ aspectRatio: '4/3' }} />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-4 w-12 bg-gray-100 rounded-full animate-pulse ms-auto" />
        </div>
        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse mt-2" />
      </div>
    </div>
  )
}
