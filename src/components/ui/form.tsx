"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { cn } from "@/lib/utils";

export function Form<TFieldValues extends FieldValues>({
  children,
  ...methods
}: React.PropsWithChildren<ReturnType<typeof import("react-hook-form").useForm<TFieldValues>>>) {
  return <FormProvider {...methods}>{children}</FormProvider>;
}

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  name,
  ...props
}: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller name={name} {...props} />
    </FormFieldContext.Provider>
  );
}

export function useFormField() {
  const ctx = React.useContext(FormFieldContext);
  const { formState } = useFormContext();
  if (!ctx) throw new Error("useFormField must be used within FormField");
  const error = (formState.errors as any)?.[ctx.name];
  return { name: ctx.name, error };
}

export function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function FormLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-semibold text-pure-white", className)}
      {...props}
    />
  );
}

export function FormControl({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}

export function FormDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-[10px] leading-tight text-ash-gray", className)}
      {...props}
    />
  );
}

export function FormMessage({ className }: { className?: string }) {
  const { error } = useFormField();
  if (!error?.message) return null;
  return (
    <p className={cn("text-[10px] leading-tight text-sunset-orange", className)}>
      {String(error.message)}
    </p>
  );
}

