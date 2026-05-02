export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
      <div className="shimmer" style={{ aspectRatio: '4/3' }} />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="shimmer h-4 w-16 rounded-full" />
          <div className="shimmer h-4 w-12 rounded-full ms-auto" />
        </div>
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-4 w-3/4 rounded" />
        <div className="shimmer h-3 w-1/2 rounded" />
        <div className="shimmer h-4 w-24 rounded" />
        <div className="shimmer h-10 w-full rounded-xl mt-2" />
      </div>
    </div>
  )
}
