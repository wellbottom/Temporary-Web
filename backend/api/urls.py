from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("category/",views.CategorylistCreate.as_view(),name="create-category"),
    path("order/",views.OrderCreate.as_view(),name="create-order"),
    path("notes/update/<int:pk>/",views.NoteDetailView.as_view(),name="update-note"),
    path("orderdetails/",views.OrderDetailCreate.as_view(),name="order-details")
]