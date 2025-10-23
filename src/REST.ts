/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */

import Status from './enums/Status';
import {
    CanceledException,
    UnknownException,
    InvalidArgumentException,
    DeadlineExceededException,
    NotFoundException,
    AlreadyExistsException,
    PermissionDeniedException,
    ResourceExhaustedxception,
    FailedPreconditionException,
    AbortedException,
    OutOfRangeException,
    UnimplementedException,
    InternalException,
    UnavailableException,
    DataLossException,
    SessionException
} from './Exceptions';

export default class REST {
    public static async call(method: string, url: string, data: Uint8Array | null, headers: Record<string, string> | null): Promise<Uint8Array<ArrayBufferLike> | null> {
        let objects: RequestInit = {
            method:     method,
            headers:    {
                ...this.getHeaders(),
                ...headers
            }
        };

        if(data) {
            objects.body =  this.encode(data) as any;
        }

        const response: Response = await fetch(url, objects);

        if(!response.ok) {
            const error: string = await response.text();
            //console.warn('[' + method + '] on ' + url, data, objects, response, error);

            throw new Error(`HTTP ${response.status}: ${error}`);
        }

        // Read raw body
        const rawBuffer: ArrayBuffer = await response.arrayBuffer();
        //console.info('[' + method + '] on ' + url, data, objects, response, rawBuffer);

        // If server returned no body (trailer-only), inspect grpc-status header for errors like unauthenticated
        if(rawBuffer.byteLength === 0) {
            const status    = Number(response.headers.get('grpc-status')) || Status.UNKNOWN;
            const message   = response.headers.get('grpc-message') || '';
        
            // @ToDo Enum values!
            if(status && status !== Status.OK) {
                switch(status) {
                    case Status.CANCELLED:
                        throw new CanceledException(message || 'The request does not have valid authentication credentials for the operation.');
                    case Status.UNKNOWN:
                        throw new UnknownException(message || 'Unknown error. For example, this error may be returned when a Status value received from another address space belongs to an error space that is not known in this address space. Also errors raised by APIs that do not return enough error information may be converted to this error.');
                    case Status.INVALID_ARGUMENT:
                        throw new InvalidArgumentException(message || 'The client specified an invalid argument. Note that this differs from FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are problematic regardless of the state of the system (e.g., a malformed file name).');
                    case Status.DEADLINE_EXCEEDED:
                        throw new DeadlineExceededException(message || 'The deadline expired before the operation could complete. For operations that change the state of the system, this error may be returned even if the operation has completed successfully. For example, a successful response from a server could have been delayed long enough for the deadline to expire.');
                    case Status.NOT_FOUND:
                        throw new NotFoundException(message || 'Some requested entity (e.g., file or directory) was not found. Note to server developers: if a request is denied for an entire class of users, such as gradual feature rollout or undocumented allowlist, NOT_FOUND may be used. If a request is denied for some users within a class of users, such as user-based access control, PERMISSION_DENIED must be used.');
                    case Status.ALREADY_EXISTS:
                        throw new AlreadyExistsException(message || 'The entity that a client attempted to create (e.g., file or directory) already exists.');
                    case Status.PERMISSION_DENIED:
                        throw new PermissionDeniedException(message || 'The caller does not have permission to execute the specified operation. PERMISSION_DENIED must not be used for rejections caused by exhausting some resource (use RESOURCE_EXHAUSTED instead for those errors). PERMISSION_DENIED must not be used if the caller can not be identified (use UNAUTHENTICATED instead for those errors). This error code does not imply the request is valid or the requested entity exists or satisfies other pre-conditions.');
                    case Status.RESOURCE_EXHAUSTED:
                        throw new ResourceExhaustedxception(message || 'Some resource has been exhausted, perhaps a per-user quota, or perhaps the entire file system is out of space.');
                    case Status.FAILED_PRECONDITION:
                        throw new FailedPreconditionException(message || 'The operation was rejected because the system is not in a state required for the operation’s execution. For example, the directory to be deleted is non-empty, an rmdir operation is applied to a non-directory, etc. Service implementors can use the following guidelines to decide between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE: (a) Use UNAVAILABLE if the client can retry just the failing call. (b) Use ABORTED if the client should retry at a higher level (e.g., when a client-specified test-and-set fails, indicating the client should restart a read-modify-write sequence). (c) Use FAILED_PRECONDITION if the client should not retry until the system state has been explicitly fixed. E.g., if an “rmdir” fails because the directory is non-empty, FAILED_PRECONDITION should be returned since the client should not retry unless the files are deleted from the directory.');
                    case Status.ABORTED:
                        throw new AbortedException(message || 'The operation was aborted, typically due to a concurrency issue such as a sequencer check failure or transaction abort. See the guidelines above for deciding between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE.');
                    case Status.OUT_OF_RANGE:
                        throw new OutOfRangeException(message || 'The operation was attempted past the valid range. E.g., seeking or reading past end-of-file. Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed if the system state changes. For example, a 32-bit file system will generate INVALID_ARGUMENT if asked to read at an offset that is not in the range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from an offset past the current file size. There is a fair bit of overlap between FAILED_PRECONDITION and OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error) when it applies so that callers who are iterating through a space can easily look for an OUT_OF_RANGE error to detect when they are done.');
                    case Status.UNIMPLEMENTED:
                        throw new UnimplementedException(message || 'The operation is not implemented or is not supported/enabled in this service.');
                    case Status.INTERNAL:
                        throw new InternalException(message || 'Internal errors. This means that some invariants expected by the underlying system have been broken. This error code is reserved for serious errors.');
                    case Status.UNAVAILABLE:
                        throw new UnavailableException(message || 'The service is currently unavailable. This is most likely a transient condition, which can be corrected by retrying with a backoff. Note that it is not always safe to retry non-idempotent operations.');
                    case Status.DATA_LOSS:
                        throw new DataLossException(message || 'Unrecoverable data loss or corruption.');
                    case Status.UNAUTHENTICATED:
                        throw new SessionException(message || 'The request does not have valid authentication credentials for the operation.');
                }

                throw new Error(`gRPC ${status}: ${message}`);
            }

            return null;
        }
        
        const type   = response.headers.get('content-type') || '';
        let binary   = rawBuffer;

        if(type.includes('application/grpc-web-text')) {
            try {
                // rawBuffer holds UTF-8 text base64 -> need to decode
                const text = new TextDecoder('utf-8').decode(rawBuffer);
            
                // strip any newlines/spaces
                const b64       = text.replace(/\s+/g, '');
                const bytes     = Buffer.from(b64, 'base64');
                binary          = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
            } catch (e) {
                // ignore decode errors here
            }
        }

        return this.decode(binary);
    }

