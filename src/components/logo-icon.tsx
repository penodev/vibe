import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";

export const LogoIcon = ({
  className,
  ...props
}: Omit<ImageProps, "src" | "alt">) => {
  return (
    <Image
      width={18}
      height={18}
      {...props}
      src='/logo.svg'
      alt='Vibe'
      className={cn("dark:text-white", className)}
    />
  );
};
