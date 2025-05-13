import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-3xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Organizador de Tareas</h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Mantén el control de tus tareas diarias, establece prioridades y nunca olvides una fecha importante.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/resgiter">
              Crear Cuenta
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
