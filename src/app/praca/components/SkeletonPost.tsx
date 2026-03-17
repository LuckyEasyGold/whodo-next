export default function SkeletonPost() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-200" />
        <div className="flex-1">
          <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
          <div className="h-3 w-24 bg-slate-200 rounded" />
        </div>
      </div>

      {/* Imagem/Video placeholder */}
      <div className="aspect-[4/3] bg-slate-200 rounded-lg mb-4" />

      {/* Ações */}
      <div className="flex gap-4 mb-3">
        <div className="w-10 h-10 bg-slate-200 rounded-full" />
        <div className="w-10 h-10 bg-slate-200 rounded-full" />
        <div className="w-10 h-10 bg-slate-200 rounded-full" />
      </div>

      {/* Curtidas */}
      <div className="h-4 w-24 bg-slate-200 rounded mb-2" />

      {/* Conteúdo */}
      <div className="space-y-2">
        <div className="h-4 w-3/4 bg-slate-200 rounded" />
        <div className="h-4 w-1/2 bg-slate-200 rounded" />
      </div>
    </div>
  )
}
