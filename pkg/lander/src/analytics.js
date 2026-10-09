const analyticsQuery = new URLSearchParams(window.location.search);
window.K53_ANALYTICS_PROPERTIES = {
  analytics_environment: 'production',
  analytics_test: analyticsQuery.get('analytics_test') === 'true' || analyticsQuery.get('utm_source') === 'qa' || analyticsQuery.get('utm_campaign') === 'issue7',
};
window.K53_ANALYTICS_ENABLED = ['k53studyguide.online', 'www.k53studyguide.online'].includes(window.location.hostname);

window.K53_GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
if (window.K53_ANALYTICS_ENABLED && /^G-[A-Z0-9]+$/.test(window.K53_GA_MEASUREMENT_ID)) {
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${window.K53_GA_MEASUREMENT_ID}`;
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('set', window.K53_ANALYTICS_PROPERTIES);
  window.gtag('config', window.K53_GA_MEASUREMENT_ID);
  window.gtag('event', 'landing_page_view', {
    ...window.K53_ANALYTICS_PROPERTIES,
    page_location: window.location.href,
    page_title: document.title,
  });
}

// PostHog product analytics. The phc_ project token is a public, client-side
// key (safe to ship in the bundle); override per environment with
// VITE_POSTHOG_KEY / VITE_POSTHOG_HOST in .dev.env if needed.
// api_host points at our managed reverse proxy; ui_host is required so
// PostHog dashboard links resolve back to the real app.
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || 'phc_DoqPgagqgsfDkiS2rFvwtYYDhWCPxTrsjfapw2WJ7pDr';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://v.vanniekerk.online';

if (window.K53_ANALYTICS_ENABLED && POSTHOG_KEY) {
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="ki Ci init qi Hi pr ji zi Di capture calculateEventProperties Qi register register_once register_for_session unregister unregister_for_session Ki getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync Xi identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty Ji Gi createPersonProfile setInternalOrTestUser Yi Ai rn opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Vi debug mr it getPageViewId captureTraceFeedback captureTraceMetric Oi".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  window.posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    ui_host: 'https://us.posthog.com',
    defaults: '2026-05-30',
    person_profiles: 'identified_only',
  });
  window.posthog.capture('landing_page_view', {
    ...window.K53_ANALYTICS_PROPERTIES,
    page_location: window.location.href,
    page_title: document.title,
  });
}


const trackAnalyticsEvent = (eventName, params = {}) => {
  if (!window.K53_ANALYTICS_ENABLED) return;
  params = { ...params, ...window.K53_ANALYTICS_PROPERTIES };
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
  if (window.posthog && typeof window.posthog.capture === 'function') {
    window.posthog.capture(eventName, params);
  }
};

const getStoreCtaLocation = (element) => {
  const explicitLocation = element.getAttribute('data-analytics-location');
  if (explicitLocation) return explicitLocation;

  const href = element.getAttribute('href') || '';
  try {
    const url = new URL(href, window.location.href);
    const referrer = url.searchParams.get('referrer');
    if (!referrer) return 'unknown';

    const referrerParams = new URLSearchParams(referrer);
    return referrerParams.get('utm_medium') || 'unknown';
  } catch {
    return 'unknown';
  }
};

document.querySelectorAll('a[href*="play.google.com/store/apps/details"]').forEach(link => {
  link.addEventListener('click', () => {
    const ctaLocation = getStoreCtaLocation(link);
    const params = {
      cta_location: ctaLocation,
      store_platform: 'android',
    };

    trackAnalyticsEvent('select_store_cta', params);
    trackAnalyticsEvent('play_store_referral_click', params);
  });
});

document.querySelectorAll('a[href*="apps.apple.com"]').forEach(link => {
  link.addEventListener('click', () => {
    const params = {
      cta_location: getStoreCtaLocation(link),
      store_platform: 'ios',
    };

    trackAnalyticsEvent('select_store_cta', params);
    trackAnalyticsEvent('app_store_referral_click', params);
  });
});
