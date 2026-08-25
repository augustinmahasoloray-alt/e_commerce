# StepUp — Dashboard Admin — Reprise de contexte (Fonctionnalités avancées)

Colle ce prompt en début de conversation pour que l'assistant ait tout le contexte avant de continuer.

---

## Projet

**StepUp Admin Dashboard** — module séparé du frontend client React (`stepup-client`), à usage strictement personnel (Augustin = seul admin/vendeur, pivot single-vendor de StepUp). Sert à piloter la marketplace : produits, catégories, marques, commandes, utilisateurs, finances, statistiques.

## Stack

- **Dashboard admin** : pas de React/Vite — HTML pur + **Tailwind via CDN** (config inline en `<script>`) + **JS vanilla** (`fetch` natif), servi en statique par Express (`server/public/admin/`).
- **Client boutique** (`stepup-client/`) : React 19 + Vite + Tailwind v4, tourne en dev sur `localhost:5173`, proxy Vite configuré (`vite.config.js`) pour rediriger `/api` vers `localhost:3000`.
- **Backend partagé** entre les deux : Express + Prisma 7 (`@prisma/adapter-pg`) + PostgreSQL, client Prisma généré dans `generated/prisma`.
- Auth JWT (`authMiddleware`, header `Authorization: Bearer`), rôle `admin` requis pour `/api/admin/...`.
- Le schéma Prisma reflète encore une architecture **multi-vendeur** (`Vendor`, `VendorOrder`, `VendorTransaction`, rôle `vendeur`) alors que le projet est en cours de pivot vers du **mono-vendeur** (Augustin = seul vendeur). Ce pivot n'est pas terminé — à garder en tête pour toute nouvelle fonctionnalité liée aux commandes/finances (voir "Point à trancher" plus bas).

## Arborescence backend (confirmée)

```
server/
  src/
    app.js                        ← montage des routes Express, CORS (origin localhost:5173), static /admin
    server.js                     ← point d'entrée, écoute PORT (défaut 5000, utilisé en 3000 en dev)
    config/
    controllers/
      adminAuth.controller.js
      adminBrand.controller.js
      adminCategory.controller.js
      adminDashboard.controller.js
      adminProduct.controller.js
      auth.controller.js
      order.controller.js
      product.controller.js
      user.controller.js
      vendor.controller.js
    services/
      product.service.js           ← getAllProducts avec filtres complets (univers, marque(s), état, livraison, prix max, tri)
    routes/
      adminAuth.routes.js
      adminBrand.routes.js
      adminCategory.routes.js
      adminDashboard.routes.js
      adminProduct.routes.js
      auth.routes.js
      index.js                     ← ne contient QUE vendor-application actuellement, pas un routeur central pour tout
      order.routes.js
      product.routes.js
      user.routes.js
      vendor.routes.js
      vendorApplication.routes.js
      category.routes.js           ← NOUVEAU, route publique (réutilise adminCategory.controller)
      brand.routes.js               ← NOUVEAU, route publique (réutilise adminBrand.controller)
    middlewares/
    scripts/
  public/
    admin/
      dashboard.html                ← page principale (sidebar : Vue d'ensemble / Produits / Catégories & Marques / Commandes)
      index.html                    ← page de connexion/inscription admin
      js/
        products.js                 ← modal "Ajouter un produit", combobox univers/sous-catégorie/marque en saisie libre
        categories.js                ← section "Catégories & Marques"
        dashboard.js
        theme.js
        api.js                      ← apiFetch() wrapper (gère le token localStorage)
      fonts/qurova/
  prisma/
    schema.prisma
```

**Important** : `app.js` monte les routes directement (pas via `routes/index.js`), par exemple :
```javascript
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/brands", adminBrandRoutes);
// etc.
```
Toute nouvelle route doit être importée et montée dans `app.js` de la même façon.

## Schéma Prisma — modèles pertinents pour les nouvelles missions

- `Product` : `nom`, `description`, `category_id`, `brand_id`, `prix`, `prix_promo`, `note_moyenne`, `actif`, `date_creation`, `etat` (enum `ProductCondition`: neuf/reconditionne/occasion), `livraison_gratuite`, `livraison_express`. Relations : `variants` (taille/couleur/stock/sku), `images`, `reviews`.
- `Category` : hiérarchique via `parent_id` (univers = racine, sous-catégorie = enfant), relation `brands` (many-to-many via `BrandCategories`).
- `Brand` : relation `categories` (univers où elle est proposée).
- `Order` : `user_id`, `address_id`, `coupon_id`, `mode_paiement`, `mode_livraison`, `montant_total`, `date_commande`. Relation `vendorOrders`.
- `VendorOrder` : `order_id`, `vendor_id`, `statut` (enum `OrderStatus`: en_attente/confirmee/expediee/livree/annulee), `montant_total`, `montant_commission`, `montant_net`. Relation `items` (→ `OrderItem` → `ProductVariant`), `transactions`.
- `VendorTransaction` : `vendor_id`, `type` (enum `TransactionType`: credit_vente/debit_commission/versement/ajustement), `statut` (enum `TransactionStatus`: en_attente/effectue/echoue), `montant`.
- `User` : `nom`, `prenom`, `email`, `telephone`, `role` (enum `Role`: client/vendeur/admin), `date_creation`. **Pas de champ de blocage/statut actif actuellement.**
- `Review` : `product_id`, `user_id`, `note`, `commentaire`, `statut` (enum `ReviewStatus`).
- `Coupon`, `Wishlist`, `Cart`/`CartItem` existent aussi.

