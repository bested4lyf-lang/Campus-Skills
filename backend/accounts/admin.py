from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Institution, StudentProfile, ActiveSession


class StudentProfileInline(admin.StackedInline):
    model = StudentProfile
    can_delete = False
    verbose_name_plural = 'Student Profile'
    fk_name = 'user'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = (StudentProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_student', 'is_staff')
    list_filter = ('is_student', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('CampusSkill Roles', {'fields': ('is_student',)}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('CampusSkill Roles', {'fields': ('is_student',)}),
    )


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ('name', 'short_code', 'state')
    search_fields = ('name', 'short_code', 'state')
    list_filter = ('state',)


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'institution', 'department', 'level', 'whatsapp_visibility', 'is_deactivated')
    search_fields = ('user__username', 'user__email', 'department')
    list_filter = ('institution', 'level', 'whatsapp_visibility', 'is_deactivated')


@admin.register(ActiveSession)
class ActiveSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'device_label', 'ip_address', 'location', 'last_active')
    search_fields = ('user__username', 'ip_address', 'device_label')
    readonly_fields = ('user', 'device_label', 'ip_address', 'location', 'last_active')