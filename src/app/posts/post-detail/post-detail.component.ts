import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Subject } from 'rxjs/Subject';
import { DocumentNode } from 'graphql';
import { client } from '../graphql.client';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';


import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { PostByIdInterface } from '../graphql/schema';
import { GetPostDetailQuery } from '../graphql/queries';


@Component({
    templateUrl: './post-detail.component.html',
      styleUrls: ['./post-detail.component.scss']

})

export class postDetailComponent implements OnInit, OnDestroy {
    public pageTitle: string = 'Post detail:';
    public post: any;
    public errorMessage: string;
    private apollo: Apollo;
    public postControl = new FormControl();
    // Observable variable of the graphql query
    public nameFilter: Subject<string> = new Subject<string>();
    private sub: Subscription;
    public id;
    // Inject Angular2Apollo service
    constructor(apollo: Apollo, private route: ActivatedRoute) {
        this.apollo = apollo;
    }

    public ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.apollo.watchQuery<PostByIdInterface>({
            query: GetPostDetailQuery,
            variables: { "id": this.id }
        }).subscribe(({ data }) => {
            this.post = data.post;
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}