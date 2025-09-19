from django import forms

class NotaForm(forms.Form):
    seccion = forms.CharField(widget=forms.HiddenInput())
    contenido = forms.CharField(widget=forms.Textarea(attrs={
        "rows": 6,
        "placeholder": "Escribe tu nota aquí..."
    }))
