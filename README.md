# MIAM V4 — Scanner intelligent par zones

Cette version corrige le principal problème du scanner précédent :
l'OCR ne lit plus toute la page comme un seul bloc.

## Analyse séparée
- Zone 1 : titre
- Zone 2 : personnes, temps et ingrédients
- Zone 3 : préparation numérotée

L'image est également convertie en niveaux de gris avec un contraste renforcé avant la lecture OCR.

Cette approche est particulièrement adaptée aux livres de cuisine dont la page est organisée en colonnes.
