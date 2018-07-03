import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Systemtittel } from 'nav-frontend-typografi';
import KandidaterTableRow from './resultstable/KandidaterTableRow';
import KandidaterTableHeader from './resultstable/KandidaterTableHeader';
import { cvPropTypes } from '../PropTypes';


export default function KandidaterTabellUtenKriterier({ antallResultater, onFilterUtdanningClick, onFilterJobberfaringClick, onFilterAntallArClick, onFlereResultaterClick, kandidater, totaltAntallTreff }) {
    return (

        <div className="resultatvisning">

            <Systemtittel>Alle kandidater</Systemtittel>
            <KandidaterTableHeader
                onFilterUtdanningClick={onFilterUtdanningClick}
                onFilterJobberfaringClick={onFilterJobberfaringClick}
                onFilterAntallArClick={onFilterAntallArClick}
                from={0}
                to={antallResultater}
            />
            {kandidater.slice(0, antallResultater).map((cv) => (
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
    );
}

KandidaterTabellUtenKriterier.propTypes = {
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    antallResultater: PropTypes.number.isRequired,
    onFilterUtdanningClick: PropTypes.func.isRequired,
    onFilterJobberfaringClick: PropTypes.func.isRequired,
    onFilterAntallArClick: PropTypes.func.isRequired,
    onFlereResultaterClick: PropTypes.func.isRequired

};
