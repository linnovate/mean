import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { TreeModel, TreeNode, TreeComponent, TREE_ACTIONS } from 'angular-tree-component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { SchemaService } from '../../services/schema.service';
import { EntityService } from '../../services/entity.service';
import { SystemService } from '../../services/system.service';

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
    if (value === 'system') this.getSystemTreeData();
    else this.getTreeData(value);
  }

  options = {
    // disable default deactivate event
    // see https://github.com/500tech/angular-tree-component/issues/481
    actionMapping: {
      mouse: {
        click: TREE_ACTIONS.ACTIVATE // instead of the default TOGGLE_ACTIVE
      }
    }
  };
  data = [];
  _activeTab;
  subscription: Subscription;
  systemSubscription: Subscription;

  constructor(private schemaSvc: SchemaService,
    private router: Router,
    private route: ActivatedRoute,
    private entityService: EntityService,
    private systemService: SystemService) {
    this.subscription = this.entityService.subject.subscribe(data => {
      if (['new entity', 'update mode', 'new mode'].indexOf(data.action) > -1) this.getTreeData(this._activeTab);
      // if (!this.tree.treeModel.focusedNode) return;
      // if (data.action === 'new entity') this.tree.treeModel.focusedNode.data.children.push(data.entity);
      // if (data.action === 'update mode') this.tree.treeModel.focusedNode.data = data.mode;
      // if (data.action === 'new mode') this.tree.treeModel.focusedNode.data.children.push(data.mode);
      // this.tree.treeModel.update();
    });
    this.systemSubscription = this.systemService.subject.subscribe(data => {
      if (['new node', 'update node', 'delete node'].indexOf(data.action) > -1) this.getSystemTreeData();
    })
  }

  get activeTab(): string {
    return this._activeTab;
  }

  activateNode(event) {
    let { node } = event;

    node.toggleExpanded();

    // leave parent nodes expanded, collapse all the other
    node.treeModel.expandedNodes.forEach(expandedNode => {
      if(!node.isDescendantOf(expandedNode)) {
        expandedNode.collapse();
      }
    })

    if (node.level === 3) { // this is a mode node
      this.router.navigate([this._activeTab , node.parent.data._id, node.data.name]);
    }
    if (node.data.type && node.data.type === 'system')
    this.router.navigate([this._activeTab , node.data._id]);
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
      setTimeout(() => {
        this.expandTreeNode()
      }, 0);
    });
  }

  getSystemTreeData() {
    this.systemService.tree().subscribe((data: any) => {
      this.data = data;
      setTimeout(() => {
        this.expandTreeNode()
      }, 0);
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

  expandTreeNode() {
    let i = location.href.lastIndexOf('/');
    let nodeName = location.href.slice(i+1);
    nodeName = decodeURIComponent(nodeName);
    let node = this.tree.treeModel.getNodeBy((node) => {
      let { name, _id } = node.data;
      return name === nodeName || _id === nodeName;
    })
    if(node) {
      console.log(node)
      node.setActiveAndVisible();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.systemSubscription.unsubscribe();
  }
}
