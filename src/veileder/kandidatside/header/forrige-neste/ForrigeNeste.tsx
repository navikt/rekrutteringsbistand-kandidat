import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { LenkeMedChevron } from '../lenke-med-chevron/LenkeMedChevron';
import './ForrigeNeste.less';

const ForrigeNeste = ({
    className,
    lenkeClass,
    forrigeKandidat,
    nesteKandidat,
    gjeldendeKandidatIndex,
    antallKandidater,
}) => {
    if (antallKandidater > 1) {
        const klasseNavn = className ? className : '';
        return (
            <div className={'forrige-neste ' + klasseNavn}>
                {forrigeKandidat && (
                    <LenkeMedChevron
                        to={forrigeKandidat}
                        className={lenkeClass}
                        type="venstre"
                        text="Forrige kandidat"
                    />
                )}
                <Normaltekst className="forrige-neste__index">
                    {gjeldendeKandidatIndex + 1} av {antallKandidater}
                </Normaltekst>
                {nesteKandidat ? (
                    <LenkeMedChevron
                        to={nesteKandidat}
                        className={lenkeClass}
                        type="hoyre"
                        text="Neste kandidat"
                    />
                ) : (
                    <div className="forrige-neste__placeholder" />
                )}
            </div>
        );
    }
    return null;
};

ForrigeNeste.defaultProps = {
    forrigeKandidat: undefined,
    nesteKandidat: undefined,
    gjeldendeKandidatIndex: undefined,
    antallKandidater: undefined,
};

ForrigeNeste.propTypes = {
    className: PropTypes.string,
    lenkeClass: PropTypes.string.isRequired,
    forrigeKandidat: PropTypes.string,
    nesteKandidat: PropTypes.string,
    gjeldendeKandidatIndex: PropTypes.number,
    antallKandidater: PropTypes.number,
};

export default ForrigeNeste;
