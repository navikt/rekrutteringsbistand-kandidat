import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Alert, BodyShort, Checkbox, CheckboxGroup, ErrorMessage } from '@navikt/ds-react';

import { capitalizeFirstLetter } from '../../utils/formateringUtils';
import { FormidlingAvUsynligKandidatOutboundDto } from './LeggTilKandidatModal';
import { Kandidatliste } from '../../kandidatliste/domene/Kandidatliste';
import { Nettressurs, ikkeLastet, senderInn, Nettstatus } from '../../api/Nettressurs';
import { postFormidlingerAvUsynligKandidat } from '../../api/api';
import { UsynligKandidat } from '../../kandidatliste/domene/Kandidat';
import { VarslingAction, VarslingActionType } from '../../varsling/varslingReducer';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import LeggTilEllerAvbryt from './LeggTilEllerAvbryt';
import css from './LeggTilKandidatModal.module.css';

type Props = {
    fnr: string;
    usynligKandidat: UsynligKandidat[];
    kandidatliste: Kandidatliste;
    stillingsId: string;
    valgtNavKontor: string;
    onClose: () => void;
};

const FormidleUsynligKandidat: FunctionComponent<Props> = ({
    fnr,
    usynligKandidat,
    kandidatliste,
    stillingsId,
    valgtNavKontor,
    onClose,
}) => {
    const dispatch = useDispatch();
    const [formidling, setFormidling] = useState<Nettressurs<Kandidatliste>>(ikkeLastet());
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

        const resultat = await postFormidlingerAvUsynligKandidat(
            kandidatliste.kandidatlisteId,
            dto
        );

        setFormidling(resultat);

        if (resultat.kind === Nettstatus.Suksess) {
            onClose();
            varsleKandidatlisteOmFormidling(resultat.data, dto);
        }
    };

    const varsleKandidatlisteOmFormidling = (
        kandidatliste: Kandidatliste,
        formidlingAvUsynligKandidat: FormidlingAvUsynligKandidatOutboundDto
    ) => {
        dispatch<VarslingAction>({
            type: VarslingActionType.VisVarsling,
            innhold: `Kandidaten (${formidlingAvUsynligKandidat.fnr}) er blitt formidlet`,
        });

        dispatch<KandidatlisteAction>({
            type: KandidatlisteActionType.FormidleUsynligKandidatSuccess,
            formidlingAvUsynligKandidat,
            kandidatliste,
        });
    };

    const harValgtEtAlternativ = presentert || fåttJobb;

    return (
        <>
            <BodyShort spacing>
                {hentNavnPåUsynligKandidat(usynligKandidat)} ({fnr})
            </BodyShort>
            <Alert variant="info" className={css.folkeregisterInfo}>
                Navnet er hentet fra folkeregisteret. Selv om personen ikke er synlig i
                Rekrutteringsbistand, kan du allikevel registrere formidlingen her for statistikkens
                del. Personen vil vises øverst i kandidatlisten.
            </Alert>
            <CheckboxGroup legend={`Registrer formidling for ${usynligKandidat[0].fornavn}:`}>
                <Checkbox
                    value={presentert}
                    onChange={(event) => setPresentert(event.target.checked)}
                >
                    Registrer at personen er blitt presentert
                </Checkbox>
                <Checkbox value={fåttJobb} onChange={(event) => setFåttJobb(event.target.checked)}>
                    Registrer at personen har fått jobb
                </Checkbox>
            </CheckboxGroup>
            <LeggTilEllerAvbryt
                onLeggTilClick={formidleUsynligKandidat}
                onAvbrytClick={onClose}
                leggTilSpinner={formidling.kind === Nettstatus.SenderInn}
                leggTilDisabled={formidling.kind === Nettstatus.SenderInn || !harValgtEtAlternativ}
                avbrytDisabled={formidling.kind === Nettstatus.SenderInn}
            />
            {formidling.kind === Nettstatus.Feil && (
                <ErrorMessage>
                    Det skjedde noe galt under formidling av usynlig kandidat
                </ErrorMessage>
            )}
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
