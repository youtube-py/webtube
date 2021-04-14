import gunicorn.app.wsgiapp
import os, sys

class SiteManager:

	def run_server(self) -> None:
		"""Prepare and run the web server."""

		print("Starting server.")

		port = os.environ.get("PORT") or 8000

		# Patch the arguments for gunicorn
		sys.argv = [
			"gunicorn",
			"--preload",
			"-b", f"0.0.0.0:{port}",
			"webtube.wsgi:application",
			"--threads", "2",
			"-w", "4",
			"--max-requests", "1000",
			"--max-requests-jitter", "50",
		]

		# Run gunicorn for the production server.
		gunicorn.app.wsgiapp.run()


def main() -> None:
    SiteManager().run_server()


if __name__ == '__main__':
    main()