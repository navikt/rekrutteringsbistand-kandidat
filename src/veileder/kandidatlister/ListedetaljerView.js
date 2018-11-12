import React from 'react';
import PropTypes from 'prop-types';
import { Element, Sidetittel } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import Lenke from 'nav-frontend-lenker';
import { Kandidat } from './PropTypes';

const statusToString = (status) => {
    if (status === 'VURDERES') {
        return 'Vurderes';
    } else if (status === 'FORESLATT') {
        return 'Foreslått';
    } else if (status === 'KONTAKTET') {
        return 'Kontaktet';
    } else if (status === 'AKTUELL') {
        return 'Aktuell';
    } else if (status === 'UAKTUELL') {
        return 'Uaktuell';
    }
    return status;
};

const utfallToString = (utfall) => {
    if (utfall === 'IKKE_PRESENTERT') {
        return 'Ikke presentert';
    } else if (utfall === 'PRESENTERT') {
        return 'Presentert';
    } else if (utfall === 'FATT_JOBBEN') {
        return 'Fått jobben';
    }
    return utfall;
};
// eslint-disable-next-line no-unused-vars
const ListedetaljerView = ({ kandidater, tittel, oppdragsgiver, opprettetAv, stillingsId, alleMarkert, onCheckAlleKandidater, onToggleKandidat }) => {
    const SideHeader = () => (
        <div className="side-header">
            <div className="wrapper">
                <div className="top">
                    <div className="header-side" />
                    <div className="tittel">
                        <Sidetittel>{tittel}</Sidetittel>
                    </div>
                    <div className="header-side" />
                </div>
                <div className="bottom">
                    <div className="antall">
                        {kandidater.length === 1 ? '1 kandidat' : `${kandidater.length} kandidater`}
                    </div>
                    { oppdragsgiver &&
                    <div className="border-left">
                        Oppdragsgiver: {oppdragsgiver}
                    </div>
                    }
                    <div className="border-left">
                        { `Opprettet av: ${opprettetAv.navn} (${opprettetAv.ident})` }
                    </div>
                    <div className="border-left">
                        <Lenke href="#">Se stillingsannonse</Lenke>
                    </div>
                </div>
            </div>
        </div>
    );
    const ListeHeader = () => (
        <div className="liste-rad liste-header">
            <div className="kolonne-checkboks">
                <Checkbox
                    label="&#8203;" // <- tegnet for tom streng
                    className="text-hide"
                    checked={alleMarkert}
                    onChange={onCheckAlleKandidater}
                />
            </div>
            <div className="kolonne-bred"><Element>Navn</Element></div>
            <div className="kolonne-smal"><Element>Fødselsdato</Element></div>
            <div className="kolonne-bred"><Element>Lagt til av</Element></div>
            <div className="kolonne-bred"><Element>Aktivitetsplan</Element></div>
            <div className="kolonne-smal"><Element>Status</Element></div>
            <div className="kolonne-bred"><Element>Utfall</Element></div>
        </div>
    );

    const KandidatRad = ({ kandidat }) => ( // eslint-disable-line react/prop-types
        <div className={`liste-rad kandidat ${kandidat.markert ? 'checked' : 'unchecked'}`}>
            <div className="kolonne-checkboks">
                <Checkbox
                    label="&#8203;" // <- tegnet for tom streng
                    className="text-hide"
                    checked={kandidat.markert}
                    onChange={() => { onToggleKandidat(kandidat.kandidatnr); }}
                />
            </div>
            <div className="kolonne-bred">{kandidat.fornavn} {kandidat.etternavn}</div>
            <div className="kolonne-smal">{new Date(kandidat.fodselsdato).toLocaleDateString('nb-NO')}</div>
            <div className="kolonne-bred">{kandidat.lagtTilAv.navn} ({kandidat.lagtTilAv.ident})</div>
            <div className="kolonne-bred">-</div>
            <div className="kolonne-smal">{statusToString(kandidat.status)}</div>
            <div className="kolonne-bred">{utfallToString(kandidat.utfall)}</div>
        </div>
    );
    return (
        <div className="Listedetaljer">
            <SideHeader />
            <div className="detaljer">
                <div className="wrapper">
                    <ListeHeader />
                    {kandidater.map((kandidat) => (
                        <KandidatRad key={kandidat.kandidatnr} kandidat={kandidat} />
                    ))}
                </div>
            </div>
        </div>
    );
};
ListedetaljerView.defaultProps = {
    oppdragsgiver: undefined
};

ListedetaljerView.propTypes = {
    kandidater: PropTypes.arrayOf(PropTypes.shape({ ...Kandidat, markert: PropTypes.bool })).isRequired,
    tittel: PropTypes.string.isRequired,
    oppdragsgiver: PropTypes.string,
    opprettetAv: PropTypes.shape({
        ident: PropTypes.string,
        navn: PropTypes.string
    }).isRequired,
    stillingsId: PropTypes.string.isRequired,
    alleMarkert: PropTypes.bool.isRequired,
    onCheckAlleKandidater: PropTypes.func.isRequired,
    onToggleKandidat: PropTypes.func.isRequired
};

export default ListedetaljerView;
