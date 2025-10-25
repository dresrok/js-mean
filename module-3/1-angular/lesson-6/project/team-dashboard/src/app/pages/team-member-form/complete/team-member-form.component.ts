import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TeamMember } from '../../models/team-member.interface';
import { TeamMemberService } from '../../services/team-member.service';

@Component({
  selector: 'app-team-member-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './team-member-form.component.html',
  styleUrl: './team-member-form.component.css'
})
export class TeamMemberFormComponent implements OnInit {
  memberForm!: FormGroup;
  isEditMode = false;
  memberId: number | null = null;
  isSubmitting = false;

  departments = ['Ingeniería', 'Diseño', 'Infraestructura', 'Producto'];
  availabilityOptions = ['disponible', 'ocupado', 'ausente', 'desconectado'];
  skillsOptions = [
    'Angular', 'React', 'Vue', 'TypeScript', 'JavaScript', 'Node.js',
    'Java', 'Spring Boot', 'Python', 'GraphQL', 'MongoDB', 'PostgreSQL', 'Redis',
    'Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins',
    'Figma', 'Sketch', 'Adobe XD', 'CSS', 'Agile', 'Scrum', 'JIRA'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private teamMemberService: TeamMemberService
  ) {}

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  private initForm() {
    this.memberForm = this.fb.group({
      // Información básica - solo validadores built-in
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],

      // Información laboral
      role: ['', [Validators.required]],
      department: ['', [Validators.required]],
      availability: ['disponible', [Validators.required]],
      experience: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
      joinDate: ['', [Validators.required]],

      // URL del avatar
      avatar: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],

      // Array dinámico de habilidades - mínimo 1 skill requerido
      skills: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
  }

  get skillsArray(): FormArray {
    return this.memberForm.get('skills') as FormArray;
  }

  addSkill(skill?: string) {
    const skillToAdd = skill || '';
    if (skill && this.skillsArray.value.includes(skill)) return;

    this.skillsArray.push(this.fb.control(skillToAdd, Validators.required));
  }

  removeSkill(index: number) {
    this.skillsArray.removeAt(index);
  }

  isSkillSelected(skill: string): boolean {
    return this.skillsArray.value.includes(skill);
  }

  private checkEditMode() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.isEditMode = true;
        this.memberId = Number(id);
        this.loadMemberData();
      }
    });
  }

  private loadMemberData() {
    if (this.memberId) {
      const member = this.teamMemberService.getMemberById(this.memberId);
      if (member) {
        // Cargar habilidades
        while (this.skillsArray.length !== 0) {
          this.skillsArray.removeAt(0);
        }
        member.skills.forEach(skill => {
          this.skillsArray.push(this.fb.control(skill, Validators.required));
        });

        // Cargar otros datos
        this.memberForm.patchValue({
          name: member.name,
          email: member.email,
          phone: member.phone,
          role: member.role,
          department: member.department,
          availability: member.availability,
          experience: member.experience,
          joinDate: this.formatDate(member.joinDate),
          avatar: member.avatar
        });
      }
    }
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    if (this.memberForm.valid) {
      this.isSubmitting = true;
      const formValue = this.memberForm.value;

      setTimeout(() => {
        if (this.isEditMode && this.memberId) {
          const result = this.teamMemberService.updateMember(this.memberId, formValue);
          if (result) {
            alert(`Miembro "${result.name}" actualizado exitosamente`);
          }
        } else {
          const newMember = this.teamMemberService.addMember(formValue);
          alert(`Miembro "${newMember.name}" creado exitosamente`);
        }

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
      if (errors['min']) return `Valor mínimo: ${errors['min'].min}`;
      if (errors['max']) return `Valor máximo: ${errors['max'].max}`;
      if (errors['pattern']) return 'Formato inválido (debe ser URL válida)';
    }
    return '';
  }

  onCancel() {
    this.router.navigate(['/dashboard']);
  }
}
