const puppeteer = require('puppeteer-core');

async function checkShopeePhone(phone) {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Fake user agent
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
  await page.setUserAgent(userAgent);

  await page.goto('https://shopee.vn/buyer/login?next=https%3A%2F%2Fshopee.vn%2F', { waitUntil: 'networkidle2' });

  const cookies = await page.cookies();
  const csrfToken = cookies.find(c => c.name === 'csrftoken')?.value || '';
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

  const headers = {
    'accept': '*/*',
    'accept-language': 'vi,en;q=0.9',
    'content-type': 'application/json',
    'user-agent': userAgent,
    'x-csrftoken': csrfToken,
    'referer': 'https://shopee.vn/',
    'cookie': cookieHeader,
  };

  const body = {
    phone,
    login_key: phone,
    login_type: 'phone',
    support_ivs: true,
  };

  const result = await page.evaluate(async (url, headers, body) => {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return await res.json();
  }, 'https://shopee.vn/api/v4/account/login_by_phone/get_login_flow', headers, body);

  await browser.close();
  return result;
}

module.exports = checkShopeePhone;
