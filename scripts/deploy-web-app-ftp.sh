#!/usr/bin/env bash
set -euo pipefail

if [[ -f ".dev.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source ".dev.env"
  set +a
fi

FTP_HOST="${FTP_HOST:-ftp.k53studyguide.online}"
FTP_USER="${FTP_USER:-publisher@k53studyguide.online}"
FTP_REMOTE_DIR="${FTP_REMOTE_DIR:-.}"
WEB_APP_MOUNT="${WEB_APP_MOUNT:-app}"
case "$WEB_APP_MOUNT" in
  app | app-preview) ;;
  *) echo "WEB_APP_MOUNT must be app or app-preview."; exit 1 ;;
esac
if [[ "$WEB_APP_MOUNT" == "app" && "${WEB_LAUNCH_APPROVED:-}" != 1 ]]; then
  echo "Production /app/ publishing requires owner launch approval (#55): WEB_LAUNCH_APPROVED=1." >&2
  exit 1
fi
if [[ -z "${FTP_PASSWORD:-}" ]]; then
  echo "Missing FTP_PASSWORD. Add it to .dev.env."
  exit 1
fi

# Preview builds must not inherit production measurement configuration.
if [[ "$WEB_APP_MOUNT" == "app-preview" ]]; then
  unset WEB_ANALYTICS
fi
WEB_APP_BASE="/$WEB_APP_MOUNT/" pnpm web:build

upload() {
  local file="$1" relative_path="$2"
  echo "Uploading $WEB_APP_MOUNT/$relative_path"
  curl --fail --silent --show-error --ftp-create-dirs \
    --user "$FTP_USER:$FTP_PASSWORD" --upload-file "$file" \
    "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$WEB_APP_MOUNT/$relative_path"
}

# Keep old fingerprinted assets for cached HTML; dependencies go up before HTML.
while IFS= read -r -d '' file; do
  upload "$file" "${file#pkg/app/build/}"
done < <(find pkg/app/build -type f ! -name 'index.html' -print0)
upload pkg/app/build/index.html index.html
upload scripts/web-app.htaccess .htaccess
echo "Web app deployed to /$WEB_APP_MOUNT/."
