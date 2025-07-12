import { LogoIcon } from "@/components/logo-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import { useTRPCQuerySuspense } from "@/hooks/use-query";
import { ChevronDownIcon, ChevronLeftIcon, SunMoonIcon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

interface Props {
  projectId: string;
}

export const ProjectHeader = ({ projectId }: Props) => {
  const { data: project } = useTRPCQuerySuspense((trpc) =>
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  const { theme, setTheme } = useTheme();

  return (
    <header className='p-2 flex justify-between items-center border-b'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2!'
          >
            <LogoIcon />
            <span className='text-sm font-medium'>{project.name}</span>
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start'>
          <DropdownMenuItem asChild>
            <Link href={`/`}>
              <ChevronLeftIcon />
              <span>Go to Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className='gap-2'>
              <SunMoonIcon className='size-4 text-muted-foreground' />
              <span>Appearance</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
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
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
