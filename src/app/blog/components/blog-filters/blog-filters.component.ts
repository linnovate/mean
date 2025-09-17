import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { BlogFilters, Category } from '@app/shared/interfaces';
import { CategoryService } from '@app/shared/services';

@Component({
  selector: 'app-blog-filters',
  templateUrl: './blog-filters.component.html',
  styleUrls: ['./blog-filters.component.scss'],
})
export class BlogFiltersComponent implements OnInit {
  @Input() currentFilters: BlogFilters = {};
  @Output() filtersChange = new EventEmitter<BlogFilters>();

  filterForm!: FormGroup;
  categories: Category[] = [];

  sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'title', label: 'Title A-Z' },
  ];

  statusOptions = [
    { value: '', label: 'All Posts' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Drafts' },
    { value: 'scheduled', label: 'Scheduled' },
  ];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    this.setupFormSubscription();

    if (this.currentFilters) {
      this.filterForm.patchValue(this.currentFilters, { emitEvent: false });
    }
  }

  private initForm(): void {
    this.filterForm = this.fb.group({
      sort: ['newest'],
      category: [''],
      status: [''],
      featured: [false],
    });
  }

  private setupFormSubscription(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(value => {
        const filters: BlogFilters = {};

        if (value.sort) filters.sort = value.sort;
        filters.category = value.category;
        filters.status = value.status;
        if (value.featured) filters.featured = value.featured;
        this.filtersChange.emit(filters);
      });
  }

  private loadCategories(): void {
    this.categoryService.getCategories(true).subscribe(categories => {
      this.categories = categories;
    });
  }

  clearFilters(): void {
    this.filterForm.reset({
      sort: 'newest',
      category: '',
      status: '',
      featured: false,
    });
  }
}
