"use client";

import { AppearanceDropdown } from "@/components/appearance-dropdown";
import { LogoIcon } from "@/components/logo-icon";
import { Button } from "@/components/ui/button";
import { useTRPCQuery } from "@/hooks/use-query";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export const ProjectsList = () => {
  const { data: projects } = useTRPCQuery((trpc) =>
    trpc.projects.getMany.queryOptions()
  );

  return (
    <div className='w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4'>
      <div className='flex gap-6'>
        <h2 className='text-2xl font-semibold'>Saved Vibes</h2>
        <AppearanceDropdown />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
        {projects?.length === 0 && (
          <div className='col-span-full text-center'>
            <p className='text-sm text-muted-foreground'>No projects found</p>
          </div>
        )}
        {projects?.map((project) => (
          <Button
            key={project.id}
            variant='outline'
            className='font-normal h-auto justify-start w-full text-start p-4'
            asChild
          >
            <Link href={`/projects/${project.id}`}>
              <div className='flex items-center gap-x-4'>
                <LogoIcon width={32} height={32} className='object-contain' />
                <div className='flex flex-col'>
                  <h3 className='truncate font-medium'>{project.name}</h3>
                  <p className='text-xs text-muted-foreground'>
                    {formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};