    public static async post(url: string, data: Uint8Array | null, headers: Record<string, string> | null) {
        return this.call('POST', url, data, headers);
    }
    
    public static async get(url: string, headers: Record<string, string> | null) {
        return this.call('GET', url, null, headers);
    }
    
    public static async delete(url: string, data: Uint8Array | null, headers: Record<string, string> | null) {
        return this.call('DELETE', url, data, headers);
    }
    
    private static getHeaders(): Record<string, string> {
        return {
            'Accept':               '*/*',
            'Content-Type':         'application/grpc-web+proto',
            'x-grpc-web':           '1'
        };
    }

    private static encode(bytes: Uint8Array): Buffer {
        const length    = bytes.length;
        const header    = Buffer.alloc(5);

        header.writeUInt8(0, 0); // compression flag = 0
        header.writeUInt32BE(length, 1);

        return Buffer.concat([
            header,
            Buffer.from(bytes)
        ]);
    }

    private static decode(buffer: ArrayBuffer): Uint8Array {
        // gRPC-Web Frame Format:
        // - 1 byte: compression flag (0 = not compressed, 1 = compressed)
        // - 4 bytes: message length (big-endian uint32)
        // - N bytes: message data
        
        const view: DataView = new DataView(buffer);
        
        if(buffer.byteLength < 5) {
            console.log('Buffer too short:', buffer.byteLength, buffer);
            throw new Error('Response too short for gRPC-Web frame');
        }
        
        const compressionFlag: number   = view.getUint8(0);
        const messageLength: number     = view.getUint32(1, false); // false = big-endian
        
        if(compressionFlag !== 0) {
            throw new Error('Compressed responses not supported');
        }
        
        return new Uint8Array(buffer, 5, messageLength);
    }
}