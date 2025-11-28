import { Link } from "wouter";
import { Heart, Mail, Phone, MapPin, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border" data-testid="footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" data-testid="link-footer-logo">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-semibold text-lg leading-tight">
                  Espoir Solidaire
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  Ensemble pour demain
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Association loi 1901 depuis 2014, nous oeuvrons chaque jour pour apporter 
              aide et soutien aux personnes dans le besoin. Votre participation fait la difference.
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Vos donnees sont protegees et securisees</span>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-accueil"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  href="/a-propos" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-about"
                >
                  Notre Mission
                </Link>
              </li>
              <li>
                <Link 
                  href="/enquete" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-footer-survey"
                >
                  Participer a l'enquete
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>contact@espoir-solidaire.org</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>01 23 45 67 89</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>12 Rue de l'Espoir<br />75001 Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            2024 Association Espoir Solidaire. Tous droits reserves.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">
              Mentions legales
            </span>
            <span className="hover:text-foreground cursor-pointer transition-colors">
              Politique de confidentialite
            </span>
            <span className="hover:text-foreground cursor-pointer transition-colors">
              Conforme RGPD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
