export interface ApiError {
    message: string;
    status: number;
}

export enum RemoteDataTypes {
    NOT_ASKED = 'NOT_ASKED',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

interface NotAsked {
    kind: RemoteDataTypes.NOT_ASKED;
}

interface Loading {
    kind: RemoteDataTypes.LOADING;
}

interface Success<T> {
    kind: RemoteDataTypes.SUCCESS;
    data: T;
}

interface Failure {
    kind: RemoteDataTypes.FAILURE;
    error: ApiError;
}

export const NotAsked = (): NotAsked => ({
    kind: RemoteDataTypes.NOT_ASKED,
});

export const Loading = (): Loading => ({
    kind: RemoteDataTypes.LOADING,
});

export const Success = <T>(data: T): Success<T> => ({
    kind: RemoteDataTypes.SUCCESS,
    data,
});

export const Failure = (error: ApiError): Failure => ({
    kind: RemoteDataTypes.FAILURE,
    error,
});

export type RemoteData<T> = NotAsked | Loading | Failure | Success<T>;

export type ResponseData<T> = Failure | Success<T>;

export function mapRemoteData<T, U>(remoteData: RemoteData<T>, func: (T) => U): RemoteData<U> {
    if (remoteData.kind === RemoteDataTypes.SUCCESS) {
        return Success(func(remoteData.data));
    }
    return remoteData;
}

export function mapResponseData<T, U>(
    responseData: ResponseData<T>,
    func: (T) => U
): ResponseData<U> {
    if (responseData.kind === RemoteDataTypes.SUCCESS) {
        return Success(func(responseData.data));
    }
    return responseData;
}
