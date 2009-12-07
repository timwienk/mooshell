from django.conf import settings


def load_settings(request):
    return {
			'project_name': settings.MOOSHELL_PROJECT_NAME,
			'project_status': settings.MOOSHELL_PROJECT_STATUS,
			'seo_title_pre': settings.MOOSHELL_SEO_TITLE_HEAD,
			'seo_title_tail': settings.MOOSHELL_SEO_TITLE_TAIL,
			'title_separator': settings.MOOSHELL_TITLE_SEPARATOR,
			'DEBUG': settings.DEBUG,
			'WEB_SERVER': request.META['SERVER_NAME'],
			'default_library_group': settings.MOOSHELL_LIBRARY_GROUP,
			'GOOGLE_ANALYTICS_ID': settings.GOOGLE_ANALYTICS_ID,
			'GOOGLE_VERIFICATION_META_TAG': settings.GOOGLE_VERIFICATION_META_TAG,
			'SHOW_LIB_OPTION': settings.MOOSHELL_SHOW_LIB_OPTION
			}
