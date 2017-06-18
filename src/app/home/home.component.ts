import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Subject } from 'rxjs/Subject';
import { DocumentNode } from 'graphql';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { AddUserMutation, UsersQuery } from '../graphql/schema';
const UsersQueryNode: DocumentNode = require('graphql-tag/loader!../graphql/Users.graphql');
const AddUserMutationNode: DocumentNode = require('graphql-tag/loader!../graphql/AddUser.graphql');

@Component({
  selector: 'home',  // <home></home>
  styleUrls: [ './home.component.css' ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  // Observable with GraphQL result
  public users: ApolloQueryObservable<UsersQuery>;
  public firstName: string;
  public lastName: string;
  public nameControl = new FormControl();
  // Observable variable of the graphql query
  public nameFilter: Subject<string> = new Subject<string>();
  private apollo: Apollo;

  // Inject Angular2Apollo service
  constructor(apollo: Apollo) {
    this.apollo = apollo;
  }

  public ngOnInit() {
    // Query users data with observable variables
    this.users = this.apollo.watchQuery<UsersQuery>({
      query: UsersQueryNode,
      variables: {
        title: 'pop',
      },
    })
      // Return only users, not the whole ApolloQueryResult
      .map(result => result.data.posts) as any;

    // Add debounce time to wait 300 ms for a new change instead of keep hitting the server
    this.nameControl.valueChanges.debounceTime(300).subscribe(name => {
      this.nameFilter.next(name);
    });
  }

  // public ngAfterViewInit() {
  //   // Set nameFilter to null after NgOnInit happend and the view has been initated
  //   this.nameFilter.next(null);
  // }

  public newUser(firstName: string) {
    // Call the mutation called addUser
    this.apollo.mutate<AddUserMutation>({
      mutation: AddUserMutationNode,
      variables: {
        firstName,
        lastName: this.lastName,
      },
    })
      .take(1)
      .subscribe({
        next: ({data}) => {
          console.log('got a new user', data.addUser);

          // get new data
          this.users.refetch();
        },
        error: (errors) => {
          console.log('there was an error sending the query', errors);
        }
      });
  }
}