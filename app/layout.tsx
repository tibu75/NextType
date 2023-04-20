import Loading from "./loading"
import Page from "./page"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (<>
    {children}
  </>
  )
}
