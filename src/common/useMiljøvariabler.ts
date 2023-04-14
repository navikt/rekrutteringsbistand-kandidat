export enum Miljøvariabel {
    LastNedCvUrl = 'KANDIDAT_LAST_NED_CV_URL',
    ArbeidsrettetOppfølgingUrl = 'KANDIDAT_ARBEIDSRETTET_OPPFOLGING_URL',
}

const useMiljøvariabler = (): {
    lastNedCvUrl: string;
    arbeidsrettetOppfølgingUrl: string;
} => {
    if (import.meta.env.MODE === 'development') {
        return {
            lastNedCvUrl: import.meta.env.VITE_LAST_NED_CV_URL!,
            arbeidsrettetOppfølgingUrl: import.meta.env.VITE_ARBEIDSRETTET_OPPFOLGING_URL!,
        };
    }

    const miljøvariablerFraWindow = {
        lastNedCvUrl: window[Miljøvariabel.LastNedCvUrl],
        arbeidsrettetOppfølgingUrl: window[Miljøvariabel.ArbeidsrettetOppfølgingUrl],
    };

    return miljøvariablerFraWindow;
};

export default useMiljøvariabler;
