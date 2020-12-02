export interface ApiError {
    message: string;
    status: number;
}

export enum Nettstatus {
    IkkeLastet = 'IkkeLastet',
    LasterInn = 'LasterInn',
    SenderInn = 'SenderInn',
    Suksess = 'Suksess',
    FinnesIkke = 'FinnesIkke',
    Feil = 'Feil',
}

interface IkkeLastet {
    kind: Nettstatus.IkkeLastet;
}

interface LasterInn {
    kind: Nettstatus.LasterInn;
}

interface SenderInn<T> {
    kind: Nettstatus.SenderInn;
    data: T;
}

interface Suksess<T> {
    kind: Nettstatus.Suksess;
    data: T;
}

interface FinnesIkke {
    kind: Nettstatus.FinnesIkke;
}

interface Feil {
    kind: Nettstatus.Feil;
    error: ApiError;
}

export const ikkeLastet = (): IkkeLastet => ({
    kind: Nettstatus.IkkeLastet,
});

export const lasterInn = (): LasterInn => ({
    kind: Nettstatus.LasterInn,
});

export const senderInn = <T>(data: T): SenderInn<T> => ({
    kind: Nettstatus.SenderInn,
    data,
});

export const suksess = <T>(data: T): Suksess<T> => ({
    kind: Nettstatus.Suksess,
    data,
});

export const finnesIkke = (): FinnesIkke => ({
    kind: Nettstatus.FinnesIkke,
});

export const feil = (error: ApiError): Feil => ({
    kind: Nettstatus.Feil,
    error,
});

export type RemoteData<T> = IkkeLastet | LasterInn | Feil | Suksess<T>;

export type Nettressurs<T> = IkkeLastet | LasterInn | SenderInn<T> | Feil | Suksess<T> | FinnesIkke;

export type ResponseData<T> = Feil | Suksess<T>;
