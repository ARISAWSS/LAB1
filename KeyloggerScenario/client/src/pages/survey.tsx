import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Heart, 
  Shield, 
  Lock, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  User,
  MapPin,
  Briefcase,
  KeyRound,
  Loader2
} from "lucide-react";
import { surveyFormSchema, type SurveyFormData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const TOTAL_STEPS = 4;

const incomeOptions = [
  { value: "moins-15k", label: "Moins de 15 000 EUR" },
  { value: "15k-25k", label: "15 000 - 25 000 EUR" },
  { value: "25k-35k", label: "25 000 - 35 000 EUR" },
  { value: "35k-50k", label: "35 000 - 50 000 EUR" },
  { value: "50k-75k", label: "50 000 - 75 000 EUR" },
  { value: "plus-75k", label: "Plus de 75 000 EUR" },
  { value: "prefere-ne-pas-dire", label: "Je prefere ne pas repondre" },
];

export default function Survey() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();

  const form = useForm<SurveyFormData>({
    resolver: zodResolver(surveyFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      birthDate: "",
      address: "",
      city: "",
      postalCode: "",
      profession: "",
      company: "",
      income: "",
      password: "",
      comments: "",
      acceptTerms: false,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: SurveyFormData) => {
      const response = await apiRequest("POST", "/api/survey", data);
      return response;
    },
    onSuccess: () => {
      setLocation("/merci");
    },
  });

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof SurveyFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["fullName", "email", "phone"];
        break;
      case 2:
        fieldsToValidate = ["birthDate", "address", "city", "postalCode"];
        break;
      case 3:
        fieldsToValidate = ["profession", "income"];
        break;
      case 4:
        fieldsToValidate = ["password", "acceptTerms"];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: SurveyFormData) => {
    submitMutation.mutate(data);
  };

  const stepIcons = [User, MapPin, Briefcase, KeyRound];
  const stepTitles = [
    "Informations de base",
    "Profil personnel",
    "Informations professionnelles",
    "Securite & Commentaires"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 md:py-12" data-testid="page-survey">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            <span>Enquete de satisfaction</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
            Participez a notre enquete
          </h1>
          <p className="text-muted-foreground">
            Aidez-nous a ameliorer nos services en repondant a quelques questions.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Etape {currentStep} sur {TOTAL_STEPS}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-bar" />
          
          <div className="flex justify-between mt-4">
            {stepTitles.map((title, index) => {
              const StepIcon = stepIcons[index];
              const isActive = index + 1 === currentStep;
              const isCompleted = index + 1 < currentStep;
              
              return (
                <div 
                  key={index}
                  className={`flex flex-col items-center gap-1 ${
                    isActive ? "opacity-100" : isCompleted ? "opacity-70" : "opacity-40"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? "bg-primary text-primary-foreground" 
                      : isActive 
                        ? "bg-primary/20 text-primary border-2 border-primary" 
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-xs hidden sm:block">{title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  {(() => {
                    const StepIcon = stepIcons[currentStep - 1];
                    return <StepIcon className="w-5 h-5 text-primary" />;
                  })()}
                  {stepTitles[currentStep - 1]}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Commencez par nous donner vos coordonnees."}
                  {currentStep === 2 && "Parlez-nous un peu de vous."}
                  {currentStep === 3 && "Quelques informations sur votre situation professionnelle."}
                  {currentStep === 4 && "Creez votre espace securise et partagez vos commentaires."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentStep === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Jean Dupont" 
                              {...field} 
                              data-testid="input-fullname"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse email <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="jean.dupont@email.com" 
                              {...field}
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telephone <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              type="tel" 
                              placeholder="06 12 34 56 78" 
                              {...field}
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de naissance <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field}
                              data-testid="input-birthdate"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse complete <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="12 Rue de la Paix, Appartement 3B" 
                              className="resize-none"
                              rows={2}
                              {...field}
                              data-testid="input-address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Paris" 
                                {...field}
                                data-testid="input-city"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code postal <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="75001" 
                                {...field}
                                data-testid="input-postalcode"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <FormField
                      control={form.control}
                      name="profession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profession <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ingenieur, Enseignant, Medecin..." 
                              {...field}
                              data-testid="input-profession"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entreprise / Employeur</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nom de votre entreprise (optionnel)" 
                              {...field}
                              data-testid="input-company"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="income"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Revenus annuels <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-income">
                                <SelectValue placeholder="Selectionnez une tranche" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {incomeOptions.map((option) => (
                                <SelectItem 
                                  key={option.value} 
                                  value={option.value}
                                  data-testid={`option-income-${option.value}`}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-primary" />
                            Creez un mot de passe pour votre espace donateur <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Minimum 8 caracteres" 
                              {...field}
                              data-testid="input-password"
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground mt-1">
                            Ce mot de passe vous permettra d'acceder a votre espace personnel securise.
                          </p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Commentaires et suggestions</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Partagez vos idees, suggestions ou experiences avec notre association..." 
                              className="resize-none"
                              rows={4}
                              {...field}
                              data-testid="input-comments"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-terms"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              J'accepte les conditions d'utilisation et la politique de confidentialite <span className="text-destructive">*</span>
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              En cochant cette case, vous acceptez que vos donnees soient traitees conformement a notre politique de confidentialite.
                            </p>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between gap-4">
              {currentStep > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePrevious}
                  data-testid="button-previous"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Precedent
                </Button>
              ) : (
                <div />
              )}
              
              {currentStep < TOTAL_STEPS ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  data-testid="button-next"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={submitMutation.isPending}
                  data-testid="button-submit"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer ma reponse
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>Donnees securisees</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <span>Conforme RGPD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
