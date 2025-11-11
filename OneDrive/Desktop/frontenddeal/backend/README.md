# Backend Gunicorn SIGTERM Fix

This directory contains the backend configuration and modules for handling graceful SIGTERM shutdowns in Gunicorn 21+.

## Files Overview

### 1. `gunicorn.conf.py`
Gunicorn configuration file that:
- Defines a custom `SigtermFilter` to suppress benign "Worker (pid:%s) was sent SIGTERM!" error logs
- Configures logging with proper handlers and formatters
- Sets worker class to use the custom `CustomSyncWorker`
- Binds to `0.0.0.0:8000` with 4 workers

**Usage:**
```bash
gunicorn -c gunicorn.conf.py app:app
```

### 2. `graceful_shutdown.py`
Provides signal handlers for SIGTERM/SIGINT with custom cleanup logic.

**Usage in your app:**
```python
from backend.graceful_shutdown import setup_graceful_shutdown

app = Flask(__name__)
setup_graceful_shutdown()
```

### 3. `worker.py`
Custom Gunicorn SyncWorker class that:
- Tracks active client connections
- Sends HTTP 200 responses before closing connections
- Notifies monitoring service about incomplete jobs
- Performs graceful cleanup on shutdown

**Configuration in `gunicorn.conf.py`:**
```python
worker_class = "backend.worker.CustomSyncWorker"
```

### 4. `app.py`
Example Flask application demonstrating how to integrate graceful shutdown handlers.

## Installation

1. Install required Python packages:
```bash
pip install gunicorn flask  # or django, fastapi, etc.
```

2. Place these files in your backend directory structure:
```
project/
├── backend/
│   ├── __init__.py
│   ├── gunicorn.conf.py
│   ├── graceful_shutdown.py
│   ├── worker.py
│   ├── app.py
│   └── ...
└── dealshop/  (frontend)
```

## How It Works

### SIGTERM Handling Flow

1. **Container receives SIGTERM signal**
2. **Gunicorn's signal handler is triggered**
3. **CustomSyncWorker.handle_exit() is called**
4. **Worker performs cleanup:**
   - Notifies monitoring service about incomplete jobs
   - Sends HTTP 200 responses to all open client connections
   - Closes connections gracefully
5. **Worker exits with code 0**

### Log Filtering

The `SigtermFilter` suppresses this error log (which is benign in Gunicorn 21+):
```
ERROR - Worker (pid:12345) was sent SIGTERM!
```

This prevents log spam while keeping other important logs visible.

## Configuration Examples

### For Render.com

In your `render.yaml`:
```yaml
services:
  - type: web
    name: my-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn -c backend/gunicorn.conf.py app:app
```

### For Docker

In your `Dockerfile`:
```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-c", "backend/gunicorn.conf.py", "app:app"]
```

## Customization

### Adding Your Own Cleanup Logic

Edit `graceful_shutdown.py` and modify the `graceful_shutdown_handler()` function:

```python
def graceful_shutdown_handler(signum, frame):
    logger.info(f"Received signal. Performing cleanup...")
    
    # Add your custom cleanup here
    close_database_connections()
    flush_cache()
    save_state_to_file()
    
    logger.info("Cleanup complete. Exiting gracefully.")
    sys.exit(0)
```

### Monitoring Service Notification

Edit `worker.py` and implement the `http_post_to_monitoring_service()` function:

```python
def notify_monitoring_of_incomplete_jobs(self):
    try:
        if hasattr(self.wsgi, 'incomplete_jobs') and self.wsgi.incomplete_jobs:
            jobs = self.wsgi.incomplete_jobs
            logger.info(f"Notifying Service C about {len(jobs)} incomplete jobs.")
            
            # Implement your notification logic
            import requests
            requests.post('https://monitoring-service.com/jobs', json=jobs)
    except Exception as e:
        logger.warning(f"Failed to notify monitoring service: {e}")
```

## Troubleshooting

### Worker not exiting within 30 seconds

The SIGTERM timeout on Render.com is 30 seconds. If your cleanup takes longer:

1. Optimize cleanup logic to complete faster
2. Run cleanup in background tasks if possible
3. Increase timeout if supported by your platform

### Monitoring service not receiving notifications

Ensure:
- The monitoring service endpoint is accessible from your worker
- Network policies allow outbound connections
- The `http_post_to_monitoring_service()` function is implemented

### Still seeing SIGTERM error logs

Make sure:
- `gunicorn.conf.py` is being used (`-c gunicorn.conf.py`)
- `SigtermFilter` is properly instantiated in the logging config
- Gunicorn version is 21+

## References

- [Gunicorn Documentation](https://docs.gunicorn.org/)
- [Python Signal Handling](https://docs.python.org/3/library/signal.html)
- [Render.com Deployment Guide](https://render.com/docs)
