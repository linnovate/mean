import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-blog-search',
  templateUrl: './blog-search.component.html',
  styleUrls: ['./blog-search.component.scss'],
})
export class BlogSearchComponent implements OnInit {
  searchControl = new FormControl('');

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get initial search value from query params
    const initialQuery = this.route.snapshot.queryParams['q'];
    if (initialQuery) {
      this.searchControl.setValue(initialQuery, { emitEvent: false });
    }

    // Setup search subscription
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(query => {
        if (query && query.trim()) {
          this.performSearch(query.trim());
        }
      });
  }

  onSearchSubmit(): void {
    const query = this.searchControl.value?.trim();
    if (query) {
      this.performSearch(query);
    }
  }

  private performSearch(query: string): void {
    this.router.navigate(['/blog/search'], {
      queryParams: { q: query },
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.router.navigate(['/blog']);
  }
}
