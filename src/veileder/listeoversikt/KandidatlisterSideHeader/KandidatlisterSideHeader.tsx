import React, { ChangeEvent } from 'react';
import { FunctionComponent } from 'react';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import SøkKandidatlisterInput from './SøkKandidatlisterInput';
import './KandidatlisterSideHeader.less';

interface Props {
    søkeOrd?: string;
    onSøkeOrdChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSubmitSøkKandidatlister?: any;
    nullstillSøk: () => void;
    opprettListe: () => void;
}

export const KandidatlisterSideHeader: FunctionComponent<Props> = ({
    søkeOrd,
    onSøkeOrdChange,
    onSubmitSøkKandidatlister,
    nullstillSøk,
    opprettListe,
}) => (
    <div className="side-header">
        <div className="side-header__innhold">
            <div className="header-child" />
            <div className="header-child tittel-wrapper">
                <SøkKandidatlisterInput
                    søkeOrd={søkeOrd || ''}
                    onSøkeOrdChange={onSøkeOrdChange}
                    onSubmitSøkKandidatlister={onSubmitSøkKandidatlister}
                />
            </div>
            <div className="header-child knapp-wrapper">
                <Flatknapp onClick={nullstillSøk} className="nullstill-sok__knapp" mini>
                    Nullstill søk
                </Flatknapp>
                <Hovedknapp
                    onClick={opprettListe}
                    id="opprett-ny-liste"
                    className="kandidatlister-side-header__opprett-ny"
                >
                    Opprett ny
                </Hovedknapp>
            </div>
        </div>
    </div>
);
