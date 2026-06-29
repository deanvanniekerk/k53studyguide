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
DIST_DIR="pkg/lander/dist"

case "${LANDER_INCLUDE_QUIZ_IMAGES:-0}" in
  1 | true | TRUE | yes | YES)
    LANDER_INCLUDE_QUIZ_IMAGES=1
    ;;
  *)
    LANDER_INCLUDE_QUIZ_IMAGES=0
    ;;
esac
export LANDER_INCLUDE_QUIZ_IMAGES

if [[ -z "${FTP_PASSWORD:-}" ]]; then
  echo "Missing FTP_PASSWORD."
  echo "Add it to .dev.env or run: FTP_PASSWORD='your-cpanel-ftp-password' pnpm lander:deploy"
  exit 1
fi

echo "Building lander..."
pnpm --dir pkg/lander exec vite build

if [[ ! -d "$DIST_DIR" ]]; then
  echo "Build output not found at $DIST_DIR"
  exit 1
fi

echo "Uploading $DIST_DIR to ftp://$FTP_HOST/$FTP_REMOTE_DIR"
if [[ "$LANDER_INCLUDE_QUIZ_IMAGES" == "1" ]]; then
  echo "Including quiz image assets."
else
  echo "Skipping quiz image assets. Run pnpm lander:deploy:full to upload them."
fi

while IFS= read -r -d '' file; do
  relative_path="${file#$DIST_DIR/}"
  remote_url="ftp://$FTP_HOST/$FTP_REMOTE_DIR/$relative_path"

  echo "Uploading $relative_path"
  curl --fail --silent --show-error --ftp-create-dirs \
    --user "$FTP_USER:$FTP_PASSWORD" \
    --upload-file "$file" \
    "$remote_url"
done < <(
  if [[ "$LANDER_INCLUDE_QUIZ_IMAGES" == "1" ]]; then
    find "$DIST_DIR" -type f -print0
  else
    find "$DIST_DIR" -path "$DIST_DIR/quiz-assets/images" -prune -o -type f -print0
  fi
)

echo "Lander deployed."
