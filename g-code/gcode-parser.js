import { Point } from './lib/line-drawing.js';
import { Fusible, Infusible } from '../Fusible.js';

export const loadFile = async (path) => {
  return await (await fetch(path)).text();
};

export class GcodeParser { //extends Infusible {
  constructor(target) {}

  async loadGcode(path = '', parse = false) {
    return parse ? this.parse(await loadFile(path)) : await loadFile(path);
  }

  groupByCommandType(commands = []) {
    return commands.reduce((acc, curr, i) => {
      return {
        ...acc,
        [curr.command]: acc[curr.command] ? [...acc[curr.command], curr] : [curr],
        count: acc.count + 1
      }

    }, { count: 0 });
  }

  async countLines(gcodeString) {
    return await (gcodeString.match(/\n/g) || []).length
  }


  async parse(gcodeString) {
    console.time('newLines')

    // const newLines = gcodeString.split('\n').length
    const newLines = await this.countLines(gcodeString)


    console.timeEnd('newLines')

    console.log('newLines', newLines)

    return gcodeString.split('\n')
      .filter(_ => !_.trim().startsWith(';'))
      .map((line, index) => line.slice(0, line.indexOf(';')).trim()
        .split(' ')
        .reduce((acc, curr, i) => ({
          ...acc,
          [i === 0 ? 'command' : curr.slice(0, 1).toLowerCase()]: i === 0 ? curr : +curr.slice(1)
        }), { index })
      );
  }
}