"""
Custom Gunicorn Worker Module

This module provides a custom Gunicorn SyncWorker that extends handle_exit
to perform stateful graceful shutdown.

Configure in gunicorn.conf.py:
    worker_class = "backend.worker.CustomSyncWorker"
"""

import sys
import signal
import logging
from gunicorn.workers.sync import SyncWorker

logger = logging.getLogger(__name__)


class CustomSyncWorker(SyncWorker):
    """
    A custom Gunicorn worker that extends handle_exit
    to perform stateful graceful shutdown.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Store active clients to notify them on shutdown
        self.clients = set()

    def accept(self, listener):
        """
        Override accept to track the client socket.
        """
        client, addr = listener.accept()
        client.setblocking(1)
        self.clients.add(client)
        return client, addr

    def handle_request(self, listener, req, client, addr):
        """
        Override handle_request to remove client after handling.
        """
        try:
            super().handle_request(listener, req, client, addr)
        finally:
            if client in self.clients:
                self.clients.remove(client)

    def handle_exit(self, sig: int, frame):
        """
        This is the custom SIGTERM handler.
        It's called by Gunicorn when the signal is received.
        
        Performs cleanup:
        1. Notifies monitoring service of incomplete jobs
        2. Closes clients gracefully with HTTP 200 responses
        3. Exits manually
        """
        logger.info(f"CustomWorker handling signal {sig}. Cleaning up...")

        try:
            # 1. Notify monitoring service of incomplete jobs
            self.notify_monitoring_of_incomplete_jobs()
            
            # 2. Close clients gracefully with HTTP 200
            self.close_clients_gracefully()
        except Exception as e:
            logger.error(f"Error during graceful shutdown: {e}")
        
        logger.info("Cleanup complete. Worker exiting.")
        sys.exit(0)  # Manually exit

    def notify_monitoring_of_incomplete_jobs(self):
        """
        Notify the monitoring service about incomplete jobs.
        
        Check for pending jobs on the WSGI app context and
        POST them to the monitoring service.
        """
        try:
            if hasattr(self.wsgi, 'incomplete_jobs') and self.wsgi.incomplete_jobs:
                jobs = self.wsgi.incomplete_jobs
                logger.info(f"Notifying monitoring service about {len(jobs)} incomplete jobs.")
                # TODO: Implement http_post_to_monitoring_service(jobs)
        except Exception as e:
            logger.warning(f"Failed to notify monitoring service: {e}")

    def close_clients_gracefully(self):
        """
        Send HTTP 200 responses to all open client connections.
        
        This gracefully closes connections instead of abruptly terminating them.
        """
        resp = b"HTTP/1.1 200 OK\r\nConnection: close\r\nContent-Length: 2\r\n\r\nOK"
        for client in list(self.clients):
            try:
                client.sendall(resp)
                client.close()
            except Exception as e:
                logger.debug(f"Failed to send graceful response to client: {e}")
