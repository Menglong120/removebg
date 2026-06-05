from pathlib import Path
from flask import Flask, jsonify, make_response, request
from werkzeug.utils import secure_filename

try:
    from rembg import remove
except ImportError as exc:
    raise RuntimeError(
        'rembg backend not available. Install with `pip install "rembg[cpu]"` or `pip install "rembg[gpu]"`.'
    ) from exc

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH


def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.after_request
def add_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


@app.route('/remove', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file received.'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'No selected file.'}), 400

    if not allowed_file(image_file.filename):
        return jsonify({'error': 'Invalid file format. Use PNG or JPG/JPEG.'}), 400

    filename = secure_filename(image_file.filename)
    image_bytes = image_file.read()

    try:
        output_data = remove(image_bytes)
    except Exception as exc:
        return jsonify({'error': 'Background removal failed.', 'detail': str(exc)}), 500

    response = make_response(output_data)
    response.headers['Content-Type'] = 'image/png'
    response.headers['Content-Disposition'] = (
        f'attachment; filename="removed-{Path(filename).stem}.png"'
    )
    return response


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
