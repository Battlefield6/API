import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { PlayElement } from "../src/generated/models/PlayElement";
import { ModRules } from "../src/generated/models/ModRules";
import { Blueprint } from "../src/generated/models/Blueprint";
import { UpdatePlayElementRequest } from "../src/generated/models/UpdatePlayElementRequest";
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

/**
 * Test-Script zum Lesen und Schreiben von Protobuf-Binärdaten im Base64-Format
 */

// Hilfsfunktionen für Base64-Konvertierung
function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = Buffer.from(base64, 'base64');
    return new Uint8Array(binaryString);
}

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    return Buffer.from(uint8Array).toString('base64');
}

// Versucht, komprimierte Daten zu dekomprimieren
function tryDecompress(data: Uint8Array): Uint8Array | null {
    try {
        // Versuche gzip
        const decompressed = zlib.gunzipSync(Buffer.from(data));
        console.log('  → Daten wurden als GZIP dekomprimiert');
        return new Uint8Array(decompressed);
    } catch (e1) {
        try {
            // Versuche deflate
            const decompressed = zlib.inflateSync(Buffer.from(data));
            console.log('  → Daten wurden als DEFLATE dekomprimiert');
            return new Uint8Array(decompressed);
        } catch (e2) {
            try {
                // Versuche inflate raw
                const decompressed = zlib.inflateRawSync(Buffer.from(data));
                console.log('  → Daten wurden als RAW DEFLATE dekomprimiert');
                return new Uint8Array(decompressed);
            } catch (e3) {
                return null;
            }
        }
    }
}

function hexDump(data: Uint8Array, maxBytes: number = 64): string {
    const bytes = data.slice(0, maxBytes);
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, '0') + ' ';
        if ((i + 1) % 16 === 0) hex += '\n    ';
    }
    return hex;
}

// Base64 aus Datei lesen
function loadBase64FromFile(filePath: string): string {
    try {
        const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
        console.log(`Lade Datei: ${absolutePath}`);

        if (!fs.existsSync(absolutePath)) {
            throw new Error(`Datei nicht gefunden: ${absolutePath}`);
        }

        const content = fs.readFileSync(absolutePath, 'utf-8');
        // Entferne Whitespace und Newlines
        return content.replace(/\s+/g, '').trim();
    } catch (error) {
        console.error(`Fehler beim Laden der Datei:`, error);
        throw error;
    }
}

// Test 1: PlayElement dekodieren
function testDecodePlayElement(base64Data: string): PlayElement | null {
    console.log('\n=== Test: PlayElement dekodieren ===');

    try {
        // Base64 zu Uint8Array konvertieren
        let binaryData = base64ToUint8Array(base64Data);
        console.log(`Base64-Länge: ${base64Data.length} Zeichen`);
        console.log(`Binärdaten-Länge: ${binaryData.length} bytes`);
        console.log(`Erste Bytes (hex):\n    ${hexDump(binaryData, 64)}`);

        // Versuche zuerst direkt zu dekodieren
        let playElement: any = null;
        try {
            playElement = PlayElement.decode(binaryData);
        } catch (firstError: any) {
            console.log(`\n  Direktes Dekodieren fehlgeschlagen: ${firstError.message}`);
            console.log('  Versuche Dekompression...');

            const decompressed = tryDecompress(binaryData);
            if (decompressed) {
                binaryData = decompressed;
                console.log(`  Dekomprimierte Länge: ${binaryData.length} bytes`);
                console.log(`  Erste Bytes nach Dekompression (hex):\n    ${hexDump(binaryData, 64)}`);
                playElement = PlayElement.decode(binaryData);
            } else {
                throw firstError;
            }
        }

        // Ergebnis ausgeben
        console.log('\nDekodiertes PlayElement:');
        console.log(`  ID: ${playElement.id}`);
        console.log(`  Name: ${playElement.name}`);
        console.log(`  Design ID: ${playElement.designId}`);
        console.log(`  Publish State: ${playElement.publishStateType}`);
        console.log(`  Moderation State: ${playElement.moderationState}`);

        if (playElement.creator) {
            console.log('\n  Creator:');
            if (playElement.creator.playerCreator?.player) {
                console.log(`    Player Creator - Persona ID: ${playElement.creator.playerCreator.player.personaId}`);
            }
            if (playElement.creator.internalCreator) {
                console.log(`    Internal Creator`);
            }
            if (playElement.creator.externalCreator) {
                console.log(`    External Creator`);
            }
        }

        if (playElement.description) {
            console.log(`  Beschreibung: ${playElement.description.value}`);
        }

        if (playElement.shortCode) {
            console.log(`  Short Code: ${playElement.shortCode.value}`);
        }

        // Als JSON ausgeben
        console.log('\nAls JSON:');
        console.log(JSON.stringify(PlayElement.toJSON(playElement), null, 2));

        return playElement;
    } catch (error: any) {
        console.error('Fehler beim Dekodieren:', error.message);
        console.error('Stack:', error.stack);
        return null;
    }
}

