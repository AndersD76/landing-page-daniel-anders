export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
        <span className="text-sm text-gray font-heading tracking-wider">
          Carregando...
        </span>
      </div>
    </div>
  );
}
