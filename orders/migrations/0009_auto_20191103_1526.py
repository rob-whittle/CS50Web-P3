# Generated by Django 2.2.6 on 2019-11-03 15:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0008_auto_20191103_1523'),
    ]

    operations = [
        migrations.AlterField(
            model_name='other',
            name='size',
            field=models.CharField(blank=True, choices=[('LG', 'Large'), ('SM', 'Small'), (None, 'N/A')], max_length=2),
        ),
    ]
