import React from 'react'
import { motion, useScroll, useTransform, useSpring } from 'motion/react'

export const HeroParallax = ({ products }) => {
  const firstRow = products.slice(0, 5)
  const secondRow = products.slice(5, 10)
  const thirdRow = products.slice(10, 15)
  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 }

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  )
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  )
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  )
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  )
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  )
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  )

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-black text-white leading-tight">
        The Ultimate <br />
        <span
          style={{
            color: '#39ff14',
            textShadow: '0 0 7px #39ff14, 0 0 20px #39ff14, 0 0 40px rgba(57,255,20,0.5)',
          }}
        >
          Gaming Store
        </span>
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-neutral-300 leading-relaxed">
        Level up your setup with the latest games, hardware, and accessories.
        From AAA titles to pro-grade peripherals — everything a gamer needs.
      </p>
      <div className="flex flex-wrap gap-4 mt-10">
        <button
          className="px-8 py-3 text-black font-black text-sm tracking-widest rounded-sm transition-transform hover:scale-105"
          style={{
            backgroundColor: '#39ff14',
            boxShadow: '0 0 15px rgba(57,255,20,0.6), 0 0 30px rgba(57,255,20,0.3)',
          }}
        >
          SHOP NOW
        </button>
        <button
          className="px-8 py-3 font-black text-sm tracking-widest rounded-sm transition-all hover:bg-[rgba(0,255,247,0.1)]"
          style={{
            color: '#00fff7',
            border: '1px solid #00fff7',
            boxShadow: '0 0 10px rgba(0,255,247,0.3)',
          }}
        >
          VIEW DEALS
        </button>
      </div>
    </div>
  )
}

export const ProductCard = ({ product, translate }) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      className="group/product h-96 w-[30rem] relative shrink-0"
    >
      <a href={product.link} className="block group-hover/product:shadow-2xl">
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-center absolute h-full w-full inset-0"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-75 bg-black pointer-events-none transition-opacity duration-300" />
      <div
        className="absolute inset-0 opacity-0 group-hover/product:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{ border: '1px solid rgba(57,255,20,0.5)', boxShadow: 'inset 0 0 20px rgba(57,255,20,0.1)' }}
      />
      <h2
        className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-bold text-lg transition-opacity duration-300"
        style={{ textShadow: '0 0 8px #39ff14' }}
      >
        {product.title}
      </h2>
    </motion.div>
  )
}
