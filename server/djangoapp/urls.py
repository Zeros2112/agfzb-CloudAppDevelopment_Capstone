from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views
from .views import static_page, about_us, contact_us

app_name = 'djangoapp'
urlpatterns = [
    path('static/', static_page, name='static_page'),
    # route is a string contains a URL pattern
    # view refers to the view function
    # name the URL


    # path for about view
    path('about/', about_us, name='about_us'),  # Add this line for the About Us page


    # path for contact us view
    path('contact/', contact_us, name='contact_us'),
    # path for registration
    path('registration/', views.registration_request, name='registration'),
    # path for login
    path('login/', views.login_request, name='login'),
    # path for logout
    path('logout/', views.logout_request, name='logout'),
    path(route='', view=views.get_dealerships, name='index'),

    # path for dealer reviews view

    # path for add a review view

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)