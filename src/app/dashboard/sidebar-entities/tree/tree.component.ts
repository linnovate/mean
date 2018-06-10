import { Component, OnInit, Input } from '@angular/core';
import { TreeModel, TreeNode } from 'angular-tree-component';
import { ActivatedRoute, Router } from '@angular/router';

import { SchemaService } from '../../../schema/schema.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  providers: []
})
export class TreeComponent {

  @Input() set activeTab(value: string) {
    this._activeTab = value;
    this.getTreeData(value);
  }

  options = {};
  data = [];
  _activeTab;

  constructor(private schemaSvc: SchemaService, private router: Router, private route: ActivatedRoute) {
  }

  get activeTab(): string {
    return this._activeTab;
  }

  activateNode(event) {
    const node = event.node;
    if (!node.isRoot && !node.hasChildren) // this is a mode node
      this.router.navigate([this._activeTab , node.parent.data._id, node.data.name]);
  }

  getTreeData(type) {
    this.schemaSvc.tree(type).subscribe(data => {
      data.forEach(d => {
        if (d.children)
          d.children.map(entity => {
            entity.children = entity.modes;
            delete entity.modes;
            return entity;
          });
      });
      this.data = data;
    });
  }
  delete(node) {
    console.log(node);
  }
  clone(node) {
    console.log(node);
  }

  newEntity(node) {
    this.router.navigate([this._activeTab , 'new', node.data.name]);
  }

  addMode(node) {
    this.router.navigate([this._activeTab , node.parent.data._id, 'new']);
  }

  filterFn(value: string, treeModel: TreeModel) {
    treeModel.filterNodes((node: TreeNode) => this.fuzzysearch(value, node.data.name));
  }

  fuzzysearch (needle: string, haystack: string) {
    const haystackLC = haystack.toLowerCase();
    const needleLC = needle.toLowerCase();
  
    const hlen = haystack.length;
    const nlen = needleLC.length;
  
    if (nlen > hlen) {
      return false;
    }
    if (nlen === hlen) {
      return needleLC === haystackLC;
    }
    outer: for (let i = 0, j = 0; i < nlen; i++) {
      const nch = needleLC.charCodeAt(i);
  
      while (j < hlen) {
        if (haystackLC.charCodeAt(j++) === nch) {
          continue outer;
        }
      }
      return false;
    }
    return true;
  }
}
