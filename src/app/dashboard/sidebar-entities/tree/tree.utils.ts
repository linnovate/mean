import {Injectable} from '@angular/core';
import {BehaviorSubject, of as observableOf} from 'rxjs';

/**
 * Json node data with nested structure. Each node has a name and a value or a list of children
 */
export class EntityNode {
  children: EntityNode[];
  name: string;
  type: any;
}

/**
 * The Json tree data in string. The data could be parsed into Json object
 */
const TREE_DATA = `
  {
    "Documents": {
      "angular": {
        "src": {
          "core": "ts",
          "compiler": "ts"
        }
      },
      "material2": {
        "src": {
          "button": "ts",
          "checkbox": "ts",
          "input": "ts"
        }
      }
    },
    "Downloads": {
        "Tutorial": "html",
        "November": "pdf",
        "October": "pdf"
    },
    "Pictures": {
        "Sun": "png",
        "Woods": "jpg",
        "Photo Booth Library": {
          "Contents": "dir",
          "Pictures": "dir"
        }
    },
    "Applications": {
        "Chrome": "app",
        "Calendar": "app",
        "Webstorm": "app"
    }
  }`;

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has name and type.
 * For a directory, it has name and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `EntityNode` with nested
 * structure.
 */
@Injectable()
export class EntityData {
  dataChange: BehaviorSubject<EntityNode[]> = new BehaviorSubject<EntityNode[]>([]);

  get data(): EntityNode[] { return this.dataChange.value; }

  constructor() {
  }


  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `EntityNode`.
   */
}