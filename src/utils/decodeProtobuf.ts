import { UpdatePlayElementRequest } from "../generated/models/UpdatePlayElementRequest";
import { PlayElement } from "../generated/models/PlayElement";

/**
 * Dekodiert gRPC-Web Frame (verwendet die gleiche Logik wie REST.decode)
 *
 * gRPC-Web Frame Format:
 * - 1 byte: compression flag (0 = not compressed, 1 = compressed)
 * - 4 bytes: message length (big-endian uint32)
 * - N bytes: message data
 */
function decodeGrpcFrame(buffer: ArrayBuffer): Uint8Array {
    const view = new DataView(buffer);

    if (buffer.byteLength < 5) {
        throw new Error('Response too short for gRPC-Web frame');
    }

    const compressionFlag = view.getUint8(0);
    const messageLength = view.getUint32(1, false); // false = big-endian

    if (compressionFlag !== 0) {
        throw new Error('Compressed responses not supported');
    }

    return new Uint8Array(buffer, 5, messageLength);
}

/**
 * Entfernt gRPC Trailer am Ende der Daten (falls vorhanden)
 */
function removeGrpcTrailer(data: Uint8Array): Uint8Array {
    // Suche nach "grpc-" Text am Ende (Teil des Trailers)
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
            // Trailer gefunden, schneide ab (mit etwas Puffer)
            return data.slice(0, Math.max(0, i - 20));
        }
    }
    return data;
}

/**
 * Findet und extrahiert gRPC Frame, auch wenn er nicht am Anfang ist
 */
function findAndExtractGrpcFrame(data: Uint8Array): Uint8Array {
    // Suche nach gRPC Frame Header (0x00 gefolgt von 4-Byte Länge)
    for (let i = 0; i < Math.min(100, data.length - 5); i++) {
        if (data[i] === 0x00) {
            const frameLength = (data[i + 1] << 24) | (data[i + 2] << 16) |
                              (data[i + 3] << 8) | data[i + 4];
            const tag = data[i + 5];
            const wireType = tag & 0x07;

            if (frameLength > 0 && frameLength < data.length && wireType <= 5) {
                // Gültiger Frame gefunden
                return data.slice(i + 5, i + 5 + frameLength);
            }
        }
    }
    return data;
}

/**
 * Dekodiert Base64-kodierte Protobuf-Daten aus Chrome DevTools Network Tab
 *
 * @param base64 - Base64-String (kann gRPC-Web Framing enthalten)
 * @param messageType - Typ der Protobuf-Nachricht
 * @returns Dekodiertes JavaScript-Objekt
 *
 * @example
 * ```typescript
 * import { decodeBase64 } from './src/utils/decodeProtobuf';
 *
 * const base64 = "..."; // Aus Chrome DevTools
 * const result = decodeBase64(base64);
 * console.log(result);
 * ```
 */
export function decodeBase64(
    base64: string,
    messageType: 'UpdatePlayElementRequest' | 'PlayElement' = 'UpdatePlayElementRequest'
): any {
    // 1. Base64 zu ArrayBuffer (wie in REST.ts)
    const bytes = Buffer.from(base64, 'base64');
    let buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);

    // 2. Versuche Standard gRPC-Web Frame zu dekodieren (wie REST.decode)
    let data: Uint8Array;
    try {
        data = decodeGrpcFrame(buffer);
    } catch (e) {
        // Frame nicht am Anfang oder anderes Format
        // Versuche Frame zu finden
        const uint8Data = new Uint8Array(buffer);
        data = findAndExtractGrpcFrame(uint8Data);
    }

    // 3. Entferne gRPC Trailer (falls vorhanden)
    data = removeGrpcTrailer(data);

    // 4. Dekodiere Protobuf zu JavaScript-Objekt
    if (messageType === 'UpdatePlayElementRequest') {
        const decoded = UpdatePlayElementRequest.decode(data);
        return UpdatePlayElementRequest.toJSON(decoded);
    } else {
        const decoded = PlayElement.decode(data);
        return PlayElement.toJSON(decoded);
    }
}

/**
 * Dekodiert Base64-kodierte UpdatePlayElementRequest-Daten
 */
export function decodeUpdateRequest(base64: string): any {
    return decodeBase64(base64, 'UpdatePlayElementRequest');
}

/**
 * Dekodiert Base64-kodierte PlayElement-Daten
 */
export function decodePlayElement(base64: string): any {
    return decodeBase64(base64, 'PlayElement');
}
