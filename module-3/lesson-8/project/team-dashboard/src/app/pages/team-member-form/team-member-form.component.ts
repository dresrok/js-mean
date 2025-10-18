import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TeamMemberService } from '../../services/team-member.service';
import { TeamMember } from '../../models/team-member.interface';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-team-member-form',
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './team-member-form.component.html',
  styleUrl: './team-member-form.component.css'
})
export class TeamMemberFormComponent implements OnInit {
  memberForm!: FormGroup;
  isSubmitting = false;

  isEditMode = false;
  memberId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private teamMemberService: TeamMemberService
  ) { }

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

      // Array dinámico de habilidades - mínimo 1 skill requerido
      skills: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
  }

  private checkEditMode() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log(id);
      if (id && id !== 'new') {
        this.isEditMode = true;
        this.memberId = id;
        this.loadMemberData();
      }
    })
  }

  private loadMemberData() {
    if (this.memberId) {
      this.teamMemberService.getMemberById(this.memberId).subscribe({
        next: (member) => {
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
            phone: member.phone
          });
        },
        error: (error) => {
          console.error('Error al cargar miembro:', error);
          alert('Error al cargar los datos del miembro');
          this.router.navigate(['/dashboard']);
        }
      });
    }
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
      const formValue = this.memberForm.value as TeamMember;

      // Generate avatar URL from name
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formValue.name || '')}&background=667eea&color=fff`;

      if (this.isEditMode && this.memberId) {
        // Update
        const memberToUpdate: TeamMember = {
          id: this.memberId,
          name: formValue.name,
          email: formValue.email,
          phone: formValue.phone,
          avatar: avatarUrl,
          role: 'Por definir',
          department: 'Por definir',
          availability: 'disponible' as const,
          experience: 0,
          joinDate: new Date(),
          skills: formValue.skills || [],
          currentProject: 'Sin asignar'
        };
        this.teamMemberService.updateMember(this.memberId, memberToUpdate).subscribe({
          next: (updatedMember) => {
            alert(`Miembro "${updatedMember.name}" actualizado exitosamente`);
            this.isSubmitting = false;
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Error al actualizar miembro:', error);
            alert('Error al actualizar el miembro. Por favor, intenta de nuevo.');
            this.isSubmitting = false;
          }
        });
      } else {
        const memberData: Omit<TeamMember, 'id'> = {
          name: formValue.name,
          email: formValue.email,
          phone: formValue.phone,
          avatar: avatarUrl,
          role: 'Por definir',
          department: 'Por definir',
          availability: 'disponible' as const,
          experience: 0,
          joinDate: new Date(),
          skills: formValue.skills || [],
          currentProject: 'Sin asignar'
        };
        this.teamMemberService.createMember(memberData as Omit<TeamMember, 'id'>).subscribe({
          next: (newMember) => {
            alert(`Miembro "${newMember.name}" creado exitosamente`);
            this.isSubmitting = false;
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Error al crear miembro:', error);
            alert('Error al crear el miembro. Por favor, intenta de nuevo.');
            this.isSubmitting = false;
          }
        });
      }
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
