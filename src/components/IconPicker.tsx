"use client";

import { type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICONS } from "@/lib/icons";

export type IconName = keyof typeof ICONS;

interface IconPickerProps {
  value?: IconName;
  onChange: (value: IconName) => void;
}

interface DynamicIconProps extends LucideProps {
  name: IconName;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = ICONS[name];

  if (!IconComponent) {
    const FallbackIcon = ICONS["CircleDollarSign"];
    return <FallbackIcon {...props} />;
  }
  return <IconComponent {...props} />;
}

export function IconGridPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-96 overflow-y-auto rounded-lg border p-2">
      {Object.keys(ICONS).map((iconName) => (
        <button
          key={iconName}
          onClick={() => onChange(iconName as IconName)}
          type="button"
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 p-2 rounded-md transition-colors aspect-square",
            "hover:bg-accent hover:text-accent-foreground",
            value === iconName
              ? "bg-primary text-primary-foreground"
              : "bg-transparent"
          )}
        >
          <DynamicIcon name={iconName as IconName} className="h-5 w-5" />
          {/* <span className="text-xs text-center truncate w-full">
            {iconName}
          </span> */}
        </button>
      ))}
    </div>
  );
}
