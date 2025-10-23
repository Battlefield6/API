import { BinaryReader } from "@bufbuild/protobuf/wire";
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

/**
 * Tool zum Analysieren von Network-Daten aus Chrome DevTools
 */

function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = Buffer.from(base64, 'base64');
    return new Uint8Array(binaryString);
}

function hexDump(data: Uint8Array, maxBytes: number = 128): string {
    const bytes = data.slice(0, maxBytes);
    let hex = '';
    let ascii = '';

    for (let i = 0; i < bytes.length; i++) {
        if (i > 0 && i % 16 === 0) {
            hex += `  ${ascii}\n    `;
            ascii = '';
        }
        hex += bytes[i].toString(16).padStart(2, '0') + ' ';
        ascii += (bytes[i] >= 32 && bytes[i] <= 126) ? String.fromCharCode(bytes[i]) : '.';
    }

    if (ascii) {
        hex += ' '.repeat((16 - (bytes.length % 16)) * 3) + ` ${ascii}`;
    }

    return hex;
}

function analyzeData(data: Uint8Array): void {
    console.log('\n=== Datenanalyse ===');
    console.log(`Gesamtlänge: ${data.length} bytes`);
    console.log('\nErste 128 Bytes (Hex + ASCII):');
    console.log('    ' + hexDump(data, 128));
    console.log('\nLetzte 64 Bytes (Hex + ASCII):');
    console.log('    ' + hexDump(data.slice(-64), 64));

    // Prüfe auf bekannte Magic Bytes
    console.log('\n=== Format-Erkennung ===');

    // gRPC-Web Frame (00000 + length)
    if (data.length >= 5 && data[0] === 0x00) {
        const frameLength = (data[1] << 24) | (data[2] << 16) | (data[3] << 8) | data[4];
        console.log(`✓ Mögliches gRPC-Web Frame erkannt`);
        console.log(`  Frame-Typ: ${data[0]} (0 = data, 1 = trailer)`);
        console.log(`  Frame-Länge: ${frameLength} bytes`);
        console.log(`  Tatsächliche Datenlänge: ${data.length - 5} bytes`);

        if (frameLength === data.length - 5) {
            console.log(`  → Frame-Länge stimmt überein!`);
            return;
        }
    }

    // GZIP Magic Bytes (1f 8b)
    if (data.length >= 2 && data[0] === 0x1f && data[1] === 0x8b) {
        console.log(`✓ GZIP-Kompression erkannt`);
        return;
    }

    // DEFLATE (zlib) Magic Bytes (78 9c, 78 01, 78 da)
    if (data.length >= 2 && data[0] === 0x78) {
        console.log(`✓ Mögliche DEFLATE-Kompression erkannt (78 ${data[1].toString(16)})`);
        return;
    }

    // Protobuf field tags prüfen
    if (data.length >= 1) {
        const firstTag = data[0];
        const fieldNumber = firstTag >>> 3;
        const wireType = firstTag & 0x07;

        if (wireType <= 5) {
            console.log(`✓ Mögliches Protobuf-Format`);
            console.log(`  Erstes Feld: ${fieldNumber}, Wire Type: ${wireType}`);
        } else {
            console.log(`✗ Ungültiger Wire Type: ${wireType} (muss 0-5 sein)`);
        }
    }

    // Suche nach möglichen String-Indikatoren
    let textCount = 0;
    for (let i = 0; i < Math.min(100, data.length); i++) {
        if (data[i] >= 32 && data[i] <= 126) textCount++;
    }
    console.log(`Text-Anteil in ersten 100 Bytes: ${textCount}%`);
}

function findGrpcTrailerStart(data: Uint8Array): number {
    // Suche nach gRPC-Trailer-Pattern (0x80 gefolgt von Länge)
    for (let i = data.length - 100; i < data.length - 5; i++) {
        if (data[i] === 0x80 && data[i + 1] === 0x00 && data[i + 2] === 0x00 && data[i + 3] === 0x00) {
            return i;
        }
    }

    // Suche nach Text-Pattern "grpc-"
    const searchText = 'grpc-';
    for (let i = data.length - 100; i >= 0; i--) {
        let match = true;
        for (let j = 0; j < searchText.length; j++) {
            if (data[i + j] !== searchText.charCodeAt(j)) {
                match = false;
                break;
            }
        }
        if (match) {
            // Gehe zurück zum Frame-Header (5 bytes davor)
            return Math.max(0, i - 20); // Sicherheitspuffer
        }
    }

    return data.length;
}