// Test 2: PlayElement erstellen und enkodieren
function testEncodePlayElement(): void {
    console.log('\n=== Test: PlayElement erstellen und enkodieren ===');

    try {
        // PlayElement erstellen
        const playElement = PlayElement.create({
            id: 'test-id-12345',
            designId: 'design-id-67890',
            name: 'Test Experience',
            publishStateType: 1, // PUBLISHED
            moderationState: 0,
            description: {
                value: 'Dies ist eine Test-Beschreibung'
            },
            shortCode: {
                value: 'ABCD1234'
            }
        });

        console.log('PlayElement erstellt');

        // Enkodieren
        const writer = new BinaryWriter();
        PlayElement.encode(playElement, writer);
        const binaryData = writer.finish();

        console.log(`Binärdaten-Länge: ${binaryData.length} bytes`);

        // Zu Base64 konvertieren
        const base64Data = uint8ArrayToBase64(binaryData);
        console.log('\nBase64-kodierte Daten:');
        console.log(base64Data);

        // Zurück dekodieren zur Verifikation
        console.log('\nVerifikation durch Rück-Dekodierung:');
        const decoded = PlayElement.decode(binaryData);
        console.log(`  Name: ${decoded.name}`);
        console.log(`  ID: ${decoded.id}`);

    } catch (error: any) {
        console.error('Fehler beim Enkodieren:', error.message);
    }
}

