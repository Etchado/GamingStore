import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const transition = {
  type: 'spring',
  mass: 0.4,
  damping: 14,
  stiffness: 120,
  restDelta: 0.001,
}

export const MenuItem = ({ setActive, active, item, children }) => (
  <div onMouseEnter={() => setActive(item)} className="relative">
    <motion.span
      transition={{ duration: 0.2 }}
      className={cn(
        'cursor-pointer text-sm font-semibold tracking-wide transition-colors select-none',
        active === item ? 'text-electric-600' : 'text-ink hover:text-electric-600'
      )}
    >
      {item}
    </motion.span>

    {active !== null && active === item && (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8 }}
        transition={transition}
        className="absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 z-50 pt-2"
      >
        <motion.div
          layoutId="active-menu"
          className="rounded-xl shadow-card-hover overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid #e2e8f0',
          }}
        >
          <div className="w-max p-4">{children}</div>
        </motion.div>
      </motion.div>
    )}
  </div>
)

export const Menu = ({ setActive, children }) => (
  <nav
    onMouseLeave={() => setActive(null)}
    className="flex items-center gap-8"
  >
    {children}
  </nav>
)

export const ProductItem = ({ title, description, href, src }) => (
  <a href={href} className="flex gap-3 group py-1">
    <img
      src={src}
      width={120}
      height={60}
      alt={title}
      className="shrink-0 rounded-lg object-cover border border-border"
    />
    <div>
      <p className="text-sm font-semibold text-ink group-hover:text-electric-600 transition-colors">
        {title}
      </p>
      <p className="text-xs text-muted mt-0.5 max-w-[140px] leading-relaxed">
        {description}
      </p>
    </div>
  </a>
)

export const HoveredLink = ({ children, href, ...rest }) => (
  <a
    href={href}
    {...rest}
    className="block text-sm text-muted hover:text-electric-600 transition-colors py-1"
  >
    {children}
  </a>
)
