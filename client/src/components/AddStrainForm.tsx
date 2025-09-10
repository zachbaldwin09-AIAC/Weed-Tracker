import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { insertStrainSchema } from "@shared/schema";

// Extend the shared schema with UI validation
const addStrainSchema = insertStrainSchema.extend({
  name: z.string().min(1, "Strain name is required").max(100, "Name too long"),
  type: z.enum(["Indica", "Sativa", "Hybrid"], {
    required_error: "Please select a strain type",
  }),
  thcContent: z.coerce
    .number()
    .min(0, "THC content must be 0 or greater")
    .max(50, "THC content cannot exceed 50%")
    .optional(),
  description: z.string().max(500, "Description too long").optional(),
});

type AddStrainFormData = z.infer<typeof addStrainSchema>;

interface AddStrainFormProps {
  onSubmit: (strain: AddStrainFormData) => void;
  initialData?: Partial<AddStrainFormData>;
  trigger?: React.ReactNode;
  isLoading?: boolean;
}

export function AddStrainForm({ onSubmit, initialData, trigger, isLoading }: AddStrainFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<AddStrainFormData>({
    resolver: zodResolver(addStrainSchema),
    defaultValues: {
      name: "",
      type: undefined,
      thcContent: undefined,
      description: "",
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
        type: initialData.type || undefined,
        thcContent: initialData.thcContent || undefined,
        description: initialData.description || "",
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: AddStrainFormData) => {
    console.log("Adding new strain:", data);
    // Normalize optional fields for backend compatibility
    const normalizedData = {
      ...data,
      thcContent: data.thcContent || undefined,
      description: data.description || undefined,
    };
    onSubmit(normalizedData);
    form.reset();
    setOpen(false);
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button data-testid="button-add-strain">
            <Plus className="w-4 h-4 mr-2" />
            Add Strain
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" data-testid="dialog-add-strain">
        <DialogHeader>
          <DialogTitle>Add New Strain</DialogTitle>
          <DialogDescription>
            Enter the details for a new cannabis strain to track your experience.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strain Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Blue Dream"
                      data-testid="input-strain-name"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-strain-type-form">
                        <SelectValue placeholder="Select strain type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Indica">Indica</SelectItem>
                      <SelectItem value="Sativa">Sativa</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thcContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>THC Content (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="e.g., 18"
                      min="0"
                      max="50"
                      step="0.1"
                      data-testid="input-thc-content"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Sweet berry aroma with calming effects..."
                      className="min-h-[80px]"
                      data-testid="textarea-strain-description"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="flex-1"
                disabled={isLoading}
                data-testid="button-cancel-add-strain"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isLoading}
                data-testid="button-submit-add-strain"
              >
                {isLoading ? "Adding..." : "Add Strain"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}