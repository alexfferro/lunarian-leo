"use client";

import * as LucideIcons from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
  icon: string | null;
  type: "INCOME" | "EXPENSE";
};

type CategoryCardProps = {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};

// MUDANÇA 1: Renomeado de 'Icon' para 'DynamicIcon' para evitar conflito
const DynamicIcon = ({
  name,
  ...props
}: { name: string } & LucideIcons.LucideProps) => {
  const LucideIconComponent = (LucideIcons as any)[name];
  if (!LucideIconComponent) {
    // Retorna um ícone padrão se o nome não for encontrado
    return <LucideIcons.CircleDollarSign {...props} />;
  }
  return <LucideIconComponent {...props} />;
};

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{category.name}</CardTitle>
        <DynamicIcon
          name={category.icon || "CircleDollarSign"}
          className="h-6 w-6 text-muted-foreground"
        />
      </CardHeader>
      <CardFooter className="flex justify-between pt-4">
        <Badge
          variant={category.type === "INCOME" ? "outline" : "destructive"}
          className="bg-opacity-80"
        >
          {category.type === "INCOME" ? "Receita" : "Despesa"}
        </Badge>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(category)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600"
            onClick={() => onDelete(category)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
