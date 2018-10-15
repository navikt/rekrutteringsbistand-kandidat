import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Systemtittel } from 'nav-frontend-typografi';
import KandidaterTableRow from './resultstable/KandidaterTableRow';
import KandidaterTableHeader from './resultstable/KandidaterTableHeader';
import cvPropTypes from '../PropTypes';


const antallBesteTreff = 5;

export default function KandidaterTabellMedKriterier({
    antallResultater,
    onFilterAntallArClick,
    onFilterScoreClick,
    onFlereResultaterClick,
    kandidater,
    totaltAntallTreff,
    onKandidatValgt,
    alleKandidaterMarkert,
    onToggleMarkeringAlleKandidater
}) {
    let tittel = '';
    if (totaltAntallTreff > antallBesteTreff) {
        tittel = `${antallBesteTreff} beste treff`;
    } else if (totaltAntallTreff === 0) {
        tittel = 'Ingen direkte treff';
    } else if (totaltAntallTreff === 1) {
        tittel = 'Beste treff';
    } else {
        tittel = `${totaltAntallTreff} beste treff`;
    }

    return (
        <div>
            <div className="resultatvisning">
                <Systemtittel>{tittel}</Systemtittel>
                <KandidaterTableHeader
                    onFilterAntallArClick={onFilterAntallArClick}
                    onFilterScoreClick={onFilterScoreClick}
                    from={0}
                    to={antallBesteTreff}
                    alleKandidaterMarkert={alleKandidaterMarkert}
                    onToggleMarkeringAlleKandidater={onToggleMarkeringAlleKandidater}
                    visCheckbox
                />
                <div className="panel">
                    {kandidater.slice(0, antallBesteTreff)
                        .map((cv) => (
                            <KandidaterTableRow
                                cv={cv}
                                key={cv.arenaKandidatnr}
                                onKandidatValgt={onKandidatValgt}
                                markert={cv.markert}
                            />
                        ))}
                </div>
            </div>
            {kandidater.length > antallBesteTreff && (
                <div className="resultatvisning">
                    <Systemtittel>Andre aktuelle kandidater</Systemtittel>
                    <KandidaterTableHeader
                        onFilterAntallArClick={onFilterAntallArClick}
                        onFilterScoreClick={onFilterScoreClick}
                        from={antallBesteTreff}
                        to={antallResultater}
                        visCheckbox={false}
                    />
                    <div className="panel">
                        {kandidater.slice(antallBesteTreff, antallResultater)
                            .map((cv) => (
                                <KandidaterTableRow
                                    cv={cv}
                                    key={cv.arenaKandidatnr}
                                    onKandidatValgt={onKandidatValgt}
                                    markert={cv.markert}
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
            )}
        </div>
    );
}


KandidaterTabellMedKriterier.propTypes = {
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    antallResultater: PropTypes.number.isRequired,
    onFilterAntallArClick: PropTypes.func.isRequired,
    onFilterScoreClick: PropTypes.func.isRequired,
    onFlereResultaterClick: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    onKandidatValgt: PropTypes.func.isRequired,
    alleKandidaterMarkert: PropTypes.bool.isRequired,
    onToggleMarkeringAlleKandidater: PropTypes.func.isRequired
};