## Où on en est (fonctionnel, testé par Augustin)

1. **Auth dashboard** : connexion admin via JWT existant, garde d'accès sur `dashboard.html`.
2. **Produits** : CRUD de base (création avec variantes/images/catégorie/marque en combobox saisie libre — crée à la volée si le nom tapé n'existe pas encore), liste avec statut de stock, suppression (désactivation).
3. **Catégories & Marques** : création d'univers, de sous-catégories, de marques (avec univers associés), affichage en liste/arbre.
4. **Vue d'ensemble** (basique) : 3 cartes statiques (produits actifs, commandes en attente à 0, chiffre d'affaires à 0 — pas encore branchées sur de vraies données de commandes) + un graphique Chart.js "Produits par catégorie" déjà fonctionnel.
5. **Boutique.jsx (client React)** : entièrement dynamique — univers/sous-catégories/marques chargés depuis `/api/categories` et `/api/brands`, produits depuis `/api/products` avec tous les filtres (univers, sous-catégorie, marques multiples, état, livraison gratuite, prix max, tri). Badges (promo/express/dernière pièce/top vente) calculés à partir des vraies données produit. Testé et confirmé fonctionnel par Augustin, proxy Vite en place.

## Nouvelles missions demandées

### 📊 Tableau de bord principal
- Nombre total de produits
- Nombre de commandes
- Chiffre d'affaires total
- Nombre de clients
- Produits en rupture de stock
- Ventes du jour / semaine / mois

### 📦 Gestion des produits (compléter l'existant)
- Liste des produits (déjà là, à enrichir si besoin)
- Ajouter un produit (déjà fait)
- **Modifier un produit** (pas encore fait — formulaire d'édition, pré-rempli)
- Supprimer un produit (déjà fait, en soft-delete via `actif: false`)
- Gestion des catégories (déjà fait)
- Gestion des stocks (ajustement de stock par variante, indépendamment de la modification produit complète ?)

### 🛒 Gestion des commandes
- Commandes en attente / confirmées / livrées / annulées (mappe sur l'enum `OrderStatus` existant côté `VendorOrder`)

### 👥 Gestion des utilisateurs
- Liste des clients
- Blocage/déblocage des comptes (nécessite un nouveau champ sur `User`, ex: `actif` ou `statut`)
- Gestion des rôles

### 💰 Finances
- Revenus
- Bénéfices
- Paiements reçus
- Demandes de retrait

### 📈 Statistiques
- Évolution des ventes
- Produits les plus vendus
- Catégories les plus populaires
- Nouveaux utilisateurs

## Point à trancher avant de coder les Commandes/Finances

Le modèle de données (`Order` → `VendorOrder` avec `montant_commission`/`montant_net`, `VendorTransaction` avec des types `versement`/`ajustement`) est conçu pour un **marketplace multi-vendeur avec système de retrait de commission**. Or Augustin est en train de repasser en **mono-vendeur** (lui = seul vendeur). Ça soulève une question pour "Finances" en particulier :
- **"Demandes de retrait"** a du sens si Augustin se paie lui-même via un circuit de commission (`VendorTransaction` de type `versement`), mais c'est un système pensé pour des vendeurs tiers qu'il faudrait payer — est-ce toujours pertinent pour un mono-vendeur, ou est-ce que "Finances" doit simplement afficher revenus/bénéfices sans notion de retrait ?
- Le flux de commande (`Order`/`VendorOrder`/`OrderItem`) n'est pas encore branché côté frontend client (panier/checkout pas terminés d'après le contexte initial) — donc "Gestion des commandes" côté admin n'aura rien à afficher tant que des commandes ne sont pas réellement créées. Prévoir de le tester avec des données de commande créées manuellement (script Prisma ou route de test), ou combiner ce chantier avec la finalisation du panier/checkout côté client ?

## Comment je veux qu'on travaille

- Vu l'ampleur du scope (6 grandes sections), découper le travail en étapes livrables une par une plutôt que tout d'un coup — proposer un ordre logique et me demander confirmation avant de commencer chaque étape.
- Fichiers complets plutôt que des snippets partiels, sauf modification ciblée explicitement demandée.
- Commandes terminal : forme longue d'abord, puis forme courte, puis explication des flags.
- Toujours prévoir le dark mode.
- Me poser les questions de clarification nécessaires avant de coder si un point n'est pas clair (notamment le point ci-dessus sur les Finances).

---

**Prêt à continuer.** Merci de proposer un découpage en étapes pour ces nouvelles missions, en commençant par celle qui te semble la plus logique (probablement le Tableau de bord principal, qui ne demande pas de nouveau champ en base, puis Modifier un produit).