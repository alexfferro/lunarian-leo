"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { Category } from "@/generated/prisma";
import { DynamicIcon } from "../IconPicker";

export type CategoryCardProps = {
  category: Category;
  onEdit: (category: Category) => void;
  deleteComponent: React.ReactNode;
};

export default function CategoryCard({
  category,
  onEdit,
  deleteComponent,
}: CategoryCardProps) {
  return (
    <div className="flex justify-between items-center border rounded-md p-2">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-muted rounded-md">
          <DynamicIcon
            name={(category.icon as any) || "CircleDollarSign"}
            className="h-6 w-6 text-muted-foreground"
          />
        </div>
        <span className="font-semibold text-md">{category.name}</span>
      </div>

      <div className="flex">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(category)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        {deleteComponent}
      </div>
    </div>
  );
}
