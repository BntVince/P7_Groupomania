# P7_Groupomania

Après l'importation du projet, il faudra, dans le terminal, : 

npm i package.json 

Pour le dossier "back" et "groupomania"

Il vous faudra également créer un fichier .env qui devra contenir JWT_SECRET=""  suivi d'une suite de caractère de votre choix à la place des ""
Ou aller écrire directement la clé pour JWT la ou elle est utilisé c'est à dire : ./back/middleware/auth.js ligne 6
                                                                                  ./back/controllers/user.controller.js ligne 56


Le back est fait de façon à communiquer avec une DB SQL, il faudra pour faire marcher le projet modifier le fichier db.config.js pour votre propre DB
