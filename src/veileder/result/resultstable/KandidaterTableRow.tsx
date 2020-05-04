import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Resultstable.less';
import { SET_SCROLL_POSITION } from '../../sok/searchReducer';
import { capitalizeFirstLetter, capitalizePoststed } from '../../../felles/sok/utils';
import TilgjengelighetFlagg from './tilgjengelighet-flagg/TilgjengelighetFlagg';
import { Cv } from '../../cv/reducer/cvReducer';

interface Props {
    kandidat: Cv;
    onKandidatValgt: (markert: boolean, kandidatnr: string) => void;
    markert: boolean;
    nettoppValgt: boolean;
    setScrollPosition: (position: number) => void;
    kandidatlisteId: string;
    stillingsId: string;
}

const KandidaterTableRow: FunctionComponent<Props> = (props) => {
    const onCheck = (kandidatnr) => {
        props.onKandidatValgt(!props.markert, kandidatnr);
    };

    const checkedClass = (markert, nettoppValgt) => {
        if (nettoppValgt) {
            return 'nettopp-valgt';
        } else if (markert) {
            return 'checked';
        }
        return '';
    };

    const {
        kandidat,
        markert = false,
        nettoppValgt,
        setScrollPosition,
        kandidatlisteId,
        stillingsId,
    } = props;
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

    return (
        <div className={`NyKandidaterTableRow ${checkedClass(markert, nettoppValgt)}`}>
            <div className="kandidat-content">
                <div className="kolonne-checkbox skjemaelement--pink">
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
                            .
                        </label>
                    </div>
                </div>
                <div className="NyKandidaterTableRow__tilgjengelighet">
                    <TilgjengelighetFlagg status={kandidat.midlertidigUtilgjengeligStatus} />
                </div>
                <div className="kolonne-navn kolonne-tekst">
                    <Link
                        className="kolonne-lenke link"
                        to={linkTilKandidat()}
                        onClick={() => setScrollPosition(window.pageYOffset)}
                        aria-label={`Se CV for ${navn}`}
                    >
                        {navn}
                    </Link>
                </div>
                <div className="kolonne-dato kolonne-tekst">{fodselsnummer}</div>
                <div className="kolonne-innsatsgruppe kolonne-tekst">{innsatsgruppe}</div>
                <div className="kolonne-bosted kolonne-tekst">{bosted}</div>
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    setScrollPosition: (scrollPosisjon) =>
        dispatch({ type: SET_SCROLL_POSITION, scrolletFraToppen: scrollPosisjon }),
});

export default connect(null, mapDispatchToProps)(KandidaterTableRow);
