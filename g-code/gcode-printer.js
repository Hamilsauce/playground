import { Point, delay, pointsBetween } from './lib/index.js';

export const loadFile = async (path) => {
  return await (await fetch(path)).text();
};


export class GcodePrinter {
  #canvas = null;
  #scene = null;
  #path = null;
  #gcode = null;
  #cursor = 0;
  #commandQueue = [];
  #commands = [];
  #position = { x: 0, y: 0, z: 0, e: 0 };
  #isPrinting = false;
  #frameId = null;
  constructor(canvas) {
    this.#canvas = canvas;

    this.#scene = canvas.querySelector('#scene');
    this.#path = this.#canvas.querySelector('#path-template').cloneNode(true);
    this.#path.id = 'printer-path';

    window._printer = this;

  }

  get hasFileLoaded() { return }

  lerp(start, end, t) {
    return start * (1.0 - t) + end * t;
  }

  lerp_point(p0, p1, t) {
    return new DOMPoint(
      this.lerp(p0.x, p1.x, t),
      this.lerp(p0.y, p1.y, t)
    );
  }

  appendToPath(d = '', command, point = new Point(0, 0)) {
    return `${d.replace('~~', '')} ${(command === 'G0' ? 'M ' : '') + point.toString()}`;
  }

  moveTo(d = '', command, point = new Point(0, 0)) {
    return `${d.replace('', '')} ${(command === 'G0' ? 'M ' : '') + point.toString()}`;
  }


  peekState() {
    return {
      isPrinting: this.#isPrinting,
      commands: this.#commands,
      cursor: this.#cursor,
      path: this.#path,
      d: this.#path.getAttribute('d'),
      isPathRendered: !!this.#path.parentElement,
      drawCommands: this.drawCommands,
    }
  }

