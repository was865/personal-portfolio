export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-7xl mx-auto pt-10 md:pt-16 pb-16">
      {children}
    </div>
  )
}
