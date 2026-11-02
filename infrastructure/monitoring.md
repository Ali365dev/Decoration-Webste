# Monitoring

Add application logging and error tracking (e.g. Sentry) at the app boundary.
Domain errors should use typed error classes; never leak internal DB errors to clients.
