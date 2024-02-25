echo -e "Store puppeteer executable in cache\n"
mkdir ./.cache
if [ -d "/app/.cache/puppeteer" ]; then
    mv /app/.cache/puppeteer ./.cac
else
    echo "/app/.cache/puppeteer does not exist, ignoring..."
    npx puppeteer browsers install chrome
fi