


export default async function GameLayout(
  {
    children
  }: {
    children: React.ReactNode
  }
) {
  return (
    <main className="h-full">
      {children}
    </main>
  )
}
