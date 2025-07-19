let code = await (await fetch('./script-to-fetch.js')).text();

// let code = await fetchedScript.text();

// Modify code here
code = code.replace('myFunc', 'patchedFunction');

const blob = new Blob([code], { type: 'application/javascript' });
const blobURL = URL.createObjectURL(blob);

const script = document.createElement('script');
script.type = 'module';
script.src = blobURL;

document.head.appendChild(script);
import {myFunc} from '././script-to-fetch.js'
myFunc()