import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import { Slash } from "lucide-react";
import { adminArticleManagement } from "@/configs/Site";
function ArticlePanelComponent() {
  const navigate = useNavigate();


  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 max-w-7xl mx-auto">
      {adminArticleManagement.map((card, index) => (
        <Card
          key={index}
          className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 cursor-pointer relative overflow-hidden h-full"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

          <CardHeader className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${card.iconBg} transition-colors duration-300`}>
                {card.icon}
              </div>
              <CardTitle className="text-xl">{card.title}</CardTitle>
            </div>
            <CardDescription className="text-base">
              {card.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-4 flex-1 flex flex-col">
            <div className="space-y-2 flex-1">
              {card.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className={`w-2 h-2 rounded-full ${card.badgeColor}`} />
                  {feature}
                </div>
              ))}
            </div>

            <Button
              onClick={() => navigate(card.path)}
              variant={card.variant === 'primary' ? 'default' : card.variant}
              className="w-full mt-auto group-hover:translate-y-0 transition-all duration-300"
              size="lg"
            >
              {card.buttonText}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default ArticlePanelComponent