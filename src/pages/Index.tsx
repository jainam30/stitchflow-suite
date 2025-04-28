
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Scissors, BarChart, Users, Sparkles } from "lucide-react";
import React from "react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Worker Management",
      description: "Easily manage workers, track production, and calculate salaries based on work completed.",
      icon: Users,
      color: "bg-primary/10 text-primary"
    },
    {
      title: "Production Tracking",
      description: "Track the progress of each production item with detailed operation breakdown.",
      icon: Scissors,
      color: "bg-secondary/10 text-secondary"
    },
    {
      title: "Comprehensive Reports",
      description: "Generate daily, weekly, and monthly reports to analyze productivity and costs.",
      icon: BarChart,
      color: "bg-accent/10 text-accent"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Mohil Enterprise</h1>
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>About</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[400px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-mohil-600 to-mohil-900 p-6 no-underline outline-none focus:shadow-md"
                          href="#"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium text-white">
                            Mohil Enterprise
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            A comprehensive production management system for garment industries
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button variant="ghost" onClick={() => navigate('/login')} className="font-medium">
                  Login
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>
      
      <section className="container mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
            Streamline Your Production Management
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive solution for garment industries to manage workers, track production, and generate detailed reports.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/login')} 
            className="mt-8 text-lg font-medium animate-fade-in"
          >
            Get Started
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className={`${feature.color} p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="container mx-auto py-8 px-4 mt-auto border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Mohil Enterprise. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button variant="ghost" size="sm">Privacy</Button>
            <Button variant="ghost" size="sm">Terms</Button>
            <Button variant="ghost" size="sm">Contact</Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
