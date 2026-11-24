# Apache POI : fonctionnement et utilisation

Ce guide présente Apache POI et son usage dans le backend NovaTech. Le projet s'en sert pour produire un fichier Excel `.xlsx` contenant les pré-inscriptions à une session.

## À quoi sert Apache POI ?

Apache POI est une bibliothèque Java qui permet de lire et d'écrire des documents Microsoft Office. Pour les feuilles de calcul, les principaux formats sont :

| Format | API POI courante | Fichier |
|---|---|---|
| Excel moderne, Office Open XML | `XSSFWorkbook` / interfaces `ss.usermodel` | `.xlsx` |
| Excel ancien, format binaire | `HSSFWorkbook` / interfaces `ss.usermodel` | `.xls` |

Dans ce projet, la dépendance `poi-ooxml` permet de manipuler les fichiers `.xlsx`. Elle est déclarée dans `backend/pom.xml` en version `6.0.0`. Les interfaces du paquet `org.apache.poi.ss.usermodel` donnent accès aux objets communs (classeur, feuille, ligne, cellule, styles), tandis que `XSSFWorkbook` indique ici que le classeur produit est au format XLSX.

## Comment fonctionne un classeur

POI représente le document avec une hiérarchie d'objets :

```text
Workbook (classeur)
└── Sheet (feuille)
    └── Row (ligne, indexée à partir de 0)
        └── Cell (cellule, colonne indexée à partir de 0)
```

On crée ou ouvre un `Workbook`, on parcourt ou construit ses feuilles, lignes et cellules, puis on écrit le classeur dans un flux (`OutputStream`). La plupart des opérations `XSSFWorkbook` gardent le classeur en mémoire : cette API est simple et adaptée aux exports de taille modérée. Pour de très gros exports, POI propose aussi l'écriture en streaming avec `SXSSFWorkbook`, qui limite la mémoire utilisée en ne conservant qu'une fenêtre de lignes.

## Dépendance Maven du projet

La dépendance est déjà présente dans `backend/pom.xml` :

```xml
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>6.0.0</version>
</dependency>
```

Maven récupère également les dépendances transitives. Il n'est donc pas nécessaire d'ajouter séparément `poi` pour l'utilisation XLSX du projet.

## Créer un fichier Excel

Voici le cycle habituel :

1. Créer un classeur et une feuille.
2. Ajouter des lignes puis des cellules, en indiquant leur type ou leur valeur.
3. Appliquer éventuellement des styles, filtres et volets figés.
4. Écrire le classeur dans un flux.
5. Fermer les ressources avec `try-with-resources`.

Exemple autonome :

```java
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public byte[] creerClasseur() throws IOException {
    try (XSSFWorkbook workbook = new XSSFWorkbook();
         ByteArrayOutputStream output = new ByteArrayOutputStream()) {
        Sheet sheet = workbook.createSheet("Contacts");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Nom");
        header.createCell(1).setCellValue("E-mail");

        Row data = sheet.createRow(1);
        data.createCell(0).setCellValue("Amina Diallo");
        data.createCell(1).setCellValue("amina@example.com");

        sheet.createFreezePane(0, 1); // garder l'en-tête visible au défilement
        sheet.setAutoFilter(new org.apache.poi.ss.util.CellRangeAddress(0, 1, 0, 1));
        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);

        workbook.write(output);
        return output.toByteArray();
    }
}
```

Pour renvoyer ce tableau d'octets depuis Spring, définir le type MIME XLSX et un nom de téléchargement :

```java
return ResponseEntity.ok()
    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=contacts.xlsx")
    .contentType(MediaType.parseMediaType(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
    .body(bytes);
```

Le type MIME doit correspondre au format réel du classeur. Pour un export volumineux, il est préférable d'écrire la réponse directement vers le flux HTTP et d'envisager `SXSSFWorkbook`, en supprimant ensuite ses fichiers temporaires avec `dispose()`.

## Lire un fichier Excel

`WorkbookFactory` détecte le format à partir du contenu du fichier et convient lorsqu'on accepte à la fois `.xls` et `.xlsx`. Il faut valider le fichier entrant et limiter sa taille avant de l'ouvrir.

```java
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import java.io.InputStream;

public void lireClasseur(InputStream input) throws Exception {
    try (Workbook workbook = WorkbookFactory.create(input)) {
        var sheet = workbook.getSheetAt(0);
        DataFormatter formatter = new DataFormatter();

        for (Row row : sheet) {
            String premiereColonne = formatter.formatCellValue(row.getCell(0));
            String deuxiemeColonne = formatter.formatCellValue(row.getCell(1));
            // Valider puis traiter les valeurs selon le métier.
        }
    }
}
```

`DataFormatter` fournit une représentation textuelle tenant compte du format d'affichage Excel. Pour importer des données métier, il faut en plus vérifier les cellules manquantes, les types attendus, les longueurs et les valeurs autorisées. Ne pas faire confiance au nom ou à l'extension du fichier téléversé.

## Utilisation dans NovaTech

L'export actuel se trouve dans `EnrollmentController.exportExcel` :

- route `GET /api/v1/management/enrollments/export.xlsx?sessionId=…` ;
- accès limité aux rôles `SUPER_ADMIN` et `EDITOR` ;
- création d'un `XSSFWorkbook` et d'une feuille « Pré-inscriptions » ;
- ajout des colonnes identifiant, nom, e-mail, téléphone, langue, statut et date ;
- mise en forme de l'en-tête, filtre automatique, première ligne figée et ajustement des colonnes ;
- écriture en mémoire puis réponse HTTP avec le type MIME XLSX et un nom de fichier.

L'endpoint CSV voisin (`/api/v1/management/enrollments/export`) est indépendant d'Apache POI : il fabrique du texte CSV directement.

## Bonnes pratiques

- Fermer classeur et flux avec `try-with-resources`.
- Réutiliser un petit nombre de styles : Excel limite le nombre de styles distincts par classeur.
- Stocker les identifiants, numéros de téléphone et valeurs qui ne doivent pas être calculées comme du texte. Les cellules numériques peuvent perdre les zéros initiaux ou afficher de longs identifiants en notation scientifique.
- Pour un export de données non fiables, écrire les valeurs comme chaînes et ne pas les transformer en formules. Pour du CSV, neutraliser les valeurs qui commencent par `=`, `+`, `-`, `@`, tabulation ou retour chariot afin d'éviter l'injection de formules.
- Pour les dates, choisir une représentation cohérente : une cellule de date avec style dédié ou un texte ISO 8601.
- Tenir compte de la mémoire : `XSSFWorkbook` garde les lignes en mémoire ; préférer `SXSSFWorkbook` pour de grands volumes.
- Pour un import téléversé, limiter la taille, vérifier les erreurs de format et valider chaque valeur avant de l'enregistrer.

## Références

- [Documentation Apache POI](https://poi.apache.org/)
- [Guide d'utilisation des feuilles de calcul](https://poi.apache.org/components/spreadsheet/quick-guide.html)
