import React from 'react';
import { formaterDatoTilMånedOgÅr } from '../../utils/dateUtils';

type Props = {
    fradato?: string | null;
    tildato?: string | null;
    navarende?: boolean;
};

const Tidsperiode = ({ fradato, tildato, navarende }: Props) => {
    const fradatoFormatted = formaterDatoHvisIkkeNull(fradato);
    const tildatoFormatted = formaterDatoHvisIkkeNull(tildato);

    if (fradatoFormatted && tildatoFormatted) {
        return (
            <span>
                {fradatoFormatted} – {tildatoFormatted}
                {navarende && ' (Nåværende)'}
            </span>
        );
    } else if (fradatoFormatted) {
        return (
            <span>
                {fradatoFormatted}
                {navarende && ' – (Nåværende)'}
            </span>
        );
    } else if (tildatoFormatted) {
        return (
            <span>
                {tildatoFormatted}
                {navarende && ' (Nåværende)'}
            </span>
        );
    }
    return <span>{navarende && 'Nåværende'}</span>;
};

const formaterDatoHvisIkkeNull = (dato?: string | null) => {
    if (!dato) {
        return null;
    }

    return formaterDatoTilMånedOgÅr(dato);
};

export default Tidsperiode;
