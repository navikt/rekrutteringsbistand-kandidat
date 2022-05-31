import { ikkeLastet, Nettressurs } from '../api/Nettressurs';
import Kandidatmatch from './Kandidatmatch';

type Stilling = {
    stilling: {
        uuid: string;
        title: string;
    };
};

export type KandidatmatchState = {
    stilling: Nettressurs<Stilling>;
    kandidater: Nettressurs<Kandidatmatch[]>;
};

export type MatchAction = SetStillingForMatchingAction | SetKandidatmatchAction;

type SetStillingForMatchingAction = {
    type: 'SetStillingForMatching';
    stilling: Nettressurs<Stilling>;
};

type SetKandidatmatchAction = {
    type: 'SetKandidatmatch';
    kandidater: Nettressurs<Kandidatmatch[]>;
};

const initialValues = {
    stilling: ikkeLastet(),
    kandidater: ikkeLastet(),
};

const kandidatmatchReducer = (state: KandidatmatchState = initialValues, action: MatchAction) => {
    switch (action.type) {
        case 'SetStillingForMatching':
            return {
                ...state,
                stilling: action.stilling,
            };

        case 'SetKandidatmatch':
            return {
                ...state,
                kandidater: action.kandidater,
            };
    }

    return state;
};

export default kandidatmatchReducer;
