import React from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import KandidaterTableRow from './KandidaterTableKandidat';
import KandidaterTableHeader from './KandidaterTableHeader';
import useMaskerFødselsnumre from '../../app/useMaskerFødselsnumre';
import { MarkerbartSøkeresultat } from '../kandidater-og-modal/KandidaterOgModal';
import './KandidaterTabell.less';
import { FunctionComponent } from 'react';

type Props = {
    kandidatlisteId?: string;
    stillingsId?: string;
    kandidater: MarkerbartSøkeresultat[];
    skjulPaginering?: boolean;
    totaltAntallTreff: number;
    antallResultater: number;
    onFlereResultaterClick: () => void;
    onKandidatValgt: (markert: boolean, kandidatnr: string) => void;
    alleKandidaterMarkert: boolean;
    onToggleMarkeringAlleKandidater: () => void;
    valgtKandidatNr: string;
};

const KandidaterTabell: FunctionComponent<Props> = ({
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
}) => {
    useMaskerFødselsnumre();

    return (
        <div className="kandidater-tabell">
            <KandidaterTableHeader
                alleKandidaterMarkert={alleKandidaterMarkert}
                onToggleMarkeringAlleKandidater={onToggleMarkeringAlleKandidater}
            />
            {kandidater.slice(0, antallResultater).map((kandidat) => (
                <KandidaterTableRow
                    kandidat={kandidat}
                    key={kandidat.arenaKandidatnr}
                    onKandidatValgt={onKandidatValgt}
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
};

export default KandidaterTabell;
