import React, { FunctionComponent, ReactNode } from 'react';
import Lenkeknapp from '../../../../felles/common/Lenkeknapp';
import { HjelpetekstMidt } from 'nav-frontend-hjelpetekst';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';
import SendSmsIkon from './SendSmsIkon';

type Props = {
    kandidater: KandidatIKandidatliste[];
    onKandidatShare: () => void;
    onEmailKandidater: () => void;
    onLeggTilKandidat: () => void;
    onSmsKandidater: () => void;
    kanEditere: boolean;
    arbeidsgiver?: string;
    kandidatlisteId: string;
    stillingsId?: string;
    children: ReactNode;
};

const SmsKnapp: FunctionComponent = () => (
    <>
        <SendSmsIkon />
        <span>Send SMS</span>
    </>
);

const Epostknapp: FunctionComponent = () => (
    <>
        <i className="Email__icon" />
        Kopier e-postadresser
    </>
);

const Deleknapp: FunctionComponent = () => (
    <>
        <i className="Share__icon" />
        <span>Del med arbeidsgiver (presenter)</span>
    </>
);

const SmsKnappMedHjelpetekst: FunctionComponent = () => (
    <div className="Lenkeknapp typo-normal Sms">
        <SmsKnapp />
    </div>
);

const EpostknappMedHjelpetekst: FunctionComponent = () => (
    <div className="Lenkeknapp typo-normal Email">
        <Epostknapp />
    </div>
);

const DeleknappMedHjelpetekst: FunctionComponent = () => (
    <div className="Lenkeknapp typo-normal Share">
        <Deleknapp />
    </div>
);

const KnappeRad: FunctionComponent<Props> = ({
    kandidater,
    onKandidatShare,
    onEmailKandidater,
    onSmsKandidater,
    kanEditere,
    arbeidsgiver,
    children,
    stillingsId,
}) => {
    const minstEnKandidatErMarkert = kandidater.filter(kandidat => kandidat.markert).length > 0;

    return (
        <div className="knappe-rad">
            <div className="knapper-venstre">{children}</div>
            <div className="dele-wrapper">
                {kanEditere &&
                    stillingsId &&
                    (minstEnKandidatErMarkert ? (
                        <div className="hjelpetekst">
                            <Lenkeknapp onClick={onSmsKandidater} className="Sms">
                                <SmsKnapp />
                            </Lenkeknapp>
                        </div>
                    ) : (
                        <HjelpetekstMidt
                            id="marker-kandidater-sms-hjelpetekst"
                            anchor={SmsKnappMedHjelpetekst}
                            tittel="Send SMS til de markerte kandidatene"
                        >
                            Du må huke av for kandidatene du ønsker å sende SMS til.
                        </HjelpetekstMidt>
                    ))}
                {minstEnKandidatErMarkert ? (
                    <div className="hjelpetekst">
                        <Lenkeknapp onClick={onEmailKandidater} className="Email">
                            <Epostknapp />
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
                                <Deleknapp />
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
