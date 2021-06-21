import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from '../../../../AppState';
import KandidatlisteActionType from '../../../reducer/KandidatlisteActionType';
import { Utfall } from '../../utfall-med-endre-ikon/UtfallMedEndreIkon';
import DelingAvCv from './DelingAvCv';

type Props = {
    kanEndre?: boolean;
    utfall: Utfall;
    kandidatnummer: string;
    kandidatlisteId: string;
};

const DelingAvCvForKandidat: FunctionComponent<Props> = ({
    kanEndre,
    utfall,
    kandidatnummer,
    kandidatlisteId,
}) => {
    const dispatch = useDispatch();
    const valgtNavKontor = useSelector((state: AppState) => state.navKontor.valgtNavKontor);

    const endreUtfallForKandidat = (nyttUtfall: Utfall) => {
        dispatch({
            kandidatlisteId,
            utfall: nyttUtfall,
            type: KandidatlisteActionType.ENDRE_UTFALL_KANDIDAT,
            navKontor: valgtNavKontor,
            kandidatnr: kandidatnummer,
        });
    };

    return (
        <DelingAvCv utfall={utfall} kanEndre={kanEndre} onEndreUtfall={endreUtfallForKandidat} />
    );
};

export default DelingAvCvForKandidat;
