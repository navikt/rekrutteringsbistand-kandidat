export enum Miljøvariabel {
    LastNedCvUrl = 'KANDIDAT_LAST_NED_CV_URL',
    ArbeidsrettetOppfølgingUrl = 'KANDIDAT_ARBEIDSRETTET_OPPFOLGING_URL',
}

const useMiljøvariabler = () => {
    if (process.env.NODE_ENV === 'development') {
        return {
            lastNedCvUrl: process.env.REACT_APP_LAST_NED_CV_URL,
            arbeidsrettetOppfølgingUrl: process.env.REACT_APP_ARBEIDSRETTET_OPPFOLGING_URL,
        };
    }

    const miljøvariablerFraWindow = {
        lastNedCvUrl: window[Miljøvariabel.LastNedCvUrl],
        arbeidsrettetOppfølgingUrl: window[Miljøvariabel.ArbeidsrettetOppfølgingUrl],
    };

    return miljøvariablerFraWindow;
};

export default useMiljøvariabler;
