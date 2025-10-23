# Protobuf Base64 Test-Script

Dieses Script ermöglicht das Lesen und Schreiben von Protobuf-Binärdaten im Base64-Format.

## Installation

Die Abhängigkeiten sind bereits im Hauptprojekt installiert. Falls nicht:

```bash
npm install
```

## Verwendung

### 1. Base64-Daten in Datei speichern

Erstelle eine Textdatei mit deinen Base64-kodierten Daten:

```bash
# Beispiel: tests/data/meine-daten.txt
echo "dein-base64-string-hier" > tests/data/meine-daten.txt
```

### 2. Script ausführen

```bash
# PlayElement dekodieren (Standard)
npm run test:proto -- tests/data/meine-daten.txt

# ModRules dekodieren
npm run test:proto -- tests/data/modrules.txt modrules

# Blueprint dekodieren
npm run test:proto -- tests/data/blueprint.txt blueprint
```

### 3. Demo ohne Parameter

Führe das Script ohne Parameter aus, um ein Demo-Beispiel zu sehen:

```bash
npm run test:proto
```

## Unterstützte Typen

- `playelement` - PlayElement-Nachrichten
- `modrules` - ModRules-Nachrichten
- `blueprint` - Blueprint-Nachrichten

## Fehlerbehandlung

### Wire Type 7 Fehler

Wenn du den Fehler "cant skip wire type 7" erhältst, bedeutet das:

1. **Falsche Daten**: Die Base64-Daten entsprechen nicht dem erwarteten Protobuf-Schema
2. **Falscher Typ**: Du versuchst die Daten mit dem falschen Message-Typ zu dekodieren
3. **Korrupte Daten**: Die Daten sind beschädigt oder unvollständig

**Lösungsansätze:**

1. Überprüfe, ob die Base64-Daten korrekt sind (keine Zeilenumbrüche, vollständig)
2. Versuche einen anderen Message-Typ
3. Prüfe die Hex-Ausgabe der ersten Bytes, um das Schema zu identifizieren

### Debugging

Das Script gibt automatisch Debug-Informationen aus:
- Länge der Base64-Daten
- Länge der Binärdaten
- Hex-Dump der ersten 64 Bytes

## Beispiele

### Beispiel 1: PlayElement dekodieren

```bash
npm run test:proto -- tests/data/example.txt
```

Output:
```
=== Test: PlayElement dekodieren ===
Base64-Länge: 132 Zeichen
Binärdaten-Länge: 98 bytes
Erste Bytes (hex):
    0a 0d 74 65 73 74 2d 69 64 2d 31 32 33 34 35 12
    ...

Dekodiertes PlayElement:
  ID: test-id-12345
  Name: Test Experience
  ...
```

### Beispiel 2: Programmatische Verwendung

```typescript
import { loadBase64FromFile, testDecodePlayElement } from './tests/protobuf-base64-test';

const base64 = loadBase64FromFile('tests/data/meine-daten.txt');
const playElement = testDecodePlayElement(base64);
console.log(playElement);
```

## Struktur

```
tests/
├── protobuf-base64-test.ts  # Haupt-Test-Script
├── tsconfig.json             # TypeScript-Konfiguration für Tests
├── data/                     # Ordner für Base64-Datendateien
│   └── example.txt           # Beispiel-Datei
└── README.md                 # Diese Datei
```

## Hilfsfunktionen

Das Script exportiert folgende Funktionen:

- `loadBase64FromFile(filePath)` - Lädt Base64 aus einer Datei
- `base64ToUint8Array(base64)` - Konvertiert Base64 zu Uint8Array
- `uint8ArrayToBase64(uint8Array)` - Konvertiert Uint8Array zu Base64
- `testDecodePlayElement(base64)` - Dekodiert PlayElement
- `testDecodeModRules(base64)` - Dekodiert ModRules
- `testDecodeBlueprint(base64)` - Dekodiert Blueprint
- `decodeGeneric(base64, messageType, typeName)` - Generische Dekodierung

## Troubleshooting

### Datei nicht gefunden

Stelle sicher, dass der Pfad relativ zum Projekt-Root ist:
```bash
# Richtig
npm run test:proto -- tests/data/meine-daten.txt

# Falsch (absoluter Windows-Pfad)
npm run test:proto -- E:\BF6\API\tests\data\meine-daten.txt
```

### TypeScript-Fehler

Falls TypeScript-Fehler auftreten:
```bash
npm run build
npm run test:proto -- tests/data/meine-daten.txt
```
