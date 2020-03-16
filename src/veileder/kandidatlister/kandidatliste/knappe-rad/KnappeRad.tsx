import React, { FunctionComponent, ReactNode } from 'react';
import Lenkeknapp from '../../../../felles/common/Lenkeknapp';
import { HjelpetekstMidt } from 'nav-frontend-hjelpetekst';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';

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

const EpostknappMedHjelpetekst: FunctionComponent = () => (
    <div className="Lenkeknapp typo-normal Email">
        <i className="Email__icon" />
        Kopier e-postadresser
    </div>
);

const DeleknappMedHjelpetekst: FunctionComponent = () => (
    <div className="Lenkeknapp typo-normal Share">
        <i className="Share__icon" />
        <span>Del med arbeidsgiver (presenter)</span>
    </div>
);

const KnappeRad: FunctionComponent<Props> = ({
    kandidater,
    onKandidatShare,
    onEmailKandidater,
    kanEditere,
    arbeidsgiver,
    children,
}) => {
    const minstEnKandidatErMarkert = kandidater.filter(kandidat => kandidat.markert).length > 0;

    return (
        <div className="knappe-rad">
            <div className="knapper-venstre">{children}</div>
            <div className="dele-wrapper">
                {minstEnKandidatErMarkert ? (
                    <div className="hjelpetekst">
                        <Lenkeknapp onClick={onEmailKandidater} className="Email">
                            <i className="Email__icon" />
                            <span>Kopier e-postadresser</span>
                        </Lenkeknapp>
                    </div>
                ) : (
                    <HjelpetekstMidt
                        id="marker-kandidater-epost-hjelpetekst"
                        anchor={EpostknappMedHjelpetekst}
                        tittel="Send e-post til de markerte kandidatene"
                    >
                        Du må huke av for kandidatene du ønsker å kopiere e-postadressen til.
                    </HjelpetekstMidt>
                )}
                {kanEditere &&
                    arbeidsgiver &&
                    (minstEnKandidatErMarkert ? (
                        <div className="hjelpetekst">
                            <Lenkeknapp onClick={onKandidatShare} className="Share">
                                <i className="Share__icon" />
                                <span>Del med arbeidsgiver (presenter)</span>
                            </Lenkeknapp>
                        </div>
                    ) : (
                        <HjelpetekstMidt
                            id="marker-kandidater-presentere-hjelpetekst"
                            anchor={DeleknappMedHjelpetekst}
                            tittel="Del de markerte kandidatene med arbeidsgiver (presenter)"
                        >
                            Du må huke av for kandidatene du ønsker å presentere for arbeidsgiver.
                        </HjelpetekstMidt>
                    ))}
            </div>
        </div>
    );
};

export default KnappeRad;