// Test 3: ModRules dekodieren
function testDecodeModRules(base64Data: string): void {
    console.log('\n=== Test: ModRules dekodieren ===');

    try {
        const binaryData = base64ToUint8Array(base64Data);
        console.log(`Base64-Länge: ${base64Data.length} Zeichen`);
        console.log(`Binärdaten-Länge: ${binaryData.length} bytes`);
        console.log(`Erste Bytes (hex):\n    ${hexDump(binaryData, 64)}`);

        const modRules = ModRules.decode(binaryData);

        console.log('\nDekodierte ModRules:');

        if (modRules.compatibleRules) {
            console.log('  Status: Compatible');
            if (modRules.compatibleRules.compiled) {
                const hasUncompressed = modRules.compatibleRules.compiled.uncompressed !== undefined;
                const hasCompressed = modRules.compatibleRules.compiled.compressed !== undefined;
                console.log(`  Compiled Rules vorhanden - Uncompressed: ${hasUncompressed}, Compressed: ${hasCompressed}`);
            }
        } else if (modRules.incompatibleRules) {
            console.log('  Status: Incompatible');
            console.log(`  Rules Version: ${modRules.incompatibleRules.rulesVersion}`);
            console.log(`  Blueprint Rules Version: ${modRules.incompatibleRules.blueprintRulesVersion}`);
        } else if (modRules.errorRules) {
            console.log('  Status: Error');
            if (modRules.errorRules.errorMessage) {
                console.log(`  Message: ${modRules.errorRules.errorMessage.value}`);
            }
        }

        // Als JSON ausgeben
        console.log('\nAls JSON:');
        console.log(JSON.stringify(ModRules.toJSON(modRules), null, 2));

    } catch (error: any) {
        console.error('Fehler beim Dekodieren:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Test 4: Blueprint dekodieren
function testDecodeBlueprint(base64Data: string): void {
    console.log('\n=== Test: Blueprint dekodieren ===');

    try {
        const binaryData = base64ToUint8Array(base64Data);
        console.log(`Base64-Länge: ${base64Data.length} Zeichen`);
        console.log(`Binärdaten-Länge: ${binaryData.length} bytes`);
        console.log(`Erste Bytes (hex):\n    ${hexDump(binaryData, 64)}`);

        const blueprint = Blueprint.decode(binaryData);

        console.log('\nDekodierter Blueprint:');
        console.log(`  Name: ${blueprint.name}`);
        console.log(`  Available Thumbnail URLs: ${blueprint.availableThumbnailUrls.length}`);

        // Als JSON ausgeben
        console.log('\nAls JSON:');
        console.log(JSON.stringify(Blueprint.toJSON(blueprint), null, 2));

    } catch (error: any) {
        console.error('Fehler beim Dekodieren:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Test 5: Generische Funktion zum Dekodieren beliebiger Protobuf-Nachrichten
function decodeGeneric<T>(
    base64Data: string,
    messageType: { decode: (input: Uint8Array) => T; toJSON: (message: T) => unknown },
    typeName: string
): void {
    console.log(`\n=== Test: ${typeName} dekodieren ===`);

    try {
        const binaryData = base64ToUint8Array(base64Data);
        console.log(`Base64-Länge: ${base64Data.length} Zeichen`);
        console.log(`Binärdaten-Länge: ${binaryData.length} bytes`);
        console.log(`Erste Bytes (hex):\n    ${hexDump(binaryData, 64)}`);

        const decoded = messageType.decode(binaryData);

        console.log(`\nDekodierter ${typeName}:`);
        console.log(JSON.stringify(messageType.toJSON(decoded), null, 2));

    } catch (error: any) {
        console.error(`Fehler beim Dekodieren von ${typeName}:`, error.message);
        console.error('Stack:', error.stack);
    }
}

// Hauptfunktion
function main(): void {
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║  Protobuf Base64 Test-Script                         ║');
    console.log('╚═══════════════════════════════════════════════════════╝');

    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('\nVerwendung:');
        console.log('  npm run test:proto -- <datei.txt> [typ]');
        console.log('\nParameter:');
        console.log('  datei.txt  - Datei mit Base64-kodierten Daten');
        console.log('  typ        - Optional: playelement, modrules, blueprint, updaterequest (default: playelement)');
        console.log('\nBeispiel:');
        console.log('  npm run test:proto -- tests/data/playelement.txt');
        console.log('  npm run test:proto -- tests/data/modrules.txt modrules');
        console.log('  npm run test:proto -- tests/updatePlayElement.extracted.base64 updaterequest');
        console.log('\nAlternativ: Demo-Test ohne Parameter ausführen');
        console.log('');

        // Demo-Test
        testEncodePlayElement();
    } else {
        const filePath = args[0];
        const type = args[1] || 'playelement';

        try {
            const base64Data = loadBase64FromFile(filePath);

            switch (type.toLowerCase()) {
                case 'playelement':
                    testDecodePlayElement(base64Data);
                    break;
                case 'modrules':
                    testDecodeModRules(base64Data);
                    break;
                case 'blueprint':
                    testDecodeBlueprint(base64Data);
                    break;
                case 'updaterequest':
                    decodeGeneric(base64Data, UpdatePlayElementRequest, 'UpdatePlayElementRequest');
                    break;
                default:
                    console.error(`Unbekannter Typ: ${type}`);
                    console.log('Gültige Typen: playelement, modrules, blueprint, updaterequest');
            }
        } catch (error: any) {
            console.error('\nFehler:', error.message);
            process.exit(1);
        }
    }

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║  Tests abgeschlossen                                  ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
}

// Script ausführen
main();

// Exportiere die Funktionen für externe Nutzung
export {
    testDecodePlayElement,
    testEncodePlayElement,
    testDecodeModRules,
    testDecodeBlueprint,
    decodeGeneric,
    base64ToUint8Array,
    uint8ArrayToBase64,
    loadBase64FromFile
};
