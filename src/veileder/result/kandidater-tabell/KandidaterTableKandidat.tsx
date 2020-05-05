import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { capitalizeFirstLetter, capitalizePoststed } from '../../../felles/sok/utils';
import { MidlertidigUtilgjengeligState } from '../../cv/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { SET_SCROLL_POSITION } from '../../sok/searchReducer';
import { Søkeresultat } from '../../sok/Søkeresultat';
import AppState from '../../AppState';
import TilgjengelighetFlagg from './tilgjengelighet-flagg/TilgjengelighetFlagg';
import './KandidaterTabell.less';

interface Props {
    kandidat: Søkeresultat;
    onKandidatValgt: (markert: boolean, kandidatnr: string) => void;
    markert: boolean;
    nettoppValgt: boolean;
    setScrollPosition: (position: number) => void;
    kandidatlisteId: string;
    stillingsId: string;
    midlertidigUtilgjengeligMap: MidlertidigUtilgjengeligState;
    hentMidlertidigUtilgjengeligForKandidat: (aktørId: string, kandidatnr: string) => void;
}

const KandidaterTableKandidat: FunctionComponent<Props> = ({
    kandidat,
    markert = false,
    nettoppValgt,
    setScrollPosition,
    kandidatlisteId,
    stillingsId,
    onKandidatValgt,
    midlertidigUtilgjengeligMap,
    hentMidlertidigUtilgjengeligForKandidat,
}) => {
    const onCheck = (kandidatnr) => {
        onKandidatValgt(!markert, kandidatnr);
    };

    const checkedClass = (markert, nettoppValgt) => {
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
    const linkTilKandidat = () => {
        if (kandidatlisteId) {
            return `/kandidater/kandidatliste/${kandidatlisteId}/cv?kandidatNr=${kandidatnummer}`;
        } else if (stillingsId) {
            return `/kandidater/stilling/${stillingsId}/cv?kandidatNr=${kandidatnummer}`;
        }
        return `/kandidater/cv?kandidatNr=${kandidatnummer}`;
    };

    let klassenavn = 'kandidater-tabell__rad kandidater-tabell__rad--kandidat';
    const markertRadKlasse = checkedClass(markert, nettoppValgt);
    if (markertRadKlasse) {
        klassenavn += ' kandidater-tabell__' + markertRadKlasse;
    }

    return (
        <div className={klassenavn}>
            <div className="skjemaelement skjemaelement--horisontal text-hide">
                <input
                    type="checkbox"
                    id={`marker-kandidat-${kandidatnummer}-checkbox`}
                    className="skjemaelement__input checkboks"
                    aria-label={`Marker kandidat med navn ${navn}`}
                    checked={markert}
                    onChange={() => {
                        onCheck(kandidat.arenaKandidatnr);
                    }}
                />
                <label
                    className="skjemaelement__label"
                    htmlFor={`marker-kandidat-${kandidatnummer}-checkbox`}
                    aria-hidden="true"
                >
                    Marker kandidat med navn {navn}
                </label>
            </div>
            <div className="kandidater-tabell__tilgjengelighet">
                <TilgjengelighetFlagg
                    status={kandidat.midlertidigUtilgjengeligStatus}
                    merInformasjon={midlertidigUtilgjengeligMap[kandidatnummer]}
                    hentMerInformasjon={() =>
                        hentMidlertidigUtilgjengeligForKandidat(
                            '123', // TODO: Bruk aktørId eller andre alternativer
                            kandidatnummer
                        )
                    }
                />
            </div>
            <div className="kandidater-tabell__kolonne-tekst">
                <Link
                    className="kandidater-tabell__navn lenke"
                    to={linkTilKandidat()}
                    onClick={() => setScrollPosition(window.pageYOffset)}
                    aria-label={`Se CV for ${navn}`}
                >
                    {navn}
                </Link>
            </div>
            <div className="kandidater-tabell__kolonne-tekst">{fodselsnummer}</div>
            <div className="kandidater-tabell__kolonne-tekst">{innsatsgruppe}</div>
            <div className="kandidater-tabell__kolonne-tekst">{bosted}</div>
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    midlertidigUtilgjengeligMap: state.midlertidigUtilgjengelig,
});

const mapDispatchToProps = (dispatch) => ({
    setScrollPosition: (scrollPosisjon) =>
        dispatch({ type: SET_SCROLL_POSITION, scrolletFraToppen: scrollPosisjon }),
    hentMidlertidigUtilgjengeligForKandidat: (aktørId: string, kandidatnr: string) => {
        dispatch({ type: 'FETCH_MIDLERTIDIG_UTILGJENGELIG', aktørId, kandidatnr });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterTableKandidat);
