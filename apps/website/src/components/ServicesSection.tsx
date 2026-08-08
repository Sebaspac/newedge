import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useOptimizedAnimation } from "@/hooks/useOptimizedAnimation";
interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
}
interface ServicesSectionProps {
  title: string;
  subtitle: string;
  services: Service[];
  accentColor: string;
  bgColor?: string;
}
export const ServicesSection = ({
  title,
  subtitle,
  services,
  accentColor,
  bgColor = "bg-white"
}: ServicesSectionProps) => {
  const { shouldAnimate } = useOptimizedAnimation();
  
  return <section className={`py-8 sm:py-16 ${bgColor}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3 sm:mb-4 animate-fade-in">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto animate-fade-in px-4">
            {subtitle}
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 max-w-5xl mx-auto">
          {services.map((service, index) => <motion.div key={service.title} initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: shouldAnimate ? 0.6 : 0,
          delay: shouldAnimate ? index * 0.05 : 0
        }}>
              <Card className="bg-white border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] animate-fade-in group h-full">
                <CardContent className="p-5 text-center h-full flex flex-col">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-200 group-hover:scale-105" style={{
                backgroundColor: `${accentColor}20`
              }}>
                    <service.icon className="w-6 h-6" style={{
                  color: accentColor
                }} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-black mb-2 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-grow text-left">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>)}
        </div>
      </div>
    </section>;
};