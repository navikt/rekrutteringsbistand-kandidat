import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { CheckboxGroup, Loader, Pagination } from '@navikt/ds-react';
import VelgbarKandidatliste from './VelgbarKandidatliste';
import useMineKandidatlister, {
    lagreIMineKandidatlisterSidestørrelse,
} from './useMineKandidatlister';
import { Nettstatus } from '../../../api/Nettressurs';
import css from './VelgKandidatlister.module.css';

type Props = {
    markerteLister: Set<string>;
    lagredeLister: Set<string>;
    onKandidatlisteMarkert: (event: ChangeEvent<HTMLInputElement>) => void;
};

const VelgKandidatlister: FunctionComponent<Props> = ({
    markerteLister,
    lagredeLister,
    onKandidatlisteMarkert,
}) => {
    const [side, setSide] = useState<number>(1);
    const mineKandidatlister = useMineKandidatlister(side);

    const hentFlereKandidatlister = (side: number) => {
        setSide(side);
    };

    const avhukedeLister = [...Array.from(markerteLister), ...Array.from(lagredeLister)];

    if (mineKandidatlister.kind === Nettstatus.LasterInn) {
        return <Loader />;
    } else if (mineKandidatlister.kind === Nettstatus.Suksess) {
        return (
            <>
                <CheckboxGroup
                    className={css.liste}
                    legend="Velg blant dine kandidatlister"
                    value={avhukedeLister}
                >
                    {mineKandidatlister.data.liste.map((kandidatliste) => (
                        <VelgbarKandidatliste
                            key={kandidatliste.kandidatlisteId}
                            kandidatliste={kandidatliste}
                            lagredeLister={lagredeLister}
                            onKandidatlisteMarkert={onKandidatlisteMarkert}
                        />
                    ))}
                </CheckboxGroup>
                <Pagination
                    size="small"
                    page={side}
                    className={css.paginering}
                    onPageChange={hentFlereKandidatlister}
                    count={Math.floor(
                        mineKandidatlister.data.antall / lagreIMineKandidatlisterSidestørrelse
                    )}
                />
            </>
        );
    } else {
        return null;
    }
};

export default VelgKandidatlister;
