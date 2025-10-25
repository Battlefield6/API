/**
 * @author      Adrian Preuß
 * @since       1.0.0
 */

class SessionException extends Error {}
class CanceledException extends Error {}
class UnknownException extends Error {}
class InvalidArgumentException extends Error {}
class DeadlineExceededException extends Error {}
class NotFoundException extends Error {}
class AlreadyExistsException extends Error {}
class PermissionDeniedException extends Error {}
class ResourceExhaustedxception extends Error {}
class FailedPreconditionException extends Error {}
class AbortedException extends Error {}
class OutOfRangeException extends Error {}
class UnimplementedException extends Error {}
class InternalException extends Error {}
class UnavailableException extends Error {}
class DataLossException extends Error {}

export {
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
}