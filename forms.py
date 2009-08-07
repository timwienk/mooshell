from django import forms

from models import Pastie, Shell

class PastieForm(forms.ModelForm):
	slug = forms.CharField(widget=forms.HiddenInput(), required=False)
	class Meta:
		model = Pastie
		exclude = ('valid_until','created_at','displayed')
		

class ShellForm(forms.ModelForm):
	version = forms.IntegerField(widget=forms.HiddenInput(), required=False)
	class Meta:
		model = Shell
		exclude = ('pastie','created_at','proposed_example')