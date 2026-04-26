import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[80vh] flex flex-col items-center justify-center gap-6 text-center px-6 pt-16"
    >
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl"
        style={{ backgroundColor: '#e6f0fa' }}
      >
        🎮
      </div>

      <div>
        <p
          className="text-[11px] font-black tracking-[0.18em] uppercase mb-3"
          style={{ color: '#0056b3' }}
        >
          ◈ Error 404
        </p>
        <h1 className="text-5xl sm:text-6xl font-black text-ink mb-4">
          Page Not Found
        </h1>
        <p className="text-muted text-sm max-w-sm mx-auto leading-relaxed">
          Looks like this page respawned somewhere else. Let's get you back to
          the action.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-colors"
          style={{ backgroundColor: '#0056b3' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
        >
          Back to Store
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 rounded-xl text-sm font-bold border transition-colors"
          style={{ borderColor: '#e0e0e0', color: '#555' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          Go Back
        </button>
      </div>
    </motion.div>
  )
}
