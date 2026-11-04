import * as React from "react";
import { Tab } from "@headlessui/react";

// Fonction utilitaire simple pour combiner les classes CSS
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

const Tabs = Tab.Group;

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Tab.List
    ref={ref}
    className={cn("tabs tabs-bordered flex-nowrap overflow-x-auto [scrollbar-width:none]", className)}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => (
  <Tab
    ref={ref}
    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
      // Sur petit écran, la liste défile : on garde l'onglet choisi entièrement visible.
      e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      onClick?.(e);
    }}
    className={({ selected }) =>
      cn("tab shrink-0 whitespace-nowrap", selected ? "tab-active" : "", className)
    }
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Tab.Panel ref={ref} className={cn("mt-4", className)} {...props} />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
