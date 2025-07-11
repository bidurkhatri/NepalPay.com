import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { Link } from "wouter"
import { motion } from "framer-motion"

interface MobileNavProps {
  navItems: Array<{
    href: string
    label: string
    icon: React.ReactNode
  }>
  className?: string
}

const MobileNav: React.FC<MobileNavProps> = ({ navItems, className }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const closeNav = () => setIsOpen(false)

  return (
    <div className={cn("md:hidden", className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">NP</span>
                </div>
                <span className="font-bold text-lg">NepaliPay</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeNav}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4">
              <div className="space-y-2 px-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-12 px-4 text-left"
                        onClick={closeNav}
                      >
                        <span className="mr-3 text-primary">{item.icon}</span>
                        <span className="text-base">{item.label}</span>
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export { MobileNav }