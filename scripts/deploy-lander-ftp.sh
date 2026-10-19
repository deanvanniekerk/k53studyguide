#!/usr/bin/env bash
set -euo pipefail

preview_topics=0
case "${1:-}" in
  --preview-topics) preview_topics=1 ;;
  "") ;;
  *) echo "Usage: $0 [--preview-topics]" >&2; exit 1 ;;
esac

if [[ -f ".dev.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source ".dev.env"
  set +a
fi

if [[ "$preview_topics" == 1 ]]; then
  export TOPIC_PREVIEW=1 TOPIC_APP_BASE=/app-preview/ TOPIC_IMAGE_BASE=/app-preview/assets/images
elif [[ "${WEB_LAUNCH_APPROVED:-}" != 1 || "${TOPIC_PREVIEW:-}" != 0 ]]; then
  echo "Full website publishing requires owner launch approval (#55): WEB_LAUNCH_APPROVED=1 TOPIC_PREVIEW=0." >&2
  echo "Use --preview-topics to upload only preview topics and their dependencies." >&2
  exit 1
fi

FTP_HOST="${FTP_HOST:-ftp.k53studyguide.online}"
FTP_USER="${FTP_USER:-publisher@k53studyguide.online}"
FTP_REMOTE_DIR="${FTP_REMOTE_DIR:-.}"
DIST_DIR="pkg/lander/dist"

if [[ -z "${FTP_PASSWORD:-}" ]]; then
  echo "Missing FTP_PASSWORD."
  echo "Add it to .dev.env or run: FTP_PASSWORD='your-cpanel-ftp-password' pnpm lander:deploy"
  exit 1
fi

echo "Building lander..."
pnpm --filter lander build

if [[ ! -d "$DIST_DIR" ]]; then
  echo "Build output not found at $DIST_DIR"
  exit 1
fi

# Refuse to replace unknown host configuration, even during a preview refresh.
# Merge owner rules into public/.htaccess and rebuild before retrying.
existing_rules=$(mktemp)
scoped_rules=$(mktemp)
trap 'rm -f "$existing_rules" "$scoped_rules"' EXIT
if curl --fail --silent --show-error --user "$FTP_USER:$FTP_PASSWORD" \
  "ftp://$FTP_HOST/$FTP_REMOTE_DIR/.htaccess" --output "$existing_rules"; then
  if ! cmp -s "$existing_rules" "$DIST_DIR/.htaccess"; then
    echo "Refusing to replace existing root .htaccess; merge its rules into pkg/lander/public/.htaccess before publishing." >&2
    exit 1
  fi
else
  status=$?
  if [[ "$status" != 78 ]]; then
    echo "Could not verify existing root .htaccess (curl $status); no files uploaded." >&2
    exit 1
  fi
fi

upload() {
  local file="$1" relative_path="$2"
  echo "Uploading $relative_path"
  curl --fail --silent --show-error --ftp-create-dirs \
    --user "$FTP_USER:$FTP_PASSWORD" --upload-file "$file" \
    "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$relative_path"
}

if [[ "$preview_topics" == 1 ]]; then
  # Add preview dependencies first. Do not replace the live homepage, guides,
  # privacy or sitemap before the owner launch gate. Root preview routing and
  # crawler exclusions are shared by preview and production.
  while IFS= read -r -d '' file; do
    upload "$file" "${file#$DIST_DIR/}"
  done < <(find "$DIST_DIR/assets" -type f -print0)
  upload "$DIST_DIR/404.html" 404.html
  upload "$DIST_DIR/.htaccess" .htaccess
  upload "$DIST_DIR/robots.txt" robots.txt
  upload "$DIST_DIR/404.html" study/404.html
  printf 'ErrorDocument 404 /study/404.html\n' > "$scoped_rules"
  upload "$scoped_rules" study/.htaccess
  while IFS= read -r -d '' file; do
    upload "$file" "${file#$DIST_DIR/}"
  done < <(find "$DIST_DIR/study" -type f -name '*.html' -print0)
else
  # Keep old fingerprinted files for cached HTML. Publish the homepage last.
  while IFS= read -r -d '' file; do
    upload "$file" "${file#$DIST_DIR/}"
  done < <(
    find "$DIST_DIR" -type f ! -name '*.html' -print0
    find "$DIST_DIR" -type f -name '*.html' ! -path "$DIST_DIR/index.html" -print0
  )
  upload "$DIST_DIR/index.html" index.html
fi

echo "Lander deployed."
