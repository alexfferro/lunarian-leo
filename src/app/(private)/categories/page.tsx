"use client";

import CategoryCard from "@/components/categories/CategoryCard";
import { useGetCategories } from "@/hooks/useCategories";

export default function CategoriesPage() {
  const { data, isLoading } = useGetCategories();

  const handleEdit = (category: any) => {
    // Lógica para abrir o modal de edição (faremos no próximo passo)
    console.log("Editar:", category);
  };

  const handleDelete = (category: any) => {
    // Lógica para abrir o diálogo de confirmação de exclusão (próximo passo)
    console.log("Deletar:", category);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Suas Categorias</h1>
      </header>

      {isLoading ? (
        <p>Carregando categorias...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.map((cat: any) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
