"use client";

import { CreateCategoryDialog } from "@/components/categories/create-category-form";
import { useDeleteCategory, useGetCategories } from "@/hooks/useCategories";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import CategoryCard from "@/components/categories/category-card";
import { DeleteDialog } from "@/components/DeleteDialog";
import { UpdateCategoryDialog } from "@/components/categories/update-category-form";
import type { Category } from "@/generated/prisma";

export default function CategoriesPage() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories, isLoading } = useGetCategories();
  const { mutate: deleteMutate, isPending: isDeletePending } =
    useDeleteCategory();

  return (
    <div className="container mx-auto p-4 md:p-8 relative min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold"> Suas Categorias</h1>
      </header>

      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories?.map((cat) => (
            // O CategoryCard agora não precisa da função onDelete, pois o botão estará no DeleteDialog
            <CategoryCard
              key={cat.id}
              category={cat}
              onEdit={() => setEditingCategory(cat)}
              // Passamos o componente DeleteDialog como um "irmão" do botão de editar
              deleteComponent={
                <DeleteDialog
                  idToDelete={cat.id}
                  itemName={cat.name}
                  mutate={deleteMutate}
                  isPending={isDeletePending}
                />
              }
            />
          ))}
        </div>
      )}
      <div className="fixed bottom-18 right-5 z-50">
        <CreateCategoryDialog />
      </div>
      <UpdateCategoryDialog
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
      />
    </div>
  );
}
