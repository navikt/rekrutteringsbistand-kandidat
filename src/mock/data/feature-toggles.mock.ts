import FEATURE_TOGGLES from '../../common/konstanter';

export const featureToggles = FEATURE_TOGGLES.reduce(
    (alleToggles, toggle) => ({ ...alleToggles, [toggle]: false }),
    {}
);
