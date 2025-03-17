export default function WidgetWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] right-3 sm:bottom-[calc(env(safe-area-inset-bottom)+3rem)] sm:right-[3rem] flex flex-col items-center justify-between p-1 bg-white/70 backdrop-blur-[0.5rem] border border-white/40 shadow-2xl rounded-lg transition-all dark:bg-gray-950/50 dark:border-slate-700 z-[100]">
      {children}
    </div>
  )
}
