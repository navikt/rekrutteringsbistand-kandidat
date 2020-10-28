import React, { FunctionComponent } from 'react';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import { Normaltekst } from 'nav-frontend-typografi';
import { Kandidatstatus } from '../../kandidatlistetyper';
import '@reach/menu-button/styles.css';
import './StatusSelect.less';
import FargetPrikk from '../../farget-prikk/FargetPrikk';

interface Props {
    kanEditere: boolean;
    value: Kandidatstatus;
    onChange: (status: Kandidatstatus) => void;
}

const StatusSelect: FunctionComponent<Props> = ({ kanEditere, value, onChange }) => {
    if (!kanEditere) {
        return (
            <div className="StatusSelect">
                <Statusvisning status={value} />
            </div>
        );
    }

    const statuserIDropdown = Object.keys(Kandidatstatus);

    return (
        <div className="StatusSelect StatusSelect__dropdown skjemaelement">
            <Menu>
                <MenuButton className="StatusSelect__button selectContainer skjemaelement__input">
                    <Statusvisning status={value} />
                </MenuButton>
                <MenuList className="StatusSelect__menu">
                    {statuserIDropdown.map((status) => (
                        <MenuItem
                            key={status}
                            onSelect={() => onChange(Kandidatstatus[status])}
                            className="StatusSelect__menuItem"
                            aria-selected={Kandidatstatus[status] === value}
                        >
                            <Statusvisning status={Kandidatstatus[status]} />
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </div>
    );
};

interface StatusvisningProps {
    status: Kandidatstatus;
}

export const Statusvisning: FunctionComponent<StatusvisningProps> = ({ status }) => (
    <span className="StatusSelect__status">
        <FargetPrikk type={status} />
        <Normaltekst>{statusToDisplayName(status)}</Normaltekst>
    </span>
);

export const statusToDisplayName = (status: Kandidatstatus) => {
    switch (status) {
        case Kandidatstatus.Vurderes:
            return 'Vurderes';
        case Kandidatstatus.Kontaktet:
            return 'Kontaktet';
        case Kandidatstatus.Aktuell:
            return 'Aktuell';
        case Kandidatstatus.Uaktuell:
            return 'Ikke aktuell';
        case Kandidatstatus.Uinteressert:
            return 'Ikke interessert';
    }
};

export default StatusSelect;
