import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { Textarea } from 'nav-frontend-skjema';
import { Feilmelding, Normaltekst } from 'nav-frontend-typografi';
import { sendEvent } from '../../../amplitude/amplitude';
import { postKandidaterTilKandidatliste } from '../../../api/api';
import { Nettressurs, ikkeLastet, senderInn, Nettstatus } from '../../../api/Nettressurs';
import { Fødselsnummersøk } from '../../../cv/reducer/cv-typer';
import { Kandidatliste } from '../../domene/Kandidatliste';
import { KandidatOutboundDto } from './LeggTilKandidatModal';
import { useDispatch } from 'react-redux';
import KandidatlisteAction from '../../reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../reducer/KandidatlisteActionType';
import { VarslingAction, VarslingActionType } from '../../../common/varsling/varslingReducer';
import LeggTilEllerAvbryt from './LeggTilEllerAvbryt';

const MAKS_NOTATLENGDE = 2000;

const BekreftMedNotat: FunctionComponent<{
    fnr: string;
    kandidat: Fødselsnummersøk;
    kandidatliste: Kandidatliste;
    onClose: () => void;
}> = ({ fnr, kandidat, kandidatliste, onClose }) => {
    const dispatch = useDispatch();
    const [notat, setNotat] = useState<string>('');
    const [leggTilKandidat, setLeggTilKandidat] = useState<Nettressurs<Kandidatliste>>(
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
            varsleKandidatlisteOmNyKandidat(respons.data, dto);
        }
    };

    const varsleKandidatlisteOmNyKandidat = (
        kandidatlisteMedNyKandidat: Kandidatliste,
        nyeKandidater: KandidatOutboundDto[]
    ) => {
        dispatch<VarslingAction>({
            type: VarslingActionType.VisVarsling,
            innhold: `Kandidat ${kandidat.fornavn} ${kandidat.etternavn} (${fnr}) er lagt til`,
        });

        dispatch<KandidatlisteAction>({
            type: KandidatlisteActionType.LeggTilKandidaterSuccess,
            antallLagredeKandidater: 1,
            kandidatliste: kandidatlisteMedNyKandidat,
            lagredeKandidater: nyeKandidater,
            lagretListe: kandidatlisteMedNyKandidat,
        });
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
            />
            <LeggTilEllerAvbryt
                onLeggTilClick={onLeggTilKandidat}
                onAvbrytClick={onClose}
                leggTilSpinner={leggTilKandidat.kind === Nettstatus.SenderInn}
                leggTilDisabled={
                    leggTilKandidat.kind === Nettstatus.SenderInn ||
                    (!!notat && notat.length > MAKS_NOTATLENGDE)
                }
                avbrytDisabled={leggTilKandidat.kind === Nettstatus.SenderInn}
            />
            {leggTilKandidat.kind === Nettstatus.Feil && (
                <Feilmelding>Klarte ikke å legge til kandidat</Feilmelding>
            )}
        </>
    );
};

export default BekreftMedNotat;
