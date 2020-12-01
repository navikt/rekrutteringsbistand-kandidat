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

interface IIkkeLastet {
    kind: Nettstatus.IkkeLastet;
}

interface ILasterInn {
    kind: Nettstatus.LasterInn;
}

interface ISenderInn<T> {
    kind: Nettstatus.SenderInn;
    data: T;
}

interface ISuksess<T> {
    kind: Nettstatus.Suksess;
    data: T;
}

interface IFinnesIkke {
    kind: Nettstatus.FinnesIkke;
}

interface IFeil {
    kind: Nettstatus.Feil;
    error: ApiError;
}

export const IkkeLastet = (): IIkkeLastet => ({
    kind: Nettstatus.IkkeLastet,
});

export const LasterInn = (): ILasterInn => ({
    kind: Nettstatus.LasterInn,
});

export const SenderInn = <T>(data: T): ISenderInn<T> => ({
    kind: Nettstatus.SenderInn,
    data,
});

export const Suksess = <T>(data: T): ISuksess<T> => ({
    kind: Nettstatus.Suksess,
    data,
});

export const FinnesIkke = (): IFinnesIkke => ({
    kind: Nettstatus.FinnesIkke,
});

export const Feil = (error: ApiError): IFeil => ({
    kind: Nettstatus.Feil,
    error,
});

export type RemoteData<T> = IIkkeLastet | ILasterInn | IFeil | ISuksess<T>;

export type Nettressurs<T> =
    | IIkkeLastet
    | ILasterInn
    | ISenderInn<T>
    | IFeil
    | ISuksess<T>
    | IFinnesIkke;

export type ResponseData<T> = IFeil | ISuksess<T>;
