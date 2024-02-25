echo -e "Store puppeteer executable in cache\n"
mkdir ./.cache
if [ -d "/app/.cache/puppeteer" ]; then
    mv /app/.cache/puppeteer ./.cache
else
    echo "/app/.cache/puppeteer does not exist, installing Chrome..."
    npx puppeteer browsers install chrome
    mv /app/.cache/puppeteer ./.cache
fi