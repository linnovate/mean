import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostBinding
} from '@angular/core';

@Component({
  selector: 'app-icons-bar',
  templateUrl: './icons-bar.component.html',
  styleUrls: ['./icons-bar.component.scss']})

export class IconsBarComponent implements OnInit {

  @Input() icon: string;
  @Output() iconChange = new EventEmitter<string>();
  @HostBinding('class.visible') isVisible: boolean = false;

  icons : any[] = [{
    groupName: 'vehicles',
    list: [
      'airplane-front-view',
      'air-station',
      'balloon',
      'boat',
      'cargo-ship',
      'car',
      'catamaran',
      'convertible',
      'drone',
      'fighter-plane',
      'fire-truck',
      'horseback-riding',
      'motorcycle',
      'railcar',
      'railroad-train',
      'rocket-boot',
      'sailing-boat',
      'segway',
      'shuttle',
      'space-shuttle',
      'steam-engine',
      'suv',
      'tour-bus',
      'tow-truck',
      'transportation',
      'trolleybus',
      'water-transportation'
    ]
  }, {
    groupName: 'vehicles',
    list: [
      'airplane-front-view',
      'air-station',
      'balloon',
      'boat',
      'cargo-ship',
      'car',
      'catamaran',
      'convertible',
      'drone',
      'fighter-plane',
      'fire-truck',
      'horseback-riding',
      'motorcycle',
      'railcar',
      'railroad-train',
      'rocket-boot',
      'sailing-boat',
      'segway',
      'shuttle',
      'space-shuttle',
      'steam-engine',
      'suv',
      'tour-bus',
      'tow-truck',
      'transportation',
      'trolleybus',
      'water-transportation'
    ]
  }];

  iconsToDisplay : any[] = this.icons;
  dashRegex : RegExp = new RegExp(/-/g);

  constructor() {
  }

  filterIcons(str) {
    this.iconsToDisplay = this
      .icons
      .map(group => {
        let {groupName, list} = group;
        return {
          groupName,
          list: list.filter(icon => {
            return icon.includes(str);
          })
        };
      })
  }

  setIcon(icon) {
    this.icon = icon;
    this.isVisible = false;
    this.iconChange.emit(this.icon);
  }

  hide() {
    setTimeout(() => {
      let focusWithinBar = Boolean(document.activeElement.closest('.icons-bar'))
      this.isVisible = focusWithinBar;
    }, 0)
  }

  show() {
    this.isVisible = true;
  }

  ngOnInit() {}

}
