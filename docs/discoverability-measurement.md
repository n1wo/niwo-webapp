# Discoverability Measurement Runbook

## Privacy decision

The repository currently has no non-essential analytics or consent layer, and the published privacy policy says so. This change therefore adds no browser analytics, cookies, persistent identifiers, fingerprinting, session replay, or third-party tracking. Search Console and Bing Webmaster Tools account-side search reports can answer the initial discoverability question with less collection risk.

Environment-managed verification values:

- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_BING_SITE_VERIFICATION`

Unset values are omitted safely. Values are verification tokens, not application secrets, but they still belong in deployment configuration rather than source.

## External account setup

1. Add and verify the canonical `https://www.niwosystems.com` property in Google Search Console.
2. Add and verify the site in Bing Webmaster Tools.
3. Deploy the matching environment token and confirm the rendered verification meta tag.
4. Submit `https://www.niwosystems.com/sitemap.xml` to both services.
5. Inspect representative EN/DE home, service, topic, insight, about, and legal URLs.
6. Capture the pre-release baseline before interpreting change.

## Review cadence and measures

Weekly for the first month, then monthly:

- valid indexed pages and exclusions;
- impressions, clicks, click-through rate, and average position by page/query/locale;
- landing-page visibility for the four service pages;
- crawl errors, canonical selection, and sitemap status;
- manually reviewed enquiries that voluntarily mention search or an AI assistant.

If a privacy-approved analytics system is introduced later, segment only consented events by landing page, locale, coarse source/referrer, and campaign parameters. Recognized AI sources may include `chatgpt.com` and explicit `utm_source=chatgpt.com`. Do not capture form text, email content, incident descriptions, credentials, URLs containing sensitive parameters, or security evidence.

Proposed conversion names for a future approved implementation: `contact_email_click`, `incident_guidance_click`, and `contact_completed`. Event payloads should contain only route, locale, and coarse source classification.

## Attribution limits

Missing AI referral data does not prove absence from AI-generated answers. A referral does not prove that a recommendation caused an enquiry. Search Console and Bing data are sampled/processed platform reports, not complete server logs. Locale, device, consent, browser privacy controls, copied URLs, and indirect journeys all limit attribution.

