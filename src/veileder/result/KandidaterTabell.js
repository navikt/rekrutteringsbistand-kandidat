import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import KandidaterTableRow from './resultstable/KandidaterTableRow';
import KandidaterTableHeader from './resultstable/KandidaterTableHeader';
import cvPropTypes from '../../felles/PropTypes';


export default function KandidaterTabell({
    antallResultater,
    onFlereResultaterClick,
    kandidater,
    totaltAntallTreff,
    onKandidatValgt,
    alleKandidaterMarkert,
    onToggleMarkeringAlleKandidater,
    valgtKandidatNr,
    stillingsId
}) {
    return (
        <div className="resultatvisning">
            <KandidaterTableHeader
                from={0}
                to={antallResultater}
                alleKandidaterMarkert={alleKandidaterMarkert}
                onToggleMarkeringAlleKandidater={onToggleMarkeringAlleKandidater}
            />

            <div>
                {kandidater.slice(0, antallResultater).map((kandidat) => (
                    <KandidaterTableRow
                        kandidat={kandidat}
                        key={kandidat.arenaKandidatnr}
                        onKandidatValgt={onKandidatValgt}
                        markert={kandidat.markert}
                        visCheckbox={false}
                        nettoppValgt={valgtKandidatNr === kandidat.arenaKandidatnr}
                        stillingsId={stillingsId}
                    />
                ))}
            </div>
            <div className="buttons--kandidatervisning">
                {antallResultater < totaltAntallTreff && (
                    <Knapp
                        type="hoved"
                        mini
                        onClick={onFlereResultaterClick}
                    >
                        Se flere kandidater
                    </Knapp>
                )}
                <Element className="antall-treff-kandidatervisning">
                    Viser {antallResultater > totaltAntallTreff ? totaltAntallTreff : antallResultater} av {totaltAntallTreff}
                </Element>
            </div>
        </div>
    );
}

KandidaterTabell.defaultProps = {
    stillingsId: undefined
};

KandidaterTabell.propTypes = {
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    antallResultater: PropTypes.number.isRequired,
    onFlereResultaterClick: PropTypes.func.isRequired,
    onKandidatValgt: PropTypes.func.isRequired,
    alleKandidaterMarkert: PropTypes.bool.isRequired,
    onToggleMarkeringAlleKandidater: PropTypes.func.isRequired,
    valgtKandidatNr: PropTypes.string.isRequired,
    stillingsId: PropTypes.string
};
