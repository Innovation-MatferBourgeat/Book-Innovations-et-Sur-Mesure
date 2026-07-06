# STYLE TEMPLATE — Matfer Bourgeat
## Application Book Innovations & Sur Mesure
*Dernière mise à jour : juillet 2026*

---

## 1. Couleurs

```css
/* Fonds */
--bg:      #060604   /* fond principal */
--bg2:     #0e0e0c   /* fond secondaire (footers, sub-nav) */
--surface: #161614   /* surface élevée (cards, inputs) */

/* Accents */
--gold:    #C9A84C   /* or principal */
--gold-l:  #E8D49A   /* or clair */
--blue:    #5B8FBF   /* bleu principal (Sur Mesure) */
--blue-l:  #8FB8E0   /* bleu clair */
--red:     #B85C38   /* rouge/terre cuite */
--red-l:   #D4896A   /* rouge clair */
--green:   #8FAF7A   /* vert */
--green-l: #AECF9A   /* vert clair */

/* Texte */
--text:    #F0EDE6               /* texte principal */
--muted:   rgba(240,237,232,0.42) /* texte atténué */
--subtle:  rgba(240,237,232,0.22) /* texte très atténué */

/* Bordures */
--border:  rgba(255,255,255,0.07)
```

### Cycles de couleurs — sous-sections
| Position | Innovations | Sur Mesure |
|---|---|---|
| 1 | `--red-l` | `--blue-l` |
| 2 | `--gold-l` | `--gold-l` |
| 3 | `--green-l` | `--green-l` |
| 4 | `--blue-l` | `--red-l` |
| 5+ | cycle reprend | cycle reprend |

---

## 2. Typographie

```css
--font-d: 'Cormorant Garamond', Georgia, serif   /* display / titres */
--font-u: 'Jost', 'Helvetica Neue', sans-serif  /* UI / labels */
```

### Usages
| Élément | Police | Graisse | Taille | Casse |
|---|---|---|---|---|
| Titre de section (sv-title) | Jost | 300 | 10px | UPPERCASE, letter-spacing .25em |
| Nom de section (home card) | Cormorant Garamond | 300 | 16px | normale |
| Titre d'image (sv-cap-title) | Cormorant Garamond | 300 | 15px | normale |
| Groupe home (Petit matériel) | Jost | 300 | 12px | UPPERCASE, letter-spacing .38em |
| Pills sous-sections | Jost | 300 | 9px | UPPERCASE, letter-spacing .18em |
| Labels CTA | Jost | 300 | 9px | UPPERCASE, letter-spacing .28em |
| Page number | Jost | 300 | 7px | — |
| Contacts (PDF) | Liberation Sans Bold | — | 8.5px | — |

---

## 3. Composants UI

### Barre d'onglets (home)
- Indicateur glissant animé `.tab-bar` position:absolute bottom:0, height:1.5px
- Innovations → couleur `--gold`
- Sur Mesure → couleur `--blue`
- Transition : `left .38s cubic-bezier(0.4,0,0.2,1)`

### Sub-navigation (sections)
- Pills flex, `justify-content` dynamique : `center` si contenu ≤ largeur, `flex-start` sinon
- `margin-left:14px` sur `.sub-pill:first-child`, `margin-right:14px` sur `:last-child`
- Barre indicatrice `.sub-bar` : `position:absolute; bottom:0; height:2px`
  - Positionnée dans `sub-wrap` (position:relative, overflow:hidden)
  - Calcul : `bar.left = pill.offsetLeft - nav.scrollLeft` (synchrone)
- Couleur par cycle de sous-section (voir tableau ci-dessus)

### Cards produits (home)
- Aspect ratio 4/3
- Gradient bas : `linear-gradient(to top, rgba(6,6,4,.95) 0%, rgba(6,6,4,.4) 60%, transparent 100%)`
- Image cover en `object-fit:cover`
- Nom en Cormorant Garamond 16px

### Lightbox
- Fond `#000`, opacity transition `.25s`
- Zoom : pinch touch + molette souris, min 1× max 6×
- Pan : doigt quand zoomé, avec clamping aux bords
- Double-tap / double-clic : reset zoom à 1×
- Fermeture : ESC + bouton ✕ top-right + reset `lbScale=1` + vide handlers touch

### Visite virtuelle 360°
- iframe plein écran dans overlay fixe `z-index:200`
- Bouton retour : flèche ← haut-gauche, fond `rgba(6,6,4,.65)`, bordure `rgba(201,168,76,.3)`, radius 2px, flèche `--gold`
- Fermeture : `frame.src=''` immédiat + `document.body.focus()` + reset pointer-events

### Toast installation PWA
- Position : `fixed; bottom:24px; left:50%; transform:translateX(-50%)`
- Apparaît 3s après `beforeinstallprompt`, disparaît auto après 6s
- Clic sur toast → `installPrompt.prompt()`
- Clic sur ✕ → ferme sans installer

### CTA footer sections
- Innovations : "Infos produit" → `liens.json`
- Sur Mesure : "Notre page Sur Mesure" → `https://digital.matferbourgeat.com/tailor`
- Style : bordure `.5px solid rgba(201,168,76,.3)`, radius 1px, hover fond `rgba(201,168,76,.06)`
- Sur Mesure variante : bordure bleue

