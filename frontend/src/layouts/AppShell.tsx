import { Outlet, ScrollRestoration } from 'react-router-dom'
import { ChatWidget } from '../components/chat/ChatWidget'
import { FeedbackProvider } from '../components/ui/Feedback'
import { DemoBar } from './DemoBar'

export default function AppShell() {
  return (
    <FeedbackProvider>
      <div className="vc">
        {import.meta.env.DEV && <DemoBar />}
        <Outlet />
        <ChatWidget />
      </div>
      <ScrollRestoration />
    </FeedbackProvider>
  )
}
