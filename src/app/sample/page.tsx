"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSampleMutationOptions, listSampleQueryOptions } from "../api/sample/query";
import { SampleTable } from "@/app/sample/project-table";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import router from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateSampleRequest, createSampleRequestSchema } from "../api/sample/type";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function SamplePage() {
  return (
    <div className="flex flex-col gap-4 py-12 px-4">
      <TableSection />
      <FormSection />
      <SataicImageSection />
      <FileUploadSection />
      <RabcSection />
    </div>
  );
}

function TableSection() {
  const { data, isLoading, isError } = useQuery(listSampleQueryOptions);

  return (
    <section className="flex flex-col flex-1 gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Table Sample</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center flex-1">
          <p>Loading...</p>
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center flex-1">
          <p className="text-red-500">Error loading projects</p>
        </div>
      ) : (
        <SampleTable data={data?.data || []} />
      )}
    </section>
  );
}

function FormSection() {
  const queryClient = useQueryClient();
  const form = useForm<CreateSampleRequest>({
    resolver: zodResolver(createSampleRequestSchema),
    defaultValues: {
      name: "",
    },
  });

  const createSampleMutation = useMutation(createSampleMutationOptions);

  useEffect(() => {
    if (createSampleMutation.isSuccess) {
      toast.success("Sample created successfully");
      queryClient.invalidateQueries({ queryKey: ["sample-list"] });
    }
  }, [createSampleMutation.isSuccess, queryClient]);

  const onSubmit = (data: CreateSampleRequest) => {
    createSampleMutation.mutate(data, {
      onError: (error) => {
        toast.error(error.message || "Failed to create sample");
      },
    });
  };
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Form Sample</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter project name"
                  {...field}
                />
                <FormDescription>The name of your project.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <div className="flex gap-2">
            <Button type="submit" disabled={createSampleMutation.isPending}>
              {createSampleMutation.isPending ? "Creating..." : "Submit"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/sample")}
              disabled={createSampleMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}

function SataicImageSection() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Static Image Sample</h1>
      <Image src="/images/sample.jpg" alt="sample" width={100} height={100} />
    </section>
  );
}

function FileUploadSection() {
  const client = createClient();
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const { error } = await client.storage
      .from('test')
      .upload('/test.jpg', file, {
        cacheControl: '3600',
        upsert: false
      })
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Upload successful");
    }
  }


  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">File Upload Sample</h1>
      <input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </section>
  );
}

function RabcSection() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Rabc Sample</h1>
    </section>
  );
}