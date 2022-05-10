import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from '../../../../AppState';
import KandidatlisteActionType from '../../../reducer/KandidatlisteActionType';
import DelingAvCv from './DelingAvCv';
import { Kandidat, Kandidatutfall } from '../../../domene/Kandidat';

type Props = {
    kanEndre: boolean;
    kandidatlisteId: string;
    kandidat: Kandidat;
};

const DelCvMedArbeidsgiver: FunctionComponent<Props> = ({
    kanEndre,
    kandidatlisteId,
    kandidat,
}) => {
    const dispatch = useDispatch();
    const valgtNavKontor = useSelector((state: AppState) => state.navKontor.valgtNavKontor);

    const endreUtfallForKandidat = (nyttUtfall: Kandidatutfall) => {
        dispatch({
            kandidatlisteId,
            utfall: nyttUtfall,
            type: KandidatlisteActionType.EndreUtfallKandidat,
            navKontor: valgtNavKontor,
            kandidatnr: kandidat.kandidatnr,
        });
    };

    return (
        <DelingAvCv
            utfall={kandidat.utfall}
            utfallsendringer={kandidat.utfallsendringer}
            kanEndre={kanEndre}
            onEndreUtfall={endreUtfallForKandidat}
            onSlettCv={() => {
                console.log('TODO: Slett CV');
            }}
        />
    );
};

export default DelCvMedArbeidsgiver;
