import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DESIGN from '../design-system';

/**
 * Component: PageTransition
 * Smooth page transition with fade and slide
 * 
 * @example
 * <PageTransition key={currentPage}>
 *   <YourPageComponent />
 * </PageTransition>
 */
export const PageTransition = memo(function PageTransition({ children, key }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut'
        }}
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});

/**
 * Component: ModalTransition
 * Scale and fade animation for modals
 */
export const ModalTransition = memo(function ModalTransition({ children, isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 0.2,
            ease: 'easeOut'
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

/**
 * Component: StaggeredList
 * Children appear in cascade with stagger effect
 * 
 * @example
 * <StaggeredList>
 *   {items.map(item => <Card key={item.id}>{item.name}</Card>)}
 * </StaggeredList>
 */
export const StaggeredList = memo(function StaggeredList({
  children,
  staggerDelay = 0.1,
  direction = 'down'
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: direction === 'down' ? 20 : -20,
      x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: DESIGN.spacing.md,
        width: '100%'
      }}
    >
      {React.Children.map(children, (child) => (
        <motion.div
          key={child?.key}
          variants={itemVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
});

/**
 * Component: CardStack
 * Grid of cards appearing with stagger
 */
export const CardStack = memo(function CardStack({
  children,
  columns = 3,
  staggerDelay = 0.08
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
        gap: DESIGN.spacing.lg,
        width: '100%'
      }}
    >
      {React.Children.map(children, (child) => (
        <motion.div
          key={child?.key}
          variants={itemVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
});

/**
 * Component: FadeIn
 * Simple fade-in effect
 */
export const FadeIn = memo(function FadeIn({
  children,
  duration = 0.5,
  delay = 0
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
});

/**
 * Component: SlideIn
 * Slide-in from left/right
 */
export const SlideIn = memo(function SlideIn({
  children,
  direction = 'left',
  duration = 0.3,
  delay = 0
}) {
  const initialX = direction === 'left' ? -100 : 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: initialX }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -initialX }}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
});

/**
 * Component: ScaleIn
 * Pop-in scale effect
 */
export const ScaleIn = memo(function ScaleIn({
  children,
  duration = 0.3,
  delay = 0
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
});

/**
 * Component: RotateIn
 * Rotate and fade-in
 */
export const RotateIn = memo(function RotateIn({
  children,
  duration = 0.4,
  delay = 0
}) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
});

/**
 * Component: PulseAnimation
 * Continuous pulse effect
 */
export const PulseAnimation = memo(function PulseAnimation({
  children,
  scale = 1.1,
  duration = 1.5
}) {
  const pulseVariants = {
    pulse: {
      scale: [1, scale, 1],
      transition: {
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div
      variants={pulseVariants}
      animate="pulse"
    >
      {children}
    </motion.div>
  );
});

/**
 * Component: BounceAnimation
 * Bounce effect
 */
export const BounceAnimation = memo(function BounceAnimation({
  children,
  duration = 0.8
}) {
  const bounceVariants = {
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div
      variants={bounceVariants}
      animate="bounce"
    >
      {children}
    </motion.div>
  );
});

/**
 * Component: Tooltip Animated
 * Animated tooltip with fade and scale
 */
export const AnimatedTooltip = memo(function AnimatedTooltip({
  children,
  message,
  show = false,
  delay = 0.1
}) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -5 }}
            transition={{
              duration: 0.2,
              delay,
              ease: 'easeOut'
            }}
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: DESIGN.colors.neutral[900],
              color: 'white',
              padding: `${DESIGN.spacing.xs}px ${DESIGN.spacing.sm}px`,
              borderRadius: DESIGN.border.radius.sm,
              fontSize: DESIGN.typography.sizes.xs,
              whiteSpace: 'nowrap',
              marginTop: DESIGN.spacing.xs,
              zIndex: 50
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

/**
 * Component: LoadingAnimation
 * Animated loading spinner
 */
export const LoadingAnimation = memo(function LoadingAnimation({
  size = 40,
  color = DESIGN.colors.primary[500]
}) {
  const spinVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  return (
    <motion.div
      variants={spinVariants}
      animate="spin"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `4px solid ${DESIGN.colors.neutral[200]}`,
        borderTopColor: color,
        borderRadius: '50%',
        display: 'inline-block'
      }}
    />
  );
});

/**
 * Component: CountUp
 * Animate number counting up
 */
export const CountUp = memo(function CountUp({
  from = 0,
  to = 100,
  duration = 2,
  suffix = '',
  prefix = '',
  style
}) {
  const [count, setCount] = React.useState(from);

  React.useEffect(() => {
    let start = from;
    const increment = (to - from) / (duration * 60); // Assuming 60fps
    let frameId;

    const animate = () => {
      start += increment;
      if (start >= to) {
        setCount(to);
      } else {
        setCount(Math.floor(start));
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [from, to, duration]);

  return (
    <motion.span style={style}>
      {prefix}{count}{suffix}
    </motion.span>
  );
});

export default {
  PageTransition,
  ModalTransition,
  StaggeredList,
  CardStack,
  FadeIn,
  SlideIn,
  ScaleIn,
  RotateIn,
  PulseAnimation,
  BounceAnimation,
  AnimatedTooltip,
  LoadingAnimation,
  CountUp
};
