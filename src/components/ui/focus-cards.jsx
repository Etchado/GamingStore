import React, { useState, memo } from 'react'
import { cn } from '@/lib/utils'

const Card = memo(({ card, index, hovered, setHovered }) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    className={cn(
      'rounded-xl relative overflow-hidden h-56 md:h-72 w-full transition-all duration-300 ease-out cursor-pointer',
      'bg-surface border border-border',
      hovered !== null && hovered !== index && 'blur-[2px] scale-[0.97] brightness-95'
    )}
  >
    <img
      src={card.src}
      alt={card.title}
      loading="lazy"
      className="object-cover absolute inset-0 w-full h-full"
    />
    <div
      className={cn(
        'absolute inset-0 flex items-end p-4 transition-opacity duration-300',
        'bg-gradient-to-t from-black/60 via-transparent to-transparent',
        hovered === index ? 'opacity-100' : 'opacity-0'
      )}
    >
      <span className="text-sm font-bold text-white">{card.title}</span>
    </div>
  </div>
))
Card.displayName = 'Card'

export function FocusCards({ cards }) {
  const [hovered, setHovered] = useState(null)
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  )
}
