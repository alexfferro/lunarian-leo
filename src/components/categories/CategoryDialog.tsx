"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as LucideIcons from "lucide-react";
import {
  useCreateCategories,
  useUpdateCategories,
} from "@/hooks/useCategories";

// Lista de ícones para o seletor
const iconList = [
  "Salad",
  "Car",
  "Home",
  "ShoppingCart",
  "Bus",
  "Plane",
  "Landmark",
  "HeartPulse",
  "Gift",
  "GraduationCap",
  "Briefcase",
  "PiggyBank",
  "CircleDollarSign",
];
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
const categorySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  type: z.enum(["INCOME", "EXPENSE"]),
  icon: z.string().optional(),
});

type FormData = z.infer<typeof categorySchema>;

type CategoryDialogProps = {
  trigger: React.ReactNode;
  categoryToEdit?: FormData & { id: string };
};

export default function CategoryDialog({
  trigger,
  categoryToEdit,
}: CategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!categoryToEdit;

  const form = useForm<FormData>({
    /* ... */
  });

  const createMutation = useCreateCategories();
  const updateMutation = useUpdateCategories();

  const onSubmit = (data: FormData) => {
    if (isEditMode) {
      updateMutation.mutate(
        { ...data, id: categoryToEdit.id },
        { onSuccess: () => setIsOpen(false) }
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => setIsOpen(false) });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes da sua categoria.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* ... (FormField para 'name') */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="EXPENSE" />
                        </FormControl>
                        <FormLabel>Despesa</FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="INCOME" />
                        </FormControl>
                        <FormLabel>Receita</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Ícone</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-6 gap-2"
                    >
                      {iconList.map((iconName) => (
                        <FormItem
                          key={iconName}
                          className="flex items-center justify-center"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={iconName}
                              className="sr-only"
                            />
                          </FormControl>
                          <FormLabel className="h-10 w-10 rounded-lg border-2 border-transparent ring-offset-background cursor-pointer data-[state=checked]:border-primary flex items-center justify-center">
                            <DynamicIcon name={iconName} />
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" /* ... */>
              {isEditMode ? "Salvar Alterações" : "Criar Categoria"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
