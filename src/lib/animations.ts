/**
 * Animation configuration for Framer Motion
 * Centralized animation variants for consistent motion design
 */

import type { Variants } from 'framer-motion';

// Base timing configurations
export const timing = {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    spring: { type: 'spring', stiffness: 300, damping: 25 },
    springGentle: { type: 'spring', stiffness: 150, damping: 20 },
    springBouncy: { type: 'spring', stiffness: 400, damping: 15 },
} as const;

// Fade variants
export const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: timing.normal }
    },
    exit: {
        opacity: 0,
        transition: { duration: timing.fast }
    }
};

// Fade up variants (most common for sections)
export const fadeUpVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 24
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: timing.slow, ease: [0.25, 0.1, 0.25, 1] }
    }
};

// Fade down variants
export const fadeDownVariants: Variants = {
    hidden: { opacity: 0, y: -24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: timing.slow }
    }
};

// Scale variants
export const scaleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: timing.spring
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: timing.fast }
    }
};

// Slide variants
export const slideLeftVariants: Variants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: timing.springGentle
    }
};

export const slideRightVariants: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: timing.springGentle
    }
};

// Stagger container variant
export const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

// Stagger item variant
export const staggerItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: timing.normal }
    }
};

// Card hover animation props
export const cardHoverProps = {
    whileHover: { y: -4, scale: 1.01 },
    whileTap: { scale: 0.99 },
    transition: timing.spring
};

// Button hover animation props
export const buttonHoverProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: timing.springBouncy
};

// Icon hover animation props
export const iconHoverProps = {
    whileHover: { scale: 1.1, rotate: 5 },
    transition: timing.springBouncy
};

// Viewport trigger settings
export const viewportSettings = {
    once: true,
    margin: '-50px'
};

// Page transition variants
export const pageTransitionVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3 }
    }
};

// Navbar scroll animation
export const navbarVariants: Variants = {
    hidden: { y: -100 },
    visible: {
        y: 0,
        transition: { duration: timing.slow }
    }
};

// Modal/Dialog variants
export const modalVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        y: 20
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: timing.spring
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: { duration: timing.fast }
    }
};

// Overlay backdrop variants
export const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: timing.normal }
    },
    exit: {
        opacity: 0,
        transition: { duration: timing.fast }
    }
};

// Text reveal variants (for headings)
export const textRevealVariants: Variants = {
    hidden: {
        opacity: 0,
        y: '100%'
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    }
};

// Drawer variants (for mobile menu)
export const drawerVariants: Variants = {
    hidden: {
        opacity: 0,
        height: 0
    },
    visible: {
        opacity: 1,
        height: 'auto',
        transition: { duration: timing.normal, ease: 'easeInOut' }
    },
    exit: {
        opacity: 0,
        height: 0,
        transition: { duration: timing.fast }
    }
};
