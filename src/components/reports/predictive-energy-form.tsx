"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Calendar as CalendarIcon, Lightbulb, Loader2, Wand2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { predictEnergyUsage } from "@/app/actions";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";

const formSchema = z.object({
  historicalData: z.string().min(20, {
    message: "Historical data must be at least 20 characters.",
  }),
  currentDate: z.date({
    required_error: "A date is required.",
  }),
  preferences: z.string().optional(),
});

type PredictionResult = {
  prediction: string;
  suggestions: string;
} | null;

const defaultHistoricalData = `2023-10-01: 2200Wh
2023-10-02: 2500Wh
2023-10-03: 2300Wh
2023-10-04: 2600Wh
2023-10-05: 2450Wh`;

export function PredictiveEnergyForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      historicalData: defaultHistoricalData,
      currentDate: new Date(),
      preferences: "Prioritize comfort in the evenings. Minimize daytime cost.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const formattedValues = {
        ...values,
        currentDate: format(values.currentDate, "yyyy-MM-dd"),
      };
      const predictionResult = await predictEnergyUsage(formattedValues);
      setResult(predictionResult);
      toast({
        title: "Prediction Complete",
        description: "AI has generated a new energy forecast.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: "Could not generate prediction. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Predictive Energy Use Tool</CardTitle>
          <CardDescription>
            Use historical data to forecast future energy consumption and get suggestions.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="historicalData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Consumption Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 2023-10-01: 2500Wh"
                        className="min-h-32 font-code"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide past energy data, one entry per line.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="currentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Prediction Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date("1990-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Preferences (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Maintain 22°C between 6-9 PM" {...field} />
                    </FormControl>
                    <FormDescription>
                      Tell the AI your comfort preferences.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Wand2 className="mr-2" />
                )}
                <span>{loading ? "Generating..." : "Generate Forecast"}</span>
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {result && (
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>AI Energy Forecast</CardTitle>
            <CardDescription>
              Based on the data you provided, here is the prediction.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Consumption Prediction</h3>
              <p className="text-muted-foreground bg-secondary/50 p-4 rounded-lg">
                {result.prediction}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Lightbulb className="text-primary"/>
                Saving Suggestions
              </h3>
              <p className="text-muted-foreground bg-secondary/50 p-4 rounded-lg">
                {result.suggestions}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      {!result && !loading && (
         <div className="border-2 border-dashed rounded-lg flex items-center justify-center text-center p-8">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Wand2 className="h-12 w-12"/>
                <h3 className="text-lg font-semibold">Waiting for Prediction</h3>
                <p className="text-sm">Fill out the form and run the forecast to see AI-powered results here.</p>
            </div>
         </div>
      )}

    </div>
  );
}
