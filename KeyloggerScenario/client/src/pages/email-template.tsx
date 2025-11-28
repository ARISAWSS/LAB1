import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Heart, 
  Copy, 
  CheckCircle,
  Mail,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function EmailTemplate() {
  const [siteUrl, setSiteUrl] = useState("http://192.168.1.100:5000");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const emailHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Espoir Solidaire - Votre avis compte</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; background: linear-gradient(135deg, #2d9a6e 0%, #238b5e 100%); border-radius: 12px 12px 0 0;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <div style="width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                      <span style="font-size: 28px;">&#10084;</span>
                    </div>
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0;">Espoir Solidaire</h1>
                    <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 8px 0 0 0;">Ensemble pour demain</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1a2e1a; font-size: 22px; font-weight: 600; margin: 0 0 16px 0;">
                Votre avis compte enormement pour nous !
              </h2>
              
              <p style="color: #4a5a4a; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Cher(e) ami(e),
              </p>
              
              <p style="color: #4a5a4a; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Dans le cadre de l'amelioration continue de nos services, nous souhaitons recueillir votre avis. Votre participation a notre enquete de satisfaction nous aidera a mieux repondre aux besoins de notre communaute.
              </p>
              
              <div style="background-color: #f0f7f4; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <p style="color: #2d9a6e; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">
                  &#128337; Duree estimee : 2 minutes
                </p>
                <p style="color: #4a5a4a; font-size: 14px; margin: 0;">
                  Vos reponses sont 100% confidentielles et securisees.
                </p>
              </div>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 24px 0;">
                    <a href="${siteUrl}/enquete" style="display: inline-block; background-color: #2d9a6e; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(45, 154, 110, 0.3);">
                      Participer a l'enquete &#8594;
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #4a5a4a; font-size: 16px; line-height: 1.6; margin: 24px 0;">
                Votre contribution nous permet d'ameliorer nos programmes d'aide et de mieux accompagner les personnes dans le besoin.
              </p>
              
              <p style="color: #4a5a4a; font-size: 16px; line-height: 1.6; margin: 0;">
                Merci pour votre soutien precieux,<br>
                <strong>L'equipe Espoir Solidaire</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f5f7f5; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7e5;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center;">
                    <p style="color: #6a7a6a; font-size: 12px; margin: 0 0 8px 0;">
                      &#128274; Vos donnees sont protegees et securisees | Conforme RGPD
                    </p>
                    <p style="color: #8a9a8a; font-size: 11px; margin: 0;">
                      Association Espoir Solidaire - 12 Rue de l'Espoir, 75001 Paris<br>
                      <a href="#" style="color: #2d9a6e; text-decoration: none;">Se desabonner</a> | 
                      <a href="#" style="color: #2d9a6e; text-decoration: none;">Politique de confidentialite</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailHtml);
    setCopied(true);
    toast({
      title: "Code HTML copie !",
      description: "Le template email a ete copie dans le presse-papier.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 md:py-12" data-testid="page-email-template">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Mail className="w-4 h-4" />
            <span>Template Email</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
            Email de phishing pret a l'emploi
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Copiez ce template HTML et envoyez-le a la victime pour l'inciter a cliquer sur le lien vers votre formulaire.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteUrl">URL de votre site (VM Attaquant)</Label>
                  <Input
                    id="siteUrl"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    placeholder="http://192.168.1.100:5000"
                    className="mt-1"
                    data-testid="input-site-url"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Remplacez par l'IP de votre VM attaquant
                  </p>
                </div>
                
                <Button 
                  onClick={copyToClipboard} 
                  className="w-full"
                  data-testid="button-copy-html"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Code copie !
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copier le code HTML
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-primary" />
                  Instructions d'utilisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">1</span>
                    <p>Modifiez l'URL ci-dessus avec l'adresse IP de votre VM attaquant</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">2</span>
                    <p>Cliquez sur "Copier le code HTML" pour copier le template</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">3</span>
                    <p>Collez le code dans un fichier .html ou utilisez un service d'envoi d'email HTML</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">4</span>
                    <p>Envoyez l'email a la VM victime (Kali)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">5</span>
                    <p>La victime clique sur le lien et remplit le formulaire</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">6</span>
                    <p>Le keylogger capture toutes les frappes !</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  Apercu de l'email
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    srcDoc={emailHtml}
                    title="Email Preview"
                    className="w-full h-[600px] border-0"
                    data-testid="email-preview"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-8 bg-accent/10 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <span className="text-lg">&#9888;</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Avertissement - Usage educatif uniquement</h3>
                <p className="text-sm text-muted-foreground">
                  Ce template est fourni exclusivement a des fins de demonstration et de formation en cybersecurite. 
                  L'utilisation de techniques de phishing contre des personnes sans leur consentement est illegale 
                  et passible de poursuites penales. Utilisez ce contenu uniquement dans un environnement de test controle.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
