import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plane, Map, Calendar, DollarSign } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-lg">
            <Plane className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-balance">GlobalTrotters</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">
            Plan Your Perfect
            <span className="block text-primary mt-2">Multi-City Adventure</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Create customized itineraries with travel dates, activities, and budgets. Discover destinations and share
            your plans with the world.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Planning Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6 pt-16">
            <div className="p-6 bg-card rounded-xl border shadow-sm">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Multi-City Plans</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Build complex itineraries across multiple cities and countries
              </p>
            </div>

            <div className="p-6 bg-card rounded-xl border shadow-sm">
              <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Scheduling</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Organize activities with dates and visual timeline views
              </p>
            </div>

            <div className="p-6 bg-card rounded-xl border shadow-sm">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Budget Tracking</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Monitor costs with detailed breakdowns and visual charts
              </p>
            </div>

            <div className="p-6 bg-card rounded-xl border shadow-sm">
              <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
                <Plane className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Share & Inspire</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Make trips public and inspire other travelers worldwide
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-24 border-t">
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; 2026 GlobalTrotters. Built with v0.</p>
        </div>
      </footer>
    </div>
  )
}
