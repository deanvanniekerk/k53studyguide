# Read-only analytics access

Use the identities below for the K53 measurement workstream ([#1](https://github.com/deanvanniekerk/k53studyguide/issues/1)). An enabled connector is not evidence that a report was retrieved. Keep raw exports, authentication files and customer-level evidence outside this public repository.

## Properties and date boundaries

| Source | Intended identity | Reporting boundary |
| --- | --- | --- |
| GA4 | Account `195283836`, property `269952161`, `k53-study-guide` | Property timezone; previously observed GMT+02:00, currency USD. Re-read property metadata before comparing reports. |
| Search Console | `sc-domain:k53studyguide.online` | Pacific time (`America/Los_Angeles`); dates include both endpoints. |
| PostHog | K53 project `491784`; filter to `k53studyguide.online` and `www.k53studyguide.online` | Project timezone UTC at the October 2026 audit. |
| Google Play | Package `deanvniekerk.k53studyguide.app` | Preserve the timezone and metric definition from the selected report. |

Search Console uses [Pacific-time dates and supports a read-only scope](https://developers.google.com/webmaster-tools/v1/searchanalytics/query). Equal calendar dates across these systems do not imply equal clock boundaries.

## Connection verification

Audit date: 6 October 2026. Re-run the small reports below before relying on a connection in a later session.

| Connection | Verified capability / limitation |
| --- | --- |
| GA4 MCP | Existing authorized-user credential refresh returns `invalid_grant`; requires renewal before a successful automated report can be claimed. |
| Search Console MCP | Configured service account returns HTTP 200 with no visible sites; the MCP request timed out after 300 seconds. The local server tries OAuth first and requests `webmasters` (write-capable), so its reauthentication is not the least-privilege route for this task. |
| Google Play MCP | Local `get_statistics` source returns placeholder text for installs and crashes. It is not an acquisition report source. |
| PostHog | The earlier audit retrieved dated website traffic queries. This does not establish mobile-app or store acquisition coverage. |
| Google Ads | Earlier audit obtained campaign data through the signed-in console; automated reporting must be verified independently before being labelled usable. |
| RevenueCat / App Store Connect | Earlier audit used signed-in reports. No automated report was verified by this access check. |

An empty Search Console site list means the authenticated identity cannot see the expected property; it does not mean there was no search traffic. Do not add duplicate properties or grant broad project roles to work around it.

## Renew access

Use the existing installed OAuth client and the Google identity that already has access to the K53 property. Request only:

- `https://www.googleapis.com/auth/analytics.readonly`
- `https://www.googleapis.com/auth/webmasters.readonly`

Save the authorized-user credential outside the checkout with owner-only file permissions. Preserve the previous credential privately until the replacement has returned both property metadata and a dated report. Never paste the credential, refresh token or an OAuth callback code into a ticket.

For GA4, point the existing MCP server's `GOOGLE_APPLICATION_CREDENTIALS` at the verified credential and reconnect the server. For Search Console, use the read-only API recipe below while the installed MCP server requires the broader `webmasters` scope. Its OAuth reauthenticate action should not be used to silently expand permissions.

If sign-in is required, the owner must complete Google account selection and consent. The attempted read-only renewal reached an unverified-app warning for the existing OAuth client; owner action is still required before access can be called restored. If the expected property is still absent afterward, an existing property administrator must grant that identity appropriate read access; local code cannot repair a property permission.

## Repeatable smoke queries

Use a closed reporting window such as **8 September–3 October 2026**. Excluding the newest days avoids treating Search Console's provisional data as final. Keep the same explicit dates in request and export metadata.

For GA4 MCP, call `get_property_details` with `property_id: 269952161`, then `run_report`:

```json
{
  "property_id": 269952161,
  "date_ranges": [{"start_date": "2026-09-08", "end_date": "2026-10-03"}],
  "dimensions": ["date", "platform"],
  "metrics": ["activeUsers", "eventCount"],
  "limit": 100,
  "order_bys": [{"dimension": {"dimension_name": "date"}}],
  "return_property_quota": true
}
```

For a read-only direct API check, use a Python environment with `google-auth` and `requests`, set `GOOGLE_APPLICATION_CREDENTIALS` to the private authorized-user file, and run this recipe. It performs only metadata/report reads, even though report-query endpoints use HTTP POST:

```python
import json
import os
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import AuthorizedSession

credentials = Credentials.from_authorized_user_file(
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"],
    scopes=[
        "https://www.googleapis.com/auth/analytics.readonly",
        "https://www.googleapis.com/auth/webmasters.readonly",
    ],
)
session = AuthorizedSession(credentials)


def read(method, url, body=None):
    response = session.request(method, url, json=body, timeout=30)
    response.raise_for_status()
    return response.json()


property_details = read(
    "GET", "https://analyticsadmin.googleapis.com/v1beta/properties/269952161"
)
assert property_details["displayName"] == "k53-study-guide"
print(json.dumps({"property": property_details}, indent=2))
print(json.dumps(read(
    "POST", "https://analyticsdata.googleapis.com/v1beta/properties/269952161:runReport",
    {
        "dateRanges": [{"startDate": "2026-09-08", "endDate": "2026-10-03"}],
        "dimensions": [{"name": "date"}, {"name": "platform"}],
        "metrics": [{"name": "activeUsers"}, {"name": "eventCount"}],
        "limit": 100,
        "orderBys": [{"dimension": {"dimensionName": "date"}}],
        "returnPropertyQuota": True,
    },
), indent=2))

sites = read("GET", "https://www.googleapis.com/webmasters/v3/sites")
assert any(
    site["siteUrl"] == "sc-domain:k53studyguide.online"
    for site in sites.get("siteEntry", [])
), "Expected Search Console property is not visible to this identity"
print(json.dumps(read(
    "POST",
    "https://www.googleapis.com/webmasters/v3/sites/"
    "sc-domain%3Ak53studyguide.online/searchAnalytics/query",
    {
        "startDate": "2026-09-08",
        "endDate": "2026-10-03",
        "dimensions": ["date"],
        "type": "web",
        "dataState": "final",
        "rowLimit": 100,
    },
), indent=2))
```

Redirect output only to a private evidence directory. Record the fetch timestamp, identity, requested window, returned timezone/currency, row count and any sampling, thresholding or incomplete-data metadata. An HTTP success with zero rows is a successful query, not proof of zero underlying demand; Search Console can omit dates and does not promise every detail row.

## Real Google Play acquisition data

Use **Play Console → Download reports → Statistics**, or the report's CSV export. For repeatable downloads, copy the exact private Cloud Storage bucket/object URI from Play Console, verify access to that report, and use the documented export format. Do not guess the bucket name or infer installs from ratings, reviews, Firebase `first_open`, ad conversions or website referral clicks.

Preserve source, app package, report dates, timezone, acquisition definition, filters and export timestamp beside the CSV. Store the file outside the repository. [Google's monthly report guide](https://support.google.com/googleplay/android-developer/answer/6135870?hl=en) documents the private Cloud Storage export source; the [Play Developer Reporting API](https://developers.google.com/play/developer/reporting) is for Android vitals rather than acquisition.
