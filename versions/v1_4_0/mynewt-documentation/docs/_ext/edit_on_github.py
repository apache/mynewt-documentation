"""
Sphinx extension to add ReadTheDocs-style "Edit on GitHub" links to the
sidebar.

Loosely based on https://github.com/astropy/astropy/pull/347

Modified for Apache Mynewt to support multiple repos.
"""

import os
import warnings


__licence__ = 'BSD (3 clause)'


def get_github_url(project, view, branch, path):
    return 'https://github.com/{project}/{view}/{branch}/{path}'.format(
        project=project,
        view=view,
        branch=branch,
        path=path)

def get_project_path_match(projects, path):
    for path_match in projects:
        if path.find(path_match) == 0:
            return path_match
    return ""

def html_page_context(app, pagename, templatename, context, doctree):
    if templatename != 'page.html':
        return

    if not app.config.edit_on_github_projects:
        warnings.warn("edit_on_github_projects not specified")
        return

    path = os.path.relpath(doctree.get('source'), app.builder.srcdir)
    path_match = get_project_path_match(app.config.edit_on_github_projects, path)
    if path_match != "":
        project = app.config.edit_on_github_projects[path_match]
        path = path.replace(path_match, project[1], 1)
    else:
        project = app.config.edit_on_github_projects["default"]
        path = project[1] + path
    show_url = get_github_url(project[0], 'blob', app.config.edit_on_github_branch, path)
    edit_url = get_github_url(project[0], 'edit', app.config.edit_on_github_branch, path)

    context['show_on_github_url'] = show_url
    context['edit_on_github_url'] = edit_url


def setup(app):
    app.add_config_value('edit_on_github_projects', {}, True)
    app.add_config_value('edit_on_github_branch', 'master', True)
    app.connect('html-page-context', html_page_context)
