import { Fusible, Infusible } from '../Fusible.js';

export const loadFile = async (path) => {
  return await (await fetch(path)).text();
};


export class GcodePrinter extends Fusible {
  constructor() {
    super();
  }

  lerp(start, end, t) {
    return start * (1.0 - t) + end * t;
  }


  lerp_point(p0, p1, t) {
    return new DOMPoint(
      this.lerp(p0.x, p1.x, t),
      this.lerp(p0.y, p1.y, t)
    );
  }

  _parse(gcodeString) {
    const lines = gcodeString.split('\n')
      .filter(_ => !_.trim().startsWith(';'))
      .map(line => {
        return line.slice(0, line.indexOf(';')).trim();
      })
      .map((line, index) => {
        let z = 0;

        return line.slice(0, line.indexOf(';')).trim().split(' ')
          .reduce((acc, curr, i) => {
            const returnVal = {
              ...acc,
              [i === 0 ? 'command' : curr.slice(0, 1).toLowerCase()]: i === 0 ? curr : +curr.slice(1)
            }

            if (returnVal.z && returnVal.z > 0.0) {
              z = z + (returnVal.z || 0);
            }

            return { ...returnVal, z };
          }, { index });
      })

    return lines;
  }
}