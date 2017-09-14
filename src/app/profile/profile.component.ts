import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const CurrentProfile = gql`
  query CurrentProfile {
    profile(username: "sara") {
      username
      email
    }
  }
`;

interface QueryResponse{
  profile
}

@Component({
  selector: 'profile',
  template: `
    <div class="profile">
        <div class="header">Profile</div>
        <div class="avatar">
        	<img height="150" width="150" src="http://www.iconninja.com/files/929/296/21/headset-person-man-avatar-support-male-young-icon.svg" alt="Avatar">
        </div>
        <div class="name">{{currentProfile.username}}</div>
        <div class="separateName"></div>
        <div class="description">Quis potenti nam lacus eros euismod
            Fringilla posuere mollis quisque pellentesque a ad amet primis dictum
            Morbi viverra orci duis interdum massa tortor hac ipsum litora
            Himenaeos quis ornare pellentesque quisque lacus
            Dictum conubia consectetur curae amet ultrices lorem orci mauris ligula sit torquent</div>
    </div>
  `,
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentProfile: any;

  constructor(private apollo: Apollo) {
    this.currentProfile = {}
  }

  ngOnInit() {
    this.apollo.watchQuery<QueryResponse>({
      query: CurrentProfile
    }).subscribe(({data}) => {
      this.currentProfile = data.profile;
    });
  }
}
