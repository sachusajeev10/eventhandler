"use client"
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { eventSchema, EventFormData } from "@/lib/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ImageUpload"
import { Plus, Trash2, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface EventFormProps {
  initialData?: EventFormData
  onSubmit: (data: EventFormData) => Promise<void>
  isLoading?: boolean
}

export function EventForm({ initialData, onSubmit, isLoading }: EventFormProps) {
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      posterUrl: "",
      venue: "",
      date: "",
      time: "",
      registrationDeadline: "",
      maxParticipants: 100,
      isPublished: false,
      paymentRequired: false,
      winnerPrize: "",
      registrationFields: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "registrationFields",
  })

  const paymentRequired = form.watch("paymentRequired")

  const handleSubmit = async (data: EventFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error(error)
      toast.error("An error occurred")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Tech Conference 2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="tech-conf-2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Event details..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="winnerPrize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Winner Prize (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g. 1st Prize: $500, 2nd Prize: $200" className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormDescription>Display the prize pool for the event winners.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="posterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Poster</FormLabel>
                  <FormControl>
                    <ImageUpload value={field.value} onChange={field.onChange} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Logistics & Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue</FormLabel>
                    <FormControl>
                      <Input placeholder="Main Auditorium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Participants</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
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
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString())}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationDeadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Registration Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
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
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString())}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsappLink"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>WhatsApp Group Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://chat.whatsapp.com/..." {...field} />
                    </FormControl>
                    <FormDescription>
                      If provided, users will see a button to join this WhatsApp group after successful registration.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Payment Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="paymentRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Require Payment
                    </FormLabel>
                    <FormDescription>
                      Enable if participants need to pay to register.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {paymentRequired && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-muted/20">
                <FormField
                  control={form.control}
                  name="paymentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentUpiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UPI ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="example@upi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentInstructions"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Payment Instructions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please pay and upload transaction ID..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentQrUrl"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Payment QR Code (Optional)</FormLabel>
                      <FormControl>
                        <ImageUpload value={field.value || ""} onChange={field.onChange} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Custom Registration Fields</CardTitle>
              <CardDescription>Add custom fields to the registration form.</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ id: crypto.randomUUID(), type: "text", label: "", required: true })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-4 p-4 border rounded-md relative bg-background/50">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-10">
                  <FormField
                    control={form.control}
                    name={`registrationFields.${index}.label`}
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Field Label</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. T-Shirt Size" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`registrationFields.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="select">Dropdown Select</SelectItem>
                            <SelectItem value="radio">Radio Buttons</SelectItem>
                            <SelectItem value="checkbox">Checkboxes (Multiple)</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`registrationFields.${index}.required`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-8">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">Required</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                {["select", "radio", "checkbox"].includes(form.watch(`registrationFields.${index}.type`)) && (
                  <FormField
                    control={form.control}
                    name={`registrationFields.${index}.options`}
                    render={({ field }) => {
                      const currentOptions = field.value || [""]
                      return (
                        <FormItem>
                          <FormLabel>Options</FormLabel>
                          <div className="space-y-3">
                            {currentOptions.map((opt: string, optIndex: number) => (
                              <div key={optIndex} className="flex gap-2 items-center">
                                <FormControl>
                                  <Input
                                    value={opt}
                                    placeholder={`Option ${optIndex + 1}`}
                                    onChange={(e) => {
                                      const newOpts = [...currentOptions];
                                      newOpts[optIndex] = e.target.value;
                                      field.onChange(newOpts);
                                    }}
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive shrink-0 hover:bg-destructive/10"
                                  onClick={() => {
                                    const newOpts = currentOptions.filter((_, i) => i !== optIndex);
                                    field.onChange(newOpts.length ? newOpts : [""]);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full border-dashed"
                              onClick={() => field.onChange([...currentOptions, ""])}
                            >
                              <Plus className="w-4 h-4 mr-2" /> Add Another Option
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                )}
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No custom fields added yet.</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center bg-card p-4 rounded-xl border shadow-sm">
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Publish Event</FormLabel>
                  <FormDescription>Make this event visible to the public.</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Event"}
          </Button>
        </div>

      </form>
    </Form>
  )
}
