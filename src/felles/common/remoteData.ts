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
    SendtInn = 'SendtInn',
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

interface SendtInn {
    kind: Nettstatus.SendtInn;
}

interface FinnesIkke {
    kind: Nettstatus.FinnesIkke;
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

export const SenderInn = <T>(data: T): SenderInn<T> => ({
    kind: Nettstatus.SenderInn,
    data,
});

export const SendtInn = (): SendtInn => ({
    kind: Nettstatus.SendtInn,
});

export const Suksess = <T>(data: T): Suksess<T> => ({
    kind: Nettstatus.Suksess,
    data,
});

export const FinnesIkke = (): FinnesIkke => ({
    kind: Nettstatus.FinnesIkke,
});

export const Feil = (error: ApiError): Feil => ({
    kind: Nettstatus.Feil,
    error,
});

export type RemoteData<T> = IkkeLastet | LasterInn | Feil | Suksess<T>;

export type Nettressurs<T> =
    | IkkeLastet
    | LasterInn
    | SenderInn<T>
    | Feil
    | Suksess<T>
    | SendtInn
    | FinnesIkke;

export type ResponseData<T> = Feil | Suksess<T>;
