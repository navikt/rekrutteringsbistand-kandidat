import React, { FunctionComponent } from 'react';
import { HjelpetekstMidt } from 'nav-frontend-hjelpetekst';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';

interface Props {
    stillingsId: string;
    alleMarkert: boolean;
    onCheckAlleKandidater: () => void;
}

const ListeHeader: FunctionComponent<Props> = ({
    stillingsId,
    alleMarkert,
    onCheckAlleKandidater,
}) => {
    const Sporsmalstegn = () => (
        <span className="Sporsmalstegn">
            <span className="Sporsmalstegn__icon" />
        </span>
    );
    const StatusHjelpetekst = () => (
        <HjelpetekstMidt
            id="sd"
            anchor={Sporsmalstegn}
            className="bred-hjelpetekst statusforklaring-stor"
        >
            <strong>Forklaring til status</strong>
            <ul className="statusliste">
                <li>
                    Vurderes &ndash; Kandidater som er lagt i en kandidatliste får status vurderes
                </li>
                <li>Kontaktet &ndash; Kandidaten er kontaktet, og det ventes på svar</li>
                <li>Aktuell &ndash; Kandidaten er vurdert som aktuell for stillingen</li>
                <li>Ikke aktuell &ndash; Kandidaten er vurdert som ikke aktuell for stillingen</li>
                <li>Ikke interessert &ndash; Kandidaten er ikke interessert i stillingen</li>
            </ul>
            Statusene er kun synlig internt og vil ikke bli delt med arbeidsgiver.
        </HjelpetekstMidt>
    );
    return (
        <div className="liste-rad-wrapper liste-header">
            <div className="liste-rad">
                <div className="kolonne-checkboks">
                    <Checkbox
                        label="&#8203;" // <- tegnet for tom streng
                        className="text-hide skjemaelement--pink"
                        checked={alleMarkert}
                        onChange={onCheckAlleKandidater}
                    />
                </div>
                <div className="kolonne-bred">
                    <Element>Navn</Element>
                </div>
                <div className="kolonne-dato">
                    <Element>Fødselsnummer</Element>
                </div>
                <div className="kolonne-bred">
                    <Element>Lagt til av</Element>
                </div>
                <div className="kolonne-middels">
                    <div className="status-overskrift">
                        Status
                        <StatusHjelpetekst />
                    </div>
                </div>
                {stillingsId && (
                    <div className="kolonne-bred">
                        <Element>Utfall</Element>
                    </div>
                )}
                <div className="kolonne-smal">
                    <Element>Notater</Element>
                </div>
                <div className="kolonne-smal">
                    <Element>Mer info</Element>
                </div>
                <div className="kolonne-smal">
                    <Element>Slett</Element>
                </div>
            </div>
        </div>
    );
};

export default ListeHeader;