function findGrpcDataFrameStart(data: Uint8Array): number {
    // Suche nach dem gRPC Frame Header (0x00 gefolgt von 4-Byte Länge)
    for (let i = 0; i < Math.min(100, data.length - 5); i++) {
        if (data[i] === 0x00) {
            const frameLength = (data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | data[i + 4];
            // Validiere, dass die Länge sinnvoll ist
            if (frameLength > 0 && frameLength < data.length) {
                const tag = data[i + 5];
                const wireType = tag & 0x07;
                // Prüfe, ob das nächste Byte ein gültiger Protobuf-Tag ist
                if (wireType <= 5) {
                    console.log(`→ gRPC Data Frame gefunden bei Offset ${i}`);
                    console.log(`  Frame-Länge: ${frameLength} bytes`);
                    console.log(`  Erstes Protobuf-Tag: Field ${tag >>> 3}, Wire Type ${wireType}`);
                    return i;
                }
            }
        }
    }
    return -1;
}

function tryExtractGrpcWebFrame(data: Uint8Array): Uint8Array | null {
    // Suche nach dem gRPC Data Frame (könnte nicht am Anfang sein)
    const frameStart = findGrpcDataFrameStart(data);
    if (frameStart >= 0) {
        const frameLength = (data[frameStart + 1] << 24) | (data[frameStart + 2] << 16) |
                          (data[frameStart + 3] << 8) | data[frameStart + 4];
        console.log(`\n→ Extrahiere gRPC Payload ab Offset ${frameStart + 5} (${frameLength} bytes)...`);
        return data.slice(frameStart + 5, frameStart + 5 + frameLength);
    }

    // Versuche, den Trailer zu finden und zu entfernen
    const trailerStart = findGrpcTrailerStart(data);
    if (trailerStart < data.length) {
        console.log(`\n→ gRPC Trailer gefunden bei Position ${trailerStart}`);
        console.log(`→ Extrahiere Payload (${trailerStart} bytes)...`);
        return data.slice(0, trailerStart);
    }

    return null;
}

function tryDecompress(data: Uint8Array): Uint8Array | null {
    const methods = [
        { name: 'GZIP', fn: () => zlib.gunzipSync(Buffer.from(data)) },
        { name: 'DEFLATE', fn: () => zlib.inflateSync(Buffer.from(data)) },
        { name: 'RAW DEFLATE', fn: () => zlib.inflateRawSync(Buffer.from(data)) },
    ];

    for (const method of methods) {
        try {
            const decompressed = method.fn();
            console.log(`\n→ Erfolgreich mit ${method.name} dekomprimiert (${decompressed.length} bytes)`);
            return new Uint8Array(decompressed);
        } catch (e) {
            // Nächste Methode versuchen
        }
    }

    return null;
}

function main(): void {
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║  Network Data Analyzer                                ║');
    console.log('╚═══════════════════════════════════════════════════════╝');

    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('\nVerwendung:');
        console.log('  npm run test:proto -- tests/updatePlayElement.base64');
        console.log('\nDieses Tool analysiert Base64-Daten aus dem Chrome Network Tab');
        console.log('und versucht, das Format zu erkennen.');
        process.exit(1);
    }

    const filePath = args[0];

    try {
        const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
        console.log(`\nLade Datei: ${absolutePath}`);

        if (!fs.existsSync(absolutePath)) {
            throw new Error(`Datei nicht gefunden: ${absolutePath}`);
        }

        const base64Content = fs.readFileSync(absolutePath, 'utf-8').replace(/\s+/g, '').trim();
        console.log(`Base64-Länge: ${base64Content.length} Zeichen`);

        let data = base64ToUint8Array(base64Content);

        // Analyse der Rohdaten
        analyzeData(data);

        // Versuche gRPC-Web Frame zu extrahieren
        console.log('\n' + '='.repeat(60));
        console.log('Versuche Extraktionsschritte...\n');

        const grpcPayload = tryExtractGrpcWebFrame(data);
        if (grpcPayload) {
            data = grpcPayload;
            console.log('\n--- Nach gRPC-Web Frame Extraktion ---');
            analyzeData(data);
        }

        // Versuche zu dekomprimieren
        const decompressed = tryDecompress(data);
        if (decompressed) {
            data = decompressed;
            console.log('\n--- Nach Dekompression ---');
            analyzeData(data);
        }

        // Speichere die extrahierten/dekomprimierten Daten
        const outputPath = filePath.replace(/\.base64$/, '.extracted.bin');
        fs.writeFileSync(outputPath, data);
        console.log(`\n✓ Extrahierte Payload gespeichert: ${outputPath}`);

        // Auch als Base64 speichern
        const base64Output = Buffer.from(data).toString('base64');
        const base64Path = filePath.replace(/\.base64$/, '.extracted.base64');
        fs.writeFileSync(base64Path, base64Output);
        console.log(`✓ Als Base64 gespeichert: ${base64Path}`);

        console.log('\n' + '═'.repeat(60));
        console.log('Analyse abgeschlossen');
        console.log('\nNächster Schritt:');
        console.log(`  npm run test:proto -- ${base64Path}`);

    } catch (error: any) {
        console.error('\n✗ Fehler:', error.message);
        process.exit(1);
    }
}

main();
