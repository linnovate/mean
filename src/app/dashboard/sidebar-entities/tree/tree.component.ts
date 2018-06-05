import { Component, OnInit, Input } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';


import { SchemaService } from '../../../schema/schema.service';
import { DynamicDatabase } from './dynamic-data-base';
import { DynamicFlatNode } from './dynamic-flat-node';
import { DynamicDataSource } from './dynamic-data-source';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  providers: [DynamicDatabase]
})
export class TreeComponent implements OnInit {

  public data = {};
  @Input() set activeTab(value: string) {
    if (value) this.getSchemas(value);
 }
  public schemas = {};
  

  constructor(
    private schemaSvc: SchemaService,
    private database: DynamicDatabase
  ) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database);

    this.dataSource.data = database.initialData();
  }

  treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: DynamicDataSource;

  getLevel = (node: DynamicFlatNode) => { return node.level; };

  isExpandable = (node: DynamicFlatNode) => { return node.expandable; };

  hasChild = (_: number, _nodeData: DynamicFlatNode) => { return _nodeData.expandable; };

  ngOnInit() {
  }

  getSchemas(type) {
    this.data[type] = this.data[type] || this.schemaSvc.find(type).subscribe(schemas => {
      return schemas;
    });
  }

}
