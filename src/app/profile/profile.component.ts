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
    <div>
        <h3>Profile</h3>
        <span>username: {{currentProfile.username}}</span>
        <span>email: {{currentProfile.email}}</span>
    </div>
  `
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
