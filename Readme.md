# Contact parsing in Deno

## Installation de Deno

Suivre les instructions ici : [https://docs.deno.com/runtime/manual/getting_started/installation](https://docs.deno.com/runtime/manual/getting_started/installation)

## Lancement

```sh
deno run --allow-read=. main.ts <grammar file> <input file>
```

## Fichier de Grammaire

Le fichier de grammaire est un fichier JSON contenant deux parties : les tokens terminaux et les règles.
Les tokens terminaux et les règles sont indexés par une chaine de caractère, cette chaine de charactère est l'identifiant du token dans la sortie du programme et dans les règles.

Les règles sont des liste de liste de token. Le premier niveau correspond aux différentes options possibles dans la règle. Le deuxième niveau est la séquence qui doit être validée.

La valeur null (sans les quotes, ce n'est pas une string) correspond au mot vide terminal epsilon.

La règle nommée S est lancée comme point d'entrée.

## Exemple de fichier

```plain
contact A B 20 50
rate 5 20 35
rate 10 35 50
delay 1 20 50

contact B C 100 140
rate 10 100 140
delay 1 100 130
delay 2 130 140
```
