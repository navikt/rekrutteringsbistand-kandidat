import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from '../../../../AppState';
import KandidatlisteActionType from '../../../reducer/KandidatlisteActionType';
import { Utfall } from '../../utfall-med-endre-ikon/UtfallMedEndreIkon';
import DelingAvCv from './DelingAvCv';
import { Kandidat } from '../../../kandidatlistetyper';

type Props = {
    kanEndre: boolean;
    kandidatlisteId: string;
    kandidat: Kandidat;
};

const DelingAvCvForKandidat: FunctionComponent<Props> = ({
    kanEndre,
    kandidatlisteId,
    kandidat,
}) => {
    const dispatch = useDispatch();
    const valgtNavKontor = useSelector((state: AppState) => state.navKontor.valgtNavKontor);

    const endreUtfallForKandidat = (nyttUtfall: Utfall) => {
        dispatch({
            kandidatlisteId,
            utfall: nyttUtfall,
            type: KandidatlisteActionType.ENDRE_UTFALL_KANDIDAT,
            navKontor: valgtNavKontor,
            kandidatnr: kandidat.kandidatnr,
        });
    };

    return (
        <DelingAvCv
            utfall={kandidat.utfall}
            kanEndre={kanEndre}
            onEndreUtfall={endreUtfallForKandidat}
        />
    );
};

export default DelingAvCvForKandidat;
