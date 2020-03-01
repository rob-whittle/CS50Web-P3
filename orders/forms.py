from django import forms

class RegisterForm(forms.Form):
    username = forms.CharField(label='Username', max_length=16, help_text='maximum 16 characters')
    password = forms.CharField(label='Password', min_length=8, help_text='must be at least 8 characters')
    confirmation = forms.CharField(label='Confirm Password', min_length=8)
