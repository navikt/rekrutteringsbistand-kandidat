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
    FinnesIkkeMedForklaring = 'FinnesIkkeMedForklaring',
    Feil = 'Feil',
}

interface IkkeLastet {
    kind: Nettstatus.IkkeLastet;
}

interface LasterInn {
    kind: Nettstatus.LasterInn;
}

interface SenderInn {
    kind: Nettstatus.SenderInn;
}

interface Suksess<T> {
    kind: Nettstatus.Suksess;
    data: T;
}

interface FinnesIkke {
    kind: Nettstatus.FinnesIkke;
}

interface FinnesIkkeMedForklaring<F> {
    kind: Nettstatus.FinnesIkkeMedForklaring;
    forklaring: F;
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

export const senderInn = (): SenderInn => ({
    kind: Nettstatus.SenderInn,
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

export type Nettressurs<T> = IkkeLastet | LasterInn | SenderInn | Feil | Suksess<T> | FinnesIkke;

export type NettressursMedForklaring<T, F> =
    | IkkeLastet
    | LasterInn
    | Feil
    | Suksess<T>
    | FinnesIkkeMedForklaring<F>;
