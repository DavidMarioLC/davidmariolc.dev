"use client";

import { MenuIcon, XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface Section {
  href: string;
  label: string;
}

interface Props {
  closeLabel: string;
  /** Accessible name of the navigation landmark, translated on the server. */
  navLabel: string;
  openLabel: string;
  sections: readonly Section[];
  title: string;
}

export function MobileNav({
  sections,
  navLabel,
  title,
  openLabel,
  closeLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = useCallback(() => setOpen(false), []);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger
        render={<Button size="icon-sm" variant="ghost" />}
        title={openLabel}
      >
        <MenuIcon />
        <span className="sr-only">{openLabel}</span>
      </SheetTrigger>
      {/* The built-in close button ships a hardcoded English label. */}
      <SheetContent showCloseButton={false} side="left">
        <SheetHeader className="flex-row items-center justify-between">
          <SheetTitle>{title}</SheetTitle>
          <SheetClose
            render={<Button size="icon-sm" variant="ghost" />}
            title={closeLabel}
          >
            <XIcon />
            <span className="sr-only">{closeLabel}</span>
          </SheetClose>
        </SheetHeader>
        <nav aria-label={navLabel} className="px-6 pb-6">
          <ul className="flex flex-col gap-1 font-mono text-base">
            {sections.map((section) => {
              const isActive =
                section.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(section.href);

              return (
                <li key={section.href}>
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "-mx-2 block rounded-md px-2 py-2 transition-colors hover:text-foreground",
                      isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground"
                    )}
                    href={section.href}
                    onClick={close}
                  >
                    {section.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
