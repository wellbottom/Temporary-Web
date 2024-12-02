
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .serializer import UserSerializer, ProductSerializer, CategorySerializer, OrderSerialzier,OrderDetailSerializer,UserProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Product,Category,Order,Order_Details,UserProfile

class UserProfileCreate(generics.CreateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        user_profile, created = UserProfile.objects.update_or_create(
            user=user,
            defaults=serializer.validated_data
        )
        if not created:
            # If the profile already exists, this acts as an update.
            return user_profile

    def get(self, request, *args, **kwargs):
        user_profiles = UserProfile.objects.all()  # Fetch all user profiles
        serializer = self.serializer_class(user_profiles, many=True)  # Serialize data
        return Response(serializer.data, status=200)

    def get_queryset(self):
        user_id = self.request.query_params.get('userId')
        return UserProfile.objects.filter(user=user_id)
    

class ProductCreate(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        ids = self.request.query_params.getlist('ids') 
        category_ids = self.request.query_params.getlist('category_ids')
        user_ids = self.request.query_params.get('user_id')
        queryset = Product.objects.all()
        if ids:
            queryset = Product.objects.filter(id__in=ids)
        if category_ids:
            queryset = queryset.filter(category_id__in=category_ids).distinct()
        if user_ids:
            queryset = queryset.filter(author=user_ids).distinct()


        return queryset
    
    def perform_create(self, serializer):
        serializer.save(author = self.request.user)



class ProductDelete(generics.DestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(author=user)

class ProductDetailView(generics.UpdateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(author = user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CategorylistCreate(generics.ListCreateAPIView):
    serializer_class=CategorySerializer
    permission_classes=[IsAuthenticated]
    queryset = Category.objects.all()

    def perform_create(self, serializer):
        serializer.save()
 

class OrderCreate(generics.ListCreateAPIView):
    serializer_class = OrderSerialzier
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)



class OrderDetailCreate(generics.ListCreateAPIView):
    serializer_class = OrderDetailSerializer 
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        return super().perform_create(serializer)
    
    def get_queryset(self):
        orderId = self.request.query_params.get('orderid')
        product_id = self.request.query_params.getlist('product-id')
        query_set = Order_Details.objects.all()
        if(orderId):
            query_set = Order_Details.objects.filter(orderId=orderId)
        if(product_id):
            query_set = query_set.filter(product__in=product_id)

        return query_set

class OrderDetailConfirm(generics.UpdateAPIView):
    serializer_class = OrderDetailSerializer 
    permission_classes = [IsAuthenticated]
    queryset = Order_Details.objects.all()


    
