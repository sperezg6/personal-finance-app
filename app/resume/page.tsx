import { NavBarWrapper } from "@/components/navbar-wrapper"
import { BlurFade } from "@/components/ui/blur-fade"

export default function Resume() {
  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="container mx-auto px-4 pt-24">
        <BlurFade delay={0.25} inView>
          <h1 className="text-4xl font-bold">Resume</h1>
        </BlurFade>
        <BlurFade delay={0.5} inView>
          <p className="mt-4 text-muted-foreground">Resume page coming soon...</p>
        </BlurFade>
      </div>
    </main>
  )
}
