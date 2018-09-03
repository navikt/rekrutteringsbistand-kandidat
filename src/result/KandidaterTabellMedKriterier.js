import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Systemtittel } from 'nav-frontend-typografi';
import KandidaterTableRow from './resultstable/KandidaterTableRow';
import KandidaterTableHeader from './resultstable/KandidaterTableHeader';
import cvPropTypes from '../PropTypes';


const antallBesteTreff = 5;

export default function KandidaterTabellMedKriterier({ antallResultater, onFilterUtdanningClick, onFilterScoreClick, onFilterJobberfaringClick, onFilterAntallArClick, onFlereResultaterClick, kandidater, totaltAntallTreff }) {
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
                    onFilterUtdanningClick={onFilterUtdanningClick}
                    onFilterScoreClick={onFilterScoreClick}
                    onFilterJobberfaringClick={onFilterJobberfaringClick}
                    onFilterAntallArClick={onFilterAntallArClick}
                    from={0}
                    to={antallBesteTreff}
                />
                {kandidater.slice(0, antallBesteTreff)
                    .map((cv) => (
                        <KandidaterTableRow
                            cv={cv}
                            key={cv.arenaKandidatnr}
                        />
                    ))}
            </div>
            {kandidater.length > antallBesteTreff && (
                <div className="resultatvisning">
                    <Systemtittel>Andre aktuelle kandidater</Systemtittel>
                    <KandidaterTableHeader
                        onFilterUtdanningClick={onFilterUtdanningClick}
                        onFilterScoreClick={onFilterScoreClick} 
                        onFilterJobberfaringClick={onFilterJobberfaringClick}
                        onFilterAntallArClick={onFilterAntallArClick}
                        from={antallBesteTreff}
                        to={antallResultater}
                    />
                    {kandidater.slice(antallBesteTreff, antallResultater)
                        .map((cv) => (
                            <KandidaterTableRow
                                cv={cv}
                                key={cv.arenaKandidatnr}
                            />
                        ))}
                    <div className="buttons--kandidatervisning">
                        {kandidater.length > antallResultater && (
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
    onFilterUtdanningClick: PropTypes.func.isRequired,
    onFilterScoreClick: PropTypes.func.isRequired,
    onFilterJobberfaringClick: PropTypes.func.isRequired,
    onFilterAntallArClick: PropTypes.func.isRequired,
    onFlereResultaterClick: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired

};

