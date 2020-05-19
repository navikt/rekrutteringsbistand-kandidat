import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { LenkeMedChevron } from '../lenke-med-chevron/LenkeMedChevron';
import './ForrigeNeste.less';

type Props = {
    className?: string;
    lenkeClass: string;
    forrigeKandidat?: string;
    nesteKandidat?: string;
    gjeldendeKandidatIndex?: number;
    antallKandidater: number;
};

const ForrigeNeste: FunctionComponent<Props> = ({
    className,
    lenkeClass,
    forrigeKandidat,
    nesteKandidat,
    gjeldendeKandidatIndex = 0,
    antallKandidater,
}) => {
    if (antallKandidater > 1) {
        const klasseNavn = className ? className : '';
        return (
            <div className={'forrige-neste ' + klasseNavn}>
                {forrigeKandidat && (
                    <LenkeMedChevron
                        to={forrigeKandidat}
                        className={lenkeClass}
                        type="venstre"
                        text="Forrige kandidat"
                    />
                )}
                <Normaltekst className="forrige-neste__index">
                    {gjeldendeKandidatIndex + 1} av {antallKandidater}
                </Normaltekst>
                {nesteKandidat ? (
                    <LenkeMedChevron
                        to={nesteKandidat}
                        className={lenkeClass}
                        type="hoyre"
                        text="Neste kandidat"
                    />
                ) : (
                    <div className="forrige-neste__placeholder" />
                )}
            </div>
        );
    }
    return null;
};

export default ForrigeNeste;
