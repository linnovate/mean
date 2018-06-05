import {Component, Injectable} from '@angular/core';

import { DynamicFlatNode } from './dynamic-flat-node';
import { SchemaService } from '../../../schema/schema.service';

@Injectable()
export class DynamicDatabase {

  constructor(
    private schemaSvc: SchemaService,
  ) {
    this.schemaSvc.find('platform').subscribe(schemas => {
      console.log(schemas);
      schemas = schemas.map(s => {
        this.rootLevelNodes1.push(s._id);
        return [s._id, s.data];
      });
      console.log(schemas, 'ddd', this.rootLevelNodes1);
      this.dataMap = new Map([
        [
          'Fruits',
          ['Apple', 'Orange', 'Banana']
        ],
        [
          'Vegetables',
          ['Tomato', 'Potato', 'Onion']
        ],
        [
          'Apple',
          ['Fuji', 'Macintosh']
        ],
        [
          'Onion',
          ['Yellow', 'White', 'Purple']
        ]
      ]);
    })

  }



  rootLevelNodes = ['Fruits', 'Vegetables'];
  rootLevelNodes1 = [];
  dataMap: any;

  /** Initial data from database */
  initialData() : DynamicFlatNode[] {
    return this
      .rootLevelNodes
      .map(name => new DynamicFlatNode(name, 0, true));
  }

  getChildren(node : string) : string[] | undefined {
    return this
      .dataMap
      .get(node);
  }

  isExpandable(node : string) : boolean {
    return this
      .dataMap
      .has(node);
  }
}