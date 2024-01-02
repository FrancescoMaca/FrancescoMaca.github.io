'use client'

import { motion, useMotionValue } from "framer-motion"

export default function Navbar() {

  const dragStart = (e: React.TouchEvent) => {
    
  }

  const dragLeave = (e: React.TouchEvent) => {
          
  }

  return (
    <motion.div className="text-m rounded-b-3xl bg-light-gray mx-5">
      {/* the hidden class is temporary */}
      <div className="relative px-3 rounded-b-3xl bg-dark-white hidden">
        <NavbarDecoration position="top-3 left-8"/>
        <NavbarDecoration position="bottom-3 right-8"/>
        <div className="flex flex-col items-center text-center">
          <NavbarButton>Home</NavbarButton>
          <NavbarButton>Showcase</NavbarButton>
          <NavbarButton>Resume</NavbarButton>
          <NavbarButton>Contact Me</NavbarButton>
          <NavbarButton>Swondi</NavbarButton>
        </div>
      </div>
      <div className="flex justify-evenly w-full py-3"
        onTouchMove={dragStart}
        onTouchEnd={dragLeave}
      >
        <div>
          <img src="/svg/double-arrow-down.svg" alt="arrow down" height={16} width={16} />
        </div>
        <div>
          <img src="/svg/double-arrow-down.svg" alt="arrow down" height={16} width={16} />
        </div>
      </div>
    </motion.div>
  )
}

function NavbarButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className="w-fit px-2 py-1 my-3 border-b-4 bg-light-gray rounded-lg"
      whileHover={{
        translateY: '5px',
        transition: { duration: 0.5, stiffness: 100, damping: 10}
      }}
    >
      <span>{children}</span>
    </motion.div>
  )
}

function NavbarDecoration({position}: {position: string}) {

  const clickDown = (e: React.MouseEvent | React.TouchEvent) => {
    const source = e.target as HTMLDivElement
    
    source.classList.remove('border-b-4')
  }

  const clickUp = (e: React.MouseEvent | React.TouchEvent) => {
    const source = e.target as HTMLDivElement
    
    source.classList.add('border-b-4')
  }

  return (
    <div className={`absolute flex items-center ${position}`}>
      <div>
        <motion.div className="w-8 h-8 m-1 bg-light-gray border-b-4 border-black rounded-lg"
          onMouseDown={clickDown} onMouseUp={clickUp} onTouchStart={clickDown} onTouchEnd={clickUp}
          whileHover={{
            translateX: ['-1px', '1px', '-1px'],
            transition: { duration: 0.1, repeat: Infinity, }
          }}
        />
        <motion.div className="w-8 h-8 m-1 bg-light-gray border-b-4 border-black rounded-lg"
          onMouseDown={clickDown} onMouseUp={clickUp} onTouchStart={clickDown} onTouchEnd={clickUp}
          whileHover={{
            translateX: ['-1px', '1px', '-1px'],
            transition: { duration: 0.1, repeat: Infinity, }
          }}
        />
      </div>
      <div>
        <motion.div className="w-8 h-8 bg-light-gray border-b-4 border-black rounded-lg"
          onMouseDown={clickDown} onMouseUp={clickUp} onTouchStart={clickDown} onTouchEnd={clickUp}
          whileHover={{
            translateX: ['-1px', '1px', '-1px'],
            transition: { duration: 0.1, repeat: Infinity, }
          }}
        />
      </div>
    </div>
  )
}