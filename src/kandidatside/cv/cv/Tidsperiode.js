import React from 'react';
import PropTypes from 'prop-types';
import { formaterDatoTilMånedOgÅr } from '../../../utils/dateUtils';

const formaterDatoHvisIkkeNull = (dato) => {
    return dato ? formaterDatoTilMånedOgÅr(dato) : null;
};

export default function Tidsperiode({ fradato, tildato, navarende }) {
    const fradatoFormatted = formaterDatoHvisIkkeNull(fradato);
    const tildatoFormatted = formaterDatoHvisIkkeNull(tildato);

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
}

Tidsperiode.defaultProps = {
    navarende: false,
    fradato: undefined,
    tildato: undefined,
};

Tidsperiode.propTypes = {
    fradato: PropTypes.string,
    tildato: PropTypes.string,
    navarende: PropTypes.bool,
};
