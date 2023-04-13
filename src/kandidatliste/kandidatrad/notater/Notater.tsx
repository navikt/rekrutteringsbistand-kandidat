import React, { ChangeEvent, FunctionComponent, useState, useEffect, useCallback } from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';

import { Kandidatliste } from '../../domene/Kandidatliste';
import { Kandidat } from '../../domene/Kandidat';
import { Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import InfoUnderKandidat from '../info-under-kandidat/InfoUnderKandidat';
import KandidatlisteAction from '../../reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../reducer/KandidatlisteActionType';
import Notatliste from './Notatliste';
import RedigerNotatModal from './RedigerNotatModal';
import Slettemodal from './Slettemodal';
import { Notat } from '../../domene/Kandidatressurser';
import { BodyLong, Button, Heading, Textarea } from '@navikt/ds-react';
import './Notater.less';

type Props = {
    kandidat: Kandidat;
    kandidatliste: Kandidatliste;
    antallNotater?: number;
    notater: Nettressurs<Notat[]>;
    onOpprettNotat: (tekst: string) => void;
    onEndreNotat: (notatId: string, tekst: string) => void;
    onSlettNotat: (notatId: string) => void;
};

const Notater: FunctionComponent<Props> = ({
    kandidat,
    kandidatliste,
    antallNotater,
    notater,
    onOpprettNotat,
    onEndreNotat,
    onSlettNotat,
}) => {
    const dispatch: Dispatch<KandidatlisteAction> = useDispatch();

    const [nyttNotatVises, setNyttNotatVises] = useState<boolean>(false);
    const [nyttNotatTekst, setNyttNotatTekst] = useState<string>('');
    const [nyttNotatFeil, setNyttNotatFeil] = useState<boolean>(false);
    const [notatSomRedigeres, setNotatSomRedigeres] = useState<Notat | undefined>(undefined);
    const [notatSomSlettes, setNotatSomSlettes] = useState<Notat | undefined>(undefined);

    const hentKandidatensNotater = useCallback(() => {
        const { kandidatlisteId } = kandidatliste;
        const { kandidatnr } = kandidat;

        dispatch({
            type: KandidatlisteActionType.HentNotater,
            kandidatlisteId,
            kandidatnr,
        });
    }, [dispatch, kandidat, kandidatliste]);

    useEffect(() => {
        setNyttNotatVises(false);
        setNyttNotatTekst('');
        setNyttNotatFeil(false);
        setNotatSomRedigeres(undefined);
        setNotatSomSlettes(undefined);

        if (!notater || notater.kind === Nettstatus.IkkeLastet) {
            hentKandidatensNotater();
        }
    }, [notater, hentKandidatensNotater]);

    const toggleNyttNotatVises = () => {
        setNyttNotatVises(!nyttNotatVises);
        setNyttNotatTekst('');
        setNyttNotatFeil(false);
    };

    const oppdaterNyttNotatTekst = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setNyttNotatTekst(e.target.value);
        setNyttNotatFeil(false);
    };

    const lagreNyttNotat = () => {
        if (nyttNotatTekst.trim().length === 0) {
            setNyttNotatFeil(true);
        } else {
            onOpprettNotat(nyttNotatTekst);
        }
    };

    return (
        <InfoUnderKandidat>
            {notatSomRedigeres && (
                <RedigerNotatModal
                    notat={notatSomRedigeres}
                    onClose={() => setNotatSomRedigeres(undefined)}
                    onSave={onEndreNotat}
                />
            )}
            {notatSomSlettes && (
                <Slettemodal
                    notat={notatSomSlettes}
                    onSlettNotat={onSlettNotat}
                    onCloseSletteModal={() => setNotatSomSlettes(undefined)}
                />
            )}

            <Heading spacing level="4" size="small">
                Notater ({antallNotater})
            </Heading>
            <BodyLong spacing>
                Her skal du kun skrive korte meldinger og statusoppdateringer. Sensitive
                opplysninger skrives <strong>ikke</strong> her. Ta direkte kontakt med veileder hvis
                du har spørsmål om en kandidat. Notatene følger ikke brukeren og er bare
                tilgjengelig via stillingen. Notatene vil være synlige for alle veiledere.
            </BodyLong>
            <BodyLong>
                Notatene blir automatisk slettet 12 måneder etter at kandidaten ble lagt til i
                kandidatlisten.
            </BodyLong>
            <div className="notater__nytt-notat-form">
                {nyttNotatVises ? (
                    <div>
                        <Textarea
                            label="Skriv inn notat"
                            value={nyttNotatTekst}
                            onChange={oppdaterNyttNotatTekst}
                            autoFocus
                            error={nyttNotatFeil ? 'Tekstfeltet kan ikke være tomt' : undefined}
                        />
                        <div className="notater__nytt-notat-knapperad">
                            <Button variant="primary" size="small" onClick={lagreNyttNotat}>
                                Lagre
                            </Button>
                            <Button variant="secondary" size="small" onClick={toggleNyttNotatVises}>
                                Avbryt
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button variant="secondary" size="small" onClick={toggleNyttNotatVises}>
                        Skriv notat
                    </Button>
                )}
            </div>
            <Notatliste
                notater={notater}
                onOpenRedigeringsModal={setNotatSomRedigeres}
                onOpenSletteModal={setNotatSomSlettes}
            />
        </InfoUnderKandidat>
    );
};

export default Notater;
