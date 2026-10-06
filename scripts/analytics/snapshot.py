#!/usr/bin/env python3
"""Read-only GA4 diagnostic snapshot. Raw results belong outside the repository.

Requires google-auth and requests in the selected Python environment.
Does not calculate production conversion or infer sales from client events.
"""
import argparse
import datetime as dt
import json
import os
from pathlib import Path

from google.auth.transport.requests import AuthorizedSession
from google.oauth2.credentials import Credentials

PROPERTY = "269952161"
EVENTS = ["first_open", "app_open", "view_promotion", "select_promotion",
          "begin_checkout", "purchase_unavailable", "purchase_cancel",
          "purchase_pending", "purchase_error", "checkout_outcome",
          "restore_start", "restore_outcome", "purchase", "in_app_purchase",
          "quiz_complete", "mock_test_complete", "select_store_cta"]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--credentials", required=True, type=Path)
    parser.add_argument("--start", required=True, type=dt.date.fromisoformat)
    parser.add_argument("--end", required=True, type=dt.date.fromisoformat)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    if args.start > args.end:
        parser.error("start must be on or before end")
    output = args.output.expanduser().resolve()
    repo = Path(__file__).resolve().parents[2]
    if output == repo or repo in output.parents:
        parser.error("output must be outside the public repository")
    os.umask(0o077)
    output.mkdir(parents=True, exist_ok=True)
    session = AuthorizedSession(Credentials.from_authorized_user_file(
        str(args.credentials.expanduser()),
        scopes=["https://www.googleapis.com/auth/analytics.readonly"],
    ))
    manifest = {
        "fetched_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "property": PROPERTY,
        "inclusive_dates": [str(args.start), str(args.end)],
        "purpose": "diagnostic baseline, NOT a verified production funnel",
        "exclusions": "none; includes QA, sandbox, legacy builds and unknown traffic",
        "confirmed_sales": None,
        "confirmed_sales_status": "requires private RevenueCat/store reconciliation",
        "reports": {},
    }

    def save(name, data):
        path = output / f"{name}.json"
        path.write_text(json.dumps(data, indent=2) + "\n")
        path.chmod(0o600)

    def request(method, url, body=None):
        response = session.request(method, url, json=body, timeout=60)
        # Avoid dumping response bodies or authentication details on failure.
        if not response.ok:
            raise RuntimeError(f"GA4 request failed: HTTP {response.status_code}")
        return response.json()

    admin = f"https://analyticsadmin.googleapis.com/v1alpha/properties/{PROPERTY}"
    prop = request("GET", admin)
    save("property", prop)
    manifest["timezone"] = prop["timeZone"]
    for name, endpoint in [("custom-dimensions", "customDimensions"),
                           ("retention", "dataRetentionSettings"),
                           ("bigquery-links", "bigQueryLinks")]:
        data = request("GET", f"{admin}/{endpoint}")
        if data.get("nextPageToken"):
            raise RuntimeError("Admin list was truncated; inspect pagination before using snapshot")
        save(name, data)
        if name == "custom-dimensions":
            dimensions = {(x["scope"], x["parameterName"]) for x in data.get("customDimensions", [])}
    save("manifest", manifest)

    def report(name, dimension_names, metrics, event_filter=False):
        query = {
            "dateRanges": [{"startDate": str(args.start), "endDate": str(args.end)}],
            "dimensions": [{"name": x} for x in dimension_names],
            "metrics": [{"name": x} for x in metrics],
            "limit": 100000,
            "orderBys": [{"dimension": {"dimensionName": x}} for x in dimension_names],
        }
        if event_filter:
            query["dimensionFilter"] = {"filter": {"fieldName": "eventName", "inListFilter": {"values": EVENTS}}}
        save(f"{name}-request", query)
        rows, metadata = [], []
        while True:
            page = request("POST", f"https://analyticsdata.googleapis.com/v1beta/properties/{PROPERTY}:runReport", {
                **query, "offset": len(rows),
            })
            batch = page.get("rows", [])
            rows.extend(batch)
            metadata.append(page.get("metadata", {}))
            if len(rows) >= page.get("rowCount", 0):
                break
            if not batch:
                raise RuntimeError("GA4 returned an incomplete page")
        save(name, {"dimensionHeaders": page.get("dimensionHeaders", []),
                    "metricHeaders": page.get("metricHeaders", []),
                    "rows": rows, "rowCount": len(rows), "pageMetadata": metadata})
        manifest["reports"][name] = {"rows": len(rows), "pageMetadata": metadata}
        save("manifest", manifest)

    # Separate denominators avoid adding non-additive user counts across events.
    report("users-by-platform", ["platform"], ["totalUsers", "activeUsers", "newUsers"])
    report("events-by-platform", ["platform", "eventName"], ["totalUsers", "eventCount"], True)
    report("native-version-coverage", ["platform", "appVersion", "eventName"], ["totalUsers", "eventCount"], True)
    required = {("USER", "premium_status"), ("EVENT", "offer_origin")}
    if required <= dimensions:
        report("journey-breakdown", ["platform", "eventName", "customUser:premium_status", "customEvent:offer_origin"],
               ["totalUsers", "eventCount"], True)
    else:
        manifest["journey_breakdown_status"] = "not available: required custom dimensions not registered"
    save("manifest", manifest)
    print(f"Saved private diagnostic snapshot to {output}; confirmed sales remain unverified.")


if __name__ == "__main__":
    main()
