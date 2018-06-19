import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Systemtittel } from 'nav-frontend-typografi';
import KandidaterTableRow from './resultstable/KandidaterTableRow';
import KandidaterTableHeader from './resultstable/KandidaterTableHeader';
import { cvPropTypes } from '../PropTypes';


const antallBesteTreff = 5;

export default function KandidaterTabellMedKriterier({ antallResultater, onFilterUtdanningClick, onFilterJobberfaringClick, onFilterAntallArClick, onFlereResultaterClick, cver, totaltAntallTreff }) {
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
                    onFilterJobberfaringClick={onFilterJobberfaringClick}
                    onFilterAntallArClick={onFilterAntallArClick}
                    from={0}
                    to={antallBesteTreff}
                />
                {cver.slice(0, antallBesteTreff)
                    .map((cv) => (
                        <KandidaterTableRow
                            cv={cv}
                            key={cv.arenaKandidatnr}
                        />
                    ))}
            </div>
            {cver.length > antallBesteTreff && (
                <div className="resultatvisning">
                    <Systemtittel>Andre aktuelle kandidater</Systemtittel>
                    <KandidaterTableHeader
                        onFilterUtdanningClick={onFilterUtdanningClick}
                        onFilterJobberfaringClick={onFilterJobberfaringClick}
                        onFilterAntallArClick={onFilterAntallArClick}
                        from={antallBesteTreff}
                        to={antallResultater}
                    />
                    {cver.slice(antallBesteTreff, antallResultater)
                        .map((cv) => (
                            <KandidaterTableRow
                                cv={cv}
                                key={cv.arenaKandidatnr}
                            />
                        ))}
                    <div className="buttons--kandidatervisning">
                        {cver.length > antallResultater && (
                            <Knapp
                                type="hoved"
                                mini
                                onClick={onFlereResultaterClick}
                            >
                                Se flere kandidater
                            </Knapp>
                        )}
                        <Element className="antall--treff--kandidatervisning">
                            Viser {antallResultater > totaltAntallTreff ? totaltAntallTreff : antallResultater} av {totaltAntallTreff}
                        </Element>
                    </div>
                </div>
            )}
        </div>
    );
}


KandidaterTabellMedKriterier.propTypes = {
    cver: PropTypes.arrayOf(cvPropTypes).isRequired,
    antallResultater: PropTypes.number.isRequired,
    onFilterUtdanningClick: PropTypes.func.isRequired,
    onFilterJobberfaringClick: PropTypes.func.isRequired,
    onFilterAntallArClick: PropTypes.func.isRequired,
    onFlereResultaterClick: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired

};

