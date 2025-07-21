import { LogoIcon } from "@/components/logo-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTRPCQuerySuspense } from "@/hooks/use-query";
import { ChevronDownIcon, ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { AppearanceDropdown } from "@/components/appearance-dropdown";

interface Props {
  projectId: string;
}

export const ProjectHeader = ({ projectId }: Props) => {
  const { data: project } = useTRPCQuerySuspense((trpc) =>
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

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
          <AppearanceDropdown isSubMenu />
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
