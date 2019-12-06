import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'pam-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import KandidaterTableRow from './resultstable/KandidaterTableRow';
import KandidaterTableHeader from './resultstable/KandidaterTableHeader';
import cvPropTypes from '../../felles/PropTypes';
import { USE_JANZZ } from '../../arbeidsgiver/common/fasitProperties';


export default function KandidaterTabell({
    antallResultater,
    onFilterScoreClick,
    onFlereResultaterClick,
    kandidater,
    totaltAntallTreff,
    onKandidatValgt,
    alleKandidaterMarkert,
    onToggleMarkeringAlleKandidater,
    valgtKandidatNr,
    urlQuery,
    initialState
}) {
    return (
        <div className="table Kandidater-table">
            <KandidaterTableHeader
                onFilterScoreClick={onFilterScoreClick}
                from={0}
                to={antallResultater}
                alleKandidaterMarkert={alleKandidaterMarkert}
                onToggleMarkeringAlleKandidater={onToggleMarkeringAlleKandidater}
            />

            {(!initialState || Object.entries(urlQuery).length > 0) && <div className="tbody">
                {kandidater.slice(0, antallResultater).map((cv) => (
                    <KandidaterTableRow
                        cv={cv}
                        key={cv.arenaKandidatnr}
                        onKandidatValgt={onKandidatValgt}
                        markert={cv.markert}
                        visCheckbox={false}
                        nettoppValgt={valgtKandidatNr === cv.arenaKandidatnr}
                    />
                ))}
            </div>}
            {(!initialState || Object.entries(urlQuery).length > 0) && !USE_JANZZ && <div className="buttons--kandidatervisning">
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
            </div>}
        </div>
    );
}

KandidaterTabell.propTypes = {
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    antallResultater: PropTypes.number.isRequired,
    onFilterScoreClick: PropTypes.func.isRequired,
    onFlereResultaterClick: PropTypes.func.isRequired,
    onKandidatValgt: PropTypes.func.isRequired,
    alleKandidaterMarkert: PropTypes.bool.isRequired,
    onToggleMarkeringAlleKandidater: PropTypes.func.isRequired,
    valgtKandidatNr: PropTypes.string.isRequired,
    urlQuery: PropTypes.oneOfType([PropTypes.object]).isRequired,
    initialState: PropTypes.bool.isRequired
};
