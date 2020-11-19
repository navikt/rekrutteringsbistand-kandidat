import React from 'react';
import PropTypes from 'prop-types';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import KandidaterTableRow from './KandidaterTableKandidat';
import KandidaterTableHeader from './KandidaterTableHeader';
import cvPropTypes from '../../../felles/PropTypes';
import './KandidaterTabell.less';
import useMaskerFødselsnumre from '../../application/useMaskerFødselsnumre';

export default function KandidaterTabell({
    antallResultater,
    skjulPaginering,
    onFlereResultaterClick,
    kandidater,
    totaltAntallTreff,
    onKandidatValgt,
    alleKandidaterMarkert,
    onToggleMarkeringAlleKandidater,
    valgtKandidatNr,
    kandidatlisteId,
    stillingsId,
}) {
    useMaskerFødselsnumre();

    return (
        <div className="kandidater-tabell">
            <KandidaterTableHeader
                from={0}
                to={antallResultater}
                alleKandidaterMarkert={alleKandidaterMarkert}
                onToggleMarkeringAlleKandidater={onToggleMarkeringAlleKandidater}
            />
            {kandidater.slice(0, antallResultater).map((kandidat) => (
                <KandidaterTableRow
                    kandidat={kandidat}
                    key={kandidat.arenaKandidatnr}
                    onKandidatValgt={onKandidatValgt}
                    markert={kandidat.markert}
                    visCheckbox={false}
                    nettoppValgt={valgtKandidatNr === kandidat.arenaKandidatnr}
                    kandidatlisteId={kandidatlisteId}
                    stillingsId={stillingsId}
                />
            ))}

            <div className="kandidater-tabell__under-treff">
                {antallResultater < totaltAntallTreff && (
                    <Hovedknapp mini onClick={onFlereResultaterClick}>
                        Se flere kandidater
                    </Hovedknapp>
                )}
                {!skjulPaginering && (
                    <Element className="kandidater-tabell__antall-treff">
                        Viser{' '}
                        {antallResultater > totaltAntallTreff
                            ? totaltAntallTreff
                            : antallResultater}{' '}
                        av {totaltAntallTreff}
                    </Element>
                )}
            </div>
        </div>
    );
}

KandidaterTabell.defaultProps = {
    kandidatlisteId: undefined,
    stillingsId: undefined,
};

KandidaterTabell.propTypes = {
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    skjulPaginering: PropTypes.bool.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    antallResultater: PropTypes.number.isRequired,
    onFlereResultaterClick: PropTypes.func.isRequired,
    onKandidatValgt: PropTypes.func.isRequired,
    alleKandidaterMarkert: PropTypes.bool.isRequired,
    onToggleMarkeringAlleKandidater: PropTypes.func.isRequired,
    valgtKandidatNr: PropTypes.string.isRequired,
    kandidatlisteId: PropTypes.string,
    stillingsId: PropTypes.string,
};
