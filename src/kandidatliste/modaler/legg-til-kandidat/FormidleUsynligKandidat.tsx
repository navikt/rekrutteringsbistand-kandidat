import React, { FunctionComponent, useState } from 'react';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';
import { CheckboxGruppe, Checkbox } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import { postFormidlingerAvUsynligKandidat } from '../../../api/api';
import { Nettressurs, ikkeLastet, senderInn, Nettstatus } from '../../../api/Nettressurs';
import { UsynligKandidat, FormidlingAvUsynligKandidat } from '../../domene/Kandidat';
import { FormidlingAvUsynligKandidatOutboundDto } from '../legg-til-kandidat-modal/LeggTilKandidatModal';
import { Kandidatliste } from '../../domene/Kandidatliste';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { capitalizeFirstLetter } from '../../../kandidatsøk/utils';

const FormidleUsynligKandidat: FunctionComponent<{
    fnr: string;
    usynligKandidat: UsynligKandidat[];
    kandidatliste: Kandidatliste;
    stillingsId: string;
    valgtNavKontor: string;
    onClose: () => void;
}> = ({ fnr, usynligKandidat, kandidatliste, stillingsId, valgtNavKontor, onClose }) => {
    const [formidling, setFormidling] = useState<Nettressurs<FormidlingAvUsynligKandidat>>(
        ikkeLastet()
    );
    const [presentert, setPresentert] = useState<boolean>(false);
    const [fåttJobb, setFåttJobb] = useState<boolean>(false);

    const formidleUsynligKandidat = async () => {
        setFormidling(senderInn());

        const dto: FormidlingAvUsynligKandidatOutboundDto = {
            fnr,
            presentert,
            fåttJobb,
            navKontor: valgtNavKontor,
            stillingsId,
        };

        setFormidling(await postFormidlingerAvUsynligKandidat(kandidatliste.kandidatlisteId, dto));
    };

    if (!kandidatliste.kanEditere) {
        return (
            <Normaltekst>
                Du er ikke eier av stillingen og kan derfor ikke registrere formidling.
            </Normaltekst>
        );
    }

    const harValgtEtAlternativ = presentert || fåttJobb;

    return (
        <>
            <Normaltekst className="blokk-s">
                {hentNavnPåUsynligKandidat(usynligKandidat)} ({fnr})
            </Normaltekst>
            <AlertStripeInfo className="LeggTilKandidatModal__folkeregister-info">
                Navnet er hentet fra folkeregisteret. Selv om personen ikke er synlig i
                Rekrutteringsbistand, kan du allikevel registrere formidlingen her for statistikkens
                del. Personen vil vises øverst i kandidatlisten.
            </AlertStripeInfo>
            <div className="blokk-m">
                <CheckboxGruppe legend={`Registrer formidling for ${usynligKandidat[0].fornavn}:`}>
                    <Checkbox
                        label="Registrer at personen er blitt presentert"
                        checked={presentert}
                        onChange={(event) => setPresentert(event.target.checked)}
                    />
                    <Checkbox
                        label="Registrer at personen har fått jobb"
                        checked={fåttJobb}
                        onChange={(event) => setFåttJobb(event.target.checked)}
                    />
                </CheckboxGruppe>
            </div>
            <div>
                <Hovedknapp
                    onClick={formidleUsynligKandidat}
                    spinner={formidling.kind === Nettstatus.SenderInn}
                    disabled={formidling.kind === Nettstatus.SenderInn || !harValgtEtAlternativ}
                >
                    Legg til
                </Hovedknapp>
                <Flatknapp
                    className="LeggTilKandidatModal__avbryt-knapp"
                    onClick={onClose}
                    disabled={formidling.kind === Nettstatus.SenderInn}
                >
                    Avbryt
                </Flatknapp>
            </div>
        </>
    );
};

const hentNavnPåUsynligKandidat = (navn: UsynligKandidat[]) =>
    navn
        .map((n) => {
            const fornavn = capitalizeFirstLetter(n.fornavn);
            const mellomnavn = n.mellomnavn ? capitalizeFirstLetter(n.mellomnavn) : '';
            const etternavn = capitalizeFirstLetter(n.etternavn);
            return `${fornavn}${mellomnavn ? ' ' + mellomnavn : ''} ${etternavn}`;
        })
        .join(', ');

export default FormidleUsynligKandidat;
