'use client'

import dynamic from 'next/dynamic'
import { LucideProps } from 'lucide-react'

// Commonly used icons - import directly for better performance
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Menu,
  MapPin,
  Heart,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  Award
} from 'lucide-react'

// Less common icons - dynamic import
const ChevronLeft = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ChevronLeft })))
const ChevronRight = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ChevronRight })))
const ChevronDown = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ChevronDown })))
const ChevronUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ChevronUp })))
const Play = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Play })))
const ArrowRight = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ArrowRight })))
const LogOut = dynamic(() => import('lucide-react').then(mod => ({ default: mod.LogOut })))
const Phone = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Phone })))
const Mail = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Mail })))
const Facebook = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Facebook })))
const Instagram = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Instagram })))
const Twitter = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Twitter })))
const Youtube = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Youtube })))
const Plus = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Plus })))
const Table = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Table })))
const Check = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Check })))
const X = dynamic(() => import('lucide-react').then(mod => ({ default: mod.X })))

const iconMap = {
  // Common icons
  calendar: Calendar,
  clock: Clock,
  user: User,
  search: Search,
  menu: Menu,
  mapPin: MapPin,
  heart: Heart,
  star: Star,
  trendingUp: TrendingUp,
  users: Users,
  dollarSign: DollarSign,
  checkCircle: CheckCircle,
  award: Award,
  
  // Dynamic icons
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  play: Play,
  arrowRight: ArrowRight,
  logOut: LogOut,
  phone: Phone,
  mail: Mail,
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  plus: Plus,
  table: Table,
  check: Check,
  x: X,
} as const

export type IconName = keyof typeof iconMap

interface IconProps extends LucideProps {
  name: IconName
}

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = iconMap[name]
  return <IconComponent {...props} />
}

// Export individual icons for direct usage when needed
export {
  Calendar,
  Clock,
  User,
  Search,
  Menu,
  MapPin,
  Heart,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Play,
  ArrowRight,
  LogOut,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Plus,
  Table,
  Check,
  X
}
