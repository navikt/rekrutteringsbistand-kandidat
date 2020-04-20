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

interface IkkeLastet {
    kind: Nettstatus.IkkeLastet;
}

interface LasterInn {
    kind: Nettstatus.LasterInn;
}

interface Suksess<T> {
    kind: Nettstatus.Suksess;
    data: T;
}

interface Feil {
    kind: Nettstatus.Feil;
    error: ApiError;
}

export const IkkeLastet = (): IkkeLastet => ({
    kind: Nettstatus.IkkeLastet,
});

export const LasterInn = (): LasterInn => ({
    kind: Nettstatus.LasterInn,
});

export const Suksess = <T>(data: T): Suksess<T> => ({
    kind: Nettstatus.Suksess,
    data,
});

export const Feil = (error: ApiError): Feil => ({
    kind: Nettstatus.Feil,
    error,
});

export type RemoteData<T> = IkkeLastet | LasterInn | Feil | Suksess<T>;

export type ResponseData<T> = Feil | Suksess<T>;
