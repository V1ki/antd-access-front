import { Page } from 'puppeteer' ;

const { uniq } = require('lodash');
const RouterConfig = require('../../config/config').default.routes;

const BASE_URL = `http://localhost:${process.env.PORT || 8000}`;

const expectPuppeteer = require('expect-puppeteer');

let page: Page ;

beforeEach(async () => {
  page = tmpPage ;
  await page.goto(`${BASE_URL}`);
  await page.evaluate(() => {
    localStorage.setItem('antd-pro-authority', '["admin"]');
  });
});

describe('Ant Design Pro E2E test', () => {

  it(`Login with error pwd` ,async ()=>{
    await page.goto(`${BASE_URL}/user/login`);
    await page.screenshot({
      path: "screenschot.png"
    })
    await expectPuppeteer(page).toFill(`[id="username"]`,"admin");
    await expectPuppeteer(page).toFill(`[id="password"]`,"ant.design1");

  
    await page.screenshot({
      path: "screenschot.png"
    })

    await expectPuppeteer(page).toClick(`button.ant-btn`);


    await page.screenshot({
      path: "screenschot.png"
    })

    await page.waitForSelector('div.ant-alert-error',{
      timeout: 2100 
    })
    
    await page.screenshot({
      path: "screenschot.png"
    })

  });

  it(`Login with success pwd` ,async ()=>{
    await page.goto(`${BASE_URL}/user/login`);
    await page.screenshot({
      path: "screenschot.png"
    })
    await expectPuppeteer(page).toFill(`[id="username"]`,"admin");
    await expectPuppeteer(page).toFill(`[id="password"]`,"ant.design");

  
    await page.screenshot({
      path: "screenschot.png"
    })

    await expectPuppeteer(page).toClick(`button.ant-btn`);


    await page.screenshot({
      path: "screenschot.png"
    })

    await page.waitForSelector('span.ant-dropdown-trigger',{
      timeout: 2100 
    })
    
    await page.screenshot({
      path: "screenschot.png"
    })
    

  })
});
