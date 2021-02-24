import { useSelector } from 'react-redux';
import AppState from '../AppState';
import FEATURE_TOGGLES from '../common/konstanter';

export const useFeatureToggle = (toggle: string) => {
    if (!FEATURE_TOGGLES.includes(toggle)) {
        console.error(`'${toggle}' er ikke i listen over feature toggles`);
    }
    return useSelector((state: AppState) => state.søk.featureToggles[toggle]);
};
