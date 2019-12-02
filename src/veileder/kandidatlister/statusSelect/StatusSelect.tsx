import * as React from 'react';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import { Normaltekst } from 'nav-frontend-typografi';
import '@reach/menu-button/styles.css';
import './StatusSelect.less';

enum Status {
    Foreslått = 'FORESLATT',
    Vurderes = 'VURDERES',
    Kontaktet = 'KONTAKTET',
    Aktuell = 'AKTUELL',
    Uaktuell = 'UAKTUELL',
    Uinteressert = 'UINTERESSERT',
}

const statusToDisplayName = (status: Status) => {
    switch (status) {
        case Status.Foreslått:
            return 'Foreslått';
        case Status.Vurderes:
            return 'Vurderes';
        case Status.Kontaktet:
            return 'Kontaktet';
        case Status.Aktuell:
            return 'Aktuell';
        case Status.Uaktuell:
            return 'Ikke aktuell';
        case Status.Uinteressert:
            return 'Ikke interessert';
    }
};

const statusToClassname = (status: Status) => status.toLowerCase();

interface Props {
    kanEditere: boolean;
    value: Status;
    onChange: (status: Status) => void;
}

const StatusSelect: React.FunctionComponent<Props> = ({ kanEditere, value, onChange }) => {
    if (!kanEditere) {
        return <Statusvisning status={value} />;
    }

    const statuserIDropdown = Object.keys(Status);

    return (
        <div className="StatusSelect skjemaelement skjemaelement--pink">
            <Menu>
                <MenuButton className="StatusSelect__button selectContainer skjemaelement__input">
                    <Statusvisning status={value} />
                </MenuButton>
                <MenuList className="StatusSelect__menu">
                    {statuserIDropdown.map(status => (
                        <MenuItem
                            key={status}
                            onSelect={() => onChange(Status[status])}
                            className="StatusSelect__menuItem"
                            aria-selected={Status[status] === value}
                        >
                            <Statusvisning status={Status[status]} />
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </div>
    );
};

interface StatusvisningProps {
    status: Status;
}

const Statusvisning: React.FunctionComponent<StatusvisningProps> = ({ status }) => (
    <span className="StatusSelect__status">
        <span
            className={`StatusSelect__sirkel StatusSelect__sirkel--${statusToClassname(status)}`}
        />
        <Normaltekst>{statusToDisplayName(status)}</Normaltekst>
    </span>
);

export default StatusSelect;
