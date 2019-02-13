import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';
import NavFrontendChevron from 'nav-frontend-chevron';

const VisKandidatForrigeNeste = ({ lenkeClass, forrigeKandidat, nesteKandidat, kandidatIndex, antallKandidater }) => {
    if (antallKandidater > 1) {
        return (
            <div className="navigering-forrige-neste">
                {forrigeKandidat &&
                    <Link
                        to={forrigeKandidat}
                        className={lenkeClass}
                    >
                        <NavFrontendChevron type="venstre" /> Forrige kandidat
                    </Link>
                }
                {(forrigeKandidat || nesteKandidat) &&
                    <Normaltekst className="index">{kandidatIndex} av {antallKandidater}</Normaltekst>
                }
                {nesteKandidat ? (
                    <Link
                        to={nesteKandidat}
                        className={lenkeClass}
                    >
                        Neste kandidat <NavFrontendChevron type="høyre" />
                    </Link>) : (<div className="header--personalia__lenke--placeholder" />
                )}
            </div>
        );
    }
    return null;
};

VisKandidatForrigeNeste.defaultProps = {
    forrigeKandidat: undefined,
    nesteKandidat: undefined,
    kandidatIndex: undefined,
    antallKandidater: undefined
};

VisKandidatForrigeNeste.propTypes = {
    lenkeClass: PropTypes.string.isRequired,
    forrigeKandidat: PropTypes.string,
    nesteKandidat: PropTypes.string,
    kandidatIndex: PropTypes.number,
    antallKandidater: PropTypes.number
};

export default VisKandidatForrigeNeste;
