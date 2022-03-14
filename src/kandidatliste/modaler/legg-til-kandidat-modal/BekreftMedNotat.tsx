import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';
import { Textarea } from 'nav-frontend-skjema';
import { Feilmelding, Normaltekst } from 'nav-frontend-typografi';
import { sendEvent } from '../../../amplitude/amplitude';
import { postKandidaterTilKandidatliste } from '../../../api/api';
import { Nettressurs, ikkeLastet, senderInn, Nettstatus } from '../../../api/Nettressurs';
import { Fødselsnummersøk } from '../../../kandidatside/cv/reducer/cv-typer';
import { Kandidatliste } from '../../domene/Kandidatliste';
import { KandidatOutboundDto } from './LeggTilKandidatModal';

const MAKS_NOTATLENGDE = 2000;

const BekreftMedNotat: FunctionComponent<{
    fnr: string;
    kandidat: Fødselsnummersøk;
    kandidatliste: Kandidatliste;
    onClose: () => void;
}> = ({ fnr, kandidat, kandidatliste, onClose }) => {
    const [notat, setNotat] = useState<string>('');
    const [leggTilKandidat, setLeggTilKandidat] = useState<Nettressurs<Fødselsnummersøk>>(
        ikkeLastet()
    );

    const onNotatChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setNotat(event.target.value);
    };

    const onLeggTilKandidat = async () => {
        setLeggTilKandidat(senderInn());

        sendEvent('legg_til_kandidat', 'klikk', {
            app: 'kandidat',
        });

        const dto: KandidatOutboundDto[] = [
            {
                kandidatnr: kandidat.arenaKandidatnr,
                notat,
            },
        ];

        const respons = await postKandidaterTilKandidatliste(kandidatliste.kandidatlisteId, dto);
        setLeggTilKandidat(respons);

        if (respons.kind === Nettstatus.Suksess) {
            onClose();
        }
    };

    return (
        <>
            <Normaltekst className="blokk-s">{`${kandidat.fornavn} ${kandidat.etternavn} (${fnr})`}</Normaltekst>
            <Textarea
                id="legg-til-kandidat-notat-input"
                value={notat}
                label="Notat om kandidaten"
                textareaClass="LeggTilKandidatModal__notat"
                description="Du skal ikke skrive sensitive opplysninger her. Notatet er synlig for alle veiledere."
                placeholder="Skriv inn en kort tekst om hvorfor kandidaten passer til stillingen"
                maxLength={MAKS_NOTATLENGDE}
                onChange={onNotatChange}
                feil={notat && notat.length > MAKS_NOTATLENGDE ? 'Notatet er for langt' : undefined}
            />
            <div>
                <Hovedknapp
                    onClick={onLeggTilKandidat}
                    spinner={leggTilKandidat.kind === Nettstatus.SenderInn}
                    disabled={leggTilKandidat.kind === Nettstatus.SenderInn}
                >
                    Legg til
                </Hovedknapp>
                <Flatknapp
                    className="LeggTilKandidatModal__avbryt-knapp"
                    onClick={onClose}
                    disabled={leggTilKandidat.kind === Nettstatus.SenderInn}
                >
                    Avbryt
                </Flatknapp>
            </div>
            {leggTilKandidat.kind === Nettstatus.Feil && (
                <Feilmelding>Klarte ikke å legge til kandidat</Feilmelding>
            )}
        </>
    );
};

export default BekreftMedNotat;
