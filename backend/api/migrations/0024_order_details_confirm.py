# Generated by Django 5.1.2 on 2024-11-25 07:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_remove_order_confirm'),
    ]

    operations = [
        migrations.AddField(
            model_name='order_details',
            name='confirm',
            field=models.BooleanField(default=False),
        ),
    ]
