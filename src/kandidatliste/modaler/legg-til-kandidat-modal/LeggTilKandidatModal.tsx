import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Input } from 'nav-frontend-skjema';
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import ModalMedKandidatScope from '../../../common/ModalMedKandidatScope';
import { Kandidatliste } from '../../domene/Kandidatliste';
import fnrValidator from '@navikt/fnrvalidator';
import AlleredeLagtTil from './AlleredeLagtTil';
import {
    fetchKandidatMedFnr,
    fetchSynlighetsevaluering,
    fetchUsynligKandidat,
} from '../../../api/api';
import { ikkeLastet, lasterInn, Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import { Fødselsnummersøk } from '../../../kandidatside/cv/reducer/cv-typer';
import { Synlighetsevaluering } from './kandidaten-finnes-ikke/Synlighetsevaluering';
import { sendEvent } from '../../../amplitude/amplitude';
import { SearchApiError } from '../../../api/fetchUtils';
import { UsynligKandidat } from '../../domene/Kandidat';
import KandidatenFinnesIkke from './kandidaten-finnes-ikke/KandidatenFinnesIkke';
import BekreftMedNotat from './BekreftMedNotat';
import FormidleUsynligKandidat from './FormidleUsynligKandidat';
import NavFrontendSpinner from 'nav-frontend-spinner';
import './LeggTilKandidatModal.less';

export type KandidatOutboundDto = {
    kandidatnr: string;
    notat?: string;
};

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
    const [pdlSøk, setPdlSøk] = useState<Nettressurs<UsynligKandidat[]>>(ikkeLastet());
    const [synlighetsevaluering, setSynlighetsevaluering] = useState<
        Nettressurs<Synlighetsevaluering>
    >(ikkeLastet());

    const tilbakestill = (medFeilmelding: string | null = null) => {
        setFeilmelding(medFeilmelding);
        setAlleredeLagtTil(false);
        setFnrSøk(ikkeLastet());
        setSynlighetsevaluering(ikkeLastet());
        setPdlSøk(ikkeLastet());
    };

    const onFnrChange = (event: ChangeEvent<HTMLInputElement>) => {
        const fnr = event.target.value;

        setFnr(fnr);

        if (fnr.length < 11) {
            tilbakestill();
        } else if (fnr.length > 11) {
            tilbakestill('Fødselsnummeret er for langt');
        } else {
            const erGyldig = validerFnr(fnr);

            if (erGyldig) {
                setFeilmelding(null);

                const finnesAllerede = erFnrAlleredeIListen(fnr);
                setAlleredeLagtTil(finnesAllerede);

                if (!finnesAllerede) {
                    hentKandidatMedFødselsnummer(fnr);
                }
            } else {
                tilbakestill('Fødselsnummeret er ikke gyldig');
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

                sendEvent('fødselsnummersøk', 'fant-ingen-kandidat', {
                    kontekst: 'kandidatliste',
                });

                setSynlighetsevaluering(lasterInn());
                const synlighetPromise = fetchSynlighetsevaluering(fnr);

                if (kandidatliste.kanEditere) {
                    setPdlSøk(lasterInn());
                    const pdlPromise = fetchUsynligKandidat(fnr);

                    setPdlSøk(await pdlPromise);
                }

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
            isOpen={vis}
            className="LeggTilKandidatModal"
            contentLabel="Legg til kandidat-modal"
            contentClass="LeggTilKandidatModal__innhold"
            onRequestClose={onClose}
        >
            <Systemtittel>Legg til kandidat</Systemtittel>
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

            {erAlleredeLagtTil && <AlleredeLagtTil />}

            {(fnrSøk.kind === Nettstatus.LasterInn ||
                synlighetsevaluering.kind === Nettstatus.LasterInn) && (
                <NavFrontendSpinner className="LeggTilKandidatModal__spinner" />
            )}

            {fnrSøk.kind === Nettstatus.FinnesIkke &&
                synlighetsevaluering.kind === Nettstatus.Suksess && (
                    <KandidatenFinnesIkke synlighetsevaluering={synlighetsevaluering.data} />
                )}

            {fnrSøk.kind === Nettstatus.Suksess && (
                <BekreftMedNotat
                    fnr={fnr}
                    kandidat={fnrSøk.data}
                    kandidatliste={kandidatliste}
                    onClose={onClose}
                />
            )}

            {pdlSøk.kind !== Nettstatus.IkkeLastet &&
                stillingsId !== null &&
                valgtNavKontor !== null && (
                    <>
                        <Undertittel className="blokk-xxs">Fra folkeregisteret</Undertittel>
                        {!kandidatliste.kanEditere ? (
                            <Normaltekst>
                                Du er ikke eier av stillingen og kan derfor ikke registrere
                                formidling.
                            </Normaltekst>
                        ) : (
                            <>
                                {pdlSøk.kind === Nettstatus.Suksess && (
                                    <FormidleUsynligKandidat
                                        fnr={fnr}
                                        usynligKandidat={pdlSøk.data}
                                        kandidatliste={kandidatliste}
                                        stillingsId={stillingsId}
                                        valgtNavKontor={valgtNavKontor}
                                        onClose={onClose}
                                    />
                                )}
                            </>
                        )}
                        {pdlSøk.kind === Nettstatus.LasterInn && (
                            <NavFrontendSpinner className="LeggTilKandidatModal__spinner" />
                        )}
                    </>
                )}
        </ModalMedKandidatScope>
    );
};

const validerFnr = (fnr: string): boolean => fnrValidator.idnr(fnr).status === 'valid';

export default LeggTilKandidatModal;
