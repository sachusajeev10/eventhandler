"use client"
import { useState } from "react"
import { submitRegistration } from "@/actions/registrations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ImageUpload"
import { toast } from "sonner"
import { RegistrationField } from "@/lib/schema"
import { motion } from "framer-motion"

export function RegistrationForm({ event }: { event: any }) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [step, setStep] = useState(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    for (const field of event.registrationFields) {
      if (field.required && !formData[field.id]) {
        toast.error(`Field "${field.label}" is required`)
        return
      }
    }
    
    if (event.paymentRequired && step === 1) {
      setStep(2)
      return
    }
    
    if (event.paymentRequired && !paymentScreenshotUrl) {
      toast.error("Payment screenshot is required")
      return
    }

    setIsSubmitting(true)
    try {
      await submitRegistration(event.id, event.slug, event.name, name, email, phone, formData, paymentScreenshotUrl)
      setIsSuccess(true)
      toast.success("Registration successful!")
    } catch (error) {
      toast.error("Failed to submit registration")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 text-center space-y-6"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="mx-auto w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </motion.div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">Registration Successful!</h2>
        <p className="text-muted-foreground text-lg">Thank you for registering for {event.name}.</p>
        
        {event.whatsappLink && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="pt-6 border-t border-border mt-8 flex flex-col items-center"
          >
            <p className="mb-4 text-muted-foreground font-medium">Join the official WhatsApp group for updates!</p>
            <motion.a 
              href={event.whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: ["0px 0px 0px 0px rgba(37,211,102,0.4)", "0px 0px 0px 15px rgba(37,211,102,0)"] 
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center gap-3 px-8 py-4 text-xl font-bold rounded-full shadow-lg"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span>Join WhatsApp Group</span>
            </motion.a>
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="base-name" className="text-base font-semibold">Full Name <span className="text-destructive">*</span></Label>
            <Input
              id="base-name"
              type="text"
              required
              placeholder="John Doe"
              className="w-full h-16 text-lg px-5 rounded-xl bg-muted/20 focus:bg-transparent transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="base-email" className="text-base font-semibold">Email Address <span className="text-destructive">*</span></Label>
            <Input
              id="base-email"
              type="email"
              required
              placeholder="john@example.com"
              className="w-full h-16 text-lg px-5 rounded-xl bg-muted/20 focus:bg-transparent transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="base-phone" className="text-base font-semibold">Phone Number <span className="text-destructive">*</span></Label>
            <Input
              id="base-phone"
              type="tel"
              required
              placeholder="+1 234 567 8900"
              className="w-full h-16 text-lg px-5 rounded-xl bg-muted/20 focus:bg-transparent transition-colors"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          {event.registrationFields?.map((field: RegistrationField) => (
            <div key={field.id} className="space-y-3">
              <Label htmlFor={field.id} className="text-base font-semibold">
                {field.label} {field.required && <span className="text-destructive">*</span>}
              </Label>
              
              {field.type === "text" || field.type === "email" || field.type === "phone" || field.type === "number" || field.type === "url" || field.type === "date" ? (
                <Input
                  id={field.id}
                  type={field.type}
                  required={field.required}
                  className="w-full h-16 text-lg px-5 rounded-xl bg-muted/20 focus:bg-transparent transition-colors"
                  value={formData[field.id] || ""}
                  onChange={(e) => updateField(field.id, e.target.value)}
                />
              ) : field.type === "textarea" ? (
                <Textarea
                  id={field.id}
                  required={field.required}
                  className="w-full min-h-[140px] text-lg p-5 rounded-xl bg-muted/20 focus:bg-transparent transition-colors"
                  value={formData[field.id] || ""}
                  onChange={(e) => updateField(field.id, e.target.value)}
                />
              ) : field.type === "select" ? (
                <Select required={field.required} value={formData[field.id] || ""} onValueChange={(val) => updateField(field.id, val)}>
                  <SelectTrigger className="w-full h-16 text-lg px-5 rounded-xl bg-muted/20">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "radio" ? (
                <RadioGroup className="space-y-3 mt-3" required={field.required} value={formData[field.id] || ""} onValueChange={(val) => updateField(field.id, val)}>
                  {field.options?.map((opt) => (
                    <div key={opt} className="flex items-center space-x-4 bg-muted/20 p-4 rounded-xl border border-transparent hover:border-border transition-colors">
                      <RadioGroupItem value={opt} id={`${field.id}-${opt}`} className="w-6 h-6" />
                      <Label htmlFor={`${field.id}-${opt}`} className="text-lg cursor-pointer flex-1">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : field.type === "checkbox" ? (
                <div className="space-y-3 mt-3">
                  {field.options?.map((opt) => (
                    <div key={opt} className="flex items-center space-x-4 bg-muted/20 p-4 rounded-xl border border-transparent hover:border-border transition-colors">
                      <Checkbox
                        id={`${field.id}-${opt}`}
                        className="w-6 h-6 rounded-md"
                        checked={(formData[field.id] || []).includes(opt)}
                        onCheckedChange={(checked) => {
                          const current = formData[field.id] || []
                          if (checked) {
                            updateField(field.id, [...current, opt])
                          } else {
                            updateField(field.id, current.filter((x: string) => x !== opt))
                          }
                        }}
                      />
                      <Label htmlFor={`${field.id}-${opt}`} className="text-lg cursor-pointer flex-1">{opt}</Label>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </motion.div>
      )}

      {step === 2 && event.paymentRequired && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="flex items-center mb-2">
            <Button type="button" variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground -ml-4 hover:bg-transparent hover:text-foreground">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Details
            </Button>
          </div>
          
          <div className="space-y-4 p-6 border rounded-2xl bg-muted/20">
            <h3 className="font-semibold text-2xl">Payment Details</h3>
            <p className="text-lg text-muted-foreground">{event.paymentInstructions}</p>
            <div className="text-2xl font-bold bg-primary/10 text-primary p-4 rounded-xl inline-block mt-2">Amount: ₹{event.paymentAmount}</div>
            
            {event.paymentUpiId && (
              <div className="text-lg font-medium mt-4">UPI ID: {event.paymentUpiId}</div>
            )}
            
            {event.paymentQrUrl && (
              <div className="mt-6 flex justify-center bg-white p-6 rounded-2xl shadow-sm border max-w-sm mx-auto">
                <img src={event.paymentQrUrl} alt="Payment QR" className="w-full h-auto rounded-xl object-contain" />
              </div>
            )}
            
            <div className="space-y-3 mt-8 pt-6 border-t">
              <Label htmlFor="paymentScreenshotUrl" className="text-lg font-semibold">Upload Payment Screenshot <span className="text-destructive">*</span></Label>
              <ImageUpload 
                value={paymentScreenshotUrl} 
                onChange={setPaymentScreenshotUrl} 
                disabled={isSubmitting} 
              />
            </div>
          </div>
        </motion.div>
      )}

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
        <Button type="submit" className="w-full h-14 text-lg font-semibold relative overflow-hidden group rounded-xl mt-4" disabled={isSubmitting}>
          <span className="relative z-10">
            {isSubmitting ? "Submitting..." : (event.paymentRequired && step === 1) ? "Next: Payment Details" : "Complete Registration"}
          </span>
          <div className="absolute inset-0 bg-primary-foreground/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </Button>
      </motion.div>
    </form>
  )
}
