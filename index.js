import puppeteer from 'puppeteer';

let url = 'https://www.draftbot.fr/economy/202859617917599745';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(url);

  let total_money = 0;

  let content = '';
  for (let i = 0; i < 100; i++) {
    content = await page.evaluate('document.querySelectorAll("div.money span")[' + str(i) + '].innerText');
    if (content.includes("k")) {
      total_money += 1000*float(content.replace("k",""));
    } else {
      total_money += float(content);
    }
  };

  await browser.close();

  console.log('Il y a actuellement ' + str(total_money) + ' Ploppy\'s en circulation dans le top 100.');
  
})();
