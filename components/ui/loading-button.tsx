import { Button, buttonVariants } from './button';
import { Loader2 } from 'lucide-react';
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

interface LoadingButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  asChild?: boolean;
}

export function LoadingButton({ 
  children, 
  isLoading, 
  loadingText, 
  disabled, 
  variant,
  size,
  asChild = false,
  className,
  ...props 
}: LoadingButtonProps) {
  return (
    <Button 
      disabled={isLoading || disabled}
      variant={variant}
      size={size}
      asChild={asChild}
      className={className}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className='w-4 h-4 mr-2 animate-spin' />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
