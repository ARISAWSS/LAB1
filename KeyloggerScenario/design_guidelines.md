# Design Guidelines: Association Espoir Solidaire

## Design Approach

**Reference-Based Approach**: Drawing inspiration from established charity websites (UNICEF, Red Cross, WWF) combined with modern form-focused platforms (Typeform, Google Forms). The design must convey **trustworthiness, warmth, and professionalism** to encourage voluntary information sharing.

## Core Design Principles

1. **Trust Through Design**: Professional appearance with humanitarian warmth
2. **Progressive Disclosure**: Multi-step form to reduce cognitive load
3. **Reassurance**: Constant visual cues of security and legitimacy
4. **Emotional Connection**: Imagery and messaging that resonates

---

## Typography System

**Font Families** (via Google Fonts CDN):
- **Primary (Body/Forms)**: Inter (400, 500, 600)
- **Headings**: Poppins (600, 700)
- **Accent/Stats**: Poppins (500 for numbers)

**Type Scale**:
- Hero Heading: text-5xl md:text-6xl, font-bold
- Section Headings: text-3xl md:text-4xl, font-semibold
- Form Labels: text-sm font-medium
- Body Text: text-base leading-relaxed
- Small Print/Legal: text-xs

---

## Layout System

**Spacing Primitives**: Tailwind units of **4, 6, 8, 12, 16** (as in p-4, gap-6, space-y-8, py-12, mt-16)

**Container Strategy**:
- Full-width sections with inner max-w-6xl
- Form containers: max-w-2xl for optimal reading/input
- Text content: max-w-3xl for comfortable reading

**Vertical Rhythm**:
- Section padding: py-12 md:py-16
- Component spacing: space-y-8
- Form field spacing: space-y-6

---

## Component Library

### Navigation
- Sticky header with association logo (left) and "Don" CTA button (right)
- Transparent background with backdrop-blur on scroll
- Navigation links: Accueil, Notre Mission, Témoignages, Contact

### Hero Section (Homepage)
- **Layout**: Split layout (60/40) - Text left, image right on desktop
- **Background**: Soft gradient overlay (white to light blue/green tint)
- **Content**: 
  - Large headline emphasizing impact
  - Subheadline with mission statement
  - Two CTAs: Primary "Participer à l'enquête", Secondary "En savoir plus"
- **Image**: Warm humanitarian imagery (helping hands, community, children)

### Trust Indicators Bar
- Horizontal badges row below hero
- Icons with short text: "10 ans d'action", "50,000+ bénéficiaires", "Certifié", "Données sécurisées"
- Use Heroicons for consistency

### Mission Section
- 3-column grid (lg:grid-cols-3) with icon-title-description cards
- Rounded cards with subtle shadows
- Icons: Heart, Users, Globe from Heroicons

### Survey Form Page

**Layout Structure**:
- Centered form container (max-w-2xl)
- Progress indicator at top (Step 1/4, 2/4, etc.)
- Section groupings with subtle dividers

**Form Sections** (Multi-step):

**Step 1: Informations de base**
- Nom complet (text input)
- Email (email input)
- Téléphone (tel input)

**Step 2: Profil personnel**
- Date de naissance (date input)
- Adresse complète (textarea)
- Ville, Code postal (2-column grid)

**Step 3: Informations professionnelles**
- Profession (text input)
- Entreprise (text input)
- Revenus annuels (select dropdown)

**Step 4: Sécurité & Commentaires**
- "Créez un mot de passe pour votre espace donateur" (password input with strength indicator)
- Zone commentaires (textarea, 4 rows)
- Checkbox: "J'accepte les conditions d'utilisation" (required)

**Form Styling**:
- Inputs: Full width, rounded borders, focus states with association color
- Labels above inputs, required asterisk in subtle color
- Floating validation messages
- Large, prominent "Continuer" / "Soumettre" buttons

### Security Reassurance Elements
- Badge "Vos données sont protégées" with shield icon
- SSL padlock icon near sensitive fields
- "Conforme RGPD" mention in footer

### About Page
- Team section: 2x2 grid of team member cards (photo, name, role)
- Testimonials: Single column, alternating photo positions
- Impact stats: Large numbers in 4-column grid

### Thank You Page
- Centered content with success icon
- Personalized thank you message
- "Next steps" section
- Social sharing buttons

### Email Template
- Clean, single-column layout (max 600px)
- Association header with logo
- Compelling subject line preview
- Clear CTA button (large, centered)
- Footer with unsubscribe/legal links

---

## Visual Elements

### Icons
**Library**: Heroicons (via CDN)
- Use outline style for navigation/UI
- Use solid style for emphasis/CTAs
- Common icons: Heart, Shield, Users, Mail, Lock, CheckCircle

### Images
**Placement**:
- Hero: Right-side image (humanitarian work, helping hands)
- Mission section: Background pattern or subtle illustration
- About page: Team photos (professional headshots)
- Testimonial section: User photos (circular crops)

**Style**: Warm, authentic photography with slight desaturation for cohesion

### Forms
- Multi-step progress bar (filled circles with connecting lines)
- Floating labels or top-aligned labels
- Input focus states with subtle glow
- Inline validation icons (checkmark for valid, warning for errors)

---

## Animations

**Minimal, purposeful animations**:
- Fade-in on scroll for sections (subtle, fast)
- Button hover: slight scale (1.02) with smooth transition
- Form field focus: border color transition
- Progress bar: smooth fill animation between steps
- NO heavy animations, NO parallax, NO complex scroll effects

---

## Accessibility

- Consistent 4.5:1 contrast minimum for all text
- Focus indicators on all interactive elements (visible outline)
- Proper label associations for all form inputs
- ARIA labels for icon-only buttons
- Skip to content link
- Form validation with clear error messages

---

## Page-Specific Layouts

### Homepage
1. Navigation (sticky)
2. Hero section (split layout, image right)
3. Trust indicators bar
4. Mission section (3-column grid)
5. Impact statistics (4-column)
6. Testimonials (2-column)
7. CTA section (centered, "Participez maintenant")
8. Footer

### Survey Form Page
1. Navigation (minimal, logo only)
2. Progress indicator
3. Form container (centered, max-w-2xl)
4. Security badges (bottom)
5. Minimal footer

### About Page
1. Navigation
2. Hero (mission statement)
3. History timeline
4. Team section (2x2 grid)
5. Impact stats
6. Partner logos
7. Footer

---

## Key Design Details

- **Rounded corners**: Consistent radius of rounded-lg for cards, rounded-md for inputs
- **Shadows**: Subtle elevation (shadow-sm for cards, shadow-md for modals)
- **Whitespace**: Generous padding within sections to create breathing room
- **Form hierarchy**: Clear visual separation between form sections with subtle dividers
- **Button hierarchy**: Primary (filled), Secondary (outline), Tertiary (text only)