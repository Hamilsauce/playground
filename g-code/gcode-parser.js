import { Fusible, Infusible } from '../Fusible.js';

export const loadFile = async (path) => {
  return await (await fetch(path)).text();
};

export class GcodeParser extends Infusible {
  constructor(target) {
    super((fusible) => {
        Object.assign(target, {
          groupByCommandType: this.groupByCommandType,
          loadGcode: this.loadGcode //.bind(target), //.bind(target),
        });

        return () => this.defuse(fusible)
      },
      (fusible) => {
        fusible.groupByCommandType = undefined
        fusible.loadGcode = undefined
      }
    )

    // Object.entries(GcodeParser.prototype);

    // console.log('target', target)

  }

  async loadGcode(path = '', parse = false) {
    // path = !path.toLowerCase().endsWith('.gcode') ? path : `${path}.gcode`;
    console.log('path', path)
    return parse ? this.parse(await loadFile(path)) : await loadFile(path);
  }

  get keys() {
    return null //Object.entr(GcodeParser.prototype);
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

  parse(gcodeString) {
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

// export class GcodeParser {
//   constructor() {

//   }

//   async loadGcode(path = '', parse = false) {
//     path = !path.toLowerCase().endsWith('.gcode') ? path : `${path}.gcode`;
//     // const gcode = parse ? this.parse(await loadFile(path)) : await loadFile(path);
//     return parse ? this.parse(await loadFile(path)) : await loadFile(path);
//   }

//   parse(gcodeString) {
//     const lines = gcodeString.split('\n')
//       .filter(_ => !_.trim().startsWith(';'))
//       .map(line => {
//         return line.slice(0, line.indexOf(';')).trim();
//       })
//       .map((line, index) => {
//         let z = 0;

//         return line.slice(0, line.indexOf(';')).trim().split(' ')
//           .reduce((acc, curr, i) => {
//             const returnVal = {
//               ...acc,
//               [i === 0 ? 'command' : curr.slice(0, 1).toLowerCase()]: i === 0 ? curr : +curr.slice(1)
//             }

//             if (returnVal.z && returnVal.z > 0.0) {
//               z = z + (returnVal.z || 0);
//             }

//             // returnVal.z = z;

//             return { ...returnVal, z };
//           }, { index });
//       })

//     // .filter(({ z }) => z)

//     return lines;
//   }
// }