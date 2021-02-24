import React, { FunctionComponent } from 'react';
import { Notat } from '../../kandidatlistetyper';
import { Nettstatus, Nettressurs } from '../../../api/remoteData';
import NavFrontendSpinner from 'nav-frontend-spinner';
import NotatInfo from './NotatInfo';
import Lenkeknapp from '../../../common/lenkeknapp/Lenkeknapp';
import { Normaltekst } from 'nav-frontend-typografi';

interface Props {
    notater: Nettressurs<Array<Notat>>;
    onOpenRedigeringsModal: (notat: Notat) => void;
    onOpenSletteModal: (notat: Notat) => void;
}

const Notatliste: FunctionComponent<Props> = ({
    notater,
    onOpenRedigeringsModal,
    onOpenSletteModal,
}) => {
    if (notater.kind === Nettstatus.LasterInn) {
        return (
            <div className="notater__spinner">
                <NavFrontendSpinner />
            </div>
        );
    }

    if (notater.kind === Nettstatus.Suksess && notater.data.length !== 0) {
        return (
            <div className="notater__liste">
                {notater.data.map((notat) => (
                    <div className="notater__rad" key={notat.notatId}>
                        <div className="notater__topprad">
                            <NotatInfo notat={notat} />
                            {notat.kanEditere && (
                                <div className="notater__endre-knapper">
                                    <Lenkeknapp
                                        className="Edit "
                                        onClick={() => {
                                            onOpenRedigeringsModal(notat);
                                        }}
                                    >
                                        <i className="Edit__icon" />
                                    </Lenkeknapp>
                                    <Lenkeknapp
                                        className="Delete"
                                        onClick={() => {
                                            onOpenSletteModal(notat);
                                        }}
                                    >
                                        <i className="Delete__icon" />
                                    </Lenkeknapp>
                                </div>
                            )}
                        </div>
                        <Normaltekst className="notater__tekst">{notat.tekst}</Normaltekst>
                    </div>
                ))}
            </div>
        );
    }

    return null;
};

export default Notatliste;
