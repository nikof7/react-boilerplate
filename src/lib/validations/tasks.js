import { z } from 'zod';

export const taskSchema = z.object({
    title: z
        .string()
        .min(1, 'El título es requerido')
        .max(100, 'El título no puede exceder 100 caracteres'),
    description: z
        .string()
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .optional()
        .or(z.literal('')),
    status: z.enum(['pending', 'in_progress', 'completed'], {
        errorMap: () => ({ message: 'Selecciona un estado válido' }),
    }),
    due_date: z
        .string()
        .optional()
        .or(z.literal(''))
        .transform((val) => (val === '' ? null : val)),
});

export const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completada' },
];
