export const loadFile = async (path) => {
  return await (await fetch(path)).text();
};

export class GcodeParser {
  constructor() {

  }


  parse(gcodeString) {
    const lines = gcodeString.split('\n')
      .filter(_ => !_.trim().startsWith(';'))
      .map(line => {
        return line.split(' ')
        .reduce((acc, curr, i) => {
          // console.log(curr);
          const returnVal = {
            ...acc,
            [i === 0 ? 'command' : curr.slice(0,1).toLowerCase()]: i === 0 ? curr : +curr.slice(1) 
          }
          return returnVal
        }, {});
      })
      
    return lines;
  }


}