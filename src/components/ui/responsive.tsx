import * as React from "react"
import { cn } from "@/lib/cn"

// Responsive Container Component
interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const containerSizes = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl', 
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full'
}

const containerPadding = {
  none: '',
  sm: 'px-4 sm:px-6',
  md: 'px-4 sm:px-6 lg:px-8',
  lg: 'px-6 sm:px-8 lg:px-12'
}

export const ResponsiveContainer = React.forwardRef<
  HTMLDivElement,
  ResponsiveContainerProps
>(({ className, size = 'lg', padding = 'md', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mx-auto w-full',
      containerSizes[size],
      containerPadding[padding],
      className
    )}
    {...props}
  />
))
ResponsiveContainer.displayName = "ResponsiveContainer"

// Responsive Grid Component
interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: 'sm' | 'md' | 'lg' | 'xl'
}

const gridGaps = {
  sm: 'gap-2 sm:gap-3',
  md: 'gap-4 sm:gap-6',
  lg: 'gap-6 sm:gap-8',
  xl: 'gap-8 sm:gap-12'
}

export const ResponsiveGrid = React.forwardRef<
  HTMLDivElement,
  ResponsiveGridProps
>(({ className, cols = { default: 1, md: 2, lg: 3 }, gap = 'md', ...props }, ref) => {
  const gridCols = cn(
    'grid',
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    gridGaps[gap]
  )

  return (
    <div
      ref={ref}
      className={cn(gridCols, className)}
      {...props}
    />
  )
})
ResponsiveGrid.displayName = "ResponsiveGrid"

// Responsive Stack Component
interface ResponsiveStackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: {
    default?: 'row' | 'col'
    sm?: 'row' | 'col'
    md?: 'row' | 'col'
    lg?: 'row' | 'col'
  }
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
}

const stackGaps = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8'
}

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch'
}

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around'
}

export const ResponsiveStack = React.forwardRef<
  HTMLDivElement,
  ResponsiveStackProps
>(({ 
  className, 
  direction = { default: 'col', md: 'row' }, 
  gap = 'md',
  align = 'start',
  justify = 'start',
  ...props 
}, ref) => {
  const stackClasses = cn(
    'flex',
    direction.default === 'row' ? 'flex-row' : 'flex-col',
    direction.sm && (direction.sm === 'row' ? 'sm:flex-row' : 'sm:flex-col'),
    direction.md && (direction.md === 'row' ? 'md:flex-row' : 'md:flex-col'),
    direction.lg && (direction.lg === 'row' ? 'lg:flex-row' : 'lg:flex-col'),
    stackGaps[gap],
    alignClasses[align],
    justifyClasses[justify]
  )

  return (
    <div
      ref={ref}
      className={cn(stackClasses, className)}
      {...props}
    />
  )
})
ResponsiveStack.displayName = "ResponsiveStack"

// Responsive Text Component
interface ResponsiveTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  size?: {
    default?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
    sm?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
    md?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
    lg?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  }
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  align?: {
    default?: 'left' | 'center' | 'right'
    sm?: 'left' | 'center' | 'right'
    md?: 'left' | 'center' | 'right'
  }
}

const textSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl'
}

const textWeights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
}

const textAligns = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}

export const ResponsiveText = React.forwardRef<
  HTMLElement,
  ResponsiveTextProps
>(({ 
  className, 
  as: Component = 'p',
  size = { default: 'base' },
  weight = 'normal',
  align = { default: 'left' },
  ...props 
}, ref) => {
  const textClasses = cn(
    size.default && textSizes[size.default],
    size.sm && `sm:${textSizes[size.sm]}`,
    size.md && `md:${textSizes[size.md]}`,
    size.lg && `lg:${textSizes[size.lg]}`,
    textWeights[weight],
    align.default && textAligns[align.default],
    align.sm && `sm:${textAligns[align.sm]}`,
    align.md && `md:${textAligns[align.md]}`
  )

  return (
    <Component
      ref={ref as any}
      className={cn(textClasses, className)}
      {...props}
    />
  )
})
ResponsiveText.displayName = "ResponsiveText"

// Responsive Show/Hide Component
interface ResponsiveShowProps extends React.HTMLAttributes<HTMLDivElement> {
  above?: 'sm' | 'md' | 'lg' | 'xl'
  below?: 'sm' | 'md' | 'lg' | 'xl'
  only?: 'sm' | 'md' | 'lg' | 'xl'
}

export const ResponsiveShow = React.forwardRef<
  HTMLDivElement,
  ResponsiveShowProps
>(({ className, above, below, only, ...props }, ref) => {
  let showClasses = ''
  
  if (only) {
    switch (only) {
      case 'sm':
        showClasses = 'hidden sm:block md:hidden'
        break
      case 'md':
        showClasses = 'hidden md:block lg:hidden'
        break
      case 'lg':
        showClasses = 'hidden lg:block xl:hidden'
        break
      case 'xl':
        showClasses = 'hidden xl:block'
        break
    }
  } else {
    if (above) {
      showClasses += `hidden ${above}:block `
    }
    if (below) {
      showClasses += `${below}:hidden `
    }
  }

  return (
    <div
      ref={ref}
      className={cn(showClasses.trim(), className)}
      {...props}
    />
  )
})
ResponsiveShow.displayName = "ResponsiveShow"
