import React, { FunctionComponent } from 'react';
import UtfallLabel from './UtfallLabel';
import '@reach/menu-button/styles.css';
import './UtfallMedEndreIkon.less';
import Lenkeknapp from '../../../../felles/common/Lenkeknapp';
import LåstHengelås from '../../side-header/rekrutteringsstatus/LåstHengelås';

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
                <Lenkeknapp className="Edit " onClick={onClick}>
                    <UtfallLabel utfall={utfall} />
                    {(utfall === Utfall.FåttJobben && <LåstHengelås />) || (
                        <i className="Edit__icon" style={{ marginLeft: '.5em' }} />
                    )}
                </Lenkeknapp>
            ) : (
                <UtfallLabel utfall={utfall} />
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
