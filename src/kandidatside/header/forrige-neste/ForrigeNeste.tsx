import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { LenkeMedChevron } from '../lenke-med-chevron/LenkeMedChevron';
import { Kandidatnavigering } from '../../fra-søk/useNavigerbareKandidaterFraSøk';
import './ForrigeNeste.less';

type Props = {
    className?: string;
    lenkeClass: string;
    kandidatnavigering: Kandidatnavigering;
};

const ForrigeNeste: FunctionComponent<Props> = ({ className, lenkeClass, kandidatnavigering }) => {
    const { forrige, neste, antall, index } = kandidatnavigering;

    if (antall > 1) {
        const klasseNavn = className ? className : '';
        return (
            <div className={'forrige-neste ' + klasseNavn}>
                {forrige && (
                    <LenkeMedChevron
                        to={forrige}
                        className={lenkeClass}
                        type="venstre"
                        text="Forrige kandidat"
                    />
                )}
                <Normaltekst className="forrige-neste__index">
                    {index + 1} av {antall}
                </Normaltekst>
                {neste ? (
                    <LenkeMedChevron
                        to={neste}
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
