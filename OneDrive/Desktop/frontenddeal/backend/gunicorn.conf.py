import logging

class SigtermFilter(logging.Filter):
    """
    A custom logging filter to suppress the benign
    'Worker (pid:%s) was sent SIGTERM!'
    error log from Gunicorn 21+.
    """
    def filter(self, record):
        """
        Filters the log record.

        Returns True to allow the log, False to suppress it.
        """
        # We target the unformatted message string
        # and the specific log level.
        msg_to_filter = "Worker (pid:%s) was sent SIGTERM!"
        if record.msg == msg_to_filter and record.levelno == logging.ERROR:
            return False  # Suppress this specific log
        return True   # Allow all other logs


# --- Gunicorn Logging Configuration ---
# Use logconfig_dict to customize the standard Python logging
logconfig_dict = {
    'version': 1,
    'disable_existing_loggers': False,  # Must be False to not break Gunicorn
    
    # 1. Define the custom filter
    'filters': {
        'sigterm_filter': {
            '()': SigtermFilter  # Instantiate the filter class
        }
    },
    
    # 2. Define handlers (e.g., log to stderr)
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'generic',
            'stream': 'ext://sys.stderr'
        }
    },
    
    # 3. Define formatters
    'formatters': {
        'generic': {
            'format': '%(asctime)s [%(process)d][%(levelname)s] %(message)s',
            'datefmt': '',
            'class': 'logging.Formatter'
        }
    },
    
    # 4. Configure Gunicorn's loggers
    'loggers': {
        # Apply the filter to the 'gunicorn.error' logger
        'gunicorn.error': {
            'level': 'INFO',  # Or 'DEBUG'
            'handlers': ['console'],
            'filters': ['sigterm_filter'], # This is the crucial line
            'propagate': False  # Prevent double-logging
        },
        'gunicorn.access': {
            'level': 'INFO',
            'handlers': ['console'],
            'propagate': False
        }
    },
    
    # Configure the root logger
    'root': {
        'level': 'INFO',
        'handlers': ['console']
    }
}

# --- Other Gunicorn Settings ---
bind = "0.0.0.0:8000"
workers = 4
worker_class = "backend.worker.CustomSyncWorker"

# Note: Run with: gunicorn -c gunicorn.conf.py app:application
