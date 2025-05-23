# 💕 Bienvenue Camille 💕

Un site web émotionnel et interactif pour célébrer l'arrivée de Camille, créé avec amour pour les futurs parents.

## ✨ Caractéristiques

- **Single Page Application** - Design élégant et moderne sans défilement
- **Visualisation Audio** - Affichage en temps réel du battement de cœur de bébé avec WaveSurfer.js
- **Animations Fluides** - Particules flottantes, cœurs animés et effets visuels
- **Design Responsive** - Optimisé pour tous les appareils (mobile, tablette, desktop)
- **Compte à Rebours** - Jusqu'à la naissance prévue en juin 2024
- **Auto-play Audio** - Le son se lance automatiquement (avec gestion des restrictions navigateur)
- **Effets Interactifs** - Animations au survol et Easter eggs cachés

## 🎵 Ajout de votre fichier audio

Pour ajouter l'audio de l'échographie de Camille :

1. Placez votre fichier audio dans le dossier racine du projet
2. Renommez-le en `camille_heartbeat.mp3` (ou utilisez le format de votre choix)
3. Le site détectera automatiquement le fichier et l'utilisera

**Formats supportés :** MP3, WAV, OGG

**Note :** Si aucun fichier audio n'est fourni, le site affichera une belle animation de forme d'onde simulée.

## 🚀 Installation et utilisation locale

1. Clonez ou téléchargez ce repository
2. Ajoutez votre fichier audio (voir section ci-dessus)
3. Ouvrez `index.html` dans votre navigateur web

C'est tout ! Aucune installation de dépendances requise.

## 🌐 Déploiement sur GitHub Pages

1. **Préparer votre repository :**
   ```bash
   git add .
   git commit -m "Site de bienvenue pour Camille"
   git push origin main
   ```

2. **Activer GitHub Pages :**
   - Allez sur votre repository GitHub
   - Cliquez sur "Settings" (Paramètres)
   - Faites défiler jusqu'à "Pages" dans le menu de gauche
   - Dans "Source", sélectionnez "Deploy from a branch"
   - Choisissez "main" comme branche
   - Cliquez sur "Save"

3. **Accéder à votre site :**
   - GitHub vous donnera une URL : `https://[votre-nom].github.io/Camille-RADIO`
   - Le site sera en ligne dans quelques minutes !

## 🎨 Personnalisation

### Changer la date de naissance
Modifiez la ligne 75 dans `script.js` :
```javascript
const targetDate = new Date('2024-06-01').getTime(); // Changez cette date
```

### Modifier les couleurs
Les couleurs principales sont dans `style.css` :
- Rose clair : `#FFB6C1`
- Rose vif : `#FF69B4`
- Rose foncé : `#FF1493`

### Ajouter du contenu
Vous pouvez modifier le texte dans `index.html` :
- Titre principal
- Message de bienvenue
- Texte du countdown

## 🖼️ Image de bébé personnalisée

Si vous voulez remplacer l'illustration SVG par une vraie image :

1. **Prompt pour ChatGPT/DALL-E :**
   ```
   "Create a soft, dreamy silhouette illustration of a sleeping baby in the womb, 
   gentle pink and purple gradient colors, minimalist style, ethereal glow effect, 
   suitable for a pregnancy announcement website, peaceful and tender mood"
   ```

2. **Remplacer l'image :**
   - Sauvegardez l'image comme `baby.png`
   - Modifiez le CSS dans `.baby-silhouette` pour utiliser votre image

## 🛠️ Technologies utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Animations et design moderne
- **JavaScript Vanilla** - Logique et interactivité
- **WaveSurfer.js** - Visualisation audio professionnelle
- **Google Fonts** - Typographie élégante (Poppins)

## 📱 Compatibilité

- ✅ Chrome, Firefox, Safari, Edge (versions récentes)
- ✅ iOS Safari, Chrome Mobile
- ✅ Responsive design (mobile, tablette, desktop)
- ⚠️ L'autoplay audio peut être bloqué sur certains navigateurs (solution incluse)

## 🎉 Fonctionnalités cachées

- Cliquez sur l'illustration du bébé pour un effet de surprise
- Bougez votre souris près du bébé pour un effet interactif
- Les particules et cœurs apparaissent de façon aléatoire

## 📧 Support

Ce site a été créé avec amour pour célébrer l'arrivée de Camille ! 

Pour toute question ou personnalisation supplémentaire, n'hésitez pas à me contacter.

---

*Fait avec 💕 pour Camille et ses parents* 