import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Users, 
  Target, 
  Award,
  ArrowRight,
  Calendar,
  MapPin,
  Briefcase
} from "lucide-react";

export default function About() {
  const team = [
    {
      name: "Sophie Martin",
      role: "Presidente",
      description: "Fondatrice d'Espoir Solidaire depuis 2014, Sophie consacre sa vie a l'action humanitaire.",
    },
    {
      name: "Jean-Pierre Dubois",
      role: "Directeur des operations",
      description: "Fort de 15 ans d'experience dans le secteur associatif, Jean-Pierre coordonne toutes nos actions terrain.",
    },
    {
      name: "Marie Lambert",
      role: "Responsable partenariats",
      description: "Marie tisse les liens avec nos partenaires institutionnels et entreprises pour maximiser notre impact.",
    },
    {
      name: "Ahmed Benali",
      role: "Coordinateur benevoles",
      description: "Ahmed anime notre reseau de plus de 200 benevoles actifs en France et a l'international.",
    },
  ];

  const timeline = [
    {
      year: "2014",
      title: "Creation de l'association",
      description: "Fondation d'Espoir Solidaire par Sophie Martin et un groupe de benevoles passionnes.",
    },
    {
      year: "2016",
      title: "Premiere mission internationale",
      description: "Lancement de notre premier programme d'aide alimentaire en Afrique de l'Ouest.",
    },
    {
      year: "2019",
      title: "Reconnaissance d'utilite publique",
      description: "L'Etat reconnait officiellement notre engagement et notre impact social.",
    },
    {
      year: "2024",
      title: "50 000 beneficiaires",
      description: "Nous franchissons le cap symbolique de 50 000 personnes aidees grace a vos dons.",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Solidarite",
      description: "Chaque action est guidee par notre volonte d'aider les plus vulnerables.",
    },
    {
      icon: Users,
      title: "Proximite",
      description: "Nous sommes presents sur le terrain, au plus pres des besoins reels.",
    },
    {
      icon: Target,
      title: "Efficacite",
      description: "100% de vos dons sont utilises pour nos programmes d'aide directe.",
    },
    {
      icon: Award,
      title: "Transparence",
      description: "Nos comptes sont certifies et publies chaque annee.",
    },
  ];

  return (
    <div className="flex flex-col" data-testid="page-about">
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              <span>Notre histoire</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
              10 ans d'engagement 
              <span className="text-primary"> au service</span> des autres
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Depuis 2014, Espoir Solidaire oeuvre sans relache pour apporter aide et 
              reconfort a ceux qui en ont le plus besoin. Notre mission : creer un monde 
              plus juste et solidaire, une action a la fois.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Nos valeurs fondatrices
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ces principes guident chacune de nos actions et decisions au quotidien.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="text-center hover-elevate"
                data-testid={`value-card-${index}`}
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif font-semibold text-lg mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
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
              Notre parcours
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les moments cles qui ont forge notre association.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
              
              {timeline.map((item, index) => (
                <div 
                  key={index}
                  className={`relative flex items-start gap-6 mb-8 last:mb-0 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  data-testid={`timeline-item-${index}`}
                >
                  <div className="hidden md:block md:w-1/2" />
                  
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center -translate-x-1/2 z-10">
                    <Calendar className="w-4 h-4 text-primary-foreground" />
                  </div>
                  
                  <Card className={`ml-12 md:ml-0 md:w-1/2 hover-elevate ${
                    index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                  }`}>
                    <CardContent className="p-4">
                      <div className="inline-block px-2 py-1 rounded bg-primary/10 text-primary text-xs font-semibold mb-2">
                        {item.year}
                      </div>
                      <h3 className="font-serif font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Notre equipe
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des femmes et des hommes engages au service de notre mission.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card 
                key={index}
                className="text-center hover-elevate"
                data-testid={`team-card-${index}`}
              >
                <CardContent className="p-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-serif font-bold text-primary">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <div className="flex items-center justify-center gap-1 text-xs text-primary mb-3">
                    <Briefcase className="w-3 h-3" />
                    <span>{member.role}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Rejoignez notre communaute
              </h2>
              <p className="opacity-90 mb-8 max-w-2xl mx-auto">
                Participez a notre enquete de satisfaction et aidez-nous a mieux comprendre 
                vos attentes. Votre avis est precieux pour ameliorer nos actions.
              </p>
              <Link href="/enquete">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                  data-testid="button-participate-about"
                >
                  Participer a l'enquete
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
