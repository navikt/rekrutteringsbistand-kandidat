import { reduxStore } from '../app';

const useFeatureToggle = (toggle: string): boolean => {
    return reduxStore.getState().search.featureToggles[toggle];
};

export default useFeatureToggle;
