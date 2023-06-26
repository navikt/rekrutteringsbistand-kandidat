import { ChangeEvent, FunctionComponent } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { BodyShort, Checkbox, Label } from '@navikt/ds-react';

import { Kandidatliste } from '../../../kandidatliste/domene/Kandidatliste';
import { lenkeTilKandidatliste } from '../../../app/paths';
import { capitalizeEmployerName } from '../../../utils/formateringUtils';
import css from './VelgKandidatlister.module.css';

type Props = {
    kandidatliste: Omit<Kandidatliste, 'kandidater'>;
    lagredeLister: Set<string>;
    onKandidatlisteMarkert: (event: ChangeEvent<HTMLInputElement>) => void;
};

const VelgbarKandidatliste: FunctionComponent<Props> = ({
    kandidatliste,
    lagredeLister,
    onKandidatlisteMarkert,
}) => {
    const { kandidatlisteId, tittel } = kandidatliste;
    const checkboxId = `velg-kandidatliste-${kandidatliste.kandidatlisteId}`;
    const erLagtTil = lagredeLister.has(kandidatlisteId);
    const opprettetDato = new Date(kandidatliste.opprettetTidspunkt).toLocaleDateString('nb', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    });

    const labelCls = classNames(css.label, css.maksEnLinje, {
        [css.disabled]: erLagtTil,
    });

    return (
        <div key={kandidatlisteId} className={css.kandidatliste}>
            <Checkbox
                hideLabel
                id={checkboxId}
                disabled={lagredeLister.has(kandidatlisteId)}
                value={kandidatlisteId}
                onChange={onKandidatlisteMarkert}
            >
                {tittel}
            </Checkbox>
            <Label className={labelCls} htmlFor={checkboxId}>
                {tittel}
            </Label>
            {kandidatliste.organisasjonNavn ? (
                <BodyShort className={classNames(css.arbeidsgiver, css.maksEnLinje)}>
                    {capitalizeEmployerName(kandidatliste.organisasjonNavn)}
                </BodyShort>
            ) : (
                <span />
            )}
            <BodyShort className={css.opprettet}>{opprettetDato}</BodyShort>
            <Link
                target="_blank"
                to={lenkeTilKandidatliste(kandidatlisteId)}
                className="navds-link"
            >
                <ExternalLinkIcon title="Åpne kandidatliste" />
            </Link>
        </div>
    );
};

export default VelgbarKandidatliste;
