import React from 'react';
import { formaterDatoTilKortMånedOgÅr, formaterDatoTilMånedOgÅr } from '../../utils/dateUtils';

type Props = {
    fradato: string | null;
    tildato: string | null;
    navarende?: boolean;
};

const Tidsperiode = ({ fradato, tildato, navarende }: Props) => {
    const fradatoFormatted = formaterDatoKortHvisIkkeNull(fradato);
    const tildatoFormatted = formaterDatoKortHvisIkkeNull(tildato);

    if (fradatoFormatted && tildatoFormatted) {
        return (
            <span>
                {fradatoFormatted} - {tildatoFormatted}
                {navarende && ' (Nåværende)'}
            </span>
        );
    } else if (fradatoFormatted) {
        return (
            <span>
                {fradatoFormatted}
                {navarende && ' - (Nåværende)'}
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formaterDatoHvisIkkeNull = (dato: string | null) => {
    if (!dato) {
        return null;
    }

    const formatert = formaterDatoTilMånedOgÅr(dato);
    return formatert[0].toUpperCase() + formatert.substring(1);
};

const formaterDatoKortHvisIkkeNull = (dato: string | null) => {
    if (!dato) {
        return null;
    }

    return formaterDatoTilKortMånedOgÅr(dato);
};

export default Tidsperiode;
