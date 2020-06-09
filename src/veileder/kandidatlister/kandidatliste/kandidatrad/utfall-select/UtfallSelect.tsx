import React, { FunctionComponent } from 'react';
import { Menu, MenuButton, MenuItem, MenuList } from '@reach/menu-button';
import UtfallVisning from './UtfallVisning';

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

// TODO classnames
const UtfallSelect: FunctionComponent<Props> = ({ kanEndreUtfall, value, onChange }) => {
    if (!kanEndreUtfall) {
        return <UtfallVisning utfall={value} />;
    }
    return (
        <div className="StatusSelect skjemaelement">
            <Menu>
                <MenuButton className="StatusSelect__button selectContainer skjemaelement__input">
                    <UtfallVisning utfall={value} />
                </MenuButton>
                <MenuList className="StatusSelect__menu">
                    {Object.keys(Utfall).map((utfall) => (
                        <MenuItem
                            key={utfall}
                            onSelect={() => onChange(Utfall[utfall])}
                            className="StatusSelect__menuItem"
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
