import React, { FunctionComponent } from 'react';
import { Menu, MenuButton, MenuItem, MenuList } from '@reach/menu-button';
import UtfallVisning from './UtfallVisning';
import '@reach/menu-button/styles.css';
import './UtfallSelect.less';

export enum Utfall {
    IkkePresentert = 'IKKE_PRESENTERT',
    Presentert = 'PRESENTERT',
    FåttJobben = 'FATT_JOBBEN',
}

interface Props {
    kanEndreUtfall: boolean;
    value: Utfall;
    onChange: (utfall: Utfall, visModal: boolean) => void;
}

const skalViseModalVedEndring = (gammeltUtfall: Utfall, nyttUtfall: Utfall) => {
    if (gammeltUtfall === Utfall.IkkePresentert) {
        return true;
    }

    if (gammeltUtfall === Utfall.Presentert && nyttUtfall === Utfall.FåttJobben) {
        return true;
    }

    return false;
};

const UtfallSelect: FunctionComponent<Props> = ({ kanEndreUtfall, value, onChange }) => {
    const onSelect = (utfall: Utfall) => {
        if (utfall !== value) {
            onChange(utfall, skalViseModalVedEndring(value, utfall));
        }
    };

    if (!kanEndreUtfall) {
        return <UtfallVisning utfall={value} />;
    }

    return (
        <div className="UtfallSelect skjemaelement">
            <Menu>
                <MenuButton className="UtfallSelect__button selectContainer skjemaelement__input">
                    <UtfallVisning utfall={value} />
                </MenuButton>
                <MenuList className="UtfallSelect__menu">
                    {Object.keys(Utfall).map((utfall) => (
                        <MenuItem
                            key={utfall}
                            onSelect={() => onSelect(Utfall[utfall])}
                            className="UtfallSelect__menuItem"
                            aria-selected={Utfall[utfall] === value}
                        >
                            <UtfallVisning utfall={Utfall[utfall]} />
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </div>
    );
};

export default UtfallSelect;
