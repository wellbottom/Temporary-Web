# Generated by Django 5.1.2 on 2024-11-25 07:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_order_confirm_alter_userprofile_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='confirm',
        ),
    ]
