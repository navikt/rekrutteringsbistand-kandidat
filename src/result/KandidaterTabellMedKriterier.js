import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Systemtittel } from 'nav-frontend-typografi';
import KandidaterTableRow from './resultstable/KandidaterTableRow';
import KandidaterTableHeader from './resultstable/KandidaterTableHeader';
import { cvPropTypes } from '../PropTypes';

function KandidaterTabellMedKriterier({ antallResultater, onFilterUtdanningClick, onFilterJobberfaringClick, onFilterAntallArClick, onFlereResultaterClick, cver, totaltAntallTreff }) {
    let tittel = '';
    if (totaltAntallTreff > 5) {
        tittel = 'Topp 5 kandidater';
    } else if (totaltAntallTreff === 0) {
        tittel = 'Ingen direkte treff';
    } else if (totaltAntallTreff === 1) {
        tittel = 'Beste kandidat';
    } else {
        tittel = `Topp ${totaltAntallTreff} kandidater`;
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
                    to={5}
                />
                {cver.slice(0, 5)
                    .map((cv) => (
                        <KandidaterTableRow
                            cv={cv}
                            key={cv.arenaKandidatnr}
                        />
                    ))}
            </div>
            {cver.length > 5 && (
                <div className="resultatvisning">
                    <Systemtittel>Andre aktuelle kandidater</Systemtittel>
                    <KandidaterTableHeader
                        onFilterUtdanningClick={onFilterUtdanningClick}
                        onFilterJobberfaringClick={onFilterJobberfaringClick}
                        onFilterAntallArClick={onFilterAntallArClick}
                        from={5}
                        to={antallResultater}
                    />
                    {cver.slice(5, antallResultater)
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

export default connect(mapStateToProps)(KandidaterTabellMedKriterier);

