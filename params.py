from django.conf import settings   

MOOTOOLS_CORE = ''.join([settings.MEDIA_URL,"js/lib/mootools-1.2.3-core-yc.js"])
MOOTOOLS_DEV_CORE = ''.join([settings.MEDIA_URL,"js/lib/mootools-1.2.3-core-nc.js"])
MOOTOOLS_MORE = ''.join([settings.MEDIA_URL,"js/lib/mootools-1.2.3.1-more.js"])
MOOTOOLS_DEPENDER = ''.join([settings.MEDIA_URL,"js/lib/mootools-more/Source/Core/Depender.js"])
SLUG_LENGTH = 5