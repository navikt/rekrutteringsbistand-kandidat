export interface ApiError {
    message: string;
    status: number;
}

export enum Nettstatus {
    IkkeLastet = 'IkkeLastet',
    LasterInn = 'LasterInn',
    SenderInn = 'SenderInn',
    Suksess = 'Suksess',
    Feil = 'Feil',
}

interface NotAsked {
    kind: Nettstatus.IkkeLastet;
}

interface Loading {
    kind: Nettstatus.LasterInn;
}

interface Success<T> {
    kind: Nettstatus.Suksess;
    data: T;
}

interface Failure {
    kind: Nettstatus.Feil;
    error: ApiError;
}

export const NotAsked = (): NotAsked => ({
    kind: Nettstatus.IkkeLastet,
});

export const Loading = (): Loading => ({
    kind: Nettstatus.LasterInn,
});

export const Success = <T>(data: T): Success<T> => ({
    kind: Nettstatus.Suksess,
    data,
});

export const Failure = (error: ApiError): Failure => ({
    kind: Nettstatus.Feil,
    error,
});

export type RemoteData<T> = NotAsked | Loading | Failure | Success<T>;

export type ResponseData<T> = Failure | Success<T>;
