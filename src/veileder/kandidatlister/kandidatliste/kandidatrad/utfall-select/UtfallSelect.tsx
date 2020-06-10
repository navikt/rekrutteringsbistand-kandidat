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
    onChange: (utfall: Utfall) => void;
}

const UtfallSelect: FunctionComponent<Props> = ({ kanEndreUtfall, value, onChange }) => {
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
                            onSelect={() => onChange(Utfall[utfall])}
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
