export enum Miljøvariabel {
    LastNedCvUrl = 'KANDIDAT_LAST_NED_CV_URL',
    ArbeidsrettetOppfølgingUrl = 'KANDIDAT_ARBEIDSRETTET_OPPFOLGING_URL',
}

const useMiljøvariabler = (): {
    lastNedCvUrl: string;
    arbeidsrettetOppfølgingUrl: string;
} => {
    if (process.env.NODE_ENV === 'development') {
        return {
            lastNedCvUrl: process.env.VITE_LAST_NED_CV_URL!,
            arbeidsrettetOppfølgingUrl: process.env.VITE_ARBEIDSRETTET_OPPFOLGING_URL!,
        };
    }

    const miljøvariablerFraWindow = {
        lastNedCvUrl: window[Miljøvariabel.LastNedCvUrl],
        arbeidsrettetOppfølgingUrl: window[Miljøvariabel.ArbeidsrettetOppfølgingUrl],
    };

    return miljøvariablerFraWindow;
};

export default useMiljøvariabler;
