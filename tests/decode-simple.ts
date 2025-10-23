import { UpdatePlayElementRequest } from "../src/generated/models/UpdatePlayElementRequest";
import { PlayElement } from "../src/generated/models/PlayElement";
import * as fs from 'fs';

/**
 * Dekodiert Base64-Daten aus Chrome Network Tab zu einem JavaScript-Objekt
 */

function decodeBase64ToObject(base64: string, messageType: 'UpdatePlayElementRequest' | 'PlayElement' = 'UpdatePlayElementRequest'): any {
    // 1. Base64 zu Uint8Array
    const binaryData = Buffer.from(base64, 'base64');
    let data = new Uint8Array(binaryData);

    // 2. Finde und entferne gRPC-Web Frame Header (falls vorhanden)
    // Suche nach 0x00 gefolgt von 4-Byte Länge
    for (let i = 0; i < Math.min(100, data.length - 5); i++) {
        if (data[i] === 0x00) {
            const frameLength = (data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | data[i + 4];
            const tag = data[i + 5];
            const wireType = tag & 0x07;

            if (frameLength > 0 && frameLength < data.length && wireType <= 5) {
                // gRPC Frame gefunden, extrahiere Payload
                data = data.slice(i + 5, i + 5 + frameLength);
                break;
            }
        }
    }

    // 3. Entferne gRPC Trailer (falls vorhanden)
    // gRPC Trailer beginnt mit 0x80 (Frame-Flag für Trailer)
    // Suche von hinten nach dem ersten Protobuf-Ende
    for (let i = data.length - 1; i >= data.length - 200 && i >= 0; i--) {
        if (data[i] === 0x80) {
            // Möglicher Trailer gefunden, schneide ab
            data = data.slice(0, i);
            break;
        }
    }

    // 4. Dekodiere Protobuf
    let decoded: any;
    if (messageType === 'UpdatePlayElementRequest') {
        decoded = UpdatePlayElementRequest.decode(data);
        // Konvertiere zu Plain Object statt toJSON
        return decoded;
    } else {
        decoded = PlayElement.decode(data);
        // Konvertiere zu Plain Object statt toJSON
        return decoded;
    }
}

// CLI Usage
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage:');
        console.log('  npm run decode -- <file.base64> [type]');
        console.log('');
        console.log('Example:');
        console.log('  npm run decode -- tests/updatePlayElement.base64');
        console.log('  npm run decode -- tests/updatePlayElement.base64 UpdatePlayElementRequest');
        console.log('  npm run decode -- tests/playelement.base64 PlayElement');
        process.exit(1);
    }

    const filePath = args[0];
    const type = (args[1] || 'UpdatePlayElementRequest') as any;

    try {
        // Lade Base64 aus Datei
        const base64 = fs.readFileSync(filePath, 'utf-8').replace(/\s+/g, '').trim();

        // Dekodiere
        const result = decodeBase64ToObject(base64, type);

        // Ausgabe als formatiertes JSON
        console.log(JSON.stringify(result, null, 2));

    } catch (error: any) {
        console.error('Fehler:', error.message);
        process.exit(1);
    }
}

// Export für programmatische Nutzung
export { decodeBase64ToObject };
