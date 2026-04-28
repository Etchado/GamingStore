import { useEffect, useState } from 'react'
import { motion, useSpring } from 'motion/react'

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)
  const spring = useSpring(progress, { stiffness: 200, damping: 30 })

  useEffect(() => {
    function update() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const max = scrollHeight - clientHeight
      setProgress(max > 0 ? scrollTop / max : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => { spring.set(progress) }, [progress, spring])

  return (
    <motion.div
      className="fixed top-0 start-0 h-0.5 z-[200] origin-left"
      style={{
        scaleX: spring,
        backgroundColor: '#0056b3',
        width: '100%',
      }}
    />
  )
}
