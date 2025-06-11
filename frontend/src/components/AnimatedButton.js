import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  icon: Icon,
  ...props 
}) => {
  const baseClasses = 'btn flex items-center justify-center gap-2';
  const variantClasses = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    danger: 'btn-danger',
    success: 'btn-success'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  );
};

export default AnimatedButton; 