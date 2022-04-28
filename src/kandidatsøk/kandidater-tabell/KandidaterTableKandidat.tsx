import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Link } from 'react-router-dom';
import { Checkbox } from 'nav-frontend-skjema';

import { capitalizeFirstLetter, capitalizePoststed } from '../utils';
import { lenkeTilKandidat } from '../../app/paths';

import ErLagtIKandidatListeIkon from './er-lagt-i-kandidatliste-ikon/ErLagtIKandidatListeIkon';
import { KandidatsøkAction, KandidatsøkActionType } from '../reducer/searchActions';
import { MarkerbartSøkeresultat } from '../kandidater-og-modal/KandidaterOgModal';
import './KandidaterTabell.less';

interface Props {
    kandidatlisteId?: string;
    stillingsId?: string;
    kandidat: MarkerbartSøkeresultat;
    onKandidatValgt: (markert: boolean, kandidatnr: string) => void;
    nettoppValgt: boolean;
    setScrollPosition: (position: number) => void;
}

const KandidaterTableKandidat: FunctionComponent<Props> = ({
    kandidat,
    nettoppValgt,
    setScrollPosition,
    kandidatlisteId,
    stillingsId,
    onKandidatValgt,
}) => {
    const onCheck = (kandidatnr: string) => {
        onKandidatValgt(!kandidat.markert, kandidatnr);
    };

    const checkedClass = (markert?: boolean, nettoppValgt?: boolean) => {
        if (nettoppValgt) {
            return 'nettopp-valgt';
        } else if (markert) {
            return 'checked';
        }
        return null;
    };

    const kandidatnummer = kandidat.arenaKandidatnr;
    const fornavn = kandidat.fornavn ? capitalizeFirstLetter(kandidat.fornavn) : '';
    const etternavn = kandidat.etternavn ? capitalizeFirstLetter(kandidat.etternavn) : '';
    const navn = `${etternavn}, ${fornavn}`;
    const fodselsnummer = kandidat.fodselsnummer;
    const innsatsgruppe = kandidat.servicebehov;
    const bosted = kandidat.poststed ? capitalizePoststed(kandidat.poststed) : '-';

    let klassenavn = 'kandidater-tabell__rad kandidater-tabell__rad--kandidat';
    const markertRadKlasse = checkedClass(kandidat.markert, nettoppValgt);
    if (markertRadKlasse) {
        klassenavn += ' kandidater-tabell__' + markertRadKlasse;
    }

    return (
        <div className={klassenavn}>
            <div className="skjemaelement skjemaelement--horisontal text-hide">
                <Checkbox
                    label="&#8203;"
                    id={`marker-kandidat-${kandidatnummer}-checkbox`}
                    aria-label={`Marker kanidat med navn ${navn}`}
                    checked={kandidat.markert}
                    onChange={() => {
                        onCheck(kandidat.arenaKandidatnr);
                    }}
                />
            </div>

            <div className="kandidater-tabell__navn-og-lagt-i-liste-ikon">
                <Link
                    className="kandidater-tabell__navn lenke"
                    to={lenkeTilKandidat(kandidatnummer, kandidatlisteId, stillingsId)}
                    onClick={() => setScrollPosition(window.pageYOffset)}
                    aria-label={`Se CV for ${navn}`}
                >
                    {navn}
                </Link>
                {kandidat.erLagtTilKandidatliste && (
                    <ErLagtIKandidatListeIkon className="kandidater-tabell__lagt-i-liste-ikon" />
                )}
            </div>
            <div className="kandidater-tabell__kolonne-tekst">{fodselsnummer}</div>
            <div className="kandidater-tabell__kolonne-tekst">{innsatsgruppe}</div>
            <div className="kandidater-tabell__kolonne-tekst">{bosted}</div>
        </div>
    );
};

const mapDispatchToProps = (dispatch: Dispatch<KandidatsøkAction>) => ({
    setScrollPosition: (scrolletFraToppen: number) =>
        dispatch({
            type: KandidatsøkActionType.SetScrollPosition,
            scrolletFraToppen,
        }),
});

export default connect(null, mapDispatchToProps)(KandidaterTableKandidat);
