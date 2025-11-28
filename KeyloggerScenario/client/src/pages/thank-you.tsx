import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  CheckCircle, 
  Home,
  Share2,
  Mail,
  ArrowRight
} from "lucide-react";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24 flex items-center" data-testid="page-thankyou">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Merci pour votre 
            <span className="text-primary"> participation !</span>
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Votre reponse a ete enregistree avec succes. Votre contribution nous aide 
            a ameliorer nos services et a mieux repondre aux besoins de notre communaute.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="font-serif text-xl font-semibold">
                Votre avis compte
              </h2>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Grace a vos reponses, nous pouvons :
            </p>
            
            <ul className="text-left space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Ameliorer nos programmes d'aide aux personnes dans le besoin</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Mieux comprendre les attentes de notre communaute</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Developper de nouveaux services adaptes a vos besoins</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Un email de confirmation a ete envoye a votre adresse.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>Verifiez votre boite de reception</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Partagez notre enquete
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Aidez-nous a toucher plus de personnes en partageant cette enquete avec vos proches.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" size="sm" data-testid="button-share-facebook">
                Facebook
              </Button>
              <Button variant="outline" size="sm" data-testid="button-share-twitter">
                Twitter
              </Button>
              <Button variant="outline" size="sm" data-testid="button-share-linkedin">
                LinkedIn
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" data-testid="button-go-home">
              <Home className="w-4 h-4 mr-2" />
              Retour a l'accueil
            </Button>
          </Link>
          <Link href="/a-propos">
            <Button data-testid="button-learn-more-thankyou">
              Decouvrir notre mission
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-primary" />
            <span className="font-serif font-semibold">Espoir Solidaire</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Ensemble pour demain
          </p>
        </div>
      </div>
    </div>
  );
}
