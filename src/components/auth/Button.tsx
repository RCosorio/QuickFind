import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  variant = 'primary',
  onClick,
  isLoading = false,
  disabled = false,
  children,
  fullWidth = false,
  className = ''
}) => {
  // Base styles
  const baseStyles = "px-4 py-2 rounded-lg font-medium text-sm transition-all focus:outline-none";
  
  // Variant styles - default styles if not overridden by className
  const variantStyles = {
    primary: 'bg-gradient-to-r from-baby-blue to-blue-500 text-white hover:shadow-md',
    secondary: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50',
    outline: 'bg-transparent border border-baby-blue text-baby-blue hover:bg-baby-blue hover:bg-opacity-10'
  };
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Loading and disabled styles
  const stateStyles = (isLoading || disabled) 
    ? 'opacity-70 cursor-not-allowed' 
    : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${stateStyles} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : children}
    </button>
  );
};

export default Button; 