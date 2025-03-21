from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
import myapp.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(myapp.routing.websocket_urlpatterns),
})
