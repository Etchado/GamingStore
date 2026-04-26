import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

export const HoverEffect = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 gap-1', className)}>
      {items.map((item, idx) => (
        <a
          href={item.link}
          key={item.link + idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full block rounded-sm"
                style={{
                  backgroundColor: 'rgba(57,255,20,0.04)',
                  boxShadow: '0 0 25px rgba(57,255,20,0.08)',
                }}
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>
          <Card>
            <div className="text-4xl mb-3">{item.icon}</div>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
            <div className="mt-5 flex items-center justify-between">
              <span
                className="font-black text-xl tracking-tight"
                style={{ color: '#39ff14', textShadow: '0 0 8px rgba(57,255,20,0.4)' }}
              >
                {item.price}
              </span>
              {item.badge && (
                <span
                  className="text-xs px-2 py-1 rounded-sm font-black tracking-widest"
                  style={{
                    backgroundColor: 'rgba(57,255,20,0.1)',
                    color: '#39ff14',
                    border: '1px solid rgba(57,255,20,0.35)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          </Card>
        </a>
      ))}
    </div>
  )
}

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        'rounded-sm h-full w-full p-4 overflow-hidden relative z-20 transition-all duration-300 group-hover:border-[rgba(57,255,20,0.3)]',
        className
      )}
      style={{
        backgroundColor: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={cn('text-white font-black tracking-wide mt-2 text-lg', className)}>
      {children}
    </h4>
  )
}

export const CardDescription = ({ className, children }) => {
  return (
    <p className={cn('mt-3 text-zinc-500 tracking-wide leading-relaxed text-sm', className)}>
      {children}
    </p>
  )
}
