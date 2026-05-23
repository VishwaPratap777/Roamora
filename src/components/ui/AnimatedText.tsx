import { motion, type Variants } from 'framer-motion';
import { cn } from '../../lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  animation?: 'fadeUp' | 'letterByLetter' | 'wordByWord';
  delay?: number;
  duration?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  once?: boolean;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const wordContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function AnimatedText({
  text,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  tag: Tag = 'p',
  once = true,
}: AnimatedTextProps) {
  if (animation === 'letterByLetter') {
    return (
      <motion.div
        className={cn('inline-block', className)}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '-50px' }}
        transition={{ delay }}
      >
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="inline-block"
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  if (animation === 'wordByWord') {
    return (
      <motion.div
        className={cn('inline-block', className)}
        variants={wordContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '-50px' }}
        transition={{ delay }}
      >
        {text.split(' ').map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            className="inline-block mr-[0.3em]"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  // Default: fadeUp
  const MotionTag = motion.create(Tag);
  return (
    <MotionTag
      className={className}
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      transition={{ delay }}
    >
      {text}
    </MotionTag>
  );
}
