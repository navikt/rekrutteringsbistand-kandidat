import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Alert, BodyShort, ErrorMessage } from '@navikt/ds-react';

import { CheckboxGruppe, Checkbox } from 'nav-frontend-skjema';
import { postFormidlingerAvUsynligKandidat } from '../../../api/api';
import { Nettressurs, ikkeLastet, senderInn, Nettstatus } from '../../../api/Nettressurs';
import { UsynligKandidat } from '../../domene/Kandidat';
import { Kandidatliste } from '../../domene/Kandidatliste';
import { capitalizeFirstLetter } from '../../../kandidatsøk/utils';
import { FormidlingAvUsynligKandidatOutboundDto } from './LeggTilKandidatModal';
import KandidatlisteActionType from '../../reducer/KandidatlisteActionType';
import KandidatlisteAction from '../../reducer/KandidatlisteAction';
import { VarslingAction, VarslingActionType } from '../../../common/varsling/varslingReducer';
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
