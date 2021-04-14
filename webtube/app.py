from flask import Flask, request, jsonify, render_template
from youtube import Video


app = Flask(__name__)


def video_dict(link):
	da = Video(link)
	return {
		"thumbnail": da.thumbnail,
		"title": da.title,
		"url": da.streams.get_audios.high().url
	}


@app.route('/')
def index():
	return render_template("index.html")

@app.route("/video", methods=["POST"])
def video():
	data = request.json
	if not data:
		return "Error", 403
	if "video" not in data:
		return "Error", 403

	return jsonify(video_dict(data.get("video"))), 200