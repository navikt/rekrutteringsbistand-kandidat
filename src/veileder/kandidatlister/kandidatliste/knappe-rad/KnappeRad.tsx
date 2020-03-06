import React, { FunctionComponent, ReactNode } from 'react';
import Lenkeknapp from '../../../../felles/common/Lenkeknapp';
import { HjelpetekstMidt } from 'nav-frontend-hjelpetekst';
import { KandidatIKandidatliste } from '../../reducer/kandidatlisteReducer';

type Props = {
    kandidater: KandidatIKandidatliste[];
    onKandidatShare: () => void;
    onEmailKandidater: () => void;
    onLeggTilKandidat: () => void;
    kanEditere: boolean;
    arbeidsgiver?: string;
    kandidatlisteId: string;
    stillingsId?: string;
    children: ReactNode;
};

const KnappeRad: FunctionComponent<Props> = ({
    kandidater,
    onKandidatShare,
    onEmailKandidater,
    kanEditere,
    arbeidsgiver,
    children,
}) => {
    const DeleKnapp = () => {
        const Disabled = () => (
            <div className="Lenkeknapp typo-normal Share">
                <i className="Share__icon" />
                <span>Del med arbeidsgiver (presenter)</span>
            </div>
        );
        const Enabled = () => (
            <div className="hjelpetekst">
                <Lenkeknapp onClick={onKandidatShare} className="Share">
                    <i className="Share__icon" />
                    <span>Del med arbeidsgiver (presenter)</span>
                </Lenkeknapp>
            </div>
        );
        if (kandidater.filter(kandidat => kandidat.markert).length > 0) {
            return <Enabled />;
        }
        return (
            <HjelpetekstMidt
                id="marker-kandidater-presentere-hjelpetekst"
                anchor={Disabled}
                tittel="Del de markerte kandidatene med arbeidsgiver (presenter)"
            >
                Du må huke av for kandidatene du ønsker å presentere for arbeidsgiver.
            </HjelpetekstMidt>
        );
    };
    const EpostKnapp = () => {
        const Disabled = () => (
            <div className="Lenkeknapp typo-normal Email">
                <i className="Email__icon" />
                Kopier e-postadresser
            </div>
        );
        const Enabled = () => (
            <div className="hjelpetekst">
                <Lenkeknapp onClick={onEmailKandidater} className="Email">
                    <i className="Email__icon" />
                    <span>Kopier e-postadresser</span>
                </Lenkeknapp>
            </div>
        );
        if (kandidater.filter(kandidat => kandidat.markert).length > 0) {
            return <Enabled />;
        }
        return (
            <HjelpetekstMidt
                id="marker-kandidater-epost-hjelpetekst"
                anchor={Disabled}
                tittel="Send e-post til de markerte kandidatene"
            >
                Du må huke av for kandidatene du ønsker å kopiere e-postadressen til.
            </HjelpetekstMidt>
        );
    };
    return (
        <div className="knappe-rad">
            <div className="knapper-venstre">{children}</div>
            <div className="dele-wrapper">
                <EpostKnapp />
                {kanEditere && arbeidsgiver && <DeleKnapp />}
            </div>
        </div>
    );
};

export default KnappeRad;
