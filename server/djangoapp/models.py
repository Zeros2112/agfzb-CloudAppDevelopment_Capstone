from django.db import models
from django.utils.timezone import now

# Create your models here.

class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    # You can add any other fields you'd like for a car make
    # For example: country_of_origin = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class CarModel(models.Model):
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    dealer_id = models.IntegerField()  # Refers to a dealer created in Cloudant database
    name = models.CharField(max_length=100)
    TYPE_CHOICES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        # Add more choices as needed
    ]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    year = models.DateField()
    # You can add any other fields you'd like for a car model
    # For example: engine_type = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.car_make} - {self.name} ({self.year.year})"


class CarDealer:
    def __init__(self, dealer_id, name, location):
        self.dealer_id = dealer_id
        self.name = name
        self.location = location



class DealerReview:
    def __init__(self, dealer_id, reviewer_name, review_text, rating):
        self.dealer_id = dealer_id
        self.reviewer_name = reviewer_name
        self.review_text = review_text
        self.rating = rating
