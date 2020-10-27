import React, { FunctionComponent } from 'react';
import UtfallLabel, { Orientering } from './UtfallLabel';
import '@reach/menu-button/styles.css';
import './UtfallMedEndreIkon.less';
import Lenkeknapp from '../../../../felles/common/Lenkeknapp';

export enum Utfall {
    IkkePresentert = 'IKKE_PRESENTERT',
    Presentert = 'PRESENTERT',
    FåttJobben = 'FATT_JOBBEN',
}

interface Props {
    kanEndreUtfall: boolean;
    utfall: Utfall;
    onClick: () => void;
}

const UtfallMedEndreIkon: FunctionComponent<Props> = ({ kanEndreUtfall, utfall, onClick }) => {
    return (
        <>
            {kanEndreUtfall ? (
                <Lenkeknapp className="utfall-med-endre-ikon" onClick={onClick}>
                    <UtfallLabel utfall={utfall} prikkOrientering={Orientering.Foran} />
                    {utfall === Utfall.FåttJobben ? (
                        <i className="utfall-med-endre-ikon__hengelås" />
                    ) : (
                        <i className="utfall-med-endre-ikon__blyant" />
                    )}
                </Lenkeknapp>
            ) : (
                <UtfallLabel utfall={utfall} prikkOrientering={Orientering.Foran} />
            )}
        </>
    );
};

export const utfallToDisplayName = (utfall: Utfall) => {
    switch (utfall) {
        case Utfall.Presentert:
            return 'Presentert';
        case Utfall.IkkePresentert:
            return 'Ikke presentert';
        case Utfall.FåttJobben:
            return 'Fått jobb';
    }
};

export default UtfallMedEndreIkon;
