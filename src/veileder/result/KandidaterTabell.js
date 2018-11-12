import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import KandidaterTableRow from './resultstable/KandidaterTableRow';
import KandidaterTableHeader from './resultstable/KandidaterTableHeader';
import cvPropTypes from '../../felles/PropTypes';


export default function KandidaterTabell({
    antallResultater,
    onFilterAntallArClick,
    onFlereResultaterClick,
    kandidater,
    totaltAntallTreff,
    onKandidatValgt,
    alleKandidaterMarkert,
    onToggleMarkeringAlleKandidater,
    valgtKandidatNr
}) {
    return (

        <div className="resultatvisning">
            <KandidaterTableHeader
                onFilterAntallArClick={onFilterAntallArClick}
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

KandidaterTabell.propTypes = {
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    antallResultater: PropTypes.number.isRequired,
    onFilterAntallArClick: PropTypes.func.isRequired,
    onFlereResultaterClick: PropTypes.func.isRequired,
    onKandidatValgt: PropTypes.func.isRequired,
    alleKandidaterMarkert: PropTypes.bool.isRequired,
    onToggleMarkeringAlleKandidater: PropTypes.func.isRequired,
    valgtKandidatNr: PropTypes.string.isRequired
};
