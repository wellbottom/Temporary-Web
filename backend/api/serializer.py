from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Category, Order, Order_Details


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


class NoteSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=True,required=False)
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author","price","category"]
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        categories_data = validated_data.pop('category', None)
        note = super().create(validated_data)
        if categories_data:
            for category_data in categories_data:
                categories = [Category.objects.get_or_create(**data)[0] for data in categories_data]
                note.category.add(*categories)
        
        return note
    
    def update(self, instance, validated_data):
        categories_data = validated_data.pop('category', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if categories_data is not None:  # Only clear and add categories if provided
            instance.category.clear()
            categories = [Category.objects.get_or_create(**data)[0] for data in categories_data]
            instance.category.add(*categories)

        instance.save()
        return instance

class OrderSerialzier(serializers.ModelSerializer):
    products = serializers.PrimaryKeyRelatedField(queryset = Note.objects.all(), many=True)
    
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
        fields = ["id","orderId","product","quantity","price"]
        