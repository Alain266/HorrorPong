# Pong666 : Le pong de l'horreur

Un classique du jeu Pong revisité avec une touche d'horreur ! Spooky Pong est un jeu simple où vous affrontez une IA au Pong, mais attention... plus vous marquez de points, plus les "screamers" (sauts de frayeur) deviennent fréquents ! Testez vos réflexes et vos nerfs dans cette expérience de jeu unique.

## ✨ Fonctionnalités

* **Gameplay Classique de Pong :** Affrontez une IA dans une partie de Pong traditionnelle.
* **Screamers Dynamiques :** Des images et sons effrayants apparaissent aléatoirement, et leur fréquence augmente à mesure que vous marquez des points.
* **Immersion Sonore :** Une musique de fond d'ambiance qui se met en pause lors des screamers et reprend automatiquement ensuite pour maintenir la tension.
* **Contrôles Simples :** Joueur 1 (vous) contrôlé à la souris, Joueur 2 géré par une IA.

## 🎮 Comment Jouer

1.  **Ouvrez le jeu :** Accédez au fichier `index.html` dans votre navigateur web (Chrome, Firefox, Edge, etc.).
2.  **Lancez la musique :** Cliquez n'importe où sur le canvas du jeu pour démarrer la musique de fond et activer les sons (une interaction utilisateur est nécessaire pour la lecture audio).
3.  **Contrôlez votre raquette :** Déplacez votre souris de haut en bas pour contrôler la raquette gauche.
4.  **Marquez des points :** Essayez de faire passer la balle derrière la raquette de l'adversaire.
5.  **Préparez-vous :** Chaque point augmente la difficulté et la probabilité d'un screamer !

## 🚀 Installation & Lancement

Pour faire fonctionner ce projet en local, suivez ces étapes :

1.  **Clonez le dépôt** ou téléchargez les fichiers du projet.
    ```bash
    git clone [https://github.com/votre-utilisateur/votre-repo-spooky-pong.git](https://github.com/votre-utilisateur/votre-repo-spooky-pong.git)
    cd votre-repo-spooky-pong
    ```
2.  **Structure des fichiers :** Assurez-vous que votre dossier de projet contient la structure suivante avec les fichiers correspondants :
    ```
    votre-repo-spooky-pong/
    ├── index.html
    ├── style.css             (pour le style et la gestion du conteneur de screamer)
    ├── script.js
    ├── img/
    │   ├── 01.jpg            (vos images de screamer)
    │   ├── 02.jpg
    │   ├── 03.jpg
    │   └── ...
    ├── jumpscare/
    │   ├── Scary Screamer.mp3 (vos sons de screamer)
    │   ├── ascending-jumpscare-102061.mp3
    │   └── ...
    └── music/
        └── ambiance.mp3      (votre musique de fond)
    ```
    *Assurez-vous que les chemins des images et des sons dans `script.js` et des balises `<audio>` dans `index.html` correspondent à votre structure de dossiers.*

3.  **Ouvrez `index.html`** dans votre navigateur.

## 📄 Licence

Ce projet est sous licence MIT.
