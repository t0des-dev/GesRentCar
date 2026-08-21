# Règle : Push GitHub automatique après chaque modification

Après **chaque modification** de fichier(s) dans ce workspace, tu dois
systématiquement effectuer les étapes suivantes **sans attendre** que
l'utilisateur le demande :

1. `git add <fichiers modifiés>`
2. `git commit -m "<message descriptif en anglais ou français>"`
3. `git push origin <branche courante>`

## Directives du message de commit
- Utiliser le format conventionnel : `fix:`, `feat:`, `refactor:`, `chore:`, etc.
- Le message doit décrire **ce qui a changé et pourquoi**.

## Exceptions
- Ne pas pousser si l'utilisateur dit explicitement "ne pas pusher" ou "juste sauvegarder".
- Ne pas pousser les fichiers secrets (`.env`, clés API) s'ils ne sont pas déjà dans `.gitignore`.
