import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/_dashboard/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(private)/_dashboard/profile/"!</div>
}
