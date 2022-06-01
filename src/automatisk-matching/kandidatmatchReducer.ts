import { ikkeLastet, Nettressurs } from '../api/Nettressurs';
import Kandidatmatch from './Kandidatmatch';

export type Stilling = {
    stilling: {
        uuid: string;
        title: string;
    };
    stillingsinfo: any;
};

export type KandidatmatchState = {
    stilling: Nettressurs<Stilling>;
    kandidater: Nettressurs<Kandidatmatch[]>;
};

export type MatchAction = SetStillingForMatchingAction | SetKandidatmatchAction;

type SetStillingForMatchingAction = {
    type: 'SET_STILLING_FOR_MATCHING';
    stilling: Nettressurs<Stilling>;
};

type SetKandidatmatchAction = {
    type: 'SET_KANDIDATMATCH';
    kandidater: Nettressurs<Kandidatmatch[]>;
};

const initialValues = {
    stilling: ikkeLastet(),
    kandidater: ikkeLastet(),
};

const kandidatmatchReducer = (state: KandidatmatchState = initialValues, action: MatchAction) => {
    switch (action.type) {
        case 'SET_STILLING_FOR_MATCHING':
            return {
                ...state,
                stilling: action.stilling,
            };

        case 'SET_KANDIDATMATCH':
            return {
                ...state,
                kandidater: action.kandidater,
            };
    }

    return state;
};

export default kandidatmatchReducer;
