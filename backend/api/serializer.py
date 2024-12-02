from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Product, Category, Order, Order_Details, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), default=serializers.CurrentUserDefault())

    class Meta:
        model = UserProfile
        fields = ["id","user", "mail", "address", "profile_picture"]
        extra_kwargs = {
            'mail': {'required': True},
            'address': {'required': True},
        }

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)
            instance.user.save()
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id","cate_name","cate_description"]

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset = Category.objects.all(), many=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "product_name",
            "content",
            "created_at",
            "author",
            "image",
            "price",
            "category",
        ]
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        categories = validated_data.pop('category', [])
        product = Product.objects.create(**validated_data)
        product.category.set(categories)
        return product


class OrderSerialzier(serializers.ModelSerializer):
    products = serializers.PrimaryKeyRelatedField(queryset = Product.objects.all(), many=True)
    
    class Meta:
        model = Order
        fields = ["id","products","user","order_date","paymentmethod"]
        extra_kwargs = {"user":{"read_only": True}}

    def create(self, validated_data):
        products_data = validated_data.pop('products', [])
        order = Order.objects.create(**validated_data)
        order.products.set(products_data)
        return order
    
class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order_Details
        fields = ["id","orderId","product","quantity","price","confirm"]
        