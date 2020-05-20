import { FunctionComponent } from 'react';
import React from 'react';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { SokKandidatlisterInput } from '../Kandidatlister';
import './KandidatlisterSideHeader.less';

interface Props {
    sokeOrd?: string;
    onSokeOrdChange: any;
    onSubmitSokKandidatlister?: any;
    nullstillSok: () => void;
    opprettListe: () => void;
}

export const KandidatlisterSideHeader: FunctionComponent<Props> = ({
    sokeOrd,
    onSokeOrdChange,
    onSubmitSokKandidatlister,
    nullstillSok,
    opprettListe,
}) => (
    <div className="side-header">
        <div className="side-header__innhold">
            <div className="header-child" />
            <div className="header-child tittel-wrapper">
                <SokKandidatlisterInput
                    sokeOrd={sokeOrd || ''}
                    onSokeOrdChange={onSokeOrdChange}
                    onSubmitSokKandidatlister={onSubmitSokKandidatlister}
                />
            </div>
            <div className="header-child knapp-wrapper">
                <Flatknapp onClick={nullstillSok} className="nullstill-sok__knapp" mini>
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
