# Generated by Django 5.1.1 on 2024-11-12 09:04

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0005_alter_leaveapplication_applied_on'),
    ]

    operations = [
        migrations.RenameField(
            model_name='subject',
            old_name='name',
            new_name='subject_name',
        ),
        migrations.RemoveField(
            model_name='class',
            name='name',
        ),
        migrations.RemoveField(
            model_name='class',
            name='subjects',
        ),
        migrations.RemoveField(
            model_name='class',
            name='teachers',
        ),
        migrations.RemoveField(
            model_name='subject',
            name='description',
        ),
        migrations.RemoveField(
            model_name='subject',
            name='teacher',
        ),
        migrations.AddField(
            model_name='class',
            name='class_code',
            field=models.CharField(default=1, max_length=50, unique=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='class',
            name='class_name',
            field=models.CharField(default=django.utils.timezone.now, max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='subject',
            name='subject_code',
            field=models.CharField(default=101, max_length=50, unique=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='teacher',
            name='classes',
            field=models.ManyToManyField(related_name='teachers', to='myapp.class'),
        ),
        migrations.AddField(
            model_name='teacher',
            name='subjects',
            field=models.ManyToManyField(related_name='teachers', to='myapp.subject'),
        ),
    ]