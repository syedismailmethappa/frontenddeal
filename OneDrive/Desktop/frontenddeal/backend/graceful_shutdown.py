"""
Graceful Shutdown Handler Module

This module provides signal handlers for graceful shutdown of the application
when receiving SIGTERM or SIGINT signals.

Add the following to your main application file (e.g., app.py):
    from backend.graceful_shutdown import setup_graceful_shutdown
    setup_graceful_shutdown()
"""

import signal
import sys
import time
import logging

logger = logging.getLogger(__name__)


def graceful_shutdown_handler(signum, frame):
    """
    Handle SIGTERM and SIGINT signals for graceful shutdown.
    
    Performs custom cleanup logic before exiting.
    """
    signal_name = "SIGTERM" if signum == signal.SIGTERM else "SIGINT"
    logger.info(f"Received {signal_name}. Performing custom cleanup...")
    
    try:
        # --- ADD CLEANUP LOGIC HERE (e.g., close DB) ---
        logger.info("Closing database connections...")
        time.sleep(1)  # Simulate cleanup work
        logger.info("Cleanup complete. Exiting gracefully.")
    except Exception as e:
        logger.error(f"Error during cleanup: {e}")
    finally:
        sys.exit(0)  # CRITICAL: Must exit manually


def setup_graceful_shutdown():
    """
    Register signal handlers for graceful shutdown.
    
    Call this function in your main application initialization.
    """
    signal.signal(signal.SIGTERM, graceful_shutdown_handler)
    signal.signal(signal.SIGINT, graceful_shutdown_handler)
    logger.info("Graceful shutdown handlers registered")
