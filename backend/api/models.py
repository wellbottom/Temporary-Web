from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    cate_name = models.CharField(max_length=100)
    cate_description = models.CharField(max_length=1000)
    def __str__(self):
        return self.cate_name

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    price = models.FloatField(default=2.0)
    category = models.ManyToManyField(Category)

    def __str__(self):
        return f"{self.title} (Created at {self.created_at.strftime('%Y-%m-%d')})"



class Order(models.Model):
    products = models.ManyToManyField(Note)
    user = models.ForeignKey(User,on_delete=models.CASCADE, related_name="orders")
    order_date = models.DateTimeField(auto_now_add=True)
    
    class Methods(models.IntegerChoices):
                  CREDIT_CARD = 1
                  CASH = 2
                  DEBIT_CARD = 3
    
    paymentmethod = models.IntegerField(choices=Methods,default=2)

    def __str__(self):
        return f"{self.products} (Ordered on {self.order_date.strftime('%Y-%m-%d')})"
    

class Order_Details(models.Model):
    orderId = models.ForeignKey(Order,on_delete=models.CASCADE,related_name="orderdetails")
    product = models.ForeignKey(Note, on_delete=models.CASCADE,related_name="orderdetailsproduct")
    quantity = models.IntegerField()
    price = models.FloatField()

    

    def __str__(self):
        return f"OrderDetail for Product {self.product_id} with Price {self.price}"




          
