import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { Chrome } from './components/Chrome'
import { MouseProvider } from './animations/MouseProvider'
import { destroySmoothScroll, initSmoothScroll } from './animations/smoothScroll'
import Intro from './sections/Intro'
import NotEcommerce from './sections/NotEcommerce'
import Shopping from './sections/Shopping'
import Dashboard from './sections/Dashboard'
import Customers from './sections/Customers'
import Inventory from './sections/Inventory'
import Ecosystem from './sections/Ecosystem'
import Investment from './sections/Investment'
import Finale from './sections/Finale'

export default function App() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    initSmoothScroll()
    return destroySmoothScroll
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <MouseProvider>
        <Chrome />
        <main>
          <Intro />
          <NotEcommerce />
          <Shopping />
          <Dashboard />
          <Customers />
          <Inventory />
          <Ecosystem />
          <Investment />
          <Finale />
        </main>
        <div className="grain" aria-hidden />
      </MouseProvider>
    </MotionConfig>
  )
}
