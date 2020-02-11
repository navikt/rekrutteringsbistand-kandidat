/* eslint-disable */
import 'autotrack';

(function(i, s, o, g, r, a, m) {
    i.GoogleAnalyticsObject = r;
    (i[r] =
        i[r] ||
        function() {
            (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date());
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-9127381-24', 'auto');
ga('set', 'anonymizeIp', true);
ga('require', 'urlChangeTracker', { trackReplaceState: true });
ga('send', 'pageview');

export function registerCompanyMetrics(orgClass) {
    ga('set', 'dimension1', orgClass);
}

export const recordNoRightsEvent = () => {
    ga('send', 'event', {
        eventCategory: 'Interaksjon',
        eventAction: 'Login',
        eventLabel: 'mangler-arbeidsgiver-rettigheter',
    });
};

export const recordHelpWithLoginRights = () => {
    ga('send', 'event', {
        eventCategory: 'Interaksjon',
        eventAction: 'Login',
        eventLabel: 'hjelp-til-innlogging',
    });
};
