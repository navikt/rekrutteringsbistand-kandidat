import { meg } from './veiledere.mock';

const dekoratør = {
    ident: meg.ident,
    navn: meg.navn,
    fornavn: meg.fornavn,
    etternavn: meg.etternavn,
    enheter: [
        { enhetId: '0239', navn: 'NAV Hurdal' },
        { enhetId: '0425', navn: 'NAV Åsnes' },
        { enhetId: '0491', navn: 'NAV Arbeidslivssenter Innlandet' },
        { enhetId: '0604', navn: 'NAV Kongsberg' },
        { enhetId: '0691', navn: 'NAV Arbeidslivssenter Vest-Viken' },
        { enhetId: '1001', navn: 'NAV Kristiansand' },
        { enhetId: '1004', navn: 'NAV Flekkefjord' },
    ],
};

export default dekoratør;
