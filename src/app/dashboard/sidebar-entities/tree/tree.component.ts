import { Component, OnInit, Input } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';

import {BehaviorSubject, of as observableOf} from 'rxjs';


import {EntityNode, EntityData} from './tree.utils';
import { SchemaService } from '../../../schema/schema.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  providers: [EntityData]
})
export class TreeComponent {
  @Input() set activeTab(value: string) {
    // if (value) this.getSchemas(value);
  }
  nestedTreeControl: NestedTreeControl<EntityNode>;

  nestedDataSource: MatTreeNestedDataSource<EntityNode>;

  constructor(entityData: EntityData, schemaSvc: SchemaService) {
    this.nestedTreeControl = new NestedTreeControl<EntityNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    schemaSvc.tree('platform').subscribe(data => {
      entityData.dataChange.next(data);
    });
    
    entityData.dataChange.subscribe(data => this.nestedDataSource.data = data);
  }

  private _getChildren = (node: EntityNode) => { return observableOf(node.children); };

  hasNestedChild = (_: number, nodeData: EntityNode) => {return !(nodeData.type); };
}
