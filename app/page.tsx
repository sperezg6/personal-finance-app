import { NavBarWrapper } from "@/components/navbar-wrapper"
import AreaCharts from "@/components/area-charts"
import { ConversionFunnelChart } from "@/components/conversion-funnel-chart"
import { BlurFade } from "@/components/ui/blur-fade"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="container mx-auto px-4 pt-24 space-y-8">
        <div className="space-y-4 pb-8">
          <BlurFade delay={0.75} inView>
            <h1 className="text-4xl font-bold">Hello Santiago 👋</h1>
          </BlurFade>
          <BlurFade delay={1} inView>
            <p className="mt-4 text-muted-foreground">Here is you finance summary</p>
          </BlurFade>
        </div>
        <BlurFade delay={0.25} inView>
          <AreaCharts />
        </BlurFade>
        <BlurFade delay={0.5} inView>
          <ConversionFunnelChart />
        </BlurFade>
      </div>
    </main>
  )
}
