
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { home, mail, phone, quote, login } from "lucide-react";

const COMPANY_MOTTO = "Empowering Businesses Through Seamless Garment Production Solutions!";
const HOW_WE_WORK = [
  {
    title: "Consultation",
    text: "We discuss requirements and understand your vision.",
  },
  {
    title: "Collaborative Planning",
    text: "Our expert team crafts tailored production strategies.",
  },
  {
    title: "Execution",
    text: "Robust operations ensure timely, high-quality deliveries.",
  },
  {
    title: "Support & Feedback",
    text: "We’re with you at every step, ensuring continual improvement.",
  },
];

export default function Index() {
  const navigate = useNavigate();

  // Dialog states
  const [openQuery, setOpenQuery] = useState(false);
  const [openQuote, setOpenQuote] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/30 to-secondary/10">
      {/* Hero/Top section */}
      <header className="container mx-auto px-4 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="bg-primary/10 rounded-full p-3">
            {React.createElement(home, { size: 32, className: "text-primary" })}
          </span>
          <span className="text-3xl font-bold tracking-tight text-primary">
            Mohil Enterprise
          </span>
        </div>
        <nav className="flex gap-2">
          <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
          <Button variant="default" onClick={() => navigate("/login")}>
            <login className="mr-2" size={18} />
            Login
          </Button>
        </nav>
      </header>

      {/* Motto & Work */}
      <section className="container mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent text-transparent bg-clip-text animate-fade-in">
            {COMPANY_MOTTO}
          </h2>
          <p className="text-lg text-muted-foreground mb-4 font-medium">Mohil ERP delivers technology-driven solutions for seamless clothing production, delivering efficiency and reliability from design to delivery.</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HOW_WE_WORK.map((step, idx) => (
              <Card key={step.title} className="shadow-md hover:shadow-lg transition-all bg-card/90">
                <CardContent className="p-4">
                  <div className="font-semibold text-lg mb-1">{step.title}</div>
                  <div className="text-muted-foreground text-sm">{step.text}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Customer Action Area */}
        <div className="flex-1 flex flex-col items-center md:items-end gap-6">
          <div className="bg-white/80 rounded-xl p-6 shadow-xl w-full max-w-xs animate-scale-in">
            <h3 className="text-2xl font-semibold mb-2 text-center text-primary">For Customers</h3>
            <div className="flex flex-col gap-3 mt-4">
              <Button variant="secondary" className="w-full" onClick={() => setOpenQuery(true)}>
                <mail className="mr-2"/> Submit Query
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setOpenQuote(true)}>
                <quote className="mr-2"/> Request Quotation
              </Button>
              <Button variant="default" className="w-full" onClick={() => setOpenOrder(true)}>
                <phone className="mr-2"/> Order Now
              </Button>
              <div className="mt-4 text-xs text-muted-foreground text-center">
                Have a question or project? Reach out directly!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dialogs */}
      <Dialog open={openQuery} onOpenChange={setOpenQuery}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit a Query</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="Your Name" />
            <Input placeholder="Your Email" type="email" />
            <Textarea placeholder="Your Query" rows={3} />
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" onClick={() => setOpenQuery(false)}>Send</Button>
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openQuote} onOpenChange={setOpenQuote}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a Quotation</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="Your Name" />
            <Input placeholder="Company/Business" />
            <Input placeholder="Email" type="email" />
            <Textarea placeholder="What do you need a quote for?" rows={3} />
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" onClick={() => setOpenQuote(false)}>Request</Button>
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openOrder} onOpenChange={setOpenOrder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place an Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="Your Name" />
            <Input placeholder="Email" type="email" />
            <Input placeholder="Product/Service Requested" />
            <Textarea placeholder="Order details or requirements" rows={3} />
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" onClick={() => setOpenOrder(false)}>Submit</Button>
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
