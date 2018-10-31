import React from 'react';
import { Element, Sidetittel } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import './Listedetaljer.less';

export default ({ kandidater, tittel, oppdragsgiver, opprettetAv, stillingsId, alleMarkert, onCheckAlleKandidater, onToggleKandidat }) => {
    const SideHeader = () => (
        <div className="side-header">
            <div className="wrapper">
                <div className="top">
                    <div className="header-side" />
                    <div className="tittel">
                        <Sidetittel>{tittel}</Sidetittel>
                    </div>
                    <div className="header-side">
                        Test
                    </div>
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
                        <a href={`/stillinger/${stillingsId}`}>
                            Se stillingsannonse
                        </a>
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
            <div className="kolonne-smal"><Element>Utfall</Element></div>
        </div>
    );
    const KandidatRad = ({ kandidat }) => (
        <div className={`liste-rad kandidat ${kandidat.markert ? 'checked' : 'unchecked'}`}>
            <div className="kolonne-checkboks">
                <Checkbox
                    label="&#8203;" // <- tegnet for tom streng
                    className="text-hide"
                    checked={kandidat.markert}
                    onChange={() => { onToggleKandidat(kandidat.kandidatnummer); }}
                />
            </div>
            <div className="kolonne-bred">{kandidat.navn}</div>
            <div className="kolonne-smal">Fødselsdato</div>
            <div className="kolonne-bred">Lagt til av</div>
            <div className="kolonne-bred">Aktivitetsplan</div>
            <div className="kolonne-smal">Status</div>
            <div className="kolonne-smal">Utfall</div>
        </div>
    );
    return (
        <div className="Listedetaljer">
            <SideHeader />
            <div className="detaljer">
                <div className="wrapper">
                    <ListeHeader />
                    {kandidater.map((kandidat) => (
                        <KandidatRad key={kandidat.kandidatnummer} kandidat={kandidat} />
                    ))}
                </div>
            </div>
        </div>
    );
};
