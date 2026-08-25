import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/_dashboard/calendar/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(private)/_dashboard/calendar/"!</div>
}
