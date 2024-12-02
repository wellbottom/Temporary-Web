from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("notes/", views.ProductCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.ProductDelete.as_view(), name="delete-note"),
    path("category/",views.CategorylistCreate.as_view(),name="create-category"),
    path("order/",views.OrderCreate.as_view(),name="create-order"),
    path("notes/update/<int:pk>/",views.ProductDetailView.as_view(),name="update-note"),
    path("orderdetails/",views.OrderDetailCreate.as_view(),name="order-details"),
    path("userprofile/",views.UserProfileCreate.as_view(),name="user-profile-create"),
    path("confirm-order/<int:pk>/",views.OrderDetailConfirm.as_view(),name="confirm-order")
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)