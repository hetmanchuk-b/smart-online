import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Generate Quiz for Smart Teams',
  description: 'Generated by create next app',
}

export default async function QuizLayout(
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