  stop(options) {
    cancelAnimationFrame(this.#frameId);
    this.#isPrinting = false;
    this.#frameId = null;

    console.warn('---[PRINTER STOPPED]');
  }

  reset(options) {
    this.#cursor = -1;

    this.#path.setAttribute('d', '');

    this.#path.remove();

    console.warn('[PRINTER RESET]');
  }

  // async print(commands = [], onCompleteHandler = () => null) {
  //   console.warn('++++[PRINTER STARTED]');
  //   this.#commands = commands;
  //   this.drawCommands = commands.filter(({ command, x, y }) => !(isNaN(x) || isNaN(y)) && ['G0', 'G1'].includes(command));
  //   const cmds = this.drawCommands

  //   if (cmds[0] && cmds[0].x && cmds[0].y) {
  //     let frameId = null;
  //     let lastPoint = null;
  //     let currentPoint = null;
  //     let d = 'M ';

  //     this.#scene.append(this.#path)
  //     this.#isPrinting = true;
  //     this.#cursor = 0;
  //     this.currentPoint = cmds[this.#cursor];

  //     const INTERVAL = 0


  //     this.#frameId = requestAnimationFrame((frameTime) => this.drawPoints.bind(this))
  //     // this.#frameId = requestAnimationFrame((frameTime) => {
  //     //   if (!(this.#isPrinting === true || currentPoint)) {
  //     //     this.stop();
  //     //     // cancelAnimationFrame(frameId)
  //     //   }

  //     //   const { command, x, y, z, e } = currentPoint;

  //     //   if (lastPoint && command === 'G1') {
  //     //     const pts = [
  //     //       lastPoint,
  //     //       ...pointsBetween(lastPoint, { x, y }).map(_ => ({ ..._, command })),
  //     //       { command, x, y }
  //     //     ];

  //     //     const time = INTERVAL ? INTERVAL / pts.length : 0;

  //     //     for (let n = 0; n < pts.length; n++) {
  //     //       const pt = pts[n];

  //     //       d = this.appendToPath(d, command, new Point(pt.x, pt.y));

  //     //       this.#path.setAttribute('d', d);

  //     //       await delay(time);
  //     //     }
  //     //   }

  //     //   else {
  //     //     d = this.appendToPath(d, command, new Point(x, y))

  //     //     this.#path.setAttribute('d', d);

  //     //     await delay(INTERVAL);
  //     //   }

  //     //   lastPoint = currentPoint;

  //     //   this.#cursor = this.#cursor + 1;

  //     //   currentPoint = cmds[this.#cursor];

  //     // });
  //     // while (this.#isPrinting === true && currentPoint) {
  //     //   const { command, x, y, z, e } = currentPoint;

  //     //   if (lastPoint && command === 'G1') {
  //     //     const pts = [
  //     //       lastPoint,
  //     //       ...pointsBetween(lastPoint, { x, y }).map(_ => ({ ..._, command })),
  //     //       { command, x, y }
  //     //     ];

  //     //     const time = INTERVAL ? INTERVAL / pts.length : 0;

  //     //     for (let n = 0; n < pts.length; n++) {
  //     //       const pt = pts[n];

  //     //       d = this.appendToPath(d, command, new Point(pt.x, pt.y));

  //     //       this.#path.setAttribute('d', d);

  //     //       await delay(time);
  //     //     }
  //     //   }

  //     //   else {
  //     //     d = this.appendToPath(d, command, new Point(x, y))

  //     //     this.#path.setAttribute('d', d);

  //     //     await delay(INTERVAL);
  //     //   }

  //     //   lastPoint = currentPoint;

  //     //   this.#cursor = this.#cursor + 1;

  //     //   currentPoint = cmds[this.#cursor];
  //     // }

  //     this.stop();

  //     return this;
  //   }
  // }


  async drawPoints(commands = [], onCompleteHandler = () => null) {
      if (!(this.#isPrinting === true || currentPoint)) {
          this.stop();
        }
else {
  
    const { command, x, y, z, e } = this.currentPoint;

    if (this.lastPoint && command === 'G1') {
      const pts = [
        this.lastPoint,
        ...pointsBetween(this.lastPoint, { x, y }).map(_ => ({ ..._, command })),
        { command, x, y }
      ];

      const time = this.INTERVAL ? this.INTERVAL / pts.length : 0;

      for (let n = 0; n < pts.length; n++) {
        const pt = pts[n];

        d = this.appendToPath(d, command, new Point(pt.x, pt.y));

        this.#path.setAttribute('d', d);

        // await delay(time);
      }
    }

    else {
      d = this.appendToPath(d, command, new Point(x, y))

      this.#path.setAttribute('d', d);

      // await delay(this.INTERVAL);
    }

    this.lastPoint = this.currentPoint;

    this.#cursor = this.#cursor + 1;

    this.currentPoint = this.drawCommands[this.#cursor];
this.#frameId = requestAnimationFrame(this.drawPoints.bind(this))
}

  }









  // async _print(commands = [], onCompleteHandler = () => null) {
  //   console.warn('++++[PRINTER STARTED]');
  //   this.#commands = commands;
  //   this.drawCommands = commands.filter(({ command, x, y }) => !(isNaN(x) || isNaN(y)) && ['G0', 'G1'].includes(command));
  //   const cmds = this.drawCommands

  //   if (cmds[0] && cmds[0].x && cmds[0].y) {
  //     let frameId = null;
  //     let lastPoint = null;
  //     let currentPoint = null;
  //     let d = 'M ';

  //     this.#scene.append(this.#path)
  //     this.#isPrinting = true;
  //     this.#cursor = 0;
  //     currentPoint = cmds[this.#cursor];

  //     const INTERVAL = 0


  //     this.#frameId = requestAnimationFrame((frameTime) => {
  //       if (!(this.#isPrinting === true || currentPoint)) {
  //         this.stop();
  //         // cancelAnimationFrame(frameId)
  //       }

  //       const { command, x, y, z, e } = currentPoint;

  //       if (lastPoint && command === 'G1') {
  //         const pts = [
  //           lastPoint,
  //           ...pointsBetween(lastPoint, { x, y }).map(_ => ({ ..._, command })),
  //           { command, x, y }
  //         ];

  //         const time = INTERVAL ? INTERVAL / pts.length : 0;

  //         for (let n = 0; n < pts.length; n++) {
  //           const pt = pts[n];

  //           d = this.appendToPath(d, command, new Point(pt.x, pt.y));

  //           this.#path.setAttribute('d', d);

  //           await delay(time);
  //         }
  //       }

  //       else {
  //         d = this.appendToPath(d, command, new Point(x, y))

  //         this.#path.setAttribute('d', d);

  //         await delay(INTERVAL);
  //       }

  //       lastPoint = currentPoint;

  //       this.#cursor = this.#cursor + 1;

  //       currentPoint = cmds[this.#cursor];

  //     });
  //     // while (this.#isPrinting === true && currentPoint) {
  //     //   const { command, x, y, z, e } = currentPoint;

  //     //   if (lastPoint && command === 'G1') {
  //     //     const pts = [
  //     //       lastPoint,
  //     //       ...pointsBetween(lastPoint, { x, y }).map(_ => ({ ..._, command })),
  //     //       { command, x, y }
  //     //     ];

  //     //     const time = INTERVAL ? INTERVAL / pts.length : 0;

  //     //     for (let n = 0; n < pts.length; n++) {
  //     //       const pt = pts[n];

  //     //       d = this.appendToPath(d, command, new Point(pt.x, pt.y));

  //     //       this.#path.setAttribute('d', d);

  //     //       await delay(time);
  //     //     }
  //     //   }

  //     //   else {
  //     //     d = this.appendToPath(d, command, new Point(x, y))

  //     //     this.#path.setAttribute('d', d);

  //     //     await delay(INTERVAL);
  //     //   }

  //     //   lastPoint = currentPoint;

  //     //   this.#cursor = this.#cursor + 1;

  //     //   currentPoint = cmds[this.#cursor];
  //     // }

  //     this.stop();

  //     return this;
  //   }
  // }
  async print(commands = [], onCompleteHandler = () => null) {
    console.warn('++++[PRINTER STARTED]');

    // this.reset();

    this.#commands = commands;

    this.drawCommands = commands.filter(({ command, x, y }) => !(isNaN(x) || isNaN(y)) && ['G0', 'G1'].includes(command))

    const cmds = this.drawCommands

    if (cmds[0] && cmds[0].x && cmds[0].y) {
      let frameId = null;
      let lastPoint = null;
      let currentPoint = null;
      let d = 'M ';

      this.#scene.append(this.#path)
      this.#isPrinting = true;
      this.#cursor = 0;
      currentPoint = cmds[this.#cursor];

      const INTERVAL = 0


      // this.#frameId = requestAnimationFrame((frameTime) => {
      //   if (!(this.#isPrinting === true || currentPoint)) {
      //     this.stop();
      //     // cancelAnimationFrame(frameId)
      //   }

      //   const { command, x, y, z, e } = currentPoint;

      //   if (lastPoint && command === 'G1') {
      //     const pts = [
      //       lastPoint,
      //       ...pointsBetween(lastPoint, { x, y }).map(_ => ({ ..._, command })),
      //       { command, x, y }
      //     ];

      //     const time = INTERVAL ? INTERVAL / pts.length : 0;

      //     for (let n = 0; n < pts.length; n++) {
      //       const pt = pts[n];

      //       d = this.appendToPath(d, command, new Point(pt.x, pt.y));

      //       this.#path.setAttribute('d', d);

      //       await delay(time);
      //     }
      //   }

      //   else {
      //     d = this.appendToPath(d, command, new Point(x, y))

      //     this.#path.setAttribute('d', d);

      //     await delay(INTERVAL);
      //   }

      //   lastPoint = currentPoint;

      //   this.#cursor = this.#cursor + 1;

      //   currentPoint = cmds[this.#cursor];

      // })
      while (this.#isPrinting === true && currentPoint) {
        const { command, x, y, z, e } = currentPoint;

        if (lastPoint && command === 'G1') {
          const pts = [
            lastPoint,
            ...pointsBetween(lastPoint, { x, y }).map(_ => ({ ..._, command })),
            { command, x, y }
          ];

          const time = INTERVAL ? INTERVAL / pts.length : 0;

          for (let n = 0; n < pts.length; n++) {
            const pt = pts[n];

            d = this.appendToPath(d, command, new Point(pt.x, pt.y));

            this.#path.setAttribute('d', d);

            await delay(time);
          }
        }

        else {
          d = this.appendToPath(d, command, new Point(x, y))

          this.#path.setAttribute('d', d);

          await delay(INTERVAL);
        }

        lastPoint = currentPoint;

        this.#cursor = this.#cursor + 1;

        currentPoint = cmds[this.#cursor];
      }

      this.stop();

      return this;
    }
  }
}


// requestAnimationFrame()