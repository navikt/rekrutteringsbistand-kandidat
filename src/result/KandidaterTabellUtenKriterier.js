import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Systemtittel } from 'nav-frontend-typografi';
import KandidaterTableRow from './resultstable/KandidaterTableRow';
import KandidaterTableHeader from './resultstable/KandidaterTableHeader';
import { cvPropTypes } from '../PropTypes';


function KandidaterTabellUtenKriterier({ antallResultater, onFilterUtdanningClick, onFilterJobberfaringClick, onFilterAntallArClick, onFlereResultaterClick, cver, totaltAntallTreff }) {
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
            {cver.map((cv) => (
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
                <a
                    className="lenke lenke--lagre--sok"
                >
                    Lagre søk og liste over kandidater
                </a>
            </div>
        </div>
    );
}

KandidaterTabellUtenKriterier.propTypes = {
    cver: PropTypes.arrayOf(cvPropTypes).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    antallResultater: PropTypes.number.isRequired,
    onFilterUtdanningClick: PropTypes.func.isRequired,
    onFilterJobberfaringClick: PropTypes.func.isRequired,
    onFilterAntallArClick: PropTypes.func.isRequired,
    onFlereResultaterClick: PropTypes.func.isRequired

};

const mapStateToProps = (state) => ({
    totaltAntallTreff: state.search.elasticSearchResultat.resultat.totaltAntallTreff
});

export default connect(mapStateToProps)(KandidaterTabellUtenKriterier);