---

## 4. Animations & transitions

```css
--ease: cubic-bezier(0.4, 0, 0.2, 1)

/* Transitions standard */
écrans (show/hide) : transform + opacity .35s var(--ease)
track slides      : transform .35s var(--ease)
tab indicator     : left + width .38s var(--ease)
sub indicator     : left + width .3s var(--ease)
lightbox          : opacity .25s var(--ease)
```

---

## 5. Layout responsive

### Portrait (mobile)
- Grille home : 2 colonnes
- Slides : flex column, image + caption empilés
- Dots de pagination visibles

### Paysage (landscape)
- Grille home : 4 colonnes
- Slides : flex column (pas de split image/caption)
- Dots masqués
- Headers compactés

---

## 6. Swipe & interactions tactiles

**Swipe horizontal (changement sous-section) :**
```
touch-action: pan-y sur .sv-slide
listener passive:false sur #svo (outer)
Décision après 6px : |dx| > |dy| → horizontal
Seuil déclenchement : 40px
```

**Scroll nav vers pill active :**
```js
nav.scrollLeft = pill.offsetLeft - (nav.clientWidth/2) + (pill.offsetWidth/2)
updateSubBar(idx)  // appelé immédiatement après (synchrone)
```

---

## 7. Système de cache

| Données | Clé localStorage | TTL |
|---|---|---|
| Arborescence GitHub | `mb_tree_v1` | 6h |
| Traductions | `mb_trans_v1` | 6h |
| Images | Service Worker | permanent |
| `liens.json` | aucun | fetch à chaque fois |

**Reset cache :** appui long 1.5s sur le logo home → vide `mb_tree_v1` + `mb_trans_v1` + reload.

---

## 8. Traductions

Fichier : `translations.tsv` à la racine du repo
- Format : `Français[TAB]English`, encodage UTF-8 BOM
- Fonction `t(text)` : retourne la traduction si LANG==='en' et entrée existe, sinon texte original
- Éléments traduits : noms de sections, sous-sections, titres d'images, groupes, boutons VR

---

## 9. Analytics

**GoatCounter** : `book-innovations-et-sur-mesure-gmb.goatcounter.com`
- Chaque ouverture de l'app comptée sur `/`
- Chaque section consultée comptée comme événement `/section/{nom}`

---

## 10. PWA & icônes

**Manifest :** `manifest.json` à la racine
- `start_url` et `scope` : URL absolue GitHub Pages
- Icônes fichiers PNG dans `/icons/` (pas base64)
- `prefer_related_applications: false`

**Icônes :**
| Fichier | Taille | Usage |
|---|---|---|
| `icon-192.png` | 192×192 | Android homescreen |
| `icon-512.png` | 512×512 | Android splash + maskable |
| `apple-touch-icon.png` | 180×180 | iPhone |
| `icon-167.png` | 167×167 | iPad Pro |
| `icon-152.png` | 152×152 | iPad retina |

**Service Worker (`sw.js`) :**
- API GitHub : network-first, fallback cache
- Images raw.githubusercontent.com : cache-first
- Google Fonts + reste : cache-first
- Enregistrement uniquement sur `*.github.io`

---

## 11. Structure fichiers repo

```
/
├── index.html          ← app complète (autoportante)
├── manifest.json       ← PWA manifest
├── sw.js               ← Service Worker
├── deploy.yml          ← (copie locale du workflow)
├── liens.json          ← { "Nom section": "URL catalogue" }
├── translations.tsv    ← table FR/EN (UTF-8 BOM)
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── apple-touch-icon.png
│   ├── icon-167.png
│   └── icon-152.png
└── Images/
    ├── 01_Innovations/
    │   ├── 01_Petit Matériel/
    │   │   └── 01_Chauffe-siphons/
    │   │       ├── 00_Couverture/
    │   │       ├── 01_Pain_points/
    │   │       ├── 02_Concept/
    │   │       └── 03_Le Produit/
    │   └── 02_Gros Matériel/
    └── 02_Sur Mesure/
        ├── Caves à vin/
        │   └── 01_Le Meurice/
        │       ├── 00_Couverture/
        │       └── 05_Visite virtuelle/
        │           └── Lien.txt
        ├── Moules/
        ├── Vitrines/
        ├── Chariots premium/
        └── Meubles de cuisson/
```

---

## 12. Règles de nommage images

| Règle | Exemple | Résultat |
|---|---|---|
| Préfixe numérique + `_` ou espace = ordre | `01_Pain_points` | Sous-section n°1 |
| `00_Couverture` ou `Couverture` = cover | `00_Couverture/` | Image home, pas sous-section |
| Dossier avec `visite`/`virtual`/`360` = VR | `05_Visite virtuelle/` | Panneau 360° |
| Fichier `.txt` dans dossier VR = URL | `Lien.txt` | URL de la visite |
| Titre image = nom sans préfixe, `_`→espace | `01_Un_outil_léger.jpg` | "Un outil léger" |
| Pas de titre si nom = chiffre seul | `01.jpg` | Pas de caption |

