import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TeamMemberService } from '../../../services/team-member.service';
import { TeamMember } from '../../../models/team-member.interface';

@Component({
  selector: 'app-team-member-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './team-member-form.component.html',
  styleUrl: './team-member-form.component.css'
})
export class TeamMemberFormComponent implements OnInit {
  memberForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private teamMemberService: TeamMemberService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.memberForm = this.fb.group({
      // Información básica - solo validadores built-in
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],

      // Array dinámico de habilidades - mínimo 1 skill requerido
      skills: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
  }

  get skillsArray(): FormArray {
    return this.memberForm.get('skills') as FormArray;
  }

  addSkill() {
    this.skillsArray.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number) {
    this.skillsArray.removeAt(index);
  }

  onSubmit() {
    if (this.memberForm.valid) {
      this.isSubmitting = true;
      const formValue = this.memberForm.value as Partial<TeamMember>;

      // Generate avatar URL from name
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formValue.name || '')}&background=667eea&color=fff`;

      setTimeout(() => {
        // Create new member with default values for required fields
        const memberData: Omit<TeamMember, 'id'> = {
          name: formValue.name || '',
          email: formValue.email || '',
          phone: formValue.phone || '',
          avatar: avatarUrl,
          role: 'Por definir',
          department: 'Ingeniería',
          availability: 'disponible' as const,
          experience: 0,
          joinDate: new Date(),
          skills: formValue.skills || []
        };

        const newMember = this.teamMemberService.addMember(memberData);
        alert(`Miembro "${newMember.name}" creado exitosamente`);

        this.isSubmitting = false;
        this.router.navigate(['/dashboard']);
      }, 500);
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.memberForm.controls).forEach(key => {
      const control = this.memberForm.get(key);
      control?.markAsTouched();
    });
    this.skillsArray.markAllAsTouched();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.memberForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.memberForm.get(fieldName);
    if (field && field.errors && field.touched) {
      const errors = field.errors;
      if (errors['required']) return `${fieldName} es requerido`;
      if (errors['email']) return 'Email inválido';
      if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }

  onCancel() {
    this.router.navigate(['/dashboard']);
  }
}
