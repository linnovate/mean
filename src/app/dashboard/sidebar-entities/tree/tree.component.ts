import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { TreeModel, TreeNode, TreeComponent } from 'angular-tree-component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { SchemaService } from '../../services/schema.service';
import { EntityService } from '../../services/entity.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  providers: []
})
export class EntitiesTreeComponent {


  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  @Input() set activeTab(value: string) {
    this._activeTab = value;
    this.getTreeData(value);
  }

  options = {};
  data = [];
  _activeTab;
  subscription: Subscription;

  constructor(private schemaSvc: SchemaService, private router: Router, private route: ActivatedRoute, private entityService: EntityService) {
    this.subscription = this.entityService.subject.subscribe(data => {
      this.getTreeData(this._activeTab);
      // if (!this.tree.treeModel.focusedNode) return;
      // if (data.action === 'new entity') this.tree.treeModel.focusedNode.data.children.push(data.entity);
      // if (data.action === 'update mode') this.tree.treeModel.focusedNode.data = data.mode;
      // if (data.action === 'new mode') this.tree.treeModel.focusedNode.data.children.push(data.mode);
      // this.tree.treeModel.update();
    });
  }

  get activeTab(): string {
    return this._activeTab;
  }

  activateNode(event) {
    const node = event.node;
    if (node.level === 2) node.expandAll();
    if (node.level === 3) // this is a mode node
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
    const entityId = node.data._schema ? node.data._id : node.parent.data._id;
    const modeName = node.data._schema ? '' : node.data.name;
    this.entityService.delete(entityId, modeName).subscribe(entity => {
      node.parent.data.children.splice(node.parent.data.children.findIndex(e => e.name === node.data.name), 1)
      this.tree.treeModel.update()
    });
  }

  clone(node) {
    const entityId = node.data._schema ? node.data._id : node.parent.data._id;
    const modeName = node.data._schema ? '' : node.data.name;
    this.entityService.clone(entityId, modeName).subscribe((entity: any) => {
      entity.children = entity.modes;
      node.parent.data.children.push((node.level === 2) ? entity : entity.modes.pop());
      this.tree.treeModel.update();
    });
  }

  newEntity(node) {
    this.router.navigate([this._activeTab , 'new', node.data.name]);
  }

  addMode(node) {
    this.router.navigate([this._activeTab , node.parent.data._id, 'new']);
  }

  filterFn(value: string, treeModel: TreeModel) {
    treeModel.filterNodes((node: TreeNode) => {
      let returnVal = this.fuzzysearch(value, node.data.name);
      returnVal = (node.level === 3 && !returnVal && this.fuzzysearch(value, node.parent.data.name)) ? true : returnVal;
      return returnVal;
    });
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
