import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, Subject, takeUntil } from 'rxjs';

import { BlogService } from '../../../shared/services/blog.service';
import { CategoryService } from '../../../shared/services/category.service';
import { Blog } from '../../../shared/interfaces/blog.interface';
import { Category } from '../../../shared/interfaces/category.interface';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.scss'],
})
export class BlogFormComponent implements OnInit, OnDestroy {
  blogForm: FormGroup;
  isEditing = false;
  isSubmitting = false;
  blogId: string | null = null;
  tags: string[] = [];
  categories: Category[] = [];

  // Material chip configuration
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.blogForm = this.createForm();
  }

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.blogId;

    // Load categories
    this.loadCategories();

    if (this.isEditing && this.blogId) {
      this.loadBlog(this.blogId);
    }

    // Auto-generate slug from title
    this.blogForm
      .get('title')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(title => {
        if (title && !this.blogForm.get('slug')?.dirty) {
          const slug = this.generateSlug(title);
          this.blogForm.patchValue({ slug }, { emitEvent: false });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCategories(): void {
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: categories => {
          this.categories = categories;
        },
        error: error => {
          console.error('Error loading categories:', error);
        },
      });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      slug: ['', [this.slugValidator]],
      excerpt: [''],
      content: ['', Validators.required],
      categories: [[]],
      metaDescription: ['', Validators.maxLength(160)],
      metaKeywords: [''],
      status: ['published', Validators.required],
      isFeatured: [false],
      scheduledAt: [null],
    });
  }

  // Custom validator for slug - only validates if not empty
  private slugValidator(control: any) {
    if (!control.value || control.value.trim() === '') {
      return null; // Valid if empty
    }
    const slugPattern = /^[a-z0-9-]+$/;
    return slugPattern.test(control.value) ? null : { invalidSlug: true };
  }

  private loadBlog(id: string): void {
    this.blogService
      .getBlogById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: blog => {
          this.populateForm(blog);
        },
        error: error => {
          console.error('Error loading blog:', error);
          this.router.navigate(['/blog']);
        },
      });
  }

  private populateForm(blog: Blog): void {
    this.tags = blog.tags || [];

    this.blogForm.patchValue({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      categories:
        blog.categories?.map(cat =>
          typeof cat === 'string' ? cat : cat._id
        ) || [],
      metaDescription: blog.metaDescription,
      metaKeywords: blog.metaKeywords,
      status: blog.status,
      isFeatured: blog.isFeatured,
      scheduledAt: blog.scheduledAt ? new Date(blog.scheduledAt) : null,
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  saveDraft(): void {
    // Mark all fields as touched to show validation errors
    Object.keys(this.blogForm.controls).forEach(key => {
      this.blogForm.get(key)?.markAsTouched();
    });

    if (this.blogForm.valid) {
      this.blogForm.patchValue({ status: 'draft' });
      this.onSubmit();
    } else {
      console.log('Form is invalid for draft save');
    }
  }

  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    Object.keys(this.blogForm.controls).forEach(key => {
      this.blogForm.get(key)?.markAsTouched();
    });

    console.log('Form valid:', this.blogForm.valid);
    console.log('Form values:', this.blogForm.value);
    console.log('Form errors:', this.getFormValidationErrors());

    if (this.blogForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formData = this.blogForm.value;
      const blogData: any = {
        ...formData,
        tags: this.tags,
        metaKeywords: formData.metaKeywords
          ? formData.metaKeywords.split(',').map((k: string) => k.trim())
          : [],
      };

      // Only include scheduledAt if status is 'scheduled' and a date is selected
      if (formData.status !== 'scheduled' || !formData.scheduledAt) {
        delete blogData.scheduledAt;
      }

      console.log('Sending blog data:', blogData);

      const request =
        this.isEditing && this.blogId
          ? this.blogService.updateBlog(this.blogId, blogData)
          : this.blogService.createBlog(blogData);

      request.pipe(takeUntil(this.destroy$)).subscribe({
        next: result => {
          console.log('Blog saved successfully:', result);
          this.router.navigate(['/blog']);
        },
        error: error => {
          console.error('Error saving blog:', error);
          this.isSubmitting = false;
        },
      });
    } else {
      console.log('Form is invalid, cannot submit');
      // Show a user-friendly message
      alert('Please fill in all required fields correctly.');
    }
  }

  // Helper method to debug form validation errors
  getFormValidationErrors(): any {
    const formErrors: any = {};
    Object.keys(this.blogForm.controls).forEach(key => {
      const controlErrors = this.blogForm.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });
    return formErrors;
  }

  onCancel(): void {
    this.router.navigate(['/blog']);
  }
}
