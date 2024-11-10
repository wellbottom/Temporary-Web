from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializer import UserSerializer, NoteSerializer, CategorySerializer, OrderSerialzier,OrderDetailSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note,Category,Order,Order_Details


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        ids = self.request.query_params.getlist('ids') 
        category_ids = self.request.query_params.getlist('category_ids')
        user_ids = self.request.query_params.get('user_id')
        queryset = Note.objects.all()
        if ids:
            queryset = Note.objects.filter(id__in=ids)
        if category_ids:
            queryset = queryset.filter(category_id__in=category_ids).distinct()
        if user_ids:
            queryset = queryset.filter(author=user_ids).distinct()


        return queryset
    
        
        
    def perform_create(self, serializer):
        categories_data = self.request.data.get('category',[])

        if serializer.is_valid():
            note = serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

        for category_data in categories_data:
            category_name = category_data.get('cate_name')
            if category_name:
                category, _ = Category.objects.get_or_create(cate_name=category_name)
                note.category.add(category) 

    def put(self, request, id, format=None):
        note = self.get_object(id)
        serializer = NoteSerializer(note, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

class NoteDetailView(generics.UpdateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author = user)


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
        query_set = Order_Details.objects.filter(orderId=orderId)
        return query_set

class OrderDetailView(generics.ListAPIView):
    serializer_class = OrderSerialzier
    permission_classe = [IsAuthenticated]

    
