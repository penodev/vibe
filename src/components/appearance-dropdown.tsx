"use client";

import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";

interface AppearanceDropdownProps {
  isSubMenu?: boolean;
}

export const AppearanceDropdown = ({ isSubMenu }: AppearanceDropdownProps) => {
  const { theme, setTheme } = useTheme();

  const TriggerButton = () => {
    return (
      <div className='flex w-fit items-center gap-2'>
        <SunMoonIcon className='size-4 text-muted-foreground' />
        <span>Appearance</span>
      </div>
    );
  };

  const DropdownMenuThemeRadio = () => {
    return (
      <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
        <DropdownMenuRadioItem value='light'>
          <span>Light</span>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value='dark'>
          <span>Dark</span>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value='system'>
          <span>System</span>
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    );
  };

  if (isSubMenu) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <TriggerButton />
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuThemeRadio />
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='w-fit'>
        <TriggerButton />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' side='right' sideOffset={10}>
        <DropdownMenuThemeRadio />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
