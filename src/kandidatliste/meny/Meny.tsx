import React, { FunctionComponent } from 'react';
import { MagnifyingGlassIcon, PersonPlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { Link } from 'react-router-dom';
import { lenkeTilFinnKandidater } from '../../app/paths';
import css from './Meny.module.css';
import classNames from 'classnames';

interface Props {
    border?: boolean;
    kandidatlisteId: string;
    stillingId: string | null;
    onLeggTilKandidat: () => void;
}

const Meny: FunctionComponent<Props> = ({
    border,
    kandidatlisteId,
    stillingId,
    onLeggTilKandidat,
}) => {
    return (
        <div
            className={classNames(css.meny, {
                [css.border]: border,
            })}
        >
            <Link
                to={lenkeTilFinnKandidater(stillingId, kandidatlisteId)}
                state={{
                    brukKriterierFraStillingen: true,
                }}
            >
                <Button variant="tertiary" as="div" icon={<MagnifyingGlassIcon aria-hidden />}>
                    Finn kandidater
                </Button>
            </Link>

            <Button
                variant="tertiary"
                onClick={onLeggTilKandidat}
                icon={<PersonPlusIcon aria-hidden />}
            >
                Legg til kandidat
            </Button>
        </div>
    );
};

export default Meny;
