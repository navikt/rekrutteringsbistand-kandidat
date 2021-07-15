import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from '../../../../AppState';
import KandidatlisteActionType from '../../../reducer/KandidatlisteActionType';
import FåttJobben from './FåttJobben';
import { Kandidat } from '../../../kandidatlistetyper';
import { Utfall } from '../etiketter/UtfallEtikett';

type Props = {
    kanEndre: boolean;
    kandidatlisteId: string;
    kandidat: Kandidat;
};

const FåttJobbenForKandidat: FunctionComponent<Props> = ({
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
            type: KandidatlisteActionType.EndreUtfallKandidat,
            navKontor: valgtNavKontor,
            kandidatnr: kandidat.kandidatnr,
        });
    };

    return (
        <FåttJobben
            kanEndre={kanEndre}
            navn={`${kandidat.fornavn} ${kandidat.etternavn}`}
            utfall={kandidat.utfall}
            onEndreUtfall={endreUtfallForKandidat}
        />
    );
};

export default FåttJobbenForKandidat;
