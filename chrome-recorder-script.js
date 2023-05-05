import url from 'url';
import { createRunner } from '@puppeteer/replay';

export async function run(extension) {
  const runner = await createRunner(extension);

  await runner.runBeforeAllSteps();

  await runner.runStep({
    type: 'setViewport',
    width: 1240,
    height: 997,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    isLandscape: false
  });
  await runner.runStep({
    type: 'navigate',
    assertedEvents: [
      {
        type: 'navigation',
        url: 'http://localhost:8000/',
        title: 'Zoro.com: 1,000s of Brands, Millions of Products'
      }
    ],
    timeout: 30000,
    url: 'http://localhost:8000/'
  });
  await runner.runStep({
    type: 'click',
    target: 'main',
    selectors: [
      [
        'aria/Open Sign In Navigation'
      ],
      [
        '#accountNavigationButton'
      ],
      [
        'xpath///*[@id="accountNavigationButton"]'
      ],
      [
        'pierce/#accountNavigationButton'
      ],
      [
        'text/account\n    \n      \n    \n  \n \n'
      ]
    ],
    offsetY: 33.140621185302734,
    offsetX: 56.95831298828125
  });
  await runner.runStep({
    type: 'click',
    target: 'main',
    selectors: [
      [
        'aria/Sign In[role="button"]'
      ],
      [
        'div.account-nav-overlay button.btn-primary'
      ],
      [
        'xpath///*[@id="app"]/div[3]/div[4]/div/div/div/div[1]/div/div/div[2]/button[1]'
      ],
      [
        'pierce/div.account-nav-overlay button.btn-primary'
      ]
    ],
    offsetY: 13.411453247070312,
    offsetX: 116.282958984375
  });

  await runner.runStep({
    type: 'waitForElement',
    selectors: ['#emailAddress']
  });
  
  await runner.runStep({
    type: 'change',
    value: 'jake.hamilton+1@zoro.com',
    selectors: [
      [
        'aria/Email Address'
      ],
      [
        '#emailAddress'
      ],
      [
        'xpath///*[@id="emailAddress"]'
      ],
      [
        'pierce/#emailAddress'
      ]
    ],
    target: 'main'
  });
  await runner.runStep({
    type: 'change',
    value: 'Bugsycat1',
    selectors: [
      [
        'aria/password'
      ],
      [
        '#input-validator-1066'
      ],
      [
        'xpath///*[@id="input-validator-1066"]'
      ],
      [
        'pierce/#input-validator-1066'
      ],
      [
        'text/Bugsycat1'
      ]
    ],
    target: 'main'
  });
  
  await runner.runStep({
    type: 'keyDown',
    target: 'main',
    key: 'Enter'
  });
  await runner.runStep({
    type: 'keyUp',
    target: 'main',
    key: 'Enter'
  });

  await runner.runAfterAllSteps();
}

if (process && import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  run();
}