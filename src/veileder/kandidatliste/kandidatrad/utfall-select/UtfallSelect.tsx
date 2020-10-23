import React, { FunctionComponent } from 'react';
import UtfallVisning from './UtfallVisning';
import '@reach/menu-button/styles.css';
import './UtfallSelect.less';
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

const UtfallSelect: FunctionComponent<Props> = ({ kanEndreUtfall, utfall, onClick }) => {
    return (
        <>
            {kanEndreUtfall ? (
                <Lenkeknapp className="Edit " onClick={onClick}>
                    <UtfallVisning utfall={utfall} />
                    {(utfall === Utfall.FåttJobben && <LåstHengelås />) || (
                        <i className="Edit__icon" style={{ marginLeft: '.5em' }} />
                    )}
                </Lenkeknapp>
            ) : (
                <UtfallVisning utfall={utfall} />
            )}
        </>
    );
};

export default UtfallSelect;
