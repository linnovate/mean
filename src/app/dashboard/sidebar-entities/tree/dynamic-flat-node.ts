export class DynamicFlatNode {
  constructor(public item : string, public level : number = 1, public expandable : boolean = false, public isLoading : boolean = false) {}
}
