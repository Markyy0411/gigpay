import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const SlideToVerify = ({ onVerify }) => {
  const [isVerified, setIsVerified] = useState(false);
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  
  const handleDragEnd = (event, info) => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    
    // If dragged past 75% of the container, it's verified
    if (info.offset.x > containerWidth * 0.75) {
      setIsVerified(true);
      onVerify(true);
      x.set(containerWidth - 56); // Lock position at the end
    } else {
      // Snap back to start
      x.set(0);
    }
  };

  const bg = useTransform(x, [0, 250], ['rgba(0,0,0,0.2)', 'rgba(34,197,94,0.2)']);
  const textColor = useTransform(x, [0, 250], ['var(--text-muted)', '#4ade80']);

  return (
    <motion.div 
      ref={containerRef}
      style={{ 
        height: '56px', 
        borderRadius: '28px', 
        border: '1px solid var(--border)',
        background: isVerified ? 'rgba(34,197,94,0.1)' : bg,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginTop: '0.5rem'
      }}
    >
      <motion.span style={{ color: isVerified ? '#4ade80' : textColor, zIndex: 1, pointerEvents: 'none', fontWeight: 500, userSelect: 'none' }}>
        {isVerified ? 'Verified Human' : 'Slide to Verify'}
      </motion.span>

      <motion.div
        drag={isVerified ? false : "x"}
        dragConstraints={containerRef}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{
          x,
          position: 'absolute',
          left: 4,
          width: '48px',
          height: '48px',
          borderRadius: '24px',
          background: isVerified ? '#4ade80' : 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isVerified ? 'default' : 'grab',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 2
        }}
        whileDrag={{ cursor: 'grabbing', scale: 1.05 }}
      >
        {isVerified ? <ShieldCheck size={24} color="black" /> : <ArrowRight size={24} color="black" />}
      </motion.div>
    </motion.div>
  );
};

export default SlideToVerify;
