from django.db import models
from django.conf import settings

# Create your models here.

class Task(models.Model):

    # Defining priority choices
    HIGH_PRIORITY = 'high'
    MEDIUM_PRIORITY = 'medium'
    LOW_PRIORITY = 'low'
    PRIORITY_CHOICES = [
        (HIGH_PRIORITY, 'High'),
        (MEDIUM_PRIORITY, 'Medium'),
        (LOW_PRIORITY, 'Low'),
    ]

    # Defining status choices
    PENDING_STATUS = 'pending'
    IN_PROGRESS_STATUS = 'in_progress'
    COMPLETED_STATUS = 'completed'
    STATUS_CHOICES = [
        (PENDING_STATUS, 'Pending'),
        (IN_PROGRESS_STATUS, 'In Progress'),
        (COMPLETED_STATUS, 'Completed'),
    ]

    # Model fields
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default=MEDIUM_PRIORITY)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default=PENDING_STATUS)
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title  