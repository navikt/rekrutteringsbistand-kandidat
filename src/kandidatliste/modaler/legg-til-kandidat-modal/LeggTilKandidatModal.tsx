import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Input } from 'nav-frontend-skjema';
import { Systemtittel } from 'nav-frontend-typografi';
import fnrValidator from '@navikt/fnrvalidator';

import { fetchKandidatMedFnr, fetchSynlighetsevaluering } from '../../../api/api';
import { Fødselsnummersøk } from '../../../cv/reducer/cv-typer';
import { ikkeLastet, lasterInn, Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import { Kandidatliste } from '../../domene/Kandidatliste';
import { SearchApiError } from '../../../api/fetchUtils';
import { sendEvent } from '../../../amplitude/amplitude';
import { Synlighetsevaluering } from './kandidaten-finnes-ikke/Synlighetsevaluering';
import BekreftMedNotat from './BekreftMedNotat';
import InformasjonOmUsynligKandidat from './InformasjonOmUsynligKandidat';
import KandidatenFinnesIkke from './kandidaten-finnes-ikke/KandidatenFinnesIkke';
import ModalMedKandidatScope from '../../../common/modal/ModalMedKandidatScope';
import LeggTilEllerAvbryt from './LeggTilEllerAvbryt';
import './LeggTilKandidatModal.less';
import Sidelaster from '../../../common/sidelaster/Sidelaster';

export type FormidlingAvUsynligKandidatOutboundDto = {
    fnr: string;
    presentert: boolean;
    fåttJobb: boolean;
    navKontor: string;
    stillingsId: string;
};

type Props = {
    vis: boolean;
    stillingsId: string | null;
    kandidatliste: Kandidatliste;
    valgtNavKontor: string | null;
    onClose: () => void;
};

const LeggTilKandidatModal: FunctionComponent<Props> = ({
    vis,
    onClose,
    kandidatliste,
    stillingsId,
    valgtNavKontor,
}) => {
    const [fnr, setFnr] = useState<string>('');
    const [feilmelding, setFeilmelding] = useState<string | null>(null);
    const [erAlleredeLagtTil, setAlleredeLagtTil] = useState<boolean>(false);
    const [fnrSøk, setFnrSøk] = useState<Nettressurs<Fødselsnummersøk>>(ikkeLastet());
    const [synlighetsevaluering, setSynlighetsevaluering] = useState<
        Nettressurs<Synlighetsevaluering>
    >(ikkeLastet());

    const tilbakestill = (medFeilmelding: string | null = null) => {
        setFeilmelding(medFeilmelding);
        setAlleredeLagtTil(false);
        setFnrSøk(ikkeLastet());
        setSynlighetsevaluering(ikkeLastet());
    };

    const onFnrChange = (event: ChangeEvent<HTMLInputElement>) => {
        const fnr = event.target.value;

        setFnr(fnr);

        if (fnr.length < 11) {
            tilbakestill();
        } else if (fnr.length > 11) {
            setFeilmelding('Fødselsnummeret er for langt');
        } else {
            tilbakestill();

            const erGyldig = validerFnr(fnr);

            if (erGyldig) {
                const finnesAllerede = erFnrAlleredeIListen(fnr);
                setAlleredeLagtTil(finnesAllerede);

                if (finnesAllerede) {
                    setFeilmelding('Kandidaten er allerede lagt til i listen');
                } else {
                    hentKandidatMedFødselsnummer(fnr);
                }
            } else {
                setFeilmelding('Fødselsnummeret er ikke gyldig');
            }
        }
    };

    const erFnrAlleredeIListen = (fnr: string) =>
        kandidatliste.kandidater.some((kandidat) => kandidat.fodselsnr === fnr);

    const hentKandidatMedFødselsnummer = async (fnr: string) => {
        setFnrSøk(lasterInn());

        try {
            const fnrSøkResponse = await fetchKandidatMedFnr(fnr);
            setFnrSøk(fnrSøkResponse);

            if (fnrSøkResponse.kind === Nettstatus.FinnesIkke) {
                setFeilmelding('Kandidaten er ikke synlig i Rekrutteringsbistand');

                sendEvent('legg_til_kandidat', 'fant_ingen_kandidat', {
                    kontekst: 'kandidatliste',
                });

                setSynlighetsevaluering(lasterInn());
                const synlighetPromise = fetchSynlighetsevaluering(fnr);

                setSynlighetsevaluering(await synlighetPromise);
            }
        } catch (e) {
            setFnrSøk({
                kind: Nettstatus.Feil,
                error: new SearchApiError('Klarte ikke å hente kandidat med fødselsnummer'),
            });
        }
    };

    return (
        <ModalMedKandidatScope
            open={vis}
            onClose={onClose}
            aria-label="Legg til kandidat-modal"
            className="LeggTilKandidatModal"
        >
            <Systemtittel className="LeggTilKandidatModal__tittel">Legg til kandidat</Systemtittel>
            <AlertStripeAdvarsel className="LeggTilKandidatModal__advarsel">
                Før du legger en kandidat på kandidatlisten må du undersøke om personen oppfyller
                kravene som er nevnt i stillingen.
            </AlertStripeAdvarsel>

            <Input
                autoFocus
                bredde="S"
                value={fnr}
                id="legg-til-kandidat-fnr"
                onChange={onFnrChange}
                placeholder="11 siffer"
                label="Fødselsnummer på kandidaten"
                className="blokk-s"
                feil={feilmelding || undefined}
            />

            {erAlleredeLagtTil && (
                <AlertStripeInfo className="LeggTilKandidatModal__advarsel">
                    Finner du ikke kandidaten i kandidatlisten? Husk å sjekk om kandidaten er
                    slettet ved å huke av "Vis kun slettede".
                </AlertStripeInfo>
            )}

            {(fnrSøk.kind === Nettstatus.LasterInn ||
                synlighetsevaluering.kind === Nettstatus.LasterInn) && <Sidelaster size="large" />}

            {fnrSøk.kind === Nettstatus.Suksess && (
                <BekreftMedNotat
                    fnr={fnr}
                    kandidat={fnrSøk.data}
                    kandidatliste={kandidatliste}
                    onClose={onClose}
                />
            )}

            {fnrSøk.kind === Nettstatus.FinnesIkke &&
                synlighetsevaluering.kind === Nettstatus.Suksess && (
                    <KandidatenFinnesIkke synlighetsevaluering={synlighetsevaluering.data} />
                )}

            {fnrSøk.kind === Nettstatus.FinnesIkke && (
                <InformasjonOmUsynligKandidat
                    fnr={fnr}
                    kandidatliste={kandidatliste}
                    stillingsId={stillingsId}
                    valgtNavKontor={valgtNavKontor}
                    onClose={onClose}
                />
            )}

            {fnrSøk.kind !== Nettstatus.Suksess && fnrSøk.kind !== Nettstatus.FinnesIkke && (
                <LeggTilEllerAvbryt leggTilDisabled onAvbrytClick={onClose} />
            )}
        </ModalMedKandidatScope>
    );
};

const validerFnr = (fnr: string): boolean => fnrValidator.idnr(fnr).status === 'valid';

export default LeggTilKandidatModal;
