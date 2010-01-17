# default settings (usually overwritten in machine_settings.py)

# LAYOUT
MOOSHELL_CROSS_LAYOUT = "Cross"
MOOSHELL_TABS_LAYOUT = "Tabs"
MOOSHELL_SlIDES_LAYOUT = "Slides"
MOOSHELL_DEFAULT_SKIN = 'light'

MOOSHELL_STANDARD_LAYOUT = MOOSHELL_CROSS_LAYOUT
MOOSHELL_EMBEDDED_TITLES = {"js": "JavaScript",
							'resources': "Resources",
							"html": "HTML",
							"css": "CSS",
							"result": "Result"}
MOOSHELL_MEDIA_PATHS = ['mooshell']

# LIBRARY SETTINGS
MOOSHELL_LIBRARY_GROUP = "Mootools" 

# SEO SETTINGS
MOOSHELL_SEO_TITLE_TAIL = " | Edit your code"
MOOSHELL_SEO_TITLE_HEAD = ""
MOOSHELL_SEO_DESCRIPTION = "mootools shell, easy test you snippets before implementing"
MOOSHELL_SEO_KEYWORDS = "mootools,javascript,javascript framework,shell,test"

MOOSHELL_TITLE_SEPARATOR = " | "

MOOSHELL_PROJECT_NAME = "MooShell"
MOOSHELL_PROJECT_STATUS = "(local)"

MOOSHELL_NEW_TITLE = 'Create Shell'
MOOSHELL_VIEW_TITLE = 'Edit Shell'

# LIBS
MOOTOOLS_CORE = "lib/mootools-1.2.4-core-yc.js"
MOOTOOLS_DEV_CORE = "lib/mootools-1.2.4-core-nc.js"
MOOTOOLS_MORE = "lib/mootools-1.2.4.2-more.js"
MOOTOOLS_DEPENDER = "lib/mootools-more/Source/Core/Depender.js"

MOOSHELL_LIBRARY_GROUP = "Mootools" # set to None if more than one used
MOOSHELL_SHOW_LIB_OPTION = False

# SHELL CONFIG
MOOSHELL_SLUG_LENGTH = 5

# GOOGLE API 
GOOGLE_ANALYTICS_ID = None #"UA-XXXXXX-XX"
GOOGLE_VERIFICATION_META_TAG = None #'<meta name="google-site-verification" content="xxxxxxxxxxxxxxxxxxx" />'
