import { Actor } from '/entities/ActorBase.entity.js';

const DEFAULT_TILE_STATE ={
  type: 0,
  
}

export class LogicalTile {
  constructor(point,state) {
    this.root;
  };
  get isTraversable() { return this._isTraversable };
  set isTraversable(newValue) { this._isTraversable = newValue };
}
