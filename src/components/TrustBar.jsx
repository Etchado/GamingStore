import { motion } from 'motion/react'

const items = [
  { icon: '🚚', title: 'Free Shipping',     sub: 'On orders over $199'         },
  { icon: '🔧', title: 'Expert Assembly',   sub: 'Tested before shipping'       },
  { icon: '🛡️', title: '2-Year Warranty',   sub: 'Full parts & labour covered'  },
  { icon: '💬', title: '24/7 Support',      sub: 'Expert tech assistance'       },
]

export default function TrustBar() {
  return (
    <section className="border-y" style={{ backgroundColor: '#f8fafc', borderColor: '#e0e0e0' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: i * 0.06 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: '#e6f0fa' }}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{item.title}</p>
                <p className="text-xs text-muted mt-0.5">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
