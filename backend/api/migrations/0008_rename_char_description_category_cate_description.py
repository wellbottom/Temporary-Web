# Generated by Django 5.1.2 on 2024-10-28 09:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_category_note_category'),
    ]

    operations = [
        migrations.RenameField(
            model_name='category',
            old_name='char_description',
            new_name='cate_description',
        ),
    ]
