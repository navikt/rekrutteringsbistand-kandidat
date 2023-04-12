import React, { FunctionComponent } from 'react';
import { PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyLong, Button } from '@navikt/ds-react';

import { Notat } from '../../domene/Kandidatressurser';
import { Nettstatus, Nettressurs } from '../../../api/Nettressurs';
import NavFrontendSpinner from 'nav-frontend-spinner';
import NotatInfo from './NotatInfo';
import css from './Notatliste.module.css';

interface Props {
    notater: Nettressurs<Notat[]>;
    onOpenRedigeringsModal: (notat: Notat) => void;
    onOpenSletteModal: (notat: Notat) => void;
}

const Notatliste: FunctionComponent<Props> = ({
    notater,
    onOpenRedigeringsModal,
    onOpenSletteModal,
}) => {
    if (notater?.kind === Nettstatus.LasterInn) {
        return (
            <div className="notater__spinner">
                <NavFrontendSpinner />
            </div>
        );
    }

    if (notater?.kind === Nettstatus.Suksess && notater.data.length !== 0) {
        return (
            <div>
                {notater.data.map((notat) => (
                    <div className={css.rad} key={notat.notatId}>
                        <div className={css.topprad}>
                            <NotatInfo notat={notat} />
                            {notat.kanEditere && (
                                <div className={css.knapper}>
                                    <Button
                                        variant="tertiary"
                                        onClick={() => {
                                            onOpenRedigeringsModal(notat);
                                        }}
                                        icon={<PencilIcon aria-label="Endre notat" />}
                                    />
                                    <Button
                                        variant="tertiary"
                                        onClick={() => {
                                            onOpenSletteModal(notat);
                                        }}
                                        icon={<TrashIcon aria-label="Slett notat" />}
                                    />
                                </div>
                            )}
                        </div>
                        <BodyLong>{notat.tekst}</BodyLong>
                    </div>
                ))}
            </div>
        );
    }

    return null;
};

export default Notatliste;
